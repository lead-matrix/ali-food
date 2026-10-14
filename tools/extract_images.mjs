import fs from 'fs';
import zlib from 'zlib';
import { PDFDocument, PDFName } from 'pdf-lib';

const dir = 'F:/GIT/ALIFOODWEB/public/images/extracted';
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

async function extractImagesFromPdf(filePath, prefix) {
  const pdfBytes = fs.readFileSync(filePath);
  const pdfDoc = await PDFDocument.load(pdfBytes);
  let count = 0;
  
  const enumeratedIndirectObjects = pdfDoc.context.enumerateIndirectObjects();
  for (const [ref, obj] of enumeratedIndirectObjects) {
    if (obj.dict && obj.dict.get) {
      const subtype = obj.dict.get(PDFName.of('Subtype'));
      if (subtype && subtype.name === 'Image') {
        count++;
        const width = obj.dict.get(PDFName.of('Width'))?.value;
        const height = obj.dict.get(PDFName.of('Height'))?.value;
        const filter = obj.dict.get(PDFName.of('Filter'))?.name || 'raw';
        const colorSpace = obj.dict.get(PDFName.of('ColorSpace'))?.toString();
        const bpc = obj.dict.get(PDFName.of('BitsPerComponent'))?.value || 8;
        const smaskRef = obj.dict.get(PDFName.of('SMask'));
        console.log(`[${prefix}] Image ${count}: ${width}x${height}, filter: ${filter}, smask: ${!!smaskRef}`);
        
        let bytes = obj.getContents();
        if (filter === 'FlateDecode') {
          try {
            bytes = zlib.inflateSync(bytes);
          } catch(e) {
            console.log('  inflate error', e.message);
          }
        }
        
        fs.writeFileSync(`${dir}/${prefix}_img${count}_${width}x${height}.bin`, bytes);
        
        // If smask exists, extract it too
        if (smaskRef) {
          const smaskObj = pdfDoc.context.lookup(smaskRef);
          if (smaskObj) {
            let smaskBytes = smaskObj.getContents();
            const smFilter = smaskObj.dict.get(PDFName.of('Filter'))?.name;
            if (smFilter === 'FlateDecode') {
              try { smaskBytes = zlib.inflateSync(smaskBytes); } catch(e){}
            }
            fs.writeFileSync(`${dir}/${prefix}_img${count}_${width}x${height}_smask.bin`, smaskBytes);
          }
        }
      }
    }
  }
}

async function run() {
  await extractImagesFromPdf('C:/Users/mrbar/.gemini/antigravity/brain/39d4424e-0ac5-4c24-aacb-bceeee2879f9/.user_uploaded/media_1790143312541.pdf', 'shwapno');
  await extractImagesFromPdf('C:/Users/mrbar/.gemini/antigravity/brain/39d4424e-0ac5-4c24-aacb-bceeee2879f9/.user_uploaded/media_1790143312555.pdf', 'charulota');
  await extractImagesFromPdf('C:/Users/mrbar/.gemini/antigravity/brain/39d4424e-0ac5-4c24-aacb-bceeee2879f9/.user_uploaded/media_1790143312622.pdf', 'aribah');
}
run();
