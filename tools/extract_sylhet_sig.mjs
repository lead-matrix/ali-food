import fs from 'fs';
import zlib from 'zlib';
import { PDFDocument, PDFName } from 'pdf-lib';

async function extractSylhetSig() {
  const pdfBytes = fs.readFileSync('C:/Users/mrbar/.gemini/antigravity/brain/39d4424e-0ac5-4c24-aacb-bceeee2879f9/.user_uploaded/media_1790142942769.pdf');
  const doc = await PDFDocument.load(pdfBytes);
  const x75 = doc.context.lookup(doc.context.enumerateIndirectObjects().find(([ref]) => ref.tag === '75 0 R')[0]);
  const x74 = doc.context.lookup(doc.context.enumerateIndirectObjects().find(([ref]) => ref.tag === '74 0 R')[0]);
  
  const w = x75.dict.get(PDFName.of('Width')).numberValue;
  const h = x75.dict.get(PDFName.of('Height')).numberValue;
  console.log('Sylhet Sig:', w, 'x', h);
  
  const rgb = zlib.inflateSync(x75.getContents());
  const alpha = zlib.inflateSync(x74.getContents());
  console.log('RGB len:', rgb.length, 'Alpha len:', alpha.length);
  
  fs.writeFileSync('F:/GIT/ALIFOODWEB/public/images/signatures/sylhet_sig_rgb.raw', rgb);
  fs.writeFileSync('F:/GIT/ALIFOODWEB/public/images/signatures/sylhet_sig_alpha.raw', alpha);
}

extractSylhetSig();
