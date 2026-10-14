Add-Type -AssemblyName System.Drawing
$raw = [System.IO.File]::ReadAllBytes("F:\GIT\ALIFOODWEB\public\images\shwapno_footer.raw")
$w = 1400
$h = 282
$bmp = New-Object System.Drawing.Bitmap($w, $h, [System.Drawing.Imaging.PixelFormat]::Format24bppRgb)
$rect = New-Object System.Drawing.Rectangle(0, 0, $w, $h)
$bmpData = $bmp.LockBits($rect, [System.Drawing.Imaging.ImageLockMode]::WriteOnly, [System.Drawing.Imaging.PixelFormat]::Format24bppRgb)

# In GDI+, 24bpp is BGR, whereas PDF raw is RGB
$stride = $bmpData.Stride
$ptr = $bmpData.Scan0
$bytes = New-Object byte[] ($stride * $h)

for ($y = 0; $y -lt $h; $y++) {
    for ($x = 0; $x -lt $w; $x++) {
        $srcIdx = ($y * $w + $x) * 3
        $dstIdx = $y * $stride + $x * 3
        $bytes[$dstIdx]     = $raw[$srcIdx + 2] # B
        $bytes[$dstIdx + 1] = $raw[$srcIdx + 1] # G
        $bytes[$dstIdx + 2] = $raw[$srcIdx]     # R
    }
}
[System.Runtime.InteropServices.Marshal]::Copy($bytes, 0, $ptr, $bytes.Length)
$bmp.UnlockBits($bmpData)

$bmp.Save("F:\GIT\ALIFOODWEB\public\images\shwapno_footer.png", [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()
Write-Output "Saved shwapno_footer.png!"
