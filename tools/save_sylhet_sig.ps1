Add-Type -AssemblyName System.Drawing

$jpgBmp = [System.Drawing.Bitmap]::FromFile("F:\GIT\ALIFOODWEB\public\images\signatures\sig_sylhet_mahbub.jpg")
$w = $jpgBmp.Width
$h = $jpgBmp.Height
$alpha = [System.IO.File]::ReadAllBytes("F:\GIT\ALIFOODWEB\public\images\signatures\sig_sylhet_mahbub_alpha.raw")

$bmp = New-Object System.Drawing.Bitmap($w, $h, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$rect = New-Object System.Drawing.Rectangle(0, 0, $w, $h)

$bmpData = $bmp.LockBits($rect, [System.Drawing.Imaging.ImageLockMode]::WriteOnly, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$jpgData = $jpgBmp.LockBits($rect, [System.Drawing.Imaging.ImageLockMode]::ReadOnly, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)

$bytes = New-Object byte[] ($w * $h * 4)
[System.Runtime.InteropServices.Marshal]::Copy($jpgData.Scan0, $bytes, 0, $bytes.Length)

for ($i = 0; $i -lt ($w * $h); $i++) {
    $bytes[$i * 4 + 3] = $alpha[$i]
}

[System.Runtime.InteropServices.Marshal]::Copy($bytes, 0, $bmpData.Scan0, $bytes.Length)
$bmp.UnlockBits($bmpData)
$jpgBmp.UnlockBits($jpgData)
$jpgBmp.Dispose()

$bmp.Save("F:\GIT\ALIFOODWEB\public\images\signatures\sig_sylhet_mahbub.png", [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()
Write-Output "Saved real sig_sylhet_mahbub.png"
