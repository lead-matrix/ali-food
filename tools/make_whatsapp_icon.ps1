Add-Type -AssemblyName System.Drawing

$size = 128
$bmp = New-Object System.Drawing.Bitmap($size, $size, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$g.Clear([System.Drawing.Color]::Transparent)

# WhatsApp green background circle
$greenBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(255, 37, 211, 102)) # #25D366
$g.FillEllipse($greenBrush, 4, 4, 120, 120)

# Inner white phone / speech icon
# White circle speech bubble
$whiteBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
$pen = New-Object System.Drawing.Pen([System.Drawing.Color]::White, 7)

# Draw phone handset using GraphicsPath
$path = New-Object System.Drawing.Drawing2D.GraphicsPath

# Outer phone ring/contour
$whitePen = New-Object System.Drawing.Pen([System.Drawing.Color]::White, 6)
$whitePen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
$whitePen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round

# Elegant handset shape inside circle
# Draw phone symbol
$pts = @(
    [System.Drawing.PointF]::new(42, 40),
    [System.Drawing.PointF]::new(50, 36),
    [System.Drawing.PointF]::new(58, 48),
    [System.Drawing.PointF]::new(53, 54),
    [System.Drawing.PointF]::new(57, 63),
    [System.Drawing.PointF]::new(66, 72),
    [System.Drawing.PointF]::new(75, 76),
    [System.Drawing.PointF]::new(81, 71),
    [System.Drawing.PointF]::new(93, 79),
    [System.Drawing.PointF]::new(89, 87),
    [System.Drawing.PointF]::new(80, 92),
    [System.Drawing.PointF]::new(65, 87),
    [System.Drawing.PointF]::new(51, 75),
    [System.Drawing.PointF]::new(39, 61),
    [System.Drawing.PointF]::new(36, 48)
)
$path.AddClosedCurve($pts, 0.4)
$g.FillPath($whiteBrush, $path)

# Outline stroke for definition
$g.DrawPath($whitePen, $path)

$g.Dispose()
$bmp.Save("F:\GIT\ALIFOODWEB\public\images\whatsapp_icon.png", [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()
Write-Output "WhatsApp icon generated successfully"
