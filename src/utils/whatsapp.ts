import { Order, Product, CustomCutInquiry } from '../types';
import { COMPANY_INFO } from '../data/companyInfo';

export function formatBDT(amount: number): string {
  return new Intl.NumberFormat('en-BD', {
    style: 'currency',
    currency: 'BDT',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount).replace('BDT', '৳');
}

export function generateOrderNumber(): string {
  const year = 2026;
  const randomSuffix = Math.floor(100000 + Math.random() * 900000);
  return `AF-${year}-${randomSuffix}`;
}

export function createOrderWhatsAppMessage(order: Order): string {
  const itemsText = order.items
    .map(
      (item, idx) =>
        `${idx + 1}. *${item.productName}*\n   - Quantity: ${item.quantity} ${item.unit}\n   - Rate: ${
          item.priceVisible ? formatBDT(item.unitPrice) : 'Quotation Basis'
        }${item.customNotes ? `\n   - Cut Note: ${item.customNotes}` : ''}`
    )
    .join('\n');

  const text = `*NEW B2B SUPPLY ORDER REQUEST*
*Order Reference:* ${order.orderNumber}
*Date:* ${new Date(order.createdAt).toLocaleDateString()}

*CLIENT INFORMATION:*
- *Company:* ${order.companyName || 'N/A'}
- *Contact Person:* ${order.customerName}
- *Client Category:* ${order.customerType}
- *Phone:* ${order.phone}
- *Delivery Hub:* ${order.deliveryCity} Regional Division
- *Delivery Address:* ${order.deliveryAddress}, ${order.deliveryArea}
- *Preferred Delivery:* ${order.preferredDate} (${order.preferredTimeSlot})

*REQUESTED PRODUCTS:*
${itemsText}

*ESTIMATED SUBTOTAL:* ${
    order.hasQuoteItems
      ? `${formatBDT(order.estimatedTotal)} + Quotation Items`
      : formatBDT(order.estimatedTotal)
  }
${order.specialInstructions ? `\n*SPECIAL PROCESSING INSTRUCTIONS:*\n${order.specialInstructions}` : ''}

_Sent via M/S ALI FOOD Digital B2B Procurement Portal_`;

  return `https://wa.me/8801319345501?text=${encodeURIComponent(text)}`;
}

export function createProductInquiryWhatsApp(product: Product): string {
  const text = `*B2B PRODUCT AVAILABILITY & QUOTE INQUIRY*
Product: *${product.name}* (Sl. ${product.sl})
Category: ${product.categoryName}
Supply Form: ${product.supplyForm}
Specification: ${product.processingSpecification}
Official Rate: ${product.priceVisible ? `${product.currency} ${product.rate} / ${product.unit}` : 'Quotation Basis'}

Hello Ali Food Procurement Team, I would like to inquire about commercial volume availability and delivery schedule for this item.`;

  return `https://wa.me/8801319345501?text=${encodeURIComponent(text)}`;
}

export function createCustomCutWhatsApp(inquiry: CustomCutInquiry): string {
  const text = `*CUSTOM CULINARY PORTIONING INQUIRY*
Company: *${inquiry.company}*
Contact: ${inquiry.name} (${inquiry.phone})
Bird/Species: ${inquiry.birdType}
Cut Required: ${inquiry.cutSpecification}
Skin / Bone: ${inquiry.skinPreference} | ${inquiry.bonePreference}
Estimated Volume: ${inquiry.estimatedVolumeKg} Kg (${inquiry.frequency})
Delivery Hub: ${inquiry.deliveryCity}
Packaging: ${inquiry.packagingPreference}

Notes: ${inquiry.notes || 'None'}`;

  return `https://wa.me/8801319345501?text=${encodeURIComponent(text)}`;
}

export function createGeneralWhatsAppLink(): string {
  const text = `Hello M/S Ali Food Procurement Team, I would like to inquire about wholesale poultry & meat supply for our business.`;
  return `https://wa.me/8801319345501?text=${encodeURIComponent(text)}`;
}
