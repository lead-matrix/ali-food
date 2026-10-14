// Professional PDF Document Generator for M/S Ali Food
// Handles: Invoices, Delivery Challans, Payment Receipts, and Client Statements

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Invoice, Delivery, Payment, Client, AppSettings } from '../lib/db/types';
import { formatDate, formatBDT, numberToWordsBDT } from './formatters';

export function generateInvoicePDF(invoice: Invoice, settings: AppSettings) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();

  // 1. Corporate Header
  doc.setFillColor(28, 8, 8); // #1C0808
  doc.rect(0, 0, pageWidth, 38, 'F');

  doc.setTextColor(245, 166, 35); // #F5A623
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.text(settings.companyName.toUpperCase(), 14, 16);

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text('Commercial Agro-Meat Processor & Institutional Wholesale Supplier', 14, 22);
  doc.text(`Dhaka Hub: ${settings.dhakaAddress}`, 14, 27);
  doc.text(`Hotlines: ${settings.primaryHotline} | ${settings.secondaryHotline} | Email: ${settings.officialEmail}`, 14, 32);

  // Top right Invoice Badge
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(245, 166, 35);
  doc.text('INVOICE', pageWidth - 14, 16, { align: 'right' });

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(255, 255, 255);
  doc.text(invoice.invoiceNumber, pageWidth - 14, 22, { align: 'right' });

  // 2. Client & Invoice Meta
  let y = 46;
  doc.setTextColor(20, 20, 20);

  // Left: Bill To
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(120, 120, 120);
  doc.text('BILLED TO (COMMERCIAL ACCOUNT):', 14, y);

  doc.setTextColor(20, 20, 20);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(invoice.clientCompany || invoice.clientName || 'Valued Client', 14, y + 6);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(60, 60, 60);
  if (invoice.clientName) doc.text(`Attention: ${invoice.clientName}`, 14, y + 11);
  if (invoice.clientPhone) doc.text(`Phone: ${invoice.clientPhone}`, 14, y + 16);
  if (invoice.clientAddress) doc.text(`Address: ${invoice.clientAddress}`, 14, y + 21);

  // Right: Meta Box
  const metaRight = pageWidth - 14;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(60, 60, 60);
  doc.text(`Issue Date: ${formatDate(invoice.issueDate)}`, metaRight, y + 6, { align: 'right' });
  doc.text(`Due Date: ${formatDate(invoice.dueDate)}`, metaRight, y + 11, { align: 'right' });
  if (invoice.periodFrom && invoice.periodTo) {
    doc.text(`Billing Period: ${formatDate(invoice.periodFrom)} - ${formatDate(invoice.periodTo)}`, metaRight, y + 16, { align: 'right' });
  }

  // Status Stamp
  const statusColor: Record<string, [number, number, number]> = {
    paid: [22, 163, 74],
    partial: [217, 119, 6],
    issued: [37, 99, 235],
    overdue: [220, 38, 38],
    void: [100, 116, 139],
    draft: [148, 163, 184],
  };
  const rgb = statusColor[invoice.status] || [37, 99, 235];
  doc.setDrawColor(rgb[0], rgb[1], rgb[2]);
  doc.setTextColor(rgb[0], rgb[1], rgb[2]);
  doc.setFont('helvetica', 'bold');
  doc.roundedRect(metaRight - 36, y + 20, 36, 7, 1.5, 1.5);
  doc.text(invoice.status.toUpperCase(), metaRight - 18, y + 25, { align: 'center' });

  // 3. Line Items Table
  const tableData = invoice.items.map((item, idx) => [
    idx + 1,
    item.productName,
    `${item.qty} ${item.unit}`,
    formatBDT(item.rate),
    formatBDT(item.amount),
  ]);

  autoTable(doc, {
    startY: y + 32,
    head: [['#', 'Item Specification / Cut Description', 'Qty', 'Unit Rate', 'Amount']],
    body: tableData,
    theme: 'grid',
    headStyles: {
      fillColor: [28, 8, 8],
      textColor: [245, 166, 35],
      fontStyle: 'bold',
      fontSize: 9,
    },
    styles: {
      fontSize: 9,
      cellPadding: 3,
    },
    columnStyles: {
      0: { cellWidth: 10, halign: 'center' },
      1: { cellWidth: 'auto' },
      2: { cellWidth: 25, halign: 'center' },
      3: { cellWidth: 32, halign: 'right' },
      4: { cellWidth: 35, halign: 'right', fontStyle: 'bold' },
    },
  });

  const finalY = (doc as any).lastAutoTable.finalY + 8;

  // 4. Summary & Totals
  const totalsLeft = pageWidth - 80;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(80, 80, 80);

  doc.text('Subtotal:', totalsLeft, finalY);
  doc.text(formatBDT(invoice.subtotal), pageWidth - 14, finalY, { align: 'right' });

  if (invoice.discount > 0) {
    doc.text('Discount:', totalsLeft, finalY + 5);
    doc.text(`- ${formatBDT(invoice.discount)}`, pageWidth - 14, finalY + 5, { align: 'right' });
  }

  if (invoice.deliveryCharge > 0) {
    doc.text('Delivery Charge:', totalsLeft, finalY + 10);
    doc.text(formatBDT(invoice.deliveryCharge), pageWidth - 14, finalY + 10, { align: 'right' });
  }

  // Net Total
  doc.setFillColor(248, 250, 252);
  doc.rect(totalsLeft - 4, finalY + 14, pageWidth - totalsLeft + 4, 10, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(20, 20, 20);
  doc.text('Total Amount:', totalsLeft, finalY + 21);
  doc.text(formatBDT(invoice.total), pageWidth - 14, finalY + 21, { align: 'right' });

  // Paid & Due
  doc.setFontSize(9);
  doc.text('Paid Amount:', totalsLeft, finalY + 29);
  doc.setTextColor(22, 163, 74);
  doc.text(formatBDT(invoice.paidAmount), pageWidth - 14, finalY + 29, { align: 'right' });

  doc.setTextColor(220, 38, 38);
  doc.text('Balance Due:', totalsLeft, finalY + 34);
  doc.text(formatBDT(invoice.dueAmount), pageWidth - 14, finalY + 34, { align: 'right' });

  // Amount in Words
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(80, 80, 80);
  doc.text('Amount in Words:', 14, finalY);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(20, 20, 20);
  doc.text(numberToWordsBDT(invoice.total), 14, finalY + 5);

  // Bank & Settlement Details
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(100, 100, 100);
  doc.text('PAYMENT INSTRUCTIONS & BANK ACCOUNTS:', 14, finalY + 16);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(60, 60, 60);
  const bankLines = doc.splitTextToSize(
    `${settings.bankDetails}\nbKash: ${settings.bkashNumber} | Nagad: ${settings.nagadNumber}`,
    totalsLeft - 22
  );
  doc.text(bankLines, 14, finalY + 21);

  // Footer notes
  const pageHeight = doc.internal.pageSize.getHeight();
  doc.setFontSize(7.5);
  doc.setTextColor(130, 130, 130);
  doc.text(settings.invoiceFooterText, 14, pageHeight - 12);
  doc.text('Generated electronically via M/S Ali Food Commercial Billing Platform • Authorized Signature', pageWidth - 14, pageHeight - 12, { align: 'right' });

  doc.save(`${invoice.invoiceNumber}.pdf`);
}

export function generateDeliveryChallanPDF(delivery: Delivery, settings: AppSettings) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = doc.internal.pageSize.getWidth();

  // Header
  doc.setFillColor(28, 8, 8);
  doc.rect(0, 0, pageWidth, 32, 'F');

  doc.setTextColor(245, 166, 35);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text(settings.companyName.toUpperCase(), 14, 14);

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.text('Pre-Dawn Express Route Delivery Challan (Logistics Copy)', 14, 20);
  doc.text(`Dhaka Hub: ${settings.dhakaAddress} | Hotline: ${settings.primaryHotline}`, 14, 26);

  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(245, 166, 35);
  doc.text('DELIVERY CHALLAN', pageWidth - 14, 14, { align: 'right' });

  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(255, 255, 255);
  doc.text(delivery.deliveryNumber, pageWidth - 14, 20, { align: 'right' });

  let y = 40;
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(120, 120, 120);
  doc.text('DELIVERY DESTINATION:', 14, y);

  doc.setTextColor(20, 20, 20);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text(delivery.clientCompany || delivery.clientName || 'Client', 14, y + 5);

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(60, 60, 60);
  if (delivery.clientName) doc.text(`Contact: ${delivery.clientName}`, 14, y + 10);
  if (delivery.vehicleDriver) doc.text(`Driver / Vehicle: ${delivery.vehicleDriver}`, 14, y + 15);

  doc.text(`Dispatch Date: ${formatDate(delivery.date)}`, pageWidth - 14, y + 5, { align: 'right' });
  doc.text(`Route Slot: 5:00 AM - 8:00 AM`, pageWidth - 14, y + 10, { align: 'right' });
  doc.text(`Status: ${delivery.status.toUpperCase()}`, pageWidth - 14, y + 15, { align: 'right' });

  // Table
  const tableData = delivery.items.map((item, idx) => [
    idx + 1,
    item.productName,
    `${item.qty} ${item.unit}`,
    '0°C–4°C Chilled',
    'Received [  ]',
  ]);

  autoTable(doc, {
    startY: y + 22,
    head: [['#', 'Poultry / Dressed Cut Item', 'Dispatched Qty', 'Temperature', 'Verification']],
    body: tableData,
    theme: 'grid',
    headStyles: {
      fillColor: [28, 8, 8],
      textColor: [245, 166, 35],
      fontSize: 9,
    },
    styles: {
      fontSize: 9,
      cellPadding: 3.5,
    },
  });

  const finalY = (doc as any).lastAutoTable.finalY + 25;

  // Signatures
  doc.setFontSize(8.5);
  doc.setTextColor(60, 60, 60);
  doc.line(14, finalY, 65, finalY);
  doc.text('Dispatched by (Logistics Officer)', 14, finalY + 5);

  doc.line(pageWidth - 75, finalY, pageWidth - 14, finalY);
  doc.text('Received by (Authorized Signature)', pageWidth - 75, finalY + 5);

  doc.save(`${delivery.deliveryNumber}_Challan.pdf`);
}

export function generatePaymentReceiptPDF(payment: Payment, settings: AppSettings) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a5',
  });

  const pageWidth = doc.internal.pageSize.getWidth();

  doc.setFillColor(28, 8, 8);
  doc.rect(0, 0, pageWidth, 26, 'F');

  doc.setTextColor(245, 166, 35);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text(settings.companyName.toUpperCase(), 10, 11);

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.text('OFFICIAL MONEY RECEIPT', 10, 16);
  doc.text(`Receipt No: ${payment.paymentNumber}`, 10, 21);

  doc.text(`Date: ${formatDate(payment.date)}`, pageWidth - 10, 16, { align: 'right' });

  let y = 36;
  doc.setTextColor(40, 40, 40);
  doc.setFontSize(9);
  doc.text(`Received with thanks from:`, 10, y);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text(payment.clientName || 'Valued Client', 10, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.text(`Amount Received:`, 10, y + 14);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(22, 163, 74);
  doc.text(formatBDT(payment.amount), 10, y + 20);

  doc.setTextColor(60, 60, 60);
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'italic');
  doc.text(`In words: ${numberToWordsBDT(payment.amount)}`, 10, y + 25);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.text(`Payment Method: ${payment.method.toUpperCase()}`, 10, y + 33);
  if (payment.reference) doc.text(`Reference / TrxID: ${payment.reference}`, 10, y + 38);
  if (payment.invoiceNumber) doc.text(`Applied to Invoice: ${payment.invoiceNumber}`, 10, y + 43);

  doc.line(pageWidth - 55, y + 55, pageWidth - 10, y + 55);
  doc.setFontSize(7.5);
  doc.text('Authorized Cashier / Accounts', pageWidth - 55, y + 60);

  doc.save(`${payment.paymentNumber}_Receipt.pdf`);
}
