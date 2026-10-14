// Safe notifications stub for M/S Ali Food platform
// Browser-side email logic removed for security compliance; dispatches to WhatsApp/mailto fallback.

import { COMPANY_INFO } from '../data/companyInfo';
import { createGeneralWhatsAppLink } from './whatsapp';

export interface NotificationResult {
  success: boolean;
  message: string;
  recipient: string;
}

/**
 * Safe notification logger stub. Zero browser-side email API keys.
 */
export async function sendOrderNotification(details: { reference: string; clientName: string; amount?: number }): Promise<NotificationResult> {
  console.info(`[NOTIFICATION LOGGED] Requisition ${details.reference} for ${details.clientName}`);
  return {
    success: true,
    message: `Logged notification for ${details.reference}`,
    recipient: COMPANY_INFO.email,
  };
}

/**
 * Opens email client via mailto
 */
export function openMailToInquiry(subject: string, body: string): void {
  const url = `mailto:${COMPANY_INFO.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  window.location.href = url;
}

/**
 * Opens WhatsApp direct chat
 */
export function openWhatsAppInquiry(): void {
  window.open(createGeneralWhatsAppLink(), '_blank', 'noopener,noreferrer');
}
