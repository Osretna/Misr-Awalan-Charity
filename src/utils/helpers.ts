export function getEmbedVideoUrl(url: string | undefined): string | null {
  if (!url) return null;
  const cleanUrl = url.trim();
  if (!cleanUrl) return null;
  
  // 1. YouTube: standard watch, short youtu.be, shorts (/shorts/ID), embed, live
  const ytMatch = cleanUrl.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/|live\/))([a-zA-Z0-9_-]{11})/
  );
  if (ytMatch && ytMatch[1]) {
    return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1&rel=0`;
  }

  // 2. Vimeo
  const vimeoMatch = cleanUrl.match(/(?:vimeo\.com\/)(\d+)/);
  if (vimeoMatch && vimeoMatch[1]) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`;
  }

  // 3. Google Drive preview embed
  if (cleanUrl.includes('drive.google.com/file/d/')) {
    return cleanUrl.replace('/view', '/preview');
  }

  // 4. Facebook video or reel plugin
  if (cleanUrl.includes('facebook.com') || cleanUrl.includes('fb.watch')) {
    return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(cleanUrl)}&show_text=0`;
  }

  return cleanUrl;
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

/**
 * Deeply sanitizes any object or array so it contains NO undefined values,
 * which cause Firebase Firestore setDoc/updateDoc to fail immediately.
 */
export function cleanFirestoreData<T>(obj: T): T {
  if (obj === undefined) {
    return null as unknown as T;
  }
  if (obj === null) {
    return null as unknown as T;
  }
  if (Array.isArray(obj)) {
    return obj.map((item) => cleanFirestoreData(item)) as unknown as T;
  }
  if (typeof obj === 'object') {
    const cleaned: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(obj)) {
      if (value !== undefined) {
        cleaned[key] = cleanFirestoreData(value);
      }
    }
    return cleaned as T;
  }
  return obj;
}
