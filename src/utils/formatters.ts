// Unified formatting helpers for M/S Ali Food platform
// Enforces: Currency BDT (৳), Date DD MMM YYYY, integer arithmetic (no floating point issues)

/**
 * Formats a monetary amount in Bangladeshi Taka.
 * Can accept either taka (with decimals) or paisa (if isPaisa is true).
 */
export function formatBDT(amount: number, isPaisa: boolean = false): string {
  const taka = isPaisa ? amount / 100 : amount;
  const rounded = Math.round((taka + Number.EPSILON) * 100) / 100;
  
  // Format with thousand separators
  const parts = rounded.toFixed(rounded % 1 === 0 ? 0 : 2).split('.');
  const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  const formatted = parts.length > 1 ? `${integerPart}.${parts[1]}` : integerPart;

  return `৳ ${formatted}`;
}

/**
 * Converts taka to integer paisa to guarantee zero floating point errors in storage/calculations.
 */
export function toPaisa(taka: number): number {
  return Math.round(taka * 100);
}

/**
 * Converts integer paisa back to decimal taka.
 */
export function toTaka(paisa: number): number {
  return paisa / 100;
}

/**
 * Formats a date string or timestamp into DD MMM YYYY (e.g., 15 Oct 2026)
 */
export function formatDate(input?: string | Date | number | null): string {
  if (!input) return '—';
  try {
    const d = new Date(input);
    if (isNaN(d.getTime())) return String(input);

    const day = String(d.getDate()).padStart(2, '0');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[d.getMonth()];
    const year = d.getFullYear();

    return `${day} ${month} ${year}`;
  } catch {
    return String(input);
  }
}

/**
 * Formats date and time: DD MMM YYYY, hh:mm A
 */
export function formatDateTime(input?: string | Date | number | null): string {
  if (!input) return '—';
  try {
    const d = new Date(input);
    if (isNaN(d.getTime())) return String(input);
    const datePart = formatDate(d);
    let hours = d.getHours();
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    return `${datePart}, ${hours}:${minutes} ${ampm}`;
  } catch {
    return String(input);
  }
}

/**
 * Converts numeric BDT amount into English words for formal invoice presentation.
 */
export function numberToWordsBDT(amount: number): string {
  const rounded = Math.round(amount);
  if (rounded === 0) return 'Zero Taka Only';

  const units = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 
    'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  function convertHundreds(n: number): string {
    let str = '';
    if (n >= 100) {
      str += units[Math.floor(n / 100)] + ' Hundred ';
      n %= 100;
    }
    if (n >= 20) {
      str += tens[Math.floor(n / 10)] + ' ';
      n %= 10;
    }
    if (n > 0) {
      str += units[n] + ' ';
    }
    return str.trim();
  }

  let words = '';
  let remaining = rounded;

  // Crore (10,000,000)
  if (remaining >= 10000000) {
    const crore = Math.floor(remaining / 10000000);
    words += convertHundreds(crore) + ' Crore ';
    remaining %= 10000000;
  }

  // Lakh (100,000)
  if (remaining >= 100000) {
    const lakh = Math.floor(remaining / 100000);
    words += convertHundreds(lakh) + ' Lakh ';
    remaining %= 100000;
  }

  // Thousand (1,000)
  if (remaining >= 1000) {
    const thousand = Math.floor(remaining / 1000);
    words += convertHundreds(thousand) + ' Thousand ';
    remaining %= 1000;
  }

  if (remaining > 0) {
    words += convertHundreds(remaining) + ' ';
  }

  return `${words.trim()} Taka Only`;
}
