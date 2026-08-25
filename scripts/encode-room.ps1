# Encodes room backdrops into the web copies the pages sit inside.
#
#   powershell -ExecutionPolicy Bypass -File scripts\encode-room.ps1
#
# Drop <name>.png in the repo root (herbarium-hall.png, specimen-room.png) and
# run this. It writes public/rooms/<name>.jpg.
#
# Third sibling to encode-habitat.ps1 and encode-concept.ps1, and it gets its
# own budget for a reason worth writing down rather than rediscovering:
#
#   - A habitat image is a card illustration. A concept sheet is a document
#     someone reads. A room is neither. It is seen THROUGH a scrim, faded out
#     before the fold, and it never has type read off it.
#   - So quality can go lower than either. What it cannot do is be heavy: this
#     is the only image on the site that loads on an ordinary page view before
#     the visitor has asked for anything, so every kilobyte is spent on someone
#     who may just be passing through.
#
# Hence a tighter 300KB budget and a quality floor of 62 - detail that would be
# unacceptable on a habitat card is invisible under a 30% wash.

param(
  [int]$MaxEdge = 1600,
  [int]$MaxKB = 300,
  [int]$MinQuality = 62
)

Add-Type -AssemblyName System.Drawing

$root = Split-Path -Parent $PSScriptRoot
$outDir = Join-Path $root "public\rooms"
if (-not (Test-Path $outDir)) { New-Item -ItemType Directory -Path $outDir | Out-Null }

$jpegCodec = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() |
  Where-Object { $_.MimeType -eq 'image/jpeg' }

# One per page that has a painted room. An explicit list rather than a glob:
# it doubles as the record of which pages have backdrops, and a stray PNG in
# the repo root cannot accidentally become one.
$names = @(
  "herbarium-hall",      # the Gallery
  "specimen-room",       # a specimen sheet
  "reading-room",        # the Reading Room
  "exhibition-hall",     # the Exhibition Hall
  "propagation-bench",   # the Propagation Bench
  "grafting-bench",      # the Grafting Bench
  "curator-room"         # the Curator's Note
)
$found = $false

foreach ($name in $names) {
  $srcPath = Join-Path $root "$name.png"
  if (-not (Test-Path $srcPath)) { continue }
  $found = $true
  $dest = Join-Path $outDir "$name.jpg"

  $img = [System.Drawing.Image]::FromFile($srcPath)
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
    $g.Clear([System.Drawing.Color]::White)
    $g.DrawImage($img, 0, 0, $w, $h)
    $g.Dispose()

    $written = $false
    foreach ($q in 82, 78, 74, 70, 66, 62) {
      if ($q -lt $MinQuality) { break }
      $ep = New-Object System.Drawing.Imaging.EncoderParameters(1)
      $ep.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter(
        [System.Drawing.Imaging.Encoder]::Quality, [int64]$q)
      $bmp.Save($dest, $jpegCodec, $ep)
      $ep.Dispose()

      $kb = (Get-Item $dest).Length / 1KB
      if ($kb -le $MaxKB) {
        "{0,-18} {1,5}x{2,-5} q{3,-3} {4,6:N0} KB" -f $name, $w, $h, $q, $kb
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

if (-not $found) { Write-Host "No room source images in the repo root. Nothing to do." }
