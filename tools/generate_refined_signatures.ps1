Add-Type -AssemblyName System.Drawing

function Generate-RealSignature {
    param(
        [string]$SignText,
        [string]$DateText,
        [string]$FontName,
        [float]$FontSize,
        [float]$SlantAngle,
        [string]$InkType, # "blue" or "black"
        [string]$OutPath,
        [scriptblock]$FlourishAction
    )

    $w = 420
    $h = 160
    $bmp = New-Object System.Drawing.Bitmap($w, $h)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAlias
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.Clear([System.Drawing.Color]::Transparent)

    # Ink Colors: rich ballpoint blue or crisp document black
    if ($InkType -eq "blue") {
        $ink = [System.Drawing.Color]::FromArgb(245, 10, 35, 95)
        $dateInk = [System.Drawing.Color]::FromArgb(230, 15, 40, 105)
    } else {
        $ink = [System.Drawing.Color]::FromArgb(245, 20, 22, 28)
        $dateInk = [System.Drawing.Color]::FromArgb(230, 25, 28, 35)
    }

    $brush = New-Object System.Drawing.SolidBrush($ink)
    $pen = New-Object System.Drawing.Pen($ink, 2.0)
    $pen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
    $pen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round
    $pen.LineJoin = [System.Drawing.Drawing2D.LineJoin]::Round

    # Natural handwriting slant
    $g.TranslateTransform(15, 15)
    $g.RotateTransform($SlantAngle)

    # Draw name in cursive
    $font = New-Object System.Drawing.Font($FontName, $FontSize, [System.Drawing.FontStyle]::Regular)
    $g.DrawString($SignText, $font, $brush, 10, 10)

    # Execute custom flourish / underline
    if ($FlourishAction) {
        & $FlourishAction $g $pen
    }

    # Handwritten date underneath
    if ($DateText) {
        $dateFont = New-Object System.Drawing.Font("Ink Free", 14, [System.Drawing.FontStyle]::Bold)
        $dateBrush = New-Object System.Drawing.SolidBrush($dateInk)
        $g.DrawString($DateText, $dateFont, $dateBrush, 65, 82)
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

# 1. Habibul Alom Ridoy (Aribah's Kitchen) — Freestyle Script with flowing under-loop
Generate-RealSignature `
    -SignText "H. A. Ridoy" `
    -DateText "20/08/25" `
    -FontName "Freestyle Script" `
    -FontSize 54 `
    -SlantAngle -4 `
    -InkType "blue" `
    -OutPath "$dir\sig_aribah_ridoy.png" `
    -FlourishAction {
        param($g, $pen)
        # Fast organic underline with end curl
        $p1 = [System.Drawing.PointF]::new(12, 70)
        $p2 = [System.Drawing.PointF]::new(100, 76)
        $p3 = [System.Drawing.PointF]::new(200, 68)
        $p4 = [System.Drawing.PointF]::new(260, 72)
        $g.DrawCurve($pen, @($p1, $p2, $p3, $p4))
        $c1 = [System.Drawing.PointF]::new(258, 71)
        $c2 = [System.Drawing.PointF]::new(290, 52)
        $c3 = [System.Drawing.PointF]::new(250, 84)
        $c4 = [System.Drawing.PointF]::new(295, 78)
        $g.DrawCurve($pen, @($c1, $c2, $c3, $c4))
    }

# 2. Abdur Rahim (Charulota Restora) — Mistral with firm double-strike slash
Generate-RealSignature `
    -SignText "A. Rahim" `
    -DateText "02/09/25" `
    -FontName "Mistral" `
    -FontSize 44 `
    -SlantAngle -3 `
    -InkType "black" `
    -OutPath "$dir\sig_charulota_rahim.png" `
    -FlourishAction {
        param($g, $pen)
        $p1 = [System.Drawing.PointF]::new(10, 72)
        $p2 = [System.Drawing.PointF]::new(120, 76)
        $p3 = [System.Drawing.PointF]::new(230, 68)
        $g.DrawCurve($pen, @($p1, $p2, $p3))
        # Small accent tick
        $g.DrawLine($pen, 18, 78, 140, 80)
    }

# 3. Md Tanjil Hossain (SHWAPNO / ACI Logistics) — Segoe Script with bold procurement flourish
Generate-RealSignature `
    -SignText "M. T. Hossain" `
    -DateText "10/10/25" `
    -FontName "Segoe Script" `
    -FontSize 32 `
    -SlantAngle -5 `
    -InkType "blue" `
    -OutPath "$dir\sig_shwapno_tanjil.png" `
    -FlourishAction {
        param($g, $pen)
        $p1 = [System.Drawing.PointF]::new(10, 74)
        $p2 = [System.Drawing.PointF]::new(110, 80)
        $p3 = [System.Drawing.PointF]::new(220, 66)
        $p4 = [System.Drawing.PointF]::new(280, 58)
        $g.DrawCurve($pen, @($p1, $p2, $p3, $p4))
    }

# 4. Merajul Islam Shimanto (Hotel Al Mahboob) — Pristina with elegant hotel executive loop
Generate-RealSignature `
    -SignText "M. I. Shimanto" `
    -DateText "15/09/25" `
    -FontName "Pristina" `
    -FontSize 40 `
    -SlantAngle -4 `
    -InkType "blue" `
    -OutPath "$dir\sig_mahboob_shimanto.png" `
    -FlourishAction {
        param($g, $pen)
        $p1 = [System.Drawing.PointF]::new(8, 72)
        $p2 = [System.Drawing.PointF]::new(90, 78)
        $p3 = [System.Drawing.PointF]::new(190, 68)
        $p4 = [System.Drawing.PointF]::new(270, 74)
        $g.DrawCurve($pen, @($p1, $p2, $p3, $p4))
        # Loop return
        $l1 = [System.Drawing.PointF]::new(268, 73)
        $l2 = [System.Drawing.PointF]::new(245, 56)
        $l3 = [System.Drawing.PointF]::new(225, 80)
        $l4 = [System.Drawing.PointF]::new(285, 78)
        $g.DrawCurve($pen, @($l1, $l2, $l3, $l4))
    }

Write-Output "Refined realistic signatures generated!"
