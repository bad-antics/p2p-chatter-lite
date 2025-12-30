# Create Skull and Crossbones Icon using .NET
Add-Type -AssemblyName System.Drawing

# Create a 256x256 bitmap
$bitmap = New-Object System.Drawing.Bitmap(256, 256)
$graphics = [System.Drawing.Graphics]::FromImage($bitmap)
$graphics.Clear([System.Drawing.Color]::Black)

# Create brushes and pens
$whiteBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
$redBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 100, 100))
$blackBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::Black)
$whitePen = New-Object System.Drawing.Pen([System.Drawing.Color]::Gray, 2)

# Draw skull (circle)
$graphics.DrawEllipse($whitePen, 60, 40, 136, 120)
$graphics.FillEllipse($whiteBrush, 60, 40, 136, 120)

# Draw eyes
$graphics.FillEllipse($blackBrush, 85, 70, 20, 20)
$graphics.FillEllipse($blackBrush, 151, 70, 20, 20)

# Draw nose
$nosePoints = @(
    [System.Drawing.Point]::new(128, 100),
    [System.Drawing.Point]::new(120, 115),
    [System.Drawing.Point]::new(136, 115)
)
$graphics.FillPolygon($blackBrush, $nosePoints)

# Draw teeth
for ($i = 0; $i -lt 5; $i++) {
    $x = 85 + ($i * 9)
    $graphics.FillRectangle($blackBrush, $x, 130, 6, 15)
}

# Draw jaw
$graphics.DrawRectangle($whitePen, 70, 140, 116, 25)
$graphics.FillRectangle($whiteBrush, 70, 140, 116, 25)

# Draw crossbones (red X)
$redPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(255, 100, 100), 10)
$graphics.DrawLine($redPen, 40, 120, 100, 180)
$graphics.DrawLine($redPen, 216, 120, 156, 180)

# Draw bone ends
$graphics.FillEllipse($redBrush, 35, 115, 15, 15)
$graphics.FillEllipse($redBrush, 95, 175, 15, 15)
$graphics.FillEllipse($redBrush, 206, 115, 15, 15)
$graphics.FillEllipse($redBrush, 151, 175, 15, 15)

# Save as ICO
$icoPath = "C:\Users\pc123\OneDrive\Documents\p2p-chatter-lite\src\app.ico"
$bitmap.Save($icoPath, [System.Drawing.Imaging.ImageFormat]::Icon)

Write-Host "Skull and crossbones icon created at: $icoPath" -ForegroundColor Green

# Cleanup
$graphics.Dispose()
$bitmap.Dispose()
$whiteBrush.Dispose()
$redBrush.Dispose()
$blackBrush.Dispose()
$whitePen.Dispose()
