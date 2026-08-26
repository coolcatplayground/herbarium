# Encodes the curator's portrait into the web copy the Curator's Note serves.
#
#   powershell -ExecutionPolicy Bypass -File scripts\encode-portrait.ps1
#
# Drop <name>-curator.png in the repo root and run this. It writes
# public/portraits/<name>.jpg, then you point `portrait:` at it in About.jsx.
#
# Fourth sibling of encode-habitat / encode-concept / encode-room, and separate
# from all three for the usual reason - a different size budget with a stated
# cause. A portrait sits in the left column of a 720px page, so it is never
# painted wider than about 260 CSS pixels and only ever asked for one page.
# Nothing here is read the way a concept sheet is read or filled the way a room
# backdrop fills a viewport.
#
#   - Long edge capped at 720px, never upscaled. Twice the largest size it is
#     ever displayed at, which covers a 2x screen and stops there.
#   - Budget 160KB. A face at 720px reaches that comfortably at high quality,
#     so the quality floor is what binds here rather than the cap.
#   - Quality floor of 80: this is a photograph of one subject against a soft
#     background, and the thing that goes first is mottling in the blur, not
#     small type.

param(
  [int]$MaxEdge = 720,
  [int]$MaxKB = 160,
  [int]$MinQuality = 80
)

Add-Type -AssemblyName System.Drawing

$root = Split-Path -Parent $PSScriptRoot
$outDir = Join-Path $root "public\portraits"
if (-not (Test-Path $outDir)) { New-Item -ItemType Directory -Path $outDir | Out-Null }

$jpegCodec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() |
  Where-Object { $_.MimeType -eq 'image/jpeg' }

$sources = Get-ChildItem (Join-Path $root "*-curator.png") -ErrorAction SilentlyContinue
if (-not $sources) {
  Write-Host "No *-curator.png in the repo root. Nothing to do."
  exit 0
}

foreach ($src in $sources) {
  $name = $src.BaseName -replace '-curator$', ''
  $dest = Join-Path $outDir "$name.jpg"

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

    # Walk quality down rather than solving for it - JPEG size is not a
    # predictable function of quality, it depends on the image's own detail.
    # Stop at the floor rather than below it: an oversized portrait is a
    # smaller problem than a blotchy one.
    $written = $false
    foreach ($q in 92, 88, 84, 80) {
      if ($q -lt $MinQuality) { break }
      $ep = New-Object System.Drawing.Imaging.EncoderParameters(1)
      $ep.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter(
        [System.Drawing.Imaging.Encoder]::Quality, [int64]$q)
      $bmp.Save($dest, $jpegCodec, $ep)
      $ep.Dispose()

      $kb = (Get-Item $dest).Length / 1KB
      if ($kb -le $MaxKB) {
        "{0,-12} {1,5}x{2,-5} q{3,-3} {4,6:N0} KB" -f $name, $w, $h, $q, $kb
        $written = $true
        break
      }
    }
    if (-not $written) {
      $kb = (Get-Item $dest).Length / 1KB
      Write-Warning ("{0}: {1:N0} KB at the quality floor of {2}" -f $name, $kb, $MinQuality)
    }

    $bmp.Dispose()
  }
  finally {
    $img.Dispose()
  }
}
