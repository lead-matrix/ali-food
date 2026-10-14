Add-Type -AssemblyName System.Drawing

function Create-Signature {
    param(
        [string]$NameText,
        [string]$DateText,
        [string]$FontName,
        [float]$FontSize,
        [float]$Rotation,
        [string]$OutPath,
        [int]$StyleType
    )

    $w = 480
    $h = 180
    $bmp = New-Object System.Drawing.Bitmap($w, $h)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.Clear([System.Drawing.Color]::Transparent)

    $inkColor = [System.Drawing.Color]::FromArgb(255, 12, 32, 85) # Deep rich signature ink blue
    $brush = New-Object System.Drawing.SolidBrush($inkColor)
    $pen = New-Object System.Drawing.Pen($inkColor, 2.2)
    $pen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
    $pen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
    $pen.LineJoin = [System.Drawing.Drawing2D.LineJoin]::Round

    # Transform for natural handwriting slant
    $g.TranslateTransform(20, 20)
    $g.RotateTransform($Rotation)

    $font = New-Object System.Drawing.Font($FontName, $FontSize, [System.Drawing.FontStyle]::Italic)
    $g.DrawString($NameText, $font, $brush, 10, 15)

    # Dynamic flourish / underline based on style
    if ($StyleType -eq 1) {
        # Flowing loop under name with flick
        $pts = @(
            [System.Drawing.PointF]::new(15, 75),
            [System.Drawing.PointF]::new(90, 85),
            [System.Drawing.PointF]::new(190, 70),
            [System.Drawing.PointF]::new(260, 78),
            [System.Drawing.PointF]::new(310, 65)
        )
        $g.DrawCurve($pen, $pts)
        # Loop back
        $pts2 = @(
            [System.Drawing.PointF]::new(305, 66),
            [System.Drawing.PointF]::new(270, 50),
            [System.Drawing.PointF]::new(230, 82),
            [System.Drawing.PointF]::new(330, 80)
        )
        $g.DrawCurve($pen, $pts2)
    } elseif ($StyleType -eq 2) {
        # Quick slash underline with dot
        $g.DrawLine($pen, 15, 75, 260, 78)
        $g.DrawLine($pen, 20, 82, 180, 84)
    } elseif ($StyleType -eq 3) {
        # Long sweeping loop
        $pts = @(
            [System.Drawing.PointF]::new(10, 78),
            [System.Drawing.PointF]::new(120, 82),
            [System.Drawing.PointF]::new(220, 74),
            [System.Drawing.PointF]::new(290, 68),
            [System.Drawing.PointF]::new(340, 60)
        )
        $g.DrawCurve($pen, $pts)
    } else {
        # Wavy tail
        $pts = @(
            [System.Drawing.PointF]::new(15, 74),
            [System.Drawing.PointF]::new(80, 80),
            [System.Drawing.PointF]::new(160, 72),
            [System.Drawing.PointF]::new(240, 82),
            [System.Drawing.PointF]::new(300, 70)
        )
        $g.DrawCurve($pen, $pts)
    }

    # Handwritten date underneath
    if ($DateText) {
        $dateFont = New-Object System.Drawing.Font("Ink Free", 15, [System.Drawing.FontStyle]::Bold)
        $dateBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(230, 15, 38, 95))
        $g.DrawString($DateText, $dateFont, $dateBrush, 80, 88)
        $dateFont.Dispose()
        $dateBrush.Dispose()
    }

    $font.Dispose()
    $brush.Dispose()
    $pen.Dispose()
    $g.Dispose()

    $bmp.Save($OutPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()
}

$dir = "F:\GIT\ALIFOODWEB\public\images\signatures"
if (!(Test-Path $dir)) { New-Item -ItemType Directory -Path $dir -Force }

Create-Signature -NameText "H. A. Ridoy" -DateText "20/08/25" -FontName "Mistral" -FontSize 40 -Rotation -4 -OutPath "$dir\test_sig_4.png" -StyleType 1
Create-Signature -NameText "A. Rahim" -DateText "02/09/25" -FontName "French Script MT" -FontSize 44 -Rotation -5 -OutPath "$dir\test_sig_5.png" -StyleType 2
Create-Signature -NameText "M. T. Hossain" -DateText "10/10/25" -FontName "Mistral" -FontSize 38 -Rotation -3 -OutPath "$dir\test_sig_6.png" -StyleType 3
Create-Signature -NameText "M. I. Shimanto" -DateText "15/09/25" -FontName "Lucida Handwriting" -FontSize 30 -Rotation -5 -OutPath "$dir\test_sig_7.png" -StyleType 4

Write-Output "Signatures generated successfully!"
