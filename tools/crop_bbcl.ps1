Add-Type -AssemblyName System.Drawing
$img = [System.Drawing.Bitmap]::FromFile("E:\Downloads\bbcl_extracted\word\media\image1.png")

# Let's see the height and create a cleanly cropped version of Ferdous Khan signature (top ~92 pixels has signature + date)
$cropH = 96
$rect = New-Object System.Drawing.Rectangle(0, 0, $img.Width, $cropH)
$cropped = $img.Clone($rect, $img.PixelFormat)

# Make white / light-grey background transparent so it blends perfectly
$cropped.MakeTransparent([System.Drawing.Color]::White)
# Also near-white colors
$outPath = "F:\GIT\ALIFOODWEB\public\images\signatures\sig_bbcl_ferdous.png"
$cropped.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)

$cropped.Dispose()
$img.Dispose()
Write-Output "Cropped BBCL signature saved!"
