Add-Type -AssemblyName System.Drawing
$img = [System.Drawing.Image]::FromFile('E:\Downloads\bbcl_extracted\word\media\image2.gif')
$img.Save('F:\GIT\ALIFOODWEB\public\images\bbcl_logo.png', [System.Drawing.Imaging.ImageFormat]::Png)
$img.Dispose()
Write-Output "BBCL logo converted: $($img.Width)x$($img.Height)"
