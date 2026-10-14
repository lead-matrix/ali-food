Add-Type -AssemblyName System.Drawing

$scale = 3.0
$w = [int](180 * $scale)
$h = [int](70 * $scale)
$bmp = New-Object System.Drawing.Bitmap($w, $h, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.Clear([System.Drawing.Color]::Transparent)

# Ink color: .051 .1686 .3216 -> deep navy blue
$inkColor = [System.Drawing.Color]::FromArgb(240, 13, 43, 82)
$pen = New-Object System.Drawing.Pen($inkColor, (1.8 * $scale))
$pen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
$pen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round

# Stroke 1:
# 15 38 m
# 23.666668 19.333332 32.666664 17.333332 42 32 c
# 51.333336 44 58.666668 40 64 20 c
# 69.333336 0 75.333336 2 82 26 c
# 92.666664 30 105.333336 27.333334 120 18 c
# 133.333328 11.333333 144 13.333333 152 24 c
$path1 = New-Object System.Drawing.Drawing2D.GraphicsPath
$path1.AddBezier((15*$scale), ((52-38)*$scale), (23.67*$scale), ((52-19.33)*$scale), (32.67*$scale), ((52-17.33)*$scale), (42*$scale), ((52-32)*$scale))
$path1.AddBezier((42*$scale), ((52-32)*$scale), (51.33*$scale), ((52-44)*$scale), (58.67*$scale), ((52-40)*$scale), (64*$scale), ((52-20)*$scale))
$path1.AddBezier((64*$scale), ((52-20)*$scale), (69.33*$scale), ((52-0)*$scale), (75.33*$scale), ((52-2)*$scale), (82*$scale), ((52-26)*$scale))
$path1.AddBezier((82*$scale), ((52-26)*$scale), (92.67*$scale), ((52-30)*$scale), (105.33*$scale), ((52-27.33)*$scale), (120*$scale), ((52-18)*$scale))
$path1.AddBezier((120*$scale), ((52-18)*$scale), (133.33*$scale), ((52-11.33)*$scale), (144*$scale), ((52-13.33)*$scale), (152*$scale), ((52-24)*$scale))
$g.DrawPath($pen, $path1)

# Stroke 2:
# 38 34 m
# 47.333336 38 60 39 76 37 c
# 92 35 103.333336 35.333332 110 38 c
# 124.666664 39.333332 139.666672 38.333332 155 35 c
$pen2 = New-Object System.Drawing.Pen($inkColor, (1.4 * $scale))
$pen2.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
$pen2.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
$path2 = New-Object System.Drawing.Drawing2D.GraphicsPath
$path2.AddBezier((38*$scale), ((52-34)*$scale), (47.33*$scale), ((52-38)*$scale), (60*$scale), ((52-39)*$scale), (76*$scale), ((52-37)*$scale))
$path2.AddBezier((76*$scale), ((52-37)*$scale), (92*$scale), ((52-35)*$scale), (103.33*$scale), ((52-35.33)*$scale), (110*$scale), ((52-38)*$scale))
$path2.AddBezier((110*$scale), ((52-38)*$scale), (124.67*$scale), ((52-39.33)*$scale), (139.67*$scale), ((52-38.33)*$scale), (155*$scale), ((52-35)*$scale))
$g.DrawPath($pen2, $path2)

# Stroke 3:
# 60 22 m
# 65.333336 36.666668 69.333336 46.666668 72 52 c
$path3 = New-Object System.Drawing.Drawing2D.GraphicsPath
$path3.AddBezier((60*$scale), ((52-22)*$scale), (65.33*$scale), ((52-36.67)*$scale), (69.33*$scale), ((52-46.67)*$scale), (72*$scale), ((52-52)*$scale))
$g.DrawPath($pen2, $path3)

# Ink dot at end
$brush = New-Object System.Drawing.SolidBrush($inkColor)
$g.FillEllipse($brush, (151*$scale), ((52-31.4)*$scale), (2.8*$scale), (2.8*$scale))
$g.FillEllipse($brush, (157*$scale), ((52-33.4)*$scale), (2.8*$scale), (2.8*$scale))

$g.Dispose()
$bmp.Save("F:\GIT\ALIFOODWEB\public\images\signatures\sig_charulota_rahim.png", [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()
Write-Output "Charulota signature rendered"
