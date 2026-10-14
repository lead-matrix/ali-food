$sourceDocx = "E:\Downloads\BBCL HEAD PAD.docx"
$targetDocx = "E:\Downloads\BBCL_Certificate_2025.docx"
$targetPdf  = "E:\Downloads\BBCL_Certificate_2025.pdf"

Copy-Item $sourceDocx $targetDocx -Force

$word = New-Object -ComObject Word.Application
$word.Visible = $false
$doc = $word.Documents.Open($targetDocx)

# Setup A4 page with appropriate margins
$doc.PageSetup.PaperSize = 7 # A4
$doc.PageSetup.TopMargin = 85
$doc.PageSetup.BottomMargin = 45
$doc.PageSetup.LeftMargin = 52
$doc.PageSetup.RightMargin = 52

# Locate the signature shape and paragraph
$sigShape = $doc.InlineShapes.Item(1)
$sigRange = $sigShape.Range
$sigPara  = $sigRange.Paragraphs.Item(1)

# Delete all empty paragraphs preceding the signature paragraph
$sigStart = $sigPara.Range.Start
if ($sigStart -gt 0) {
    $doc.Range(0, $sigStart).Delete()
}

# Clear any text in the signature paragraph (like the '/')
$sigParaText = $sigPara.Range.Text.Trim()
if ($sigParaText -eq "/") {
    # Keep the shape, clear text
    # In Word, the inline shape is inside the range
}

# Prepare official certificate body text
$certText = "Ref No: BBCL/SCM/VENDOR-CERT/2025/11-032" + "						" + "Date: 12 November 2025" +
"TO WHOM IT MAY CONCERN" +
"This is to certify that M/S Ali Food, with central distribution and butchery hubs in Tejgaon, Dhaka and West Madarbari, Chattogram, is an enlisted and active supplier of fresh poultry and meat products to Big Boss Corporation Ltd. (Aptech Industrial Park, 30 Sarabo, Kashimpur, Gazipur)." +
"During the contract tenure of 01 November 2024 to 31 October 2025, M/S Ali Food has regularly supplied bulk dressed broiler poultry, custom culinary portioned cuts, and specialty waterfowl catering to our central industrial cafeteria and executive meal services." +
"Their operations have consistently complied with agreed specifications, temperature preservation during cold transit, weight accuracy, and strict halal and hygiene benchmarks. Their supply execution and order response have remained highly dependable." +
"This certificate is issued upon the request of M/S Ali Food for corporate documentation and institutional procurement pre-qualification purposes, without any legal or financial liability on the part of Big Boss Corporation Ltd." +
"We wish them continuous growth in their institutional enterprise."

# Insert the text at the beginning of the document
$insertRange = $doc.Range(0, 0)
$insertRange.Text = $certText

# Format Ref and Date paragraph
$p1 = $doc.Paragraphs.Item(1)
$p1.Range.Font.Name = "Calibri"
$p1.Range.Font.Size = 9.5
$p1.Range.Font.Bold = 0

# Format 'TO WHOM IT MAY CONCERN'
$p2 = $doc.Paragraphs.Item(3)
$p2.Range.Font.Name = "Calibri"
$p2.Range.Font.Size = 11
$p2.Range.Font.Bold = 1
$p2.Range.ParagraphFormat.Alignment = 1 # Center

# Format Body paragraphs
for ($i = 5; $i -le 13; $i += 2) {
    if ($i -le $doc.Paragraphs.Count) {
        $p = $doc.Paragraphs.Item($i)
        $p.Range.Font.Name = "Calibri"
        $p.Range.Font.Size = 10
        $p.Range.Font.Bold = 0
        $p.Range.ParagraphFormat.Alignment = 3 # Justify
        $p.Range.ParagraphFormat.LineSpacingRule = 0 # Single
        $p.Range.ParagraphFormat.SpaceAfter = 6
    }
}

# Save as PDF
if (Test-Path $targetPdf) { Remove-Item $targetPdf }
$doc.SaveAs([ref]$targetPdf, [ref]17) # wdFormatPDF = 17

$doc.Close($false)
$word.Quit()
Write-Output "BBCL PDF generated successfully!"
