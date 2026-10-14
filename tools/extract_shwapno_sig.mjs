import fs from 'fs';
import zlib from 'zlib';
import { PDFDocument, PDFName } from 'pdf-lib';

async function extract541() {
  const pdfBytes = fs.readFileSync('C:/Users/mrbar/.gemini/antigravity/brain/39d4424e-0ac5-4c24-aacb-bceeee2879f9/.user_uploaded/media_1790143312541.pdf');
  const doc = await PDFDocument.load(pdfBytes);
  const x8 = doc.context.lookup(doc.context.enumerateIndirectObjects().find(([ref]) => ref.tag === '8 0 R')[0]);
  const x9 = doc.context.lookup(doc.context.enumerateIndirectObjects().find(([ref]) => ref.tag === '9 0 R')[0]);
  
  const w = x8.dict.get(PDFName.of('Width')).numberValue;
  const h = x8.dict.get(PDFName.of('Height')).numberValue;
  console.log('Shwapno Sig:', w, 'x', h);
  
  const rgb = zlib.inflateSync(x8.getContents());
  const alpha = zlib.inflateSync(x9.getContents());
  console.log('RGB length:', rgb.length, 'expected:', w * h * 3);
  console.log('Alpha length:', alpha.length, 'expected:', w * h);
  
  fs.writeFileSync('F:/GIT/ALIFOODWEB/public/images/signatures/real_shwapno_sig_rgb.raw', rgb);
  fs.writeFileSync('F:/GIT/ALIFOODWEB/public/images/signatures/real_shwapno_sig_alpha.raw', alpha);
}

extract541();
