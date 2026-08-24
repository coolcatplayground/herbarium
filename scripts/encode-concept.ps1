# Encodes Propagation Bench concept sheets into the web copies the bench serves.
#
#   powershell -ExecutionPolicy Bypass -File scripts\encode-concept.ps1
#
# Drop <id>-concept.png in the repo root and run this. It writes
# public/concepts/<id>.jpg, then you point `art:` at it in
# public/future-species.txt.
#
# Sibling of encode-habitat.ps1 and deliberately not merged with it: a habitat
# illustration is a wide backdrop read at a glance, while a concept sheet is a
# tall document someone reads - panel labels, stat lines, design notes. It
# needs a taller cap and a higher quality floor, because the thing that breaks
# first here is small type going mushy, not a gradient banding.
#
#   - Long edge capped at 1500px, never upscaled.
#   - Quality floor of 82: below that the annotation text on a concept sheet
#     stops being readable, and an unreadable sheet is worse than a large one.
#   - Budget 620KB rather than the habitats' 460KB, for the same reason.

param(
  [int]$MaxEdge = 1500,
  [int]$MaxKB = 620,
  [int]$MinQuality = 82
)

Add-Type -AssemblyName System.Drawing

$root = Split-Path -Parent $PSScriptRoot
$outDir = Join-Path $root "public\concepts"
if (-not (Test-Path $outDir)) { New-Item -ItemType Directory -Path $outDir | Out-Null }

$jpegCodec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() |
  Where-Object { $_.MimeType -eq 'image/jpeg' }

$sources = Get-ChildItem (Join-Path $root "*-concept.png") -ErrorAction SilentlyContinue
if (-not $sources) {
  Write-Host "No *-concept.png in the repo root. Nothing to do."
  exit 0
}

foreach ($src in $sources) {
  $key = $src.BaseName -replace '-concept$', ''
  $dest = Join-Path $outDir "$key.jpg"

  $img = [System.Drawing.Image]::FromFile($src.FullName)
  try {
    $scale = [Math]::Min(1.0, $MaxEdge / [double][Math]::Max($img.Width, $img.Height))
    $w = [int][Math]::Round($img.Width * $scale)
    $h = [int][Math]::Round($img.Height * $scale)

    $bmp = New-Object System.Drawing.Bitmap($w, $h)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
    # White ground: these sheets are drawn on white and JPEG has no alpha, so
    # anything transparent would otherwise composite to black.
    $g.Clear([System.Drawing.Color]::White)
    $g.DrawImage($img, 0, 0, $w, $h)
    $g.Dispose()

    $written = $false
    foreach ($q in 94, 92, 90, 88, 86, 84, 82) {
      if ($q -lt $MinQuality) { break }
      $ep = New-Object System.Drawing.Imaging.EncoderParameters(1)
      $ep.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter(
        [System.Drawing.Imaging.Encoder]::Quality, [int64]$q)
      $bmp.Save($dest, $jpegCodec, $ep)
      $ep.Dispose()

      $kb = (Get-Item $dest).Length / 1KB
      if ($kb -le $MaxKB) {
        "{0,-14} {1,5}x{2,-5} q{3,-3} {4,6:N0} KB" -f $key, $w, $h, $q, $kb
        $written = $true
        break
      }
    }
    if (-not $written) {
      $kb = (Get-Item $dest).Length / 1KB
      Write-Warning ("{0}: {1:N0} KB at the quality floor of {2} - kept, because readable type beats a smaller file here." -f $key, $kb, $MinQuality)
    }

    $bmp.Dispose()
  }
  finally {
    $img.Dispose()
  }
}
