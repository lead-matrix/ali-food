/**
 * Ali Food — Corporate Dossier Generator  v9 (PRODUCTION RELEASE)
 *
 * Requirements fulfilled:
 *   1. Conditional Headers:
 *      - Corporate Pages (1, 2, 3, & 9): Full-width Ali Food official header banner.
 *      - Certificate Pages (4, 5, 6, 7, 8, 10, & 11): Authentic client letterheads with respective logos.
 *   2. Authentic Logos in Client Letterheads:
 *      - Page 4 (Aribah's Kitchen): Official flame/white script logo on dark banner.
 *      - Page 5 (Charulota Restora): Official circular gold & green emblem logo.
 *      - Page 6 (SHWAPNO Chattogram): Official Shwapno logo + footer award banner.
 *      - Page 7 (Hotel Al Mahboob): Executive hospitality header.
 *      - Page 8 (BBCL): Official green horse corporate emblem.
 *      - Page 9 (Pandamart): Official Delivery Hero / Pandamart header & authentic stamp/sig.
 *      - Page 10 (SHWAPNO Sylhet): Official Shwapno logo + footer award banner.
 *   3. Authentic Scanned Handwritten Signatures:
 *      - Page 4: MD. ARIFUL ISLAM (Proprietor & Head of Operations, Aribah's Kitchen)
 *      - Page 5: MOHAMMAD ZAHIDUL ISLAM (Manager, Procurement & Food Operations, Charulota Restora)
 *      - Page 6: MD TANJIL HOSSAIN (Deputy Manager, Regional Procurement, SHWAPNO Chattogram)
 *      - Page 7: MERAJUL ISLAM SHIMANTO (Manager, Hotel Al Mahboob)
 *      - Page 8: FERDOUS KHAN (Director, Supply Chain Management, BBCL)
 *      - Page 9: DELIVERY HERO STORES (Pandamart) Official Stamp & Ink Signature
 *      - Page 10: MAHBUB JAMIL CHOWDHURY (Deputy Manager, Regional Procurement, SHWAPNO Sylhet)
 *   4. Sub-Vendor Strategic Affiliations:
 *      - Ali Food explicitly documented as primary sub-vendor and butchery supply partner
 *        for Daily Fresh Meat and Allah'r Dan Chicken House across Pandamart & Shwapno.
 *   5. WhatsApp Icon Branding:
 *      - Official WhatsApp icon embedded and displayed on master footers, Page 1 contact registry,
 *        Page 2 profile, and Page 9 Get In Touch directory.
 *   6. Complete 11-Page Dossier Structure & Automated Validation Gate.
 */

import { readFileSync, writeFileSync } from 'fs';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');
const pdfParse = require('pdf-parse/lib/pdf-parse.js');

export const TOTAL = 11;
export const W = 595.28; // A4 width in points
export const H = 841.89; // A4 height in points
export const M = 40;     // Content margin

// Brand colors
export const C = {
  orange    : rgb(0.93, 0.48, 0.13), // #ED7A21 / Primary Brand Orange
  green     : rgb(0.08, 0.47, 0.23), // #14783B / Deep Brand Green
  maroon    : rgb(0.361, 0.063, 0.063), // #5C1010 / Dark Maroon
  white     : rgb(1, 1, 1),
  black     : rgb(0, 0, 0),
  greyDark  : rgb(0.20, 0.20, 0.20),
  greyMid   : rgb(0.48, 0.48, 0.48),
  greyLight : rgb(0.94, 0.94, 0.94),
  greyRow   : rgb(0.97, 0.97, 0.97),
  cream     : rgb(1.00, 0.97, 0.91),
  navy      : rgb(0.12, 0.22, 0.45),
  pandamart : rgb(0.83, 0.13, 0.42),
};

// Basic drawing primitives
const fillRect = (pg, x, y, w, h, color) =>
  pg.drawRectangle({ x, y, width: w, height: h, color });

const txt = (pg, s, x, y, font, size, color = C.black) =>
  pg.drawText(String(s), { x, y, font, size, color });

const txtCenter = (pg, s, y, font, size, color = C.black, ax = 0, aw = W) => {
  const tw = font.widthOfTextAtSize(String(s), size);
  pg.drawText(String(s), { x: ax + (aw - tw) / 2, y, font, size, color });
};

const txtRight = (pg, s, edge, y, font, size, color = C.black) => {
  const tw = font.widthOfTextAtSize(String(s), size);
  pg.drawText(String(s), { x: edge - tw, y, font, size, color });
};

const hLine = (pg, x, y, w, t = 0.5, color = C.greyMid) =>
  pg.drawLine({ start: { x, y }, end: { x: x + w, y }, thickness: t, color });

// ═══════════════════════════════════════════════════════════════════════════════
//  STANDARDIZED MASTER FOOTER (Applied to ALL 11 pages with WhatsApp Icon)
// ═══════════════════════════════════════════════════════════════════════════════
export function applyMasterFooter(page, pageNum, totalPages, fonts, whatsappIcon = null) {
  const width = page.getWidth();
  const footerHeight = 28;

  // Full-bleed deep green footer
  page.drawRectangle({
    x: 0,
    y: 0,
    width: width,
    height: footerHeight,
    color: C.green,
  });

  // Top gold accent line
  page.drawRectangle({
    x: 0,
    y: footerHeight - 2,
    width: width,
    height: 2,
    color: C.orange,
  });

  const pageStr = `AF/CORP/2026  |  Page ${pageNum} of ${totalPages}`;

  if (fonts.regular) {
    if (whatsappIcon) {
      page.drawText('M/S ALI FOOD  |', {
        x: 35,
        y: 10,
        size: 8,
        font: fonts.regular,
        color: C.white,
      });

      page.drawImage(whatsappIcon, {
        x: 102,
        y: 8,
        width: 12,
        height: 12,
      });

      page.drawText('01319-345501 / 01401-238019  |  alislamridoy@gmail.com', {
        x: 118,
        y: 10,
        size: 8,
        font: fonts.regular,
        color: C.white,
      });
    } else {
      page.drawText('M/S ALI FOOD  |  01319-345501 / 01401-238019  |  alislamridoy@gmail.com', {
        x: 35,
        y: 10,
        size: 8,
        font: fonts.regular,
        color: C.white,
      });
    }
  }

  if (fonts.bold) {
    page.drawText(pageStr, {
      x: width - 175,
      y: 10,
      size: 8,
      font: fonts.bold,
      color: C.white,
    });
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
//  CLIENT LETTERHEADS (Pages 4, 5, 6, 7, 8, 10, & 11) WITH ORIGINAL LOGOS
// ═══════════════════════════════════════════════════════════════════════════════
export function drawClientLetterhead(page, pageNum, fonts, clientLogos = {}) {
  const width = page.getWidth();
  const height = page.getHeight();
  const { bold: B, regular: R, italic: I } = fonts;

  if (pageNum === 4) {
    // Page 4: Aribah's Kitchen Letterhead Header (Dark Navy Banner matching original scan)
    const bannerH = 68;
    fillRect(page, 0, height - bannerH, width, bannerH, rgb(0.12, 0.10, 0.25));
    fillRect(page, 0, height - bannerH - 2, width, 2, C.orange);

    if (clientLogos.aribah) {
      const lw = 150;
      const lh = 48;
      page.drawImage(clientLogos.aribah, {
        x: (width - lw) / 2,
        y: height - bannerH + (bannerH - lh) / 2,
        width: lw,
        height: lh,
      });
    } else {
      txtCenter(page, "ARIBAH'S KITCHEN", height - 42, B, 22, C.white);
    }

    txtCenter(page, "273/3 West Nakhalpara, Tejgaon, Dhaka-1215  |  Mobile: +88 01768-354350", height - bannerH - 14, R, 8.5, C.greyDark);
    hLine(page, M, height - bannerH - 21, width - M * 2, 0.75, rgb(0.12, 0.10, 0.25));
    return bannerH + 25;
  }

  if (pageNum === 5) {
    // Page 5: Charulota Restora Letterhead Header (Circular Emblem + Ornate Details)
    fillRect(page, 0, height - 4, width, 4, rgb(0.05, 0.35, 0.21));
    fillRect(page, 0, height - 6, width, 2, rgb(0.83, 0.69, 0.22));

    if (clientLogos.charulota) {
      page.drawImage(clientLogos.charulota, {
        x: M,
        y: height - 80,
        width: 62,
        height: 61,
      });
    }

    const tx = clientLogos.charulota ? M + 74 : M;
    txt(page, "CHARULOTA RESTORA", tx, height - 33, B, 20, rgb(0.05, 0.35, 0.21));
    txt(page, "CHINESE, BANGLA, INDIAN & CATERING SERVICE  (Air Conditioned)", tx, height - 47, B, 8, rgb(0.25, 0.25, 0.25));
    txt(page, "16, Kawran Bazar, Amber Shah Mosque Market (2nd Fl.), Tejgaon, Dhaka-1215, Bangladesh", tx, height - 60, R, 7.5, C.greyDark);
    txt(page, "Hotline: +88 01742-239404  |  Mobile: +88 01767-940444, +88 01685-559249  |  24 Hours Open", tx, height - 71, R, 7.2, C.greyMid);

    hLine(page, M, height - 86, width - M * 2, 1, rgb(0.05, 0.35, 0.21));
    hLine(page, M, height - 88.5, width - M * 2, 0.5, rgb(0.83, 0.69, 0.22));
    return 95;
  }

  if (pageNum === 6) {
    // Page 6: SHWAPNO / ACI Logistics Ltd. Chattogram (Official Logo)
    fillRect(page, 0, height - 4, width, 4, rgb(0.85, 0.12, 0.12));
    fillRect(page, 0, height - 6, width, 2, rgb(0.08, 0.45, 0.20));

    if (clientLogos.shwapno) {
      page.drawImage(clientLogos.shwapno, {
        x: width - M - 90,
        y: height - 76,
        width: 88,
        height: 49,
      });
    }

    txt(page, "SHWAPNO", M, height - 34, B, 22, rgb(0.85, 0.12, 0.12));
    txt(page, "  |  ACI LOGISTICS LIMITED", M + 112, height - 34, B, 13, rgb(0.2, 0.2, 0.2));
    txt(page, "Bangladesh's Leading Retail Superstore Chain  |  Regional Procurement Division", M, height - 48, B, 8.5, rgb(0.08, 0.45, 0.20));
    txt(page, "Zakir Hossain Road (Opposite Holy Crescent Hospital), North Khulshi, Chattogram", M, height - 61, R, 8, C.greyDark);
    txt(page, "Customer Care: 16469  |  Web: www.shwapno.com  |  Corporate SCM Desk: proc.ctg@shwapno.net", M, height - 72, R, 7.5, C.greyMid);

    hLine(page, M, height - 85, width - M * 2, 1, rgb(0.08, 0.45, 0.20));
    hLine(page, M, height - 87.5, width - M * 2, 0.5, rgb(0.85, 0.12, 0.12));
    return 95;
  }

  if (pageNum === 7) {
    // Page 7: Hotel Al Mahboob Letterhead Header
    fillRect(page, 0, height - 44, width, 44, C.navy);
    fillRect(page, 0, height - 47, width, 3, C.orange);
    txtCenter(page, "HOTEL AL MAHBOOB", height - 25, B, 17, C.white);
    txtCenter(page, "Hospitality, Executive Lodging & Banquet Catering Services  |  Dhaka, Bangladesh", height - 38, R, 8, C.orange);
    txtCenter(page, "Manager: Merajul Islam Shimanto  |  Direct Contact: 01688984958  |  Tejgaon & Farmgate District, Dhaka", height - 60, B, 8, C.navy);
    hLine(page, M, height - 70, width - M * 2, 0.75, C.navy);
    return 78;
  }

  if (pageNum === 8) {
    // Page 8: Big Boss Corporation Ltd. (BBCL) (Official Horse Logo)
    fillRect(page, 0, height - 4, width, 4, rgb(0.15, 0.22, 0.30));
    fillRect(page, 0, height - 6, width, 2, C.orange);

    if (clientLogos.bbcl) {
      page.drawImage(clientLogos.bbcl, {
        x: width - M - 35,
        y: height - 73,
        width: 28,
        height: 38,
      });
    }

    txt(page, "BIG BOSS CORPORATION LTD. (BBCL)", M, height - 34, B, 19, rgb(0.12, 0.18, 0.25));
    txt(page, "Industrial Apparel Conglomerate  |  Directorate of Central Supply Chain Management", M, height - 48, B, 8.5, rgb(0.35, 0.40, 0.45));
    txt(page, "Aptech Industrial Park, 30 Sarabo, Kashimpur, Gazipur, Bangladesh", M, height - 61, R, 8, C.greyDark);
    txt(page, "Head Office: BGMEA Complex (Level-08), Uttara, Dhaka-1230  |  Web: www.aptechdesignsltd.com", M, height - 72, R, 7.5, C.greyMid);

    hLine(page, M, height - 85, width - M * 2, 1, rgb(0.15, 0.22, 0.30));
    hLine(page, M, height - 87.5, width - M * 2, 0.5, C.orange);
    return 95;
  }

  if (pageNum === 9) {
    // Page 9: Delivery Hero Stores (Bangladesh) Ltd. / Pandamart
    fillRect(page, 0, height - 4, width, 4, C.pandamart);
    fillRect(page, 0, height - 6, width, 2, C.orange);

    txt(page, "DELIVERY HERO STORES (BANGLADESH) LIMITED", M, height - 34, B, 16.5, C.pandamart);
    txt(page, "PANDAMART QUICK-COMMERCE OPERATIONS  |  CENTRAL PROCUREMENT DIVISION", M, height - 48, B, 8.5, rgb(0.2, 0.2, 0.2));
    txt(page, "Simpletree Attalika, Level-9, Plot-13, Block-CEN(C), Holding 134, Gulshan Avenue, Dhaka-1212", M, height - 61, R, 8, C.greyDark);
    txt(page, "Platform: www.foodpanda.com.bd  |  Corporate SCM Desk: supply.bd@deliveryhero.com", M, height - 72, R, 7.5, C.greyMid);

    hLine(page, M, height - 85, width - M * 2, 1, C.pandamart);
    hLine(page, M, height - 87.5, width - M * 2, 0.5, C.orange);
    return 95;
  }

  if (pageNum === 10) {
    // Page 10: SHWAPNO / ACI Logistics Ltd. Sylhet (Official Logo)
    fillRect(page, 0, height - 4, width, 4, rgb(0.85, 0.12, 0.12));
    fillRect(page, 0, height - 6, width, 2, rgb(0.08, 0.45, 0.20));

    if (clientLogos.shwapno) {
      page.drawImage(clientLogos.shwapno, {
        x: width - M - 90,
        y: height - 76,
        width: 88,
        height: 49,
      });
    }

    txt(page, "SHWAPNO", M, height - 34, B, 22, rgb(0.85, 0.12, 0.12));
    txt(page, "  |  ACI LOGISTICS LIMITED", M + 112, height - 34, B, 13, rgb(0.2, 0.2, 0.2));
    txt(page, "Bangladesh's Leading Retail Superstore Chain  |  Sylhet Regional Division", M, height - 48, B, 8.5, rgb(0.08, 0.45, 0.20));
    txt(page, "Antaranga 70/1, North Kazitula, Supply Road, Central Shahi Eidgah, Sylhet-3100", M, height - 61, R, 8, C.greyDark);
    txt(page, "Regional SCM: +88 01999 081 099  |  Email: jamil@acilogistics.net  |  Web: www.shwapno.com", M, height - 72, R, 7.5, C.greyMid);

    hLine(page, M, height - 85, width - M * 2, 1, rgb(0.08, 0.45, 0.20));
    hLine(page, M, height - 87.5, width - M * 2, 0.5, rgb(0.85, 0.12, 0.12));
    return 95;
  }

  return 65;
}

// ═══════════════════════════════════════════════════════════════════════════════
//  MASTER HEADER ROUTING LOGIC (Ali Food vs Client Letterheads)
// ═══════════════════════════════════════════════════════════════════════════════
export function renderPageHeader(page, pageNum, aliFoodLogoBanner, subtitle = '', fonts = {}, clientLogos = {}) {
  const isCertificatePage = [4, 5, 6, 7, 8, 9, 10].includes(pageNum);

  if (isCertificatePage) {
    // Draw respective Client Letterhead with original company logo
    return drawClientLetterhead(page, pageNum, fonts, clientLogos);
  } else {
    // Draw Ali Food Official Header Banner across corporate pages (1, 2, 3, & 9)
    const width = page.getWidth();
    const height = page.getHeight();
    const headerHeight = 65;

    page.drawImage(aliFoodLogoBanner, {
      x: 0,
      y: height - headerHeight,
      width: width,
      height: headerHeight,
    });

    // Green accent strip under banner
    page.drawRectangle({
      x: 0,
      y: height - headerHeight - 2,
      width: width,
      height: 2,
      color: C.green,
    });

    let usedTop = headerHeight + 2;

    if (subtitle && fonts.bold) {
      const subH = 19;
      page.drawRectangle({
        x: 0,
        y: height - headerHeight - 2 - subH,
        width: width,
        height: subH,
        color: C.maroon,
      });
      page.drawRectangle({
        x: 0,
        y: height - headerHeight - 2 - subH - 2,
        width: width,
        height: 2,
        color: C.green,
      });

      const tw = fonts.bold.widthOfTextAtSize(subtitle, 8.5);
      page.drawText(subtitle, {
        x: (width - tw) / 2,
        y: height - headerHeight - 2 - subH + 5.5,
        size: 8.5,
        font: fonts.bold,
        color: C.white,
      });
      usedTop += subH + 2;
    }

    return usedTop;
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
//  DYNAMIC TEXT WRAPPING (Zero Truncation / Overlap)
// ═══════════════════════════════════════════════════════════════════════════════
export function drawWrappedText(page, text, { x, y, maxWidth, lineHeight, font, size, color }) {
  const words = String(text).split(' ');
  let currentLine = '';
  let currentY = y;

  for (const word of words) {
    const testLine = currentLine.length > 0 ? `${currentLine} ${word}` : word;
    const testWidth = font.widthOfTextAtSize(testLine, size);

    if (testWidth > maxWidth && currentLine.length > 0) {
      page.drawText(currentLine.trim(), { x, y: currentY, size, font, color });
      currentLine = word;
      currentY -= lineHeight;
    } else {
      currentLine = testLine;
    }
  }

  if (currentLine.trim().length > 0) {
    page.drawText(currentLine.trim(), { x, y: currentY, size, font, color });
    currentY -= lineHeight;
  }

  return currentY;
}

// ═══════════════════════════════════════════════════════════════════════════════
//  STANDARDIZED BOTTOM SIGNATURE BLOCK (AUTHENTIC INK SIGNATURES)
// ═══════════════════════════════════════════════════════════════════════════════
export function drawSignatureBlock(page, { signatoryName, designation, companyName, location, fontBold, fontRegular, sigImage, isStamp = false }) {
  const startY = 152;
  const startX = 50;

  // Draw authentic ink signature PNG image
  if (sigImage) {
    if (isStamp) {
      // For Pandamart official stamp + signature (500x360)
      page.drawImage(sigImage, {
        x: startX,
        y: startY - 18,
        width: 135,
        height: 97,
      });
    } else {
      page.drawImage(sigImage, {
        x: startX,
        y: startY - 8,
        width: 130,
        height: 50,
      });
    }
  }

  // Designation block below signature
  page.drawText(signatoryName.toUpperCase(), { x: startX, y: startY - 22, size: 9,  font: fontBold   });
  page.drawText(designation,                 { x: startX, y: startY - 34, size: 8,  font: fontRegular });
  page.drawText(companyName,                 { x: startX, y: startY - 46, size: 8,  font: fontRegular });
  page.drawText(`Place: ${location}`,        { x: startX, y: startY - 58, size: 8,  font: fontRegular });
}


// ═══════════════════════════════════════════════════════════════════════════════
//  PAGE 1 — COVER + TABLE OF CONTENTS (Balanced Spacing with WhatsApp icon)
// ═══════════════════════════════════════════════════════════════════════════════
async function buildCoverPage(doc, aliFoodLogoBanner, fonts, whatsappIcon) {
  const pg = doc.addPage([W, H]);
  const { bold: B, regular: R, italic: I } = fonts;

  fillRect(pg, 0, 0, W, H, C.white);
  const usedTop = renderPageHeader(pg, 1, aliFoodLogoBanner, 'CORPORATE PROFILE & SUPPORTING DOCUMENTS', fonts);

  // Slogan bar
  const tagY = H - usedTop - 24;
  hLine(pg, M, tagY + 10, W - M * 2, 1, C.green);
  txtCenter(pg, '"YOUR TRUSTED MEAT SOURCE"', tagY - 1, B, 11, C.maroon);
  hLine(pg, M, tagY - 10, W - M * 2, 1, C.green);

  // Table of Contents
  const tocY = tagY - 30;
  fillRect(pg, M, tocY - 5, W - M * 2, 20, C.green);
  fillRect(pg, M, tocY + 13, W - M * 2, 2, C.orange);
  txt(pg, 'TABLE OF CONTENTS  |  INSTITUTIONAL DOSSIER REGISTRY', M + 14, tocY + 3, B, 9.5, C.white);

  const entries = [
    ['2', 'Corporate Profile & Wholesale Supply Capabilities'],
    ['3', 'Commercial Supply Schedule & Wholesale Price List  |  FY 2026-2027'],
    ['4', 'Supply Certificate  |  Aribah\'s Kitchen (Tejgaon, Dhaka)'],
    ['5', 'Supply Certificate  |  Charulota Restora (Kawran Bazar, Dhaka)'],
    ['6', 'Supply Certificate  |  SHWAPNO / ACI Logistics Ltd. (Chattogram Division)'],
    ['7', 'Supplier Acknowledgement  |  Hotel Al Mahboob (Dhaka)'],
    ['8', 'Vendor Performance Certificate  |  Big Boss Corporation Ltd. (BBCL, Gazipur)'],
    ['9', 'Supply Certificate  |  Pandamart / Delivery Hero (Sub-Vendor Partnership)'],
    ['10', 'Supply Certificate  |  SHWAPNO Sylhet Regional Operations (Sub-Vendor)'],
    ['11', 'Why Ali Food?  5 Reasons to Partner  +  Institutional Desk'],
  ];

  let ey = tocY - 21;
  const rowH = 17;
  entries.forEach(([pgN, lbl], i) => {
    fillRect(pg, M, ey - 4, W - M * 2, rowH, i % 2 === 0 ? C.greyRow : C.white);
    fillRect(pg, M, ey - 4, 24, rowH, C.green);
    txtCenter(pg, pgN, ey + 4, B, 8.5, C.white, M, 24);
    txt(pg, lbl, M + 32, ey + 4, R, 8.2, C.greyDark);
    ey -= (rowH + 1.5);
  });
  hLine(pg, M, ey + 6, W - M * 2, 0.5, C.green);

  // ── COMPANY PROFILE SNAPSHOT ───────────────────────────────────────────────
  const snapY = ey - 8;
  const boxBottom = 32; // sits just above footer
  const boxH = snapY + 6 - boxBottom;

  fillRect(pg, M, boxBottom, W - M * 2, boxH, C.greyLight);
  fillRect(pg, M, snapY + 6, W - M * 2, 3, C.green);

  // Section title bar
  txtCenter(pg, 'COMPANY OVERVIEW  |  OPERATIONAL REGISTRY & SUB-VENDOR NETWORK', snapY - 4, B, 8.2, C.green);

  // ── Overview Paragraph ─────────────────────────────────────────────────────
  const ovY1 = snapY - 19;
  const overviewLines = [
    'M/S Ali Food is a licensed institutional poultry processor and wholesale meat distributor. Our facilities include central',
    'Processing Centers in Tejgaon, dedicated Wholesale Shops at Kaptan Bazar and Kawran Bazar, and live poultry supply',
    'depots at Shonar Bangla Hash Murgi Aroth and Sadek Khan Hash Murgi Aroth, alongside regional port logistics in Chattogram.',
    'We supply dressed broiler, specialty waterfowl, and portioned cuts to supermarket chains, catering firms, and dark stores.',
    'Ali Food acts as authorized butchery processing sub-vendor for Daily Fresh Meat and Allah\'r Dan Chicken House nationwide.',
  ];
  overviewLines.forEach((ln, idx) => {
    txt(pg, ln, M + 10, ovY1 - idx * 10.5, R, 7.3, C.greyDark);
  });

  // ── Divider ────────────────────────────────────────────────────────────────
  const div1Y = ovY1 - 58;
  hLine(pg, M + 6, div1Y, W - M * 2 - 12, 0.5, C.greyMid);

  // ── Contact Row (4 cols) with Facilities & WhatsApp branding ──────────────
  const cW4 = (W - M * 2) / 4;
  const ctY = div1Y - 12;

  // Processing Center
  txtCenter(pg, 'Processing Center', ctY, B, 7.5, C.green, M, cW4);
  txtCenter(pg, 'Tejgaon, Dhaka-1208', ctY - 11, R, 6.8, C.black, M, cW4);
  txtCenter(pg, 'Central Butchery Depot', ctY - 21, I, 6.0, C.greyMid, M, cW4);

  // Wholesale Shops
  txtCenter(pg, 'Wholesale Shops', ctY, B, 7.5, C.green, M + cW4, cW4);
  txtCenter(pg, 'Kaptan & Kawran Bazar', ctY - 11, R, 6.8, C.black, M + cW4, cW4);
  txtCenter(pg, 'Dhaka Wholesale Outlets', ctY - 21, I, 6.0, C.greyMid, M + cW4, cW4);

  // Wholesale Aroths
  txtCenter(pg, 'Wholesale Aroths', ctY, B, 7.5, C.green, M + cW4 * 2, cW4);
  txtCenter(pg, 'Shonar Bangla & Sadek Khan', ctY - 11, R, 6.6, C.black, M + cW4 * 2, cW4);
  txtCenter(pg, 'Live Bird & Duck Depots', ctY - 21, I, 6.0, C.greyMid, M + cW4 * 2, cW4);

  // Hotlines + WhatsApp
  txtCenter(pg, 'Hotlines & WhatsApp', ctY, B, 7.5, C.green, M + cW4 * 3, cW4);
  if (whatsappIcon) {
    pg.drawImage(whatsappIcon, {
      x: M + cW4 * 3 + 5,
      y: ctY - 14,
      width: 9,
      height: 9,
    });
    txt(pg, '01319-345501 / 01401-238019', M + cW4 * 3 + 16, ctY - 11, R, 6.2, C.black);
  } else {
    txtCenter(pg, '01319-345501 / 01401-238019', ctY - 11, R, 6.2, C.black, M + cW4 * 3, cW4);
  }
  txtCenter(pg, 'alislamridoy@gmail.com', ctY - 21, I, 6.0, C.greyMid, M + cW4 * 3, cW4);

  // Column divider lines
  for (let i = 1; i <= 3; i++) {
    pg.drawLine({
      start: { x: M + i * cW4, y: div1Y - 25 },
      end: { x: M + i * cW4, y: div1Y - 2 },
      thickness: 0.3,
      color: C.greyMid,
    });
  }

  // ── Divider ────────────────────────────────────────────────────────────────
  const div2Y = ctY - 28;
  hLine(pg, M + 6, div2Y, W - M * 2 - 12, 0.5, C.greyMid);

  // ── Key Metrics Row (4 stats) ──────────────────────────────────────────────
  const mY = div2Y - 11;
  const metrics = [
    { num: 'EST. 2020',       sub: 'Years of Growth'    },
    { num: '21+ PRODUCTS',    sub: 'Full Poultry Range' },
    { num: '05:00 AM - 08:00 AM', sub: 'Pre-Dawn Delivery' },
    { num: '7+ TIER-1 CLIENTS', sub: 'Verified Corporate' },
  ];
  metrics.forEach((m, i) => {
    const cx = M + i * cW4;
    txtCenter(pg, m.num, mY,      B, 7.5, C.maroon,  cx, cW4);
    txtCenter(pg, m.sub, mY - 10, R, 6.5, C.greyMid, cx, cW4);
    if (i < 3) {
      pg.drawLine({
        start: { x: cx + cW4, y: div2Y - 18 },
        end: { x: cx + cW4, y: div2Y - 2 },
        thickness: 0.3,
        color: C.greyMid,
      });
    }
  });

  // ── Quality Badges Strip ───────────────────────────────────────────────────
  const bY = mY - 16;
  hLine(pg, M + 6, bY, W - M * 2 - 12, 0.5, C.greyMid);
  const qY = bY - 8;
  const qW = (W - M * 2) / 4;
  [
    { icon: '[ HALAL ]',        lbl: '100% Manual Halal Slaughter', sub: 'Trained Team & Full Bleed' },
    { icon: '[ COLD-CHAIN ]',   lbl: '0-4 deg C Chilled / -18 deg C',  sub: 'Unbroken Freshness Chain'  },
    { icon: '[ BIO-SECURE ]',   lbl: 'Veterinary Cleared Stock',    sub: 'Health Inspected Batches'  },
    { icon: '[ SUB-VENDOR ]',   lbl: 'Daily Fresh & Allah\'r Dan',   sub: 'Pandamart & Shwapno Supply'},
  ].forEach((q, i) => {
    const cx = M + i * qW;
    txtCenter(pg, q.icon, qY - 2,  B, 6.8, C.green,    cx, qW);
    txtCenter(pg, q.lbl,  qY - 11, B, 6.5, C.greyDark, cx, qW);
    txtCenter(pg, q.sub,  qY - 19, I, 5.8, C.greyMid,  cx, qW);
  });

  applyMasterFooter(pg, 1, TOTAL, fonts, whatsappIcon);
}


// ═══════════════════════════════════════════════════════════════════════════════
//  PAGE 2 — CORPORATE PROFILE & SUPPLY CAPABILITIES
// ═══════════════════════════════════════════════════════════════════════════════
async function buildProfilePage(doc, aliFoodLogoBanner, fonts, whatsappIcon) {
  const pg = doc.addPage([W, H]);
  const { bold: B, regular: R, italic: I } = fonts;

  fillRect(pg, 0, 0, W, H, C.white);
  const usedTop = renderPageHeader(pg, 2, aliFoodLogoBanner, 'CORPORATE PROFILE & SUPPLY CAPABILITIES', fonts);

  fillRect(pg, 0, H - usedTop - 18, W, 18, C.greyLight);
  txt(pg, 'Wholesale Poultry, Meat & Dressed Cuts Partner', M, H - usedTop - 12, I, 8, C.greyDark);
  txtRight(pg, 'Record Ref: AF/CORP/2026  |  Dhaka & Chattogram', W - M, H - usedTop - 12, R, 7.2, C.greyDark);

  let cy = H - usedTop - 34;

  function secHead(n, title) {
    fillRect(pg, M, cy - 2, W - M * 2, 17, C.green);
    fillRect(pg, M, cy + 13, W - M * 2, 2, C.orange);
    txt(pg, `${n}.  ${title}`, M + 8, cy + 3, B, 8.5, C.white);
    cy -= 22;
  }

  // 1. Executive Overview
  secHead('1', 'EXECUTIVE OVERVIEW & BUSINESS SCOPE');
  const overviewText =
    'M/S Ali Food is an institutional poultry processor and wholesale meat supplier operating across Dhaka and Chattogram. ' +
    'Our commercial infrastructure includes our central Processing Center in Tejgaon, established wholesale trading shops ' +
    'at Kaptan Bazar and Kawran Bazar, and live poultry supply hubs at Shonar Bangla Hash Murgi Aroth and Sadek Khan Hash Murgi Aroth. ' +
    'We supply dressed chicken, specialty birds, and customized portion cuts to supermarket chains, corporate cafeterias, ' +
    'hotels, fine-dining restaurants, and dark-store fulfillment operations throughout Bangladesh. ' +
    'Our operations encompass bio-secure contract farming, temperature-monitored butchery, and cold-chain logistics ' +
    '- ensuring uninterrupted supply adhering strictly to national halal, veterinary hygiene, and food safety benchmarks.';
  cy = drawWrappedText(pg, overviewText, { x: M, y: cy, maxWidth: W - M * 2, lineHeight: 11.5, font: R, size: 8.0, color: C.greyDark });
  cy -= 7;

  // 2. Core Product Segments
  secHead('2', 'CORE PRODUCT SEGMENTS & SUPPLY PORTFOLIO');
  const segments = [
    {
      h: 'Dressed & Chilled Commercial Poultry',
      b: 'Daily-dressed Broiler (skin-on, skinless, curry cut), Layer, and Sonalika chicken. Eviscerated, chlorinated chilled-bath processed and weight-calibrated for volume food service.',
    },
    {
      h: 'Deboned & Culinary Portioned Cuts',
      b: '100% boneless breast fillets, drumsticks, leg quarters, wings, Thai cuts, paya, and vacuum-sealed liver/gizzard offals portioned precisely to institutional kitchen specs.',
    },
    {
      h: 'Specialty Waterfowl & Heritage Birds',
      b: 'Dressed Country Duck, Swan Meat, Pigeon (Squab), Belgium Duck, and native Desi chicken reared on clean feeds for banquet, executive, and traditional culinary operations.',
    },
    {
      h: 'Live Healthy Birds & Custom Butchery',
      b: 'Live Broiler, Sonali, Layer, and Desi transport from certified farms to institutional depots for on-site quality verification and immediate halal slaughter.',
    },
  ];

  segments.forEach(seg => {
    txt(pg, '>', M + 4, cy, B, 8.5, C.green);
    txt(pg, seg.h, M + 16, cy, B, 8.2, C.green);
    cy -= 11;
    cy = drawWrappedText(pg, seg.b, { x: M + 16, y: cy, maxWidth: W - M * 2 - 16, lineHeight: 10.5, font: R, size: 7.6, color: C.greyDark });
    cy -= 4;
  });
  cy -= 6;

  // 3. Hygiene Infrastructure
  secHead('3', 'HYGIENE INFRASTRUCTURE & OPERATIONAL STANDARDS');
  const cards = [
    { t: 'Bio-Secure Farms',     b: 'Contract sourcing with veterinary health clearances for every batch of birds before butchery.' },
    { t: '100% Halal Slaughter', b: 'Trained manual halal slaughter team, thorough hygiene protocols and complete blood draining.' },
    { t: 'Active Chill-Chain',   b: 'Holding chilled at 0-4 deg C and frozen at -18 deg C preserving tenderness, texture and freshness.' },
    { t: 'Express Dispatch',     b: 'Pre-dawn dedicated delivery routes (5:00-8:00 AM) across major Dhaka and Chattogram zones.' },
  ];
  const cWc = (W - M * 2 - 9) / 4;
  const cardH = 70;

  cards.forEach((card, i) => {
    const cx = M + i * (cWc + 3);
    fillRect(pg, cx, cy - cardH + 14, cWc, cardH, C.greyLight);
    fillRect(pg, cx, cy + 12,  cWc,  2.5, C.green);
    txtCenter(pg, card.t, cy + 1, B, 7.2, C.green, cx, cWc);
    hLine(pg, cx + 6, cy - 6, cWc - 12, 0.4, C.greyMid);

    drawWrappedText(pg, card.b, {
      x: cx + 6,
      y: cy - 14,
      maxWidth: cWc - 12,
      lineHeight: 9.5,
      font: R,
      size: 6.5,
      color: C.greyDark,
    });
  });
  cy -= cardH + 12;

  // 4. Verified Clients & Sub-Vendor Strategic Affiliations
  secHead('4', 'VERIFIED INSTITUTIONAL CLIENTS & SUB-VENDOR NETWORK');
  const clients = [
    'SHWAPNO  (Superstore Chain / ACI Logistics Limited — Chattogram & Sylhet Regional Divisions)',
    'Pandamart  (Delivery Hero Stores Bangladesh Limited — Quick-Commerce Network)',
    'Big Boss Corporation Ltd.  (BBCL, Industrial Apparel Conglomerate, Gazipur)',
    'Aribah\'s Kitchen  (Central Kitchen & Catering Operations, Tejgaon, Dhaka)',
    'Charulota Restora  (Banquet & Multi-Cuisine Restaurant, Kawran Bazar, Dhaka)',
    'Hotel Al Mahboob  (Hospitality & Executive Lodging Catering, Dhaka)',
    'Strategic Sub-Vendor: Daily Fresh Meat & Allah\'r Dan Chicken House (Retail Supply Fulfillment)',
  ];
  fillRect(pg, M, cy - clients.length * 12 - 2, W - M * 2, clients.length * 12 + 14, C.greyLight);
  fillRect(pg, M, cy + 8, W - M * 2, 2, C.green);
  txt(pg, 'CERTIFIED CLIENT & SUB-VENDOR REGISTRY  (Official documents on Pages 4-8, 10-11):',
      M + 8, cy - 1, B, 7.2, C.green);
  cy -= 12;
  clients.forEach(c => {
    txt(pg, '*  ' + c, M + 14, cy, B, 7.2, C.green);
    cy -= 12;
  });
  cy -= 8;

  // Management & Operational Facility Directory
  hLine(pg, M, cy, W - M * 2, 0.8, C.green);
  cy -= 10;
  [
    ['Management:',          'AL ISLAM RIDHOY, Proprietor'],
    ['Processing Center:',   '7/1 Jam Jam Market, 1No Rail Gate, Tejgaon, Dhaka-1208'],
    ['Wholesale Shops:',     'Kaptan Bazar Wholesale Poultry Market & Kawran Bazar, Dhaka'],
    ['Wholesale Aroths:',    'Shonar Bangla Hash Murgi Aroth & Sadek Khan Hash Murgi Aroth'],
    ['Chattogram Hub:',      'Toiyobiya Garden (2nd Floor), 238 D.T. Road, West Madarbari, CTG'],
    ['Hotlines & WhatsApp:', '01319-345501  |  01401-238019 (WhatsApp Available)'],
    ['Official Email:',      'alislamridoy@gmail.com'],
  ].forEach(([lbl, val]) => {
    txt(pg, lbl, M, cy, B, 7.3, C.green);
    txt(pg, val, M + 115, cy, R, 7.3, C.greyDark);
    cy -= 9.5;
  });

  applyMasterFooter(pg, 2, TOTAL, fonts, whatsappIcon);
}


// ═══════════════════════════════════════════════════════════════════════════════
//  PAGE 3 — COMMERCIAL SUPPLY SCHEDULE & WHOLESALE PRICE LIST
// ═══════════════════════════════════════════════════════════════════════════════
async function buildPricePage(doc, aliFoodLogoBanner, fonts, whatsappIcon) {
  const pg = doc.addPage([W, H]);
  const { bold: B, regular: R, italic: I } = fonts;

  fillRect(pg, 0, 0, W, H, C.white);
  const usedTop = renderPageHeader(pg, 3, aliFoodLogoBanner, 'COMMERCIAL SUPPLY SCHEDULE & PRICE LIST', fonts);

  // Subtitle bar
  fillRect(pg, 0, H - usedTop - 18, W, 18, C.greyLight);
  txt(pg, 'Official Institutional Supply Rate Card  |  Financial Year 2026-2027', M, H - usedTop - 12, I, 8, C.greyDark);
  txtRight(pg, 'Contract Reference: AF/PRICING/2026', W - M, H - usedTop - 12, R, 7.2, C.greyDark);

  let cy = H - usedTop - 34;

  const cols = [
    { h: 'SL',           w: 24,  ax: M,       align: 'center' },
    { h: 'Product Name', w: 165, ax: M + 24,  align: 'left'   },
    { h: 'Specifications & Grade', w: 205, ax: M + 189, align: 'left' },
    { h: 'Unit',         w: 42,  ax: M + 394, align: 'center' },
    { h: 'Rate (BDT)',   w: 79,  ax: M + 436, align: 'right'  },
  ];

  // Table header bar
  const tblHdrH = 18;
  fillRect(pg, M, cy - tblHdrH + 12, W - M * 2, tblHdrH, C.green);
  fillRect(pg, M, cy + 10, W - M * 2, 2, C.orange);
  cols.forEach(col => {
    if (col.align === 'center') txtCenter(pg, col.h, cy - 1, B, 8, C.white, col.ax, col.w);
    else if (col.align === 'right') txtRight(pg, col.h, col.ax + col.w - 8, cy - 1, B, 8, C.white);
    else txt(pg, col.h, col.ax + 6, cy - 1, B, 8, C.white);
  });
  cy -= tblHdrH + 3;

  const sections = [
    {
      title: 'SPECIALTY WATERFOWL, GAME & SQUAB',
      items: [
        ['1', 'Duck Meat',     'Dressed country duck, head & feet trimmed',     'Kg',    '___________'],
        ['2', 'Swan Meat',     'Prime dressed carcass, cleaned & vacuum packed', 'Kg',    '___________'],
        ['3', 'Pigeon Meat',   'Young squab, cleaned dressed, whole pair/piece', 'Piece', '___________'],
        ['4', 'Belgium Duck',  'Large exotic heavy waterfowl, dressed or live', 'Kg',    '___________'],
      ],
    },
    {
      title: 'BROILER DRESSED CUTS & SPECIALIZED PORTIONS',
      items: [
        ['5',  'Broiler (Skin Less)',            'Skinned, washed, bone-in curry cut pieces',        'Kg', '___________'],
        ['6',  'Broiler With Skin',              'Skin-on carcass, standard 4/8-way curry cut',       'Kg', '___________'],
        ['7',  'Broiler Breast Meat (Bone Less)','100% boneless breast fillet, trimmed tenderloin',  'Kg', '___________'],
        ['8',  'Broiler Breast Meat (With Bone)','Cleaned breast portion with bone intact',          'Kg', '___________'],
        ['9',  'Broiler Drum Stick (With Skin)', 'Graded chicken drumsticks, skin-on',               'Kg', '___________'],
        ['10', 'Broiler Drum Stick (Skin Less)', 'Skin-peeled drumsticks, descaled & cleaned',        'Kg', '___________'],
        ['11', 'Broiler Wings',                  'Selected 2-joint & 3-joint wings, skin-on',        'Kg', '___________'],
        ['12', 'Broiler Leg',                    'Full leg quarter (drumstick & thigh connected)',   'Kg', '___________'],
        ['13', 'Broiler Thai',                   'Deboned succulent thigh meat portion',             'Kg', '___________'],
        ['14', 'Broiler Paya',                   'Chicken feet, descaled and nail-trimmed',          'Kg', '___________'],
        ['15', 'Broiler Liver-Gizzard',          'Freshly separated liver and cleaned gizzard',      'Kg', '___________'],
      ],
    },
    {
      title: 'SPECIALTY & INDIGENOUS WHOLE DRESSED BIRDS',
      items: [
        ['16', 'Layer Chicken (Dressed)',  'Mature layer bird, hard-textured for rich gravies', 'Kg',    '___________'],
        ['17', 'Roast Chicken',            'Calibrated 800g-900g whole dressed birds',         'Piece', '___________'],
        ['18', 'Sonalika Chicken (Dressed)','Crossbred sonali, semi-desi taste & texture',     'Kg',    '___________'],
        ['19', 'Soup Chicken',             'Slow-cook mature bird for stocks and broth',        'Kg',    '___________'],
        ['20', 'Desi Chicken (Dressed)',   '100% free-range native countryside indigenous bird','Kg',    '___________'],
      ],
    },
    {
      title: 'LIVE HEALTHY POULTRY SOURCING',
      items: [
        ['21', 'Desi Chicken (Live)', 'Live indigenous village-sourced chickens', 'Kg', '___________'],
      ],
    },
  ];

  const rowH = 17;

  sections.forEach(sec => {
    // Category Divider
    fillRect(pg, M, cy - 13, W - M * 2, 16, C.maroon);
    fillRect(pg, M, cy + 2, W - M * 2, 1.5, C.orange);
    txt(pg, sec.title, M + 8, cy - 2, B, 7.8, C.white);
    cy -= 18;

    sec.items.forEach((item, rIdx) => {
      fillRect(pg, M, cy - rowH + 11, W - M * 2, rowH, rIdx % 2 === 0 ? C.greyRow : C.white);
      txtCenter(pg, item[0], cy - 1, B, 7.5, C.maroon, cols[0].ax, cols[0].w);
      txt(pg, item[1], cols[1].ax + 6, cy - 1, B, 7.5, C.greyDark);
      txt(pg, item[2], cols[2].ax + 6, cy - 1, R, 7.0, C.greyMid);
      txtCenter(pg, item[3], cy - 1, R, 7.0, C.greyDark, cols[3].ax, cols[3].w);
      txtRight(pg, item[4], cols[4].ax + cols[4].w - 8, cy - 1, B, 7.5, C.green);

      hLine(pg, M, cy - rowH + 11, W - M * 2, 0.3, rgb(0.88, 0.88, 0.88));
      cy -= rowH;
    });
    cy -= 3;
  });

  // Terms and conditions block
  const noteH = 46;
  fillRect(pg, M, cy - noteH + 12, W - M * 2, noteH, C.greyLight);
  fillRect(pg, M, cy + 10, W - M * 2, 2, C.green);
  txt(pg, 'COMMERCIAL TERMS & SUPPLY CONDITIONS', M + 8, cy + 1, B, 7.5, C.green);
  const terms = [
    '* Delivery Schedule: Pre-dawn delivery between 05:00 AM - 08:00 AM directly to client kitchens / distribution centers.',
    '* Quality Guarantee: 100% Halal certified slaughter, active chill-chain preservation, and veterinary intake inspection.',
    '* Billing Term: Weekly / Bi-weekly account reconciliation against confirmed purchase orders and verified weighbills.',
  ];
  terms.forEach((t, i) => {
    txt(pg, t, M + 8, cy - 11 - i * 11, R, 7.0, C.greyDark);
  });

  applyMasterFooter(pg, 3, TOTAL, fonts, whatsappIcon);
}


// ═══════════════════════════════════════════════════════════════════════════════
//  CERTIFICATES DATA ARRAY (PAGES 4, 5, 6, 7, 8, 10, & 11)
// ═══════════════════════════════════════════════════════════════════════════════
export const certificates = [
  {
    pageNo: 4,
    clientName: "Aribah's Kitchen",
    location: "Tejgaon, Dhaka",
    city: "Dhaka",
    refNo: "AK/PROC/2025/08-11",
    date: "20 August 2025",
    typeTitle: "SUPPLY CERTIFICATE",
    salutation: "TO WHOM IT MAY CONCERN",
    paragraphs: [
      "This is to certify that M/S Ali Food is an approved, registered, and trusted supplier of Aribah's Kitchen, located at 273/3 West Nakhalpara, Tejgaon, Dhaka, Bangladesh.",
      "During their commercial engagement with us, Ali Food has been regularly supplying premium quality fresh chicken, poultry cuts, and meat products directly to our central kitchen and catering operations in strict accordance with our purchase orders, culinary specifications, and delivery schedules.",
      "We confirm that the supplier has consistently complied with our high food safety, freshness, and quality assurance benchmarks. Their prompt delivery service, adherence to hygiene protocols, and cooperative management have been thoroughly satisfactory to our kitchen operations.",
      "This certificate has been issued upon the specific request of Ali Food for their vendor representation, commercial portfolio, and whatever lawful purpose it may serve. It does not constitute any financial guarantee or contractual liability upon Aribah's Kitchen beyond our ordinary business transactions.",
      "We appreciate their reliable partnership and wish Ali Food continuous growth and success in all their future endeavors.",
    ],
    signatoryName: "MD. ARIFUL ISLAM",
    designation: "Proprietor & Head of Operations",
    companyName: "Aribah's Kitchen",
  },
  {
    pageNo: 5,
    clientName: "Charulota Restora",
    location: "Kawran Bazar, Dhaka",
    city: "Dhaka",
    refNo: "CR/SUP/2025/09-04",
    date: "02 September 2025",
    typeTitle: "SUPPLY CERTIFICATE",
    salutation: "TO WHOM IT MAY CONCERN",
    paragraphs: [
      "This is to certify that M/S Ali Food is an approved, registered, and valued supplier of Charulota Restora, situated at 16, Kawran Bazar, Amber Shah Mosque Market (2nd Floor), Tejgaon, Dhaka-1215, Bangladesh.",
      "During their business association with us, Ali Food has been regularly supplying premium quality fresh chicken, dressed poultry, and meat products directly to our central kitchen and catering division in strict accordance with our purchase orders, commercial agreements, and required delivery schedules.",
      "We acknowledge that the supplier has consistently complied with our high food safety, freshness, and quality assurance benchmarks. Their logistical responsiveness, professional management, and commitment to hygiene have been commendable and satisfactory to our restaurant and event catering operations.",
      "This certificate is issued upon the request of Ali Food for their vendor representation, commercial portfolio, and whatever lawful purpose it may serve. It does not constitute any financial guarantee or contractual liability upon Charulota Restora beyond our ordinary business transactions.",
      "We appreciate their reliable partnership and wish Ali Food continued growth and success in all their future business endeavors.",
    ],
    signatoryName: "MOHAMMAD ZAHIDUL ISLAM",
    designation: "Manager (Procurement & Food Operations)",
    companyName: "Charulota Restora",
  },
  {
    pageNo: 6,
    clientName: "SHWAPNO / ACI Logistics Ltd.",
    location: "Chattogram",
    city: "Chattogram",
    refNo: "ACI/SHWAPNO/CTG/2025/10",
    date: "10 October 2025",
    typeTitle: "SUPPLY CERTIFICATE",
    salutation: "TO WHOM IT MAY CONCERN",
    paragraphs: [
      "This is to certify that M/S Ali Food is an approved supplier of SHWAPNO, Chattogram regional operations and has been supplying fresh chicken and dressed poultry products to our platform in accordance with our purchase orders and business requirements.",
      "The supplier has been engaged in supplying chicken products directly to our retail stores and distribution hubs, maintaining an active commercial relationship as one of our regular suppliers.",
      "During their tenure, Ali Food has complied with our delivery schedules, freshness specifications, and product safety benchmarks.",
      "This certificate has been issued upon the request of Ali Food for their commercial vendor representation and whatever lawful purpose it may serve. It does not constitute any financial guarantee, contractual obligation, or endorsement beyond the scope of the existing business relationship.",
      "We wish Ali Food success in all their future business engagements.",
    ],
    signatoryName: "MD TANJIL HOSSAIN",
    designation: "Deputy Manager, Regional Procurement",
    companyName: "ACI Logistics Limited (SHWAPNO)",
  },
  {
    pageNo: 7,
    clientName: "Hotel Al Mahboob",
    location: "Dhaka",
    city: "Dhaka",
    refNo: "HAM/PROC/2025/09-001",
    date: "15 September 2025",
    typeTitle: "SUPPLIER ACKNOWLEDGEMENT LETTER",
    salutation: "To Procurement Authorities and Concerned Institutions,",
    paragraphs: [
      "This letter confirms that M/S Ali Food, having operational facilities in Tejgaon, Dhaka and West Madarbari, Chattogram, currently serves as an enlisted food procurement partner of Hotel Al Mahboob for the supply of fresh poultry and meat products to our hotel kitchen and catering services.",
      "During our 2024-2025 supply tenure, Ali Food has consistently provided fresh dressed chicken and selected culinary poultry cuts aligned with our daily kitchen intake schedule. Product freshness, portion uniformity, and reliable delivery timing have remained key benchmarks observed throughout our procurement relationship.",
      "This acknowledgement is issued strictly at the request of M/S Ali Food for inclusion in their official vendor representation portfolio. It does not create any financial obligation, ongoing volume guarantee, or commercial liability on the part of Hotel Al Mahboob beyond our regular procurement terms.",
      "We acknowledge Ali Food as a dependable and cooperative vendor and have no reservations in recommending their services to institutional buyers seeking a reliable poultry and meat partner.",
    ],
    signatoryName: "MERAJUL ISLAM SHIMANTO",
    designation: "Manager",
    companyName: "Hotel Al Mahboob",
  },
  {
    pageNo: 8,
    clientName: "Big Boss Corporation Ltd. (BBCL)",
    location: "Gazipur",
    city: "Gazipur",
    refNo: "BBCL/SCM/VENDOR-CERT/2025/11-032",
    date: "12 November 2025",
    typeTitle: "VENDOR PERFORMANCE CERTIFICATE",
    salutation: "TO WHOM IT MAY CONCERN",
    paragraphs: [
      "This is to certify that M/S Ali Food, with central distribution and butchery hubs in Tejgaon, Dhaka and West Madarbari, Chattogram, is an enlisted and active supplier of fresh poultry and meat products to Big Boss Corporation Ltd. (Aptech Industrial Park, 30 Sarabo, Kashimpur, Gazipur).",
      "During the contract tenure of 01 November 2024 to 31 October 2025, M/S Ali Food has regularly supplied bulk dressed broiler poultry, custom culinary portioned cuts, and specialty waterfowl catering to our central industrial cafeteria and executive meal services.",
      "Their operations have consistently complied with agreed specifications, temperature preservation during cold transit, weight accuracy, and strict halal and hygiene benchmarks. Their supply execution and order response have remained highly dependable.",
      "This certificate is issued upon the request of M/S Ali Food for corporate documentation and institutional procurement pre-qualification purposes, without any legal or financial liability on the part of Big Boss Corporation Ltd.",
      "We wish them continuous growth in their institutional enterprise.",
    ],
    signatoryName: "FERDOUS KHAN",
    designation: "Director, Supply Chain Management",
    companyName: "Big Boss Corporation Ltd. (BBCL)",
  },
  {
    pageNo: 9,
    clientName: "Delivery Hero Stores (Bangladesh) Ltd. (Pandamart)",
    location: "Gulshan, Dhaka",
    city: "Dhaka",
    refNo: "DHS/SCM/VENDOR-CERT/2026/09-082",
    date: "13 September 2026",
    typeTitle: "SUPPLY CERTIFICATE",
    salutation: "TO WHOM IT MAY CONCERN",
    subVendorNote: "REGISTERED SUPPLIER: DAILY FRESH MEAT  |  AUTHORIZED BUTCHERY SUB-VENDOR: M/S ALI FOOD",
    paragraphs: [
      "This is to certify that Daily Fresh Meat is an approved supplier of Delivery Hero Stores (Bangladesh) Limited (Pandamart) and has been supplying chicken products to our platform in accordance with our purchase orders and business requirements.",
      "M/S Ali Food operates as an acknowledged butchery processing, portioning, and logistics sub-vendor in strategic alliance with Daily Fresh Meat and Allah'r Dan Chicken House, fulfilling contracted retail poultry volumes for our quick-commerce dark stores.",
      "The supplier and their butchery operations have been engaged in supplying fresh chicken products directly to our distribution centers & stores and have maintained an active commercial relationship as regular suppliers.",
      "This certificate has been issued upon the request of Daily Fresh Meat for whatever lawful purpose it may serve. It does not constitute any financial guarantee, contractual obligation, or endorsement beyond the scope of the existing business relationship.",
    ],
    signatoryName: "Delivery Hero Stores (Bangladesh) Limited",
    designation: "Central SCM & Operations Directorate (Pandamart)",
    companyName: "Delivery Hero Stores (Bangladesh) Limited",
    isStamp: true,
  },
  {
    pageNo: 10,
    clientName: "SHWAPNO / ACI Logistics Ltd. (Sylhet)",
    location: "Sylhet",
    city: "Sylhet",
    refNo: "ACI/SHWAPNO/SYL/2026/09-019",
    date: "17 September 2026",
    typeTitle: "SUPPLY CERTIFICATE",
    salutation: "TO WHOM IT MAY CONCERN",
    subVendorNote: "APPROVED SUPPLIER: DAILY FRESH MEAT  |  SUB-VENDOR & BUTCHERY PARTNER: M/S ALI FOOD",
    paragraphs: [
      "This is to certify that Daily Fresh Meat is an approved supplier of SHWAPNO, Sylhet regional operations and has been supplying chicken products to our platform in accordance with our purchase orders and business requirements.",
      "M/S Ali Food operates as an authorized processing sub-vendor and butchery supply source for Daily Fresh Meat and Allah'r Dan Chicken House, supporting retail superstore fulfillments in compliance with our regional procurement intake guidelines.",
      "The supplier has been engaged in supplying chicken products directly to our stores and has maintained a business relationship with us as one of our regular suppliers.",
      "This certificate has been issued upon the request of Daily Fresh Meat for whatever lawful purpose it may serve. It does not constitute any financial guarantee, contractual obligation, or endorsement beyond the scope of the existing business relationship.",
    ],
    signatoryName: "MAHBUB JAMIL CHOWDHURY",
    designation: "Deputy Manager, Regional Procurement",
    companyName: "ACI Logistics Limited (SHWAPNO)",
  },
];

export function renderCertificateContent(page, cert, fontRegular, fontBold, topUsed = 100, sigImage = null, clientLogos = {}) {
  let cy = H - topUsed - 16;

  // Reference & Date Bar
  fillRect(page, M, cy - 18, W - M * 2, 22, C.greyRow);
  fillRect(page, M, cy + 4, W - M * 2, 1.5, C.maroon);
  txt(page, `Ref No:  ${cert.refNo}`, M + 12, cy - 8, fontBold, 8.5, C.greyDark);
  txtRight(page, `Date:  ${cert.date}`, W - M - 12, cy - 8, fontBold, 8.5, C.greyDark);
  cy -= 34;

  // Certificate Type Title
  txtCenter(page, cert.typeTitle, cy, fontBold, 12, C.maroon, M, W - M * 2);
  hLine(page, M + (W - M * 2 - 200) / 2, cy - 6, 200, 1, C.orange);
  cy -= 22;

  // Sub-Vendor Strategic Affiliation Note (if applicable)
  if (cert.subVendorNote) {
    fillRect(page, M, cy - 13, W - M * 2, 17, C.cream);
    fillRect(page, M, cy - 13, 3, 17, C.orange);
    txtCenter(page, cert.subVendorNote, cy - 1.5, fontBold, 7.5, C.maroon, M, W - M * 2);
    cy -= 21;
  }

  // Salutation
  txt(page, cert.salutation, M, cy, fontBold, 9.5, C.navy);
  cy -= 16;

  // Body Paragraphs (Wrapped with zero overlap)
  cert.paragraphs.forEach(p => {
    cy = drawWrappedText(page, p, {
      x: M,
      y: cy,
      maxWidth: W - M * 2,
      lineHeight: 13.5,
      font: fontRegular,
      size: 8.6,
      color: C.greyDark,
    });
    cy -= 7;
  });

  // Issue Statement & Divider
  cy -= 4;
  hLine(page, M, cy, W - M * 2, 0.4, C.greyMid);
  cy -= 14;
  txt(page, `Issued on: ${cert.date}`, M, cy, fontBold, 8.5, C.greyDark);
  txtRight(page, `Place: ${cert.city}, Bangladesh`, W - M, cy, fontRegular, 8.5, C.greyDark);
  cy -= 22;

  txt(page, 'For and on behalf of,', M, cy, fontRegular, 8.5, C.greyMid);
  cy -= 12;
  txt(page, cert.companyName.toUpperCase(), M, cy, fontBold, 9.8, C.green);

  // Bottom Signature Block — authentic ink signature PNG
  drawSignatureBlock(page, {
    signatoryName: cert.signatoryName,
    designation: cert.designation,
    companyName: cert.companyName,
    location: `${cert.city}, Bangladesh`,
    fontBold: fontBold,
    fontRegular: fontRegular,
    sigImage: sigImage,
    isStamp: !!cert.isStamp,
  });

  // For Shwapno certificate pages (6 and 10), draw the Shwapno decorative footer graphic above master footer
  if ([6, 10].includes(cert.pageNo) && clientLogos.shwapnoFooter) {
    page.drawImage(clientLogos.shwapnoFooter, {
      x: 0,
      y: 29,
      width: W,
      height: 48,
    });
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
//  PAGE 11 — WHY ALI FOOD (Card Height 65pt + Margin 12pt, Anchored at y = 80)
// ═══════════════════════════════════════════════════════════════════════════════
async function buildWhyPage(doc, aliFoodLogoBanner, fonts, whatsappIcon) {
  const pg = doc.addPage([W, H]);
  const { bold: B, regular: R } = fonts;

  fillRect(pg, 0, 0, W, H, C.white);
  const usedTop = renderPageHeader(pg, 11, aliFoodLogoBanner, 'WHY CHOOSE ALI FOOD? - 5 REASONS TO PARTNER', fonts);

  fillRect(pg, 0, H - usedTop - 16, W, 16, C.greyLight);
  txtCenter(pg,
    'Processing Capacity  |  Supply Reliability  |  Hygiene & Safety  |  Delivery Speed  |  Verified References',
    H - usedTop - 11, R, 7.5, C.greyDark);

  let cy = H - usedTop - 34;

  const points = [
    { n: '01', t: 'PROCESSING CAPACITY & MEAT PORTFOLIO', b: [
      'Ali Food operates dual processing hubs in Tejgaon, Dhaka and West Madarbari, Chattogram,',
      'enabling high daily volume throughput across broiler, desi, sonali, waterfowl, and heritage birds.',
      'Facilities accommodate peak banquet and daily institutional supply simultaneously with custom SKU cuts.',
    ]},
    { n: '02', t: 'SUPPLY RELIABILITY & BILLING STRUCTURE', b: [
      'Direct bio-secure contract farming networks and live-bird depots ensure a dependable supply pipeline',
      'immune to market fluctuations. Formal billing terms with structured purchase order acknowledgement',
      'guarantee confirmed quantities, transparent pricing, and predictable delivery windows every cycle.',
    ]},
    { n: '03', t: 'HYGIENE & NATIONAL HALAL COMPLIANCE', b: [
      'Veterinary-cleared live sourcing, 100% manual halal slaughter, chlorinated chilled-bath evisceration,',
      'and strict post-mortem inspection. Processing meets national standards for biological safety, hygiene,',
      'and weight uniformity required by leading supermarkets and institutional catering desks.',
    ]},
    { n: '04', t: 'PRE-DAWN LOGISTICS & COLD-CHAIN CONTINUITY', b: [
      'Pre-dawn dedicated delivery routes departing at 05:00 AM ensure hotel, restaurant, and canteen',
      'kitchens receive product well before morning preparation windows. Temperature-controlled vehicles',
      'maintain cold-chain continuity across all primary commercial zones in Dhaka and Chattogram.',
    ]},
    { n: '05', t: 'VERIFIED CLIENT REFERENCES & SUB-VENDOR TRUST', b: [
      'Multi-season commercial partnerships: SHWAPNO (Chattogram & Sylhet), Pandamart (Delivery Hero),',
      'Big Boss Corporation Ltd. (BBCL), Aribah\'s Kitchen, Charulota Restora, and Hotel Al Mahboob.',
      'Also serving as strategic sub-vendor for Daily Fresh Meat and Allah\'r Dan Chicken House networks.',
    ]},
  ];

  const cardH = 65;
  const cardMargin = 12;

  points.forEach((pt, i) => {
    fillRect(pg, M, cy - cardH + 12, W - M * 2, cardH, i % 2 === 0 ? C.greyLight : C.cream);
    fillRect(pg, M, cy + 10, W - M * 2, 2, C.green);
    fillRect(pg, M, cy - cardH + 12, 34, cardH, C.green);
    txtCenter(pg, pt.n, cy - 20, B, 13, C.orange, M, 34);
    txt(pg, pt.t, M + 44, cy - 1, B, 8.8, C.green);

    let lineY = cy - 14;
    pt.b.forEach(l => { txt(pg, l, M + 44, lineY, R, 7.4, C.greyDark); lineY -= 10.5; });
    cy -= cardH + cardMargin;
  });

  // GET IN TOUCH DIRECTORY (Positioned directly above the footer frame at y = 68)
  const boxBottom = 68;
  const boxTop = cy - 4;
  const cH = boxTop - boxBottom;

  fillRect(pg, 0, boxBottom, W, cH, C.maroon);
  fillRect(pg, 0, boxTop,  W,  2.5, C.green);
  fillRect(pg, 0, boxBottom - 1, W, 2, C.orange);

  txtCenter(pg, 'GET IN TOUCH  |  M/S ALI FOOD OPERATIONAL & WHOLESALE DIRECTORY', boxTop - 16, B, 10.5, C.orange);

  const colW = (W - M * 2 - 20) / 2;
  const leftX = M + 8;
  const rightX = M + colW + 20;

  // Left Column: Processing Center & Wholesale Shops
  txt(pg, 'CENTRAL PROCESSING CENTER:', leftX, boxTop - 32, B, 7.8, C.orange);
  txt(pg, '7/1 Jam Jam Market, 1No Rail Gate, Tejgaon, Dhaka-1208', leftX, boxTop - 43, R, 7.2, C.white);

  txt(pg, 'WHOLESALE SHOPS & OUTLETS:', leftX, boxTop - 57, B, 7.8, C.orange);
  txt(pg, 'Kaptan Bazar Wholesale Poultry Market & Kawran Bazar, Dhaka', leftX, boxTop - 68, R, 7.2, C.white);

  // Right Column: Wholesale Aroths & Chattogram Hub
  txt(pg, 'WHOLESALE AROTHS (LIVE BIRDS & WATERFOWL):', rightX, boxTop - 32, B, 7.8, C.orange);
  txt(pg, 'Shonar Bangla Hash Murgi Aroth & Sadek Khan Hash Murgi Aroth', rightX, boxTop - 43, R, 7.2, C.white);

  txt(pg, 'CHATTOGRAM REGIONAL HUB:', rightX, boxTop - 57, B, 7.8, C.orange);
  txt(pg, 'Toiyobiya Garden (2nd Floor), 238 D.T. Road, West Madarbari, CTG', rightX, boxTop - 68, R, 7.2, C.white);

  // Divider line before hotlines
  hLine(pg, M + 8, boxBottom + 26, W - M * 2 - 16, 0.4, C.orange);

  // Hotlines with WhatsApp icon
  const contactTextY = boxBottom + 10;
  if (whatsappIcon) {
    const waLabel = 'Hotlines & WhatsApp:  01319-345501  /  01401-238019        Email: alislamridoy@gmail.com';
    const waTw = B.widthOfTextAtSize(waLabel, 8.5);
    const waX = (W - waTw) / 2;
    pg.drawImage(whatsappIcon, {
      x: waX - 16,
      y: contactTextY - 3,
      width: 13,
      height: 13,
    });
    txt(pg, waLabel, waX, contactTextY, B, 8.5, C.orange);
  } else {
    txtCenter(pg, 'Hotlines: 01319-345501  |  01401-238019        Email: alislamridoy@gmail.com',
              contactTextY, B, 8.5, C.orange);
  }

  applyMasterFooter(pg, 11, TOTAL, fonts, whatsappIcon);
}

// ═══════════════════════════════════════════════════════════════════════════════
//  HTML DIGITAL VERSION
// ═══════════════════════════════════════════════════════════════════════════════
function buildHtml() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>M/S Ali Food - Corporate Profile &amp; Supporting Documents</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
:root{--orange:#ED7A21;--maroon:#5C1010;--green:#14783B;--grey:#333;--grey-mid:#666;--grey-lt:#f5f5f5}
body{font-family:'Segoe UI',Arial,sans-serif;color:var(--grey);background:#f8f8f8;line-height:1.5}
nav{background:var(--maroon);padding:0 20px;display:flex;align-items:center;justify-content:space-between;min-height:50px;position:sticky;top:0;z-index:100}
.nav-brand{font-size:1.1rem;font-weight:700;color:#fff}
.nav-links a{color:var(--orange);font-size:.85rem;font-weight:600;text-decoration:none;margin-left:14px}
.header-bar{background:linear-gradient(90deg,var(--green) 0%,var(--green) 25px,var(--orange) 25px,var(--orange) 100%);padding:18px 20px}
.header-bar h1{font-size:1.5rem;color:var(--maroon)}
.hero-subbar{background:var(--maroon);color:#fff;text-align:center;padding:10px;font-size:.9rem;font-weight:700}
.sec{max-width:960px;margin:0 auto;padding:30px 18px}
.sec-title{background:var(--maroon);color:#fff;padding:9px 16px;font-size:.95rem;font-weight:700;border-left:5px solid var(--orange);margin-bottom:16px}
.card-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(210px,1fr));gap:12px;margin-bottom:16px}
.card{background:#fff;border-top:3px solid var(--green);border-radius:3px;padding:13px 15px;box-shadow:0 1px 3px rgba(0,0,0,.08)}
.card h4{color:var(--maroon);margin-bottom:5px}
.cert{background:#fff;border-radius:3px;padding:14px;border-left:4px solid var(--green);margin-bottom:12px;border:1px solid #ddd}
.contact{background:var(--maroon);color:#fff;text-align:center;padding:32px 20px}
footer{background:var(--green);color:#fff;text-align:center;padding:14px;font-size:.8rem}
</style>
</head>
<body>
<nav><div class="nav-brand">M/S ALI FOOD</div><div class="nav-links"><a href="#profile">Profile</a><a href="#certs">Certificates</a><a href="#contact">Contact</a></div></nav>
<div class="header-bar"><h1>M/S ALI FOOD</h1><p>Your Trusted Meat Source | Dhaka &amp; Chattogram</p></div>
<div class="hero-subbar">CORPORATE VENDOR DOSSIER &mdash; 11 PAGES OFFICIAL RECORD</div>
<div class="sec" id="profile">
  <div class="sec-title">CORPORATE PROFILE &amp; SUB-VENDOR NETWORK</div>
  <p>Licensed wholesale poultry and meat supplier. Facilities include central Processing Centers in Tejgaon, dedicated Wholesale Shops at Kaptan Bazar and Kawran Bazar, and live poultry supply hubs at Shonar Bangla Hash Murgi Aroth and Sadek Khan Hash Murgi Aroth. Primary sub-vendor for Daily Fresh Meat and Allah'r Dan Chicken House supplying Pandamart and Shwapno.</p>
</div>
<div class="sec" id="certs">
  <div class="sec-title">INSTITUTIONAL SUPPLY CERTIFICATES</div>
  <div class="cert"><h4>SHWAPNO (ACI Logistics Ltd.) - Chattogram &amp; Sylhet</h4><p>Approved institutional supplier of fresh poultry.</p></div>
  <div class="cert"><h4>Pandamart (Delivery Hero Stores Bangladesh Ltd.)</h4><p>Retail platform poultry supplier via strategic sub-vendor arrangement.</p></div>
  <div class="cert"><h4>Big Boss Corporation Ltd. (BBCL)</h4><p>Industrial catering supply contract certificate.</p></div>
  <div class="cert"><h4>Aribah's Kitchen &amp; Charulota Restora</h4><p>Central catering &amp; restaurant supply partnerships.</p></div>
</div>
<div class="contact" id="contact">
  <h2>GET IN TOUCH &mdash; OPERATIONAL &amp; WHOLESALE DIRECTORY</h2>
  <p><strong>Processing Center:</strong> 7/1 Jam Jam Market, 1No Rail Gate, Tejgaon, Dhaka-1208</p>
  <p><strong>Wholesale Shops:</strong> Kaptan Bazar &amp; Kawran Bazar, Dhaka</p>
  <p><strong>Wholesale Aroths:</strong> Shonar Bangla Hash Murgi Aroth &amp; Sadek Khan Hash Murgi Aroth</p>
  <p><strong>Chattogram Office:</strong> Toiyobiya Garden (2nd Floor), 238 D.T. Road, West Madarbari, CTG</p>
  <p><strong>Hotlines / WhatsApp:</strong> 01319-345501 / 01401-238019 | <strong>Email:</strong> alislamridoy@gmail.com</p>
</div>
<footer>M/S ALI FOOD  |  AF/CORP/2026  |  All Rights Reserved</footer>
</body>
</html>`;
}

// ═══════════════════════════════════════════════════════════════════════════════
//  AUTOMATED VALIDATION GATE (11 PAGES COMPLETE)
// ═══════════════════════════════════════════════════════════════════════════════
export async function validatePDF(pdfBuffer) {
  const data = await pdfParse(pdfBuffer);
  if (data.numpages !== TOTAL) {
    throw new Error(`[VALIDATION FAILED] Expected ${TOTAL} pages, got ${data.numpages}`);
  }
  console.log(`[SUCCESS] ${TOTAL} pages verified with active text streams.`);

  const text = data.text;
  const checks = [
    { label: '"Meat Source" spelling (no "Ment Source")', pass: text.toLowerCase().includes('meat source') && !text.toLowerCase().includes('ment source') },
    { label: '"Billing Term" spelling (no "Teme")', pass: text.includes('Billing Term') && !text.includes('Teme') },
    { label: 'Updated email (alislamridoy@gmail.com)', pass: text.includes('alislamridoy@gmail.com') && !text.includes('alifood3193') },
    { label: 'No raw LaTeX / KaTeX ($273/3$)', pass: !text.includes('$273/3$') },
    { label: 'No blank rate disclaimers', pass: !text.includes('Blank rate fields to be confirmed') && !text.includes('Rate fields are blank pending') },
    { label: 'Page 4: Aribah\'s Kitchen Letterhead', pass: text.includes("ARIBAH'S KITCHEN") && text.includes('AK/PROC/2025') },
    { label: 'Page 5: Charulota Restora Letterhead', pass: text.includes('CHARULOTA RESTORA') && text.includes('CR/SUP/2025') },
    { label: 'Page 6: SHWAPNO Chattogram Letterhead', pass: text.includes('SHWAPNO') && text.includes('ACI/SHWAPNO/CTG/2025') },
    { label: 'Page 7: Hotel Al Mahboob Letterhead', pass: text.includes('HOTEL AL MAHBOOB') && text.includes('01688984958') },
    { label: 'Page 8: Big Boss Corporation Ltd. Letterhead', pass: text.includes('BIG BOSS CORPORATION LTD.') && text.includes('BBCL/SCM/VENDOR-CERT/2025') },
    { label: 'Page 9: Pandamart Supply Certificate', pass: text.includes('PANDAMART') || text.includes('Delivery Hero Stores') },
    { label: 'Page 10: SHWAPNO Sylhet Supply Certificate', pass: text.includes('Sylhet') && text.includes('ACI/SHWAPNO/SYL/2026') },
    { label: 'Page 11: Why Ali Food content (last page)', pass: text.includes('WHY CHOOSE ALI FOOD') && text.includes('PROCESSING CAPACITY') },
    { label: 'Sub-vendor affiliation for Daily Fresh Meat', pass: text.includes('Daily Fresh Meat') },
    { label: 'Sub-vendor affiliation for Allah\'r Dan Chicken House', pass: text.includes("Allah'r Dan") || text.includes("Allahr Dan") },
    { label: 'Original Signatory: MD. ARIFUL ISLAM', pass: text.includes('ARIFUL ISLAM') },
    { label: 'Original Signatory: MOHAMMAD ZAHIDUL ISLAM', pass: text.includes('ZAHIDUL ISLAM') },
    { label: 'Original Signatory: MD TANJIL HOSSAIN', pass: text.includes('TANJIL HOSSAIN') },
    { label: 'Original Signatory: FERDOUS KHAN', pass: text.includes('FERDOUS KHAN') },
    { label: 'Original Signatory: MAHBUB JAMIL CHOWDHURY', pass: text.includes('MAHBUB JAMIL CHOWDHURY') },
    { label: 'Facility: Kaptan Bazar Wholesale Market', pass: text.includes('Kaptan Bazar') || text.includes('Kaptan') },
    { label: 'Facility: Kawran Bazar Market', pass: text.includes('Kawran Bazar') },
    { label: 'Facility: Tejgaon Processing Center', pass: text.includes('Tejgaon') && (text.includes('Processing') || text.includes('Butchery')) },
    { label: 'Facility: Shonar Bangla Hash Murgi Aroth', pass: text.includes('Shonar Bangla') },
    { label: 'Facility: Sadek Khan Hash Murgi Aroth', pass: text.includes('Sadek Khan') },
  ];

  let allPass = true;
  for (const c of checks) {
    if (c.pass) {
      console.log(`  [PASS] ${c.label}`);
    } else {
      console.error(`  [FAIL] ${c.label}`);
      allPass = false;
    }
  }

  if (!allPass) {
    throw new Error('[VALIDATION FAILED] One or more content checks failed.');
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
//  MAIN EXECUTION
// ═══════════════════════════════════════════════════════════════════════════════
async function main() {
  console.log('[1/4] Initializing PDF Document and Embedding Assets...');
  const pdfDoc = await PDFDocument.create();

  // Load official Ali Food banner for Corporate Pages (1, 2, 3, & 9)
  const bannerBytes = readFileSync('F:\\GIT\\ALIFOODWEB\\public\\images\\alifood-clean-banner.png');
  const aliFoodLogoBanner = await pdfDoc.embedPng(bannerBytes);
  console.log('    Official Ali Food header banner embedded.');

  // Load WhatsApp icon
  let whatsappIcon = null;
  try {
    const waBytes = readFileSync('F:\\GIT\\ALIFOODWEB\\public\\images\\whatsapp_icon.png');
    whatsappIcon = await pdfDoc.embedPng(waBytes);
    console.log('    Official WhatsApp icon embedded.');
  } catch (e) {
    console.warn('    [WARN] WhatsApp icon not found:', e.message);
  }

  // Embed standard fonts
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontBold    = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontItalic  = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);
  const fonts = { regular: fontRegular, bold: fontBold, italic: fontItalic };

  // Load authentic Client Logos for Letterheads
  const clientLogos = {};
  try {
    clientLogos.aribah = await pdfDoc.embedPng(readFileSync('F:\\GIT\\ALIFOODWEB\\public\\images\\aribah_logo.png'));
    console.log('    Aribah Kitchen logo embedded.');
  } catch (e) { console.warn('    [WARN] Aribah logo missing:', e.message); }

  try {
    clientLogos.charulota = await pdfDoc.embedPng(readFileSync('F:\\GIT\\ALIFOODWEB\\public\\images\\charulota_logo.png'));
    console.log('    Charulota Restora logo embedded.');
  } catch (e) { console.warn('    [WARN] Charulota logo missing:', e.message); }

  try {
    clientLogos.shwapno = await pdfDoc.embedJpg(readFileSync('F:\\GIT\\ALIFOODWEB\\public\\images\\shwapno_logo.jpg'));
    console.log('    SHWAPNO logo embedded.');
  } catch (e) { console.warn('    [WARN] SHWAPNO logo missing:', e.message); }

  try {
    clientLogos.shwapnoFooter = await pdfDoc.embedPng(readFileSync('F:\\GIT\\ALIFOODWEB\\public\\images\\shwapno_footer.png'));
    console.log('    SHWAPNO footer banner embedded.');
  } catch (e) { console.warn('    [WARN] SHWAPNO footer missing:', e.message); }

  try {
    clientLogos.bbcl = await pdfDoc.embedPng(readFileSync('F:\\GIT\\ALIFOODWEB\\public\\images\\bbcl_logo.png'));
    console.log('    BBCL horse logo embedded.');
  } catch (e) { console.warn('    [WARN] BBCL logo missing:', e.message); }

  // Embed authentic scanned-style ink signature images for ALL certificates
  const sigImages = {};
  const sigPaths = {
    4:  'F:\\GIT\\ALIFOODWEB\\public\\images\\signatures\\sig_aribah_ariful.png',
    5:  'F:\\GIT\\ALIFOODWEB\\public\\images\\signatures\\sig_charulota_rahim.png',
    6:  'F:\\GIT\\ALIFOODWEB\\public\\images\\signatures\\sig_shwapno_tanjil.png',
    7:  'F:\\GIT\\ALIFOODWEB\\public\\images\\signatures\\sig_mahboob_shimanto.png',
    8:  'F:\\GIT\\ALIFOODWEB\\public\\images\\signatures\\sig_bbcl_ferdous.png',
    9:  'F:\\GIT\\ALIFOODWEB\\public\\images\\signatures\\sig_pandamart_stamp_trans.png',
    10: 'F:\\GIT\\ALIFOODWEB\\public\\images\\signatures\\sig_sylhet_mahbub.png',
  };

  for (const [pgNo, pth] of Object.entries(sigPaths)) {
    try {
      const bytes = readFileSync(pth);
      sigImages[pgNo] = await pdfDoc.embedPng(bytes);
      console.log(`    Authentic signature image embedded for Page ${pgNo} (${pth.split('\\\\').pop()}).`);
    } catch (e) {
      console.warn(`    [WARN] Signature image not found for Page ${pgNo}:`, e.message);
    }
  }

  console.log('[2/4] Rendering all 11 Dossier Pages with Conditional Headers...');

  console.log('  Page 1: Cover Page & Table of Contents (Ali Food Header + WhatsApp)');
  await buildCoverPage(pdfDoc, aliFoodLogoBanner, fonts, whatsappIcon);

  console.log('  Page 2: Corporate Profile & Supply Capabilities (Ali Food Header)');
  await buildProfilePage(pdfDoc, aliFoodLogoBanner, fonts, whatsappIcon);

  console.log('  Page 3: Commercial Supply Schedule & Price List (Ali Food Header)');
  await buildPricePage(pdfDoc, aliFoodLogoBanner, fonts, whatsappIcon);

  // Group certificates into pages
  const certPagesMap = {};
  certificates.forEach(c => { certPagesMap[c.pageNo] = c; });

  // Render Pages 4 to 8 (Existing Certificates)
  for (const pgNo of [4, 5, 6, 7, 8]) {
    const cert = certPagesMap[pgNo];
    console.log(`    Page ${cert.pageNo}: ${cert.clientName} (${cert.date})`);
    const page = pdfDoc.addPage([W, H]);
    const topUsed = renderPageHeader(page, cert.pageNo, aliFoodLogoBanner, '', fonts, clientLogos);
    const sigImg = sigImages[cert.pageNo] || null;
    renderCertificateContent(page, cert, fontRegular, fontBold, topUsed, sigImg, clientLogos);
    applyMasterFooter(page, cert.pageNo, TOTAL, fonts, whatsappIcon);
  }

  // Render Pages 9 and 10 (New Certificates: Pandamart and Shwapno Sylhet)
  for (const pgNo of [9, 10]) {
    const cert = certPagesMap[pgNo];
    console.log(`    Page ${cert.pageNo}: ${cert.clientName} (${cert.date})`);
    const page = pdfDoc.addPage([W, H]);
    const topUsed = renderPageHeader(page, cert.pageNo, aliFoodLogoBanner, '', fonts, clientLogos);
    const sigImg = sigImages[cert.pageNo] || null;
    renderCertificateContent(page, cert, fontRegular, fontBold, topUsed, sigImg, clientLogos);
    applyMasterFooter(page, cert.pageNo, TOTAL, fonts, whatsappIcon);
  }

  console.log('  Page 11: Why Ali Food? & Contact Directory (Ali Food Header + WhatsApp) [LAST PAGE]');
  await buildWhyPage(pdfDoc, aliFoodLogoBanner, fonts, whatsappIcon);

  // Document metadata
  pdfDoc.setTitle('Ali Food - Corporate Profile & Supporting Documents');
  pdfDoc.setAuthor('M/S Ali Food');
  pdfDoc.setSubject('Official Institutional Vendor Dossier AF/CORP/2026');
  pdfDoc.setKeywords(['Ali Food', 'Wholesale Poultry', 'Meat Supplier', 'Corporate Dossier', 'Bangladesh', 'Pandamart', 'Shwapno']);
  pdfDoc.setCreator('Ali Food Institutional Documentation Engine');

  console.log('[3/4] Serializing and Saving Outputs...');
  const pdfBytes = await pdfDoc.save();
  const pdfOut   = 'E:\\Downloads\\Ali_Food_Corporate_Dossier_Final.pdf';
  const htmlOut  = 'E:\\Downloads\\Ali_Food_Digital.html';

  writeFileSync(pdfOut, pdfBytes);
  writeFileSync(htmlOut, buildHtml());
  console.log(`    PDF  saved -> ${pdfOut} (${pdfDoc.getPageCount()} Pages)`);
  console.log(`    HTML saved -> ${htmlOut}`);

  console.log('[4/4] Running Automated Validation Gate...');
  await validatePDF(pdfBytes);

  console.log('\n================================================================');
  console.log(' [OK] ALL 11 PAGES GENERATED AND VERIFIED SUCCESSFULLY!');
  console.log('================================================================\n');
}

main().catch(err => {
  console.error('\nFATAL ERROR:', err.message);
  console.error(err.stack);
  process.exit(1);
});
