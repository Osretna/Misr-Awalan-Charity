export function getEmbedVideoUrl(url: string | undefined): string | null {
  if (!url) return null;
  
  // YouTube
  const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
  if (ytMatch && ytMatch[1]) {
    return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1&rel=0`;
  }

  // Vimeo
  const vimeoMatch = url.match(/(?:vimeo\.com\/)(\d+)/);
  if (vimeoMatch && vimeoMatch[1]) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`;
  }

  // Direct video link or Google drive embed
  if (url.includes('drive.google.com/file/d/')) {
    return url.replace('/view', '/preview');
  }

  return url;
}

export function formatNumber(num: number, lang: 'ar' | 'en' = 'ar'): string {
  return new Intl.NumberFormat(lang === 'ar' ? 'ar-EG' : 'en-US').format(num);
}

export function formatCurrency(amount: number, currency: string = 'EGP', lang: 'ar' | 'en' = 'ar'): string {
  const formatted = formatNumber(amount, lang);
  if (lang === 'ar') {
    return currency === 'EGP' ? `${formatted} ج.م` : `${formatted} $`;
  }
  return currency === 'EGP' ? `${formatted} EGP` : `$${formatted}`;
}

export function generateRefNumber(): string {
  const prefix = 'MAW-';
  const randomPart = Math.random().toString(36).substring(2, 8).toUpperCase();
  const datePart = Date.now().toString().slice(-4);
  return `${prefix}${randomPart}-${datePart}`;
}
