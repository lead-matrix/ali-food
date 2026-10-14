Add-Type -AssemblyName System.Drawing

$img = [System.Drawing.Bitmap]::FromFile("F:\GIT\ALIFOODWEB\public\images\pandamart_cert.jpg")
# The stamp circle and signature: x from 160 to 680, y from 1620 to 1980 (excluding the text "(Pandamart)" above y=1610)
$cropRect = New-Object System.Drawing.Rectangle(170, 1618, 500, 320)
$cropped = $img.Clone($cropRect, $img.PixelFormat)

$w = $cropped.Width
$h = $cropped.Height

$bmp = New-Object System.Drawing.Bitmap($w, $h, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$rect = New-Object System.Drawing.Rectangle(0, 0, $w, $h)

$bmpData = $bmp.LockBits($rect, [System.Drawing.Imaging.ImageLockMode]::WriteOnly, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$srcData = $cropped.LockBits($rect, [System.Drawing.Imaging.ImageLockMode]::ReadOnly, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)

$bytes = New-Object byte[] ($w * $h * 4)
[System.Runtime.InteropServices.Marshal]::Copy($srcData.Scan0, $bytes, 0, $bytes.Length)

for ($i = 0; $i -lt ($w * $h); $i++) {
    $b = $bytes[$i * 4 + 0]
    $g = $bytes[$i * 4 + 1]
    $r = $bytes[$i * 4 + 2]
    
    $lum = [int](0.299 * $r + 0.587 * $g + 0.114 * $b)
    if ($lum -gt 235) {
        $bytes[$i * 4 + 3] = 0
    } elseif ($lum -gt 205) {
        $alpha = [byte](255 * (235 - $lum) / (235 - 205))
        $bytes[$i * 4 + 3] = $alpha
    } else {
        $bytes[$i * 4 + 3] = 255
    }
}

[System.Runtime.InteropServices.Marshal]::Copy($bytes, 0, $bmpData.Scan0, $bytes.Length)
$bmp.UnlockBits($bmpData)
$cropped.UnlockBits($srcData)
$cropped.Dispose()
$img.Dispose()

$bmp.Save("F:\GIT\ALIFOODWEB\public\images\signatures\sig_pandamart_stamp_trans.png", [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()
Write-Output "Clean transparent Pandamart stamp saved"
