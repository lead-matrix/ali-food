Add-Type -AssemblyName System.Drawing

function Render-SigTest {
    param($Name, $Date, $FontName, $Size, $OutName)
    $bmp = New-Object System.Drawing.Bitmap(440, 160)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAlias
    $g.Clear([System.Drawing.Color]::Transparent)

    $ink = [System.Drawing.Color]::FromArgb(245, 14, 38, 98)
    $brush = New-Object System.Drawing.SolidBrush($ink)
    $pen = New-Object System.Drawing.Pen($ink, 2.0)
    $pen.StartCap = [System.Drawing.Drawing2D.LineCap]::Round
    $pen.EndCap = [System.Drawing.Drawing2D.LineCap]::Round

    $g.TranslateTransform(15, 12)
    $g.RotateTransform(-4)

    $font = New-Object System.Drawing.Font($FontName, $Size, [System.Drawing.FontStyle]::Italic)
    $g.DrawString($Name, $font, $brush, 10, 10)

    # Dynamic underline
    $p1 = [System.Drawing.PointF]::new(10, 72)
    $p2 = [System.Drawing.PointF]::new(120, 78)
    $p3 = [System.Drawing.PointF]::new(240, 68)
    $p4 = [System.Drawing.PointF]::new(310, 62)
    $g.DrawCurve($pen, @($p1, $p2, $p3, $p4))

    # Date
    $dateFont = New-Object System.Drawing.Font("Ink Free", 14, [System.Drawing.FontStyle]::Bold)
    $g.DrawString($Date, $dateFont, $brush, 75, 82)

    $bmp.Save("F:\GIT\ALIFOODWEB\public\images\signatures\$OutName.png", [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp.Dispose()
    $g.Dispose()
}

Render-SigTest -Name "M. T. Hossain" -Date "10/10/25" -FontName "Mistral" -Size 44 -OutName "test_tanjil_mistral"
Render-SigTest -Name "M. T. Hossain" -Date "10/10/25" -FontName "Freestyle Script" -Size 52 -OutName "test_tanjil_freestyle"
Render-SigTest -Name "M. I. Shimanto" -Date "15/09/25" -FontName "Freestyle Script" -Size 50 -OutName "test_shimanto_freestyle"
Render-SigTest -Name "M. I. Shimanto" -Date "15/09/25" -FontName "Mistral" -Size 42 -OutName "test_shimanto_mistral"

Write-Output "Rendered comparison signatures!"
