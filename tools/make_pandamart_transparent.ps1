Add-Type -AssemblyName System.Drawing

$img = [System.Drawing.Bitmap]::FromFile("F:\GIT\ALIFOODWEB\public\images\signatures\sig_pandamart_stamp.png")
$w = $img.Width
$h = $img.Height

$bmp = New-Object System.Drawing.Bitmap($w, $h, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$rect = New-Object System.Drawing.Rectangle(0, 0, $w, $h)

$bmpData = $bmp.LockBits($rect, [System.Drawing.Imaging.ImageLockMode]::WriteOnly, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$srcData = $img.LockBits($rect, [System.Drawing.Imaging.ImageLockMode]::ReadOnly, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)

$bytes = New-Object byte[] ($w * $h * 4)
[System.Runtime.InteropServices.Marshal]::Copy($srcData.Scan0, $bytes, 0, $bytes.Length)

for ($i = 0; $i -lt ($w * $h); $i++) {
    $b = $bytes[$i * 4 + 0]
    $g = $bytes[$i * 4 + 1]
    $r = $bytes[$i * 4 + 2]
    
    # If near white background, make transparent
    $lum = [int](0.299 * $r + 0.587 * $g + 0.114 * $b)
    if ($lum -gt 238) {
        $bytes[$i * 4 + 3] = 0
    } elseif ($lum -gt 215) {
        # Smooth alpha anti-aliasing
        $alpha = [byte](255 * (238 - $lum) / (238 - 215))
        $bytes[$i * 4 + 3] = $alpha
    } else {
        $bytes[$i * 4 + 3] = 255
    }
}

[System.Runtime.InteropServices.Marshal]::Copy($bytes, 0, $bmpData.Scan0, $bytes.Length)
$bmp.UnlockBits($bmpData)
$img.UnlockBits($srcData)
$img.Dispose()

$bmp.Save("F:\GIT\ALIFOODWEB\public\images\signatures\sig_pandamart_stamp_trans.png", [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()
Write-Output "Transparent Pandamart stamp saved"
