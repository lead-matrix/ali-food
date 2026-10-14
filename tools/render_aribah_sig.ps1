Add-Type -AssemblyName System.Drawing

$scale = 3.0
$w = [int](180 * $scale)
$h = [int](70 * $scale)
$bmp = New-Object System.Drawing.Bitmap($w, $h, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.Clear([System.Drawing.Color]::Transparent)

# Pen color: .0549 .1059 .1882 -> dark blue/navy ink
$inkColor = [System.Drawing.Color]::FromArgb(235, 14, 27, 48)
$pen = New-Object System.Drawing.Pen($inkColor, (1.8 * $scale))
$pen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
$pen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round

# Stroke 1:
# 12 36 m
# 20.666668 18.666666 29.333332 16 38 28 c
# 46 40 54.666664 36 64 16 c
# 73.333336 -4 80 -.66666794 84 26 c
# 96 30 109.333336 26.666668 124 16 c
# 136 9.333333 146 11.333333 154 22 c
$path1 = New-Object System.Drawing.Drawing2D.GraphicsPath
$path1.AddBezier((12*$scale), ((50-36)*$scale), (20.67*$scale), ((50-18.67)*$scale), (29.33*$scale), ((50-16)*$scale), (38*$scale), ((50-28)*$scale))
$path1.AddBezier((38*$scale), ((50-28)*$scale), (46*$scale), ((50-40)*$scale), (54.67*$scale), ((50-36)*$scale), (64*$scale), ((50-16)*$scale))
$path1.AddBezier((64*$scale), ((50-16)*$scale), (73.33*$scale), ((50 - -4)*$scale), (80*$scale), ((50 - -0.67)*$scale), (84*$scale), ((50-26)*$scale))
$path1.AddBezier((84*$scale), ((50-26)*$scale), (96*$scale), ((50-30)*$scale), (109.33*$scale), ((50-26.67)*$scale), (124*$scale), ((50-16)*$scale))
$path1.AddBezier((124*$scale), ((50-16)*$scale), (136*$scale), ((50-9.33)*$scale), (146*$scale), ((50-11.33)*$scale), (154*$scale), ((50-22)*$scale))
$g.DrawPath($pen, $path1)

# Stroke 2:
# 34 32 m
# 44.666668 36 58 37 74 35 c
# 90 33 102 33.333332 110 36 c
# 124.666664 37.333332 139.666672 36 155 32 c
$pen2 = New-Object System.Drawing.Pen($inkColor, (1.4 * $scale))
$pen2.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
$pen2.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
$path2 = New-Object System.Drawing.Drawing2D.GraphicsPath
$path2.AddBezier((34*$scale), ((50-32)*$scale), (44.67*$scale), ((50-36)*$scale), (58*$scale), ((50-37)*$scale), (74*$scale), ((50-35)*$scale))
$path2.AddBezier((74*$scale), ((50-35)*$scale), (90*$scale), ((50-33)*$scale), (102*$scale), ((50-33.33)*$scale), (110*$scale), ((50-36)*$scale))
$path2.AddBezier((110*$scale), ((50-36)*$scale), (124.67*$scale), ((50-37.33)*$scale), (139.67*$scale), ((50-36)*$scale), (155*$scale), ((50-32)*$scale))
$g.DrawPath($pen2, $path2)

# Stroke 3:
# 60 20 m
# 65.333336 33.333336 69.333336 42.666668 72 48 c
$path3 = New-Object System.Drawing.Drawing2D.GraphicsPath
$path3.AddBezier((60*$scale), ((50-20)*$scale), (65.33*$scale), ((50-33.33)*$scale), (69.33*$scale), ((50-42.67)*$scale), (72*$scale), ((50-48)*$scale))
$g.DrawPath($pen2, $path3)

# Ink dot at end
$brush = New-Object System.Drawing.SolidBrush($inkColor)
$g.FillEllipse($brush, (151*$scale), ((50-29.4)*$scale), (2.8*$scale), (2.8*$scale))
$g.FillEllipse($brush, (157*$scale), ((50-31.4)*$scale), (2.8*$scale), (2.8*$scale))

$g.Dispose()
$bmp.Save("F:\GIT\ALIFOODWEB\public\images\signatures\sig_aribah_ariful.png", [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()
Write-Output "Aribah signature rendered"
