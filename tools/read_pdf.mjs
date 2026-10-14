import { readFileSync, writeFileSync } from 'fs';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const pdfParse = require('pdf-parse');

const pdfBuffer = readFileSync('E:\\Downloads\\Ali_Food_Complete_Corporate_Record_5_Pages.pdf');
const data = await pdfParse(pdfBuffer);
console.log('=== PDF INFO ===');
console.log('Pages:', data.numpages);
console.log('=== TEXT CONTENT ===');
console.log(data.text);
writeFileSync('pdf_content.txt', `Pages: ${data.numpages}\n\n${data.text}`);
console.log('\nWritten to pdf_content.txt');
