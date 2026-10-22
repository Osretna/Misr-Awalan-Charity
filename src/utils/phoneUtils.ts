/**
 * Phone and WhatsApp utility functions
 * Specifically optimized for Egyptian mobile prefixes (010, 011, 012, 015)
 * and international formats.
 */

export function cleanPhoneNumber(raw: string): string {
  if (!raw) return '';
  // Remove spaces, dashes, parentheses, non-digit characters except leading '+'
  let cleaned = raw.trim().replace(/[\s\-\(\)\.]/g, '');
  return cleaned;
}

export function toInternationalWhatsAppNumber(raw: string): string {
  const cleaned = cleanPhoneNumber(raw).replace(/^\+/, '');
  if (!cleaned) return '';

  // If Egyptian local format starting with 010, 011, 012, 015
  if (/^01[0125][0-9]{8}$/.test(cleaned)) {
    return '2' + cleaned; // e.g. 01118150007 -> 201118150007
  }

  // If local format starting with a single 0, convert by stripping 0 and adding Egypt prefix 20
  if (cleaned.startsWith('0') && cleaned.length >= 10 && cleaned.length <= 11) {
    return '20' + cleaned.substring(1);
  }

  // If already prefixed with 20...
  if (cleaned.startsWith('20') && cleaned.length === 12) {
    return cleaned;
  }

  return cleaned;
}

export function buildWhatsAppUrl(number: string, message?: string): string {
  const intlNumber = toInternationalWhatsAppNumber(number);
  if (!intlNumber) return '#';
  const encodedMsg = message ? encodeURIComponent(message) : '';
  return `https://wa.me/${intlNumber}${encodedMsg ? `?text=${encodedMsg}` : ''}`;
}

export function buildTelUrl(number: string): string {
  const cleaned = cleanPhoneNumber(number);
  if (!cleaned) return '#';
  return `tel:${cleaned}`;
}

export function formatDisplayNumber(number: string): string {
  if (!number) return '';
  const cleaned = cleanPhoneNumber(number);
  // Egyptian standard 11-digit mobile display: 011 1815 0007 or 01118150007
  return cleaned;
}

export async function copyTextToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      const successful = document.execCommand('copy');
      textArea.remove();
      return successful;
    }
  } catch (err) {
    console.error('Failed to copy to clipboard', err);
    return false;
  }
}
