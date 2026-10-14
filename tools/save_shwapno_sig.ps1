Add-Type -AssemblyName System.Drawing

$w = 1000
$h = 566
$rgb = [System.IO.File]::ReadAllBytes("F:\GIT\ALIFOODWEB\public\images\signatures\real_shwapno_sig_rgb.raw")
$alpha = [System.IO.File]::ReadAllBytes("F:\GIT\ALIFOODWEB\public\images\signatures\real_shwapno_sig_alpha.raw")

$bmp = New-Object System.Drawing.Bitmap($w, $h, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$rect = New-Object System.Drawing.Rectangle(0, 0, $w, $h)
$bmpData = $bmp.LockBits($rect, [System.Drawing.Imaging.ImageLockMode]::WriteOnly, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)

$bytes = New-Object byte[] ($w * $h * 4)
for ($i = 0; $i -lt ($w * $h); $i++) {
    $bytes[$i * 4 + 0] = $rgb[$i * 3 + 2] # Blue
    $bytes[$i * 4 + 1] = $rgb[$i * 3 + 1] # Green
    $bytes[$i * 4 + 2] = $rgb[$i * 3 + 0] # Red
    $bytes[$i * 4 + 3] = $alpha[$i]        # Alpha
}

[System.Runtime.InteropServices.Marshal]::Copy($bytes, 0, $bmpData.Scan0, $bytes.Length)
$bmp.UnlockBits($bmpData)

$bmp.Save("F:\GIT\ALIFOODWEB\public\images\signatures\sig_shwapno_tanjil.png", [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()
Write-Output "Saved real sig_shwapno_tanjil.png"
