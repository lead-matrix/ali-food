[Windows.Storage.StorageFile, Windows.Storage, ContentType = WindowsRuntime] | Out-Null
[Windows.Storage.FileAccessMode, Windows.Storage, ContentType = WindowsRuntime] | Out-Null
[Windows.Globalization.Language, Windows.Globalization, ContentType = WindowsRuntime] | Out-Null
[Windows.Graphics.Imaging.BitmapDecoder, Windows.Graphics.Imaging, ContentType = WindowsRuntime] | Out-Null
[Windows.Media.Ocr.OcrEngine, Windows.Media.Ocr, ContentType = WindowsRuntime] | Out-Null
Add-Type -AssemblyName System.Runtime.WindowsRuntime

function Await($op) {
    return [System.WindowsRuntimeSystemExtensions]::AsTask($op).GetAwaiter().GetResult()
}

$lang = New-Object Windows.Globalization.Language("en-US")
$ocr = [Windows.Media.Ocr.OcrEngine]::TryCreateFromLanguage($lang)

$file = Await([Windows.Storage.StorageFile]::GetFileFromPathAsync("F:\GIT\ALIFOODWEB\public\images\pandamart_cert.jpg"))
$stream = Await($file.OpenAsync([Windows.Storage.FileAccessMode]::Read))
$decoder = Await([Windows.Graphics.Imaging.BitmapDecoder]::CreateAsync($stream))
$bitmap = Await($decoder.GetSoftwareBitmapAsync())

$result = Await($ocr.RecognizeAsync($bitmap))
Write-Output "--- OCR RESULT ---"
Write-Output $result.Text
