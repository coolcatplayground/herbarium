# Encodes habitat source art into the web copies the exhibition hall serves.
#
#   powershell -ExecutionPolicy Bypass -File scripts\encode-habitat.ps1
#
# Drop habitat-<key>.png in the repo root and run this. It writes
# public/habitats/<key>.jpg, then you wire it with `image:` in habitatMap.js.
#
# System.Drawing rather than a tool: there is no ImageMagick or ffmpeg on this
# machine, and the `convert` on PATH is Windows' filesystem utility, not IM.
# This keeps the project dependency-free.
#
# Two rules, both taken from the eight images already in place:
#   - Cap the long edge at 1600px and NEVER upscale. The existing files sit at
#     1535-1536x1024 where the source was smaller than the cap, and 1600x900
#     where it was wider. Upscaling a 1536px source to 1600 would add nothing
#     but bytes.
#   - Step JPEG quality down until the file lands under 460 KB. The eight in
#     place are 368-452 KB, so that is the band being matched, not a guess.

param(
  [int]$MaxEdge = 1600,
  [int]$MaxKB = 460
)

Add-Type -AssemblyName System.Drawing

$root = Split-Path -Parent $PSScriptRoot
$outDir = Join-Path $root "public\habitats"
if (-not (Test-Path $outDir)) { New-Item -ItemType Directory -Path $outDir | Out-Null }

$jpegCodec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() |
  Where-Object { $_.MimeType -eq 'image/jpeg' }

$sources = Get-ChildItem (Join-Path $root "habitat-*.png") -ErrorAction SilentlyContinue
if (-not $sources) {
  Write-Host "No habitat-*.png in the repo root. Nothing to do."
  exit 0
}

# The map is keyed by SECONDARY type, so the mono-Grass room — the largest in
# the collection, 46 specimens — is keyed `none`, not `grass`: a pure-Grass
# typing is the absence of a second adaptation. Naming that file after the type
# rather than the key is the natural mistake, so absorb it here instead of
# silently writing a grass.jpg that nothing ever loads.
$aliases = @{ "grass" = "none" }

foreach ($src in $sources) {
  $key = $src.BaseName -replace '^habitat-', ''
  if ($aliases.ContainsKey($key)) {
    $alias = $aliases[$key]
    Write-Host ("  ({0} is the key for the mono-Grass room, writing {1}.jpg)" -f $alias, $alias)
    $key = $alias
  }
  $dest = Join-Path $outDir "$key.jpg"

  $img = [System.Drawing.Image]::FromFile($src.FullName)
  try {
    # Never upscale: a scale factor above 1 is clamped to 1.
    $scale = [Math]::Min(1.0, $MaxEdge / [double][Math]::Max($img.Width, $img.Height))
    $w = [int][Math]::Round($img.Width * $scale)
    $h = [int][Math]::Round($img.Height * $scale)

    $bmp = New-Object System.Drawing.Bitmap($w, $h)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
    $g.DrawImage($img, 0, 0, $w, $h)
    $g.Dispose()

    # Walk quality down rather than solving for it — JPEG size is not a
    # predictable function of quality, it depends on the image's own detail.
    $written = $false
    foreach ($q in 92, 88, 84, 80, 76, 72, 68, 64, 60) {
      $ep = New-Object System.Drawing.Imaging.EncoderParameters(1)
      $ep.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter(
        [System.Drawing.Imaging.Encoder]::Quality, [int64]$q)
      $bmp.Save($dest, $jpegCodec, $ep)
      $ep.Dispose()

      $kb = (Get-Item $dest).Length / 1KB
      if ($kb -le $MaxKB) {
        "{0,-10} {1,5}x{2,-5} q{3,-3} {4,6:N0} KB" -f $key, $w, $h, $q, $kb
        $written = $true
        break
      }
    }
    if (-not $written) {
      $kb = (Get-Item $dest).Length / 1KB
      Write-Warning ("{0}: still {1:N0} KB at lowest quality" -f $key, $kb)
    }

    $bmp.Dispose()
  }
  finally {
    $img.Dispose()
  }
}
