Add-Type -AssemblyName System.Drawing

$img = [System.Drawing.Bitmap]::FromFile("F:\GIT\ALIFOODWEB\public\images\pandamart_cert.jpg")
# Find crop bounds around the stamp & signature
# In 1600 x 2273, the stamp is roughly at x: 160..640, y: 1620..1980
$cropRect = New-Object System.Drawing.Rectangle(160, 1580, 500, 360)
$cropped = $img.Clone($cropRect, $img.PixelFormat)
$cropped.Save("F:\GIT\ALIFOODWEB\public\images\signatures\sig_pandamart_stamp.png", [System.Drawing.Imaging.ImageFormat]::Png)
$cropped.Dispose()
$img.Dispose()
Write-Output "Cropped Pandamart stamp & signature"
