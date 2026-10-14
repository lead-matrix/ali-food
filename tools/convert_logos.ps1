Add-Type -AssemblyName System.Drawing

function Convert-RgbMaskToPng {
    param($rgbPath, $maskPath, $w, $h, $outPath)
    $raw = [System.IO.File]::ReadAllBytes($rgbPath)
    $mask = $null
    if ($maskPath -and (Test-Path $maskPath)) {
        $mask = [System.IO.File]::ReadAllBytes($maskPath)
    }

    $bmp = New-Object System.Drawing.Bitmap($w, $h, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $rect = New-Object System.Drawing.Rectangle(0, 0, $w, $h)
    $bmpData = $bmp.LockBits($rect, [System.Drawing.Imaging.ImageLockMode]::WriteOnly, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $stride = $bmpData.Stride
    $ptr = $bmpData.Scan0
    $bytes = New-Object byte[] ($stride * $h)

    for ($y = 0; $y -lt $h; $y++) {
        for ($x = 0; $x -lt $w; $x++) {
            $srcIdx = ($y * $w + $x) * 3
            $pixIdx = ($y * $w + $x)
            $dstIdx = $y * $stride + $x * 4

            $a = 255
            if ($mask) {
                $a = $mask[$pixIdx]
            }

            $bytes[$dstIdx]     = $raw[$srcIdx + 2] # B
            $bytes[$dstIdx + 1] = $raw[$srcIdx + 1] # G
            $bytes[$dstIdx + 2] = $raw[$srcIdx]     # R
            $bytes[$dstIdx + 3] = [byte]$a          # A
        }
    }

    [System.Runtime.InteropServices.Marshal]::Copy($bytes, 0, $ptr, $bytes.Length)
    $bmp.UnlockBits($bmpData)
    $bmp.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()
    Write-Output "Saved $outPath"
}

Convert-RgbMaskToPng -rgbPath "F:\GIT\ALIFOODWEB\public\images\aribah_logo.raw" -maskPath "F:\GIT\ALIFOODWEB\public\images\aribah_mask.raw" -w 628 -h 202 -outPath "F:\GIT\ALIFOODWEB\public\images\aribah_logo.png"
Convert-RgbMaskToPng -rgbPath "F:\GIT\ALIFOODWEB\public\images\charulota_logo.raw" -maskPath "F:\GIT\ALIFOODWEB\public\images\charulota_mask.raw" -w 341 -h 335 -outPath "F:\GIT\ALIFOODWEB\public\images\charulota_logo.png"
Convert-RgbMaskToPng -rgbPath "F:\GIT\ALIFOODWEB\public\images\shwapno_footer.raw" -maskPath "F:\GIT\ALIFOODWEB\public\images\shwapno_mask.raw" -w 1400 -h 282 -outPath "F:\GIT\ALIFOODWEB\public\images\shwapno_footer.png"
