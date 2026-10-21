import React from 'react';
import { useApp } from '../context/AppContext';
import { getEmbedVideoUrl } from '../utils/helpers';
import { X, ExternalLink } from 'lucide-react';

export const VideoModal: React.FC = () => {
  const { activeVideoUrl, closeVideoModal, lang } = useApp();

  if (!activeVideoUrl) return null;

  const embedUrl = getEmbedVideoUrl(activeVideoUrl);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-4xl bg-gray-950 rounded-2xl overflow-hidden shadow-2xl border border-gray-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-4 py-3 bg-gray-900 border-b border-gray-800 text-white">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
            <span className="text-sm font-bold">
              {lang === 'ar' ? 'توثيق ميداني لأعمال منظمة مصر أولاً' : 'Misr Awalan Field Footage'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={activeVideoUrl}
              target="_blank"
              rel="noreferrer"
              className="p-1.5 text-gray-400 hover:text-white transition-colors"
              title="فتح الرابط الأصلي"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
            <button
              onClick={closeVideoModal}
              className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
              aria-label="إغلاق"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Video Embed */}
        <div className="relative aspect-video w-full bg-black">
          {embedUrl ? (
            <iframe
              src={embedUrl}
              title="Field Video Documentation"
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400 text-sm">
              {lang === 'ar' ? 'تعذر تشغيل هذا الرابط مباشرة، يمكنك فتحه بالخارج.' : 'Could not embed this link directly.'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
