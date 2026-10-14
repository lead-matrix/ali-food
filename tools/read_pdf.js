const fs = require('fs');
const path = require('path');

// Try pdf-parse
async function readPDF() {
  try {
    const pdfParse = require('pdf-parse');
    const pdfBuffer = fs.readFileSync('E:\\Downloads\\Ali_Food_Complete_Corporate_Record_5_Pages.pdf');
    const data = await pdfParse(pdfBuffer);
    console.log('=== PDF INFO ===');
    console.log('Pages:', data.numpages);
    console.log('=== TEXT CONTENT ===');
    console.log(data.text);
  } catch (e) {
    console.error('Error:', e.message);
  }
}

readPDF();
