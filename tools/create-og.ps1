Add-Type -AssemblyName System.Drawing

$width = 1200
$height = 630
$bmp = New-Object System.Drawing.Bitmap $width, $height, ([System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
$g = [System.Drawing.Graphics]::FromImage($bmp)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
$g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::ClearTypeGridFit
$g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic

# Background Linear Gradient
$c1 = [System.Drawing.ColorTranslator]::FromHtml('#0D0303')
$c2 = [System.Drawing.ColorTranslator]::FromHtml('#1C0606')
$bgBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush (New-Object System.Drawing.Point(0, 0)), (New-Object System.Drawing.Point($width, $height)), $c1, $c2
$g.FillRectangle($bgBrush, 0, 0, $width, $height)
$bgBrush.Dispose()

# Subtle Amber and Emerald Radial Glows
$glowColor1 = [System.Drawing.Color]::FromArgb(40, 245, 166, 35)
$glowBrush1 = New-Object System.Drawing.SolidBrush $glowColor1
$g.FillEllipse($glowBrush1, 760, 40, 460, 460)
$glowBrush1.Dispose()

$glowColor2 = [System.Drawing.Color]::FromArgb(30, 26, 122, 60)
$glowBrush2 = New-Object System.Drawing.SolidBrush $glowColor2
$g.FillEllipse($glowBrush2, -100, 260, 440, 440)
$glowBrush2.Dispose()

# Top accent bar in Brand Amber
$amberColor = [System.Drawing.ColorTranslator]::FromHtml('#F5A623')
$accentPen = New-Object System.Drawing.Pen $amberColor, 5
$g.DrawLine($accentPen, 0, 0, $width, 0)
$accentPen.Dispose()

# Load clean banner and draw at top-left
$bannerPath = 'F:\GIT\ALIFOODWEB\public\images\alifood-clean-banner.png'
if (Test-Path $bannerPath) {
    $banner = [System.Drawing.Bitmap]::FromFile($bannerPath)
    $bw = 480
    $bh = [int]($banner.Height * ($bw / $banner.Width))
    $g.DrawImage($banner, 70, 45, $bw, $bh)
    $banner.Dispose()
}

# Circular Emblem on Right side
$emblemPath = 'F:\GIT\ALIFOODWEB\public\images\alifood-emblem.png'
if (Test-Path $emblemPath) {
    $emblem = [System.Drawing.Bitmap]::FromFile($emblemPath)
    $haloColor = [System.Drawing.Color]::FromArgb(45, 245, 166, 35)
    $haloBrush = New-Object System.Drawing.SolidBrush $haloColor
    $g.FillEllipse($haloBrush, 850, 90, 280, 280)
    $haloBrush.Dispose()

    $g.DrawImage($emblem, 865, 105, 250, 250)
    $emblem.Dispose()
}

# Brushes
$brushWhite = New-Object System.Drawing.SolidBrush ([System.Drawing.Color]::White)
$brushAmber = New-Object System.Drawing.SolidBrush $amberColor
$brushGold = New-Object System.Drawing.SolidBrush ([System.Drawing.ColorTranslator]::FromHtml('#FEEECB'))
$brushSlate = New-Object System.Drawing.SolidBrush ([System.Drawing.ColorTranslator]::FromHtml('#E2E8F0'))
$brushMuted = New-Object System.Drawing.SolidBrush ([System.Drawing.ColorTranslator]::FromHtml('#94A3B8'))

# Subtitle Category Badge
$fontSub = New-Object System.Drawing.Font('Arial', 12, [System.Drawing.FontStyle]::Bold)
$g.DrawString('INSTITUTIONAL POULTRY, MEAT & DRESSED CUTS PARTNER', $fontSub, $brushAmber, 70, 165)

# Main Value Headline
$fontHead = New-Object System.Drawing.Font('Arial', 24, [System.Drawing.FontStyle]::Bold)
$g.DrawString('Fresh Meat. Reliable Supply. Built for Business.', $fontHead, $brushWhite, 70, 195)

# Supporting text
$fontDesc = New-Object System.Drawing.Font('Arial', 13, [System.Drawing.FontStyle]::Regular)
$descLine1 = 'Commercial poultry and culinary portioning supply for supermarkets,'
$descLine2 = 'restaurant networks, catering operations, and institutional kitchens.'
$g.DrawString($descLine1, $fontDesc, $brushSlate, 70, 240)
$g.DrawString($descLine2, $fontDesc, $brushSlate, 70, 265)

# Feature Badges
$deg = [char]0x00B0
$pills = @(
    '100% Halal Manual Cut',
    ('Active 0' + $deg + 'C - 4' + $deg + 'C Chilled Chain'),
    'Pre-Dawn Routes (5:00 - 8:00 AM)',
    'Corporate Weekly / Monthly Terms'
)
$pillFont = New-Object System.Drawing.Font('Arial', 10, [System.Drawing.FontStyle]::Bold)
$pillBgColor = [System.Drawing.Color]::FromArgb(230, 24, 6, 6)
$pillBg = New-Object System.Drawing.SolidBrush $pillBgColor
$pillBorderColor = [System.Drawing.ColorTranslator]::FromHtml('#4D1515')
$pillBorder = New-Object System.Drawing.Pen $pillBorderColor, 1

$px = 70
$pillY = 320
foreach ($p in $pills) {
    $size = $g.MeasureString($p, $pillFont)
    $pw = [int]($size.Width + 24)
    $ph = 36
    $g.FillRectangle($pillBg, $px, $pillY, $pw, $ph)
    $g.DrawRectangle($pillBorder, $px, $pillY, $pw, $ph)
    $g.DrawString($p, $pillFont, $brushGold, ($px + 12), ($pillY + 9))
    $px += $pw + 12
}

# Bottom Card
$barY = 405
$barH = 160
$barBgColor = [System.Drawing.Color]::FromArgb(245, 14, 3, 3)
$barBg = New-Object System.Drawing.SolidBrush $barBgColor
$barBorderColor = [System.Drawing.ColorTranslator]::FromHtml('#3D1010')
$barBorder = New-Object System.Drawing.Pen $barBorderColor, 1
$g.FillRectangle($barBg, 70, $barY, 1060, $barH)
$g.DrawRectangle($barBorder, 70, $barY, 1060, $barH)

# Vertical dividing lines in bottom card
$dividerPen = New-Object System.Drawing.Pen ([System.Drawing.ColorTranslator]::FromHtml('#2A0A0A')), 1
$g.DrawLine($dividerPen, 440, ($barY + 15), 440, ($barY + $barH - 15))
$g.DrawLine($dividerPen, 790, ($barY + 15), 790, ($barY + $barH - 15))
$dividerPen.Dispose()

# Typography for bottom bar
$barTitleFont = New-Object System.Drawing.Font('Arial', 9, [System.Drawing.FontStyle]::Bold)
$barPhoneFont = New-Object System.Drawing.Font('Arial', 14, [System.Drawing.FontStyle]::Bold)
$barTextFont = New-Object System.Drawing.Font('Arial', 10, [System.Drawing.FontStyle]::Regular)
$barBoldFont = New-Object System.Drawing.Font('Arial', 10, [System.Drawing.FontStyle]::Bold)

# Column 1: Procurement Hotlines
$g.DrawString('PROCUREMENT HOTLINES', $barTitleFont, $brushAmber, 95, ($barY + 18))
$g.DrawString('01319-345501', $barPhoneFont, $brushWhite, 95, ($barY + 40))
$g.DrawString('01401-238019', $barPhoneFont, $brushWhite, 95, ($barY + 68))
$g.DrawString('Email: alifood3193@gmail.com', $barTextFont, $brushMuted, 95, ($barY + 102))
$g.DrawString('WhatsApp: +8801319345501', $barTextFont, $brushAmber, 95, ($barY + 125))

# Column 2: Regional Hubs
$g.DrawString('STRATEGIC LOGISTICS HUBS', $barTitleFont, $brushAmber, 465, ($barY + 18))
$g.DrawString('Dhaka Central Division (Tejgaon)', $barBoldFont, $brushWhite, 465, ($barY + 40))
$g.DrawString('7/1 Jam Jam Market, 1 No Rail Gate, Tejgaon', $barTextFont, $brushMuted, 465, ($barY + 62))
$g.DrawString('Chattogram Regional Division', $barBoldFont, $brushWhite, 465, ($barY + 92))
$g.DrawString('238 D.T. Road, West Madarbari, Chattogram', $barTextFont, $brushMuted, 465, ($barY + 114))

# Column 3: Web Portal
$g.DrawString('OFFICIAL WEB PLATFORM', $barTitleFont, $brushAmber, 815, ($barY + 18))
$urlFont = New-Object System.Drawing.Font('Arial', 13, [System.Drawing.FontStyle]::Bold)
$g.DrawString('https://ali-food.vercel.app', $urlFont, $brushAmber, 815, ($barY + 42))
$g.DrawString('B2B Supply & Order Requisition', $barBoldFont, $brushWhite, 815, ($barY + 74))
$g.DrawString('20+ Standardized Poultry Cuts', $barTextFont, $brushMuted, 815, ($barY + 98))
$g.DrawString('Vendor Code: AF-INST-2026/09', $barTextFont, $brushGold, 815, ($barY + 122))

# Save
$outPath = 'F:\GIT\ALIFOODWEB\public\images\og-image.png'
$bmp.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)

$g.Dispose()
$bmp.Dispose()
Write-Output 'og-image.png (1200x630) refined successfully!'
