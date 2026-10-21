import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { getEmbedVideoUrl } from '../utils/helpers';
import { X, ExternalLink, Play, AlertCircle } from 'lucide-react';

export const VideoModal: React.FC = () => {
  const { activeVideoUrl, closeVideoModal, lang } = useApp();
  const [iframeError, setIframeError] = useState(false);

  if (!activeVideoUrl) return null;

  const embedUrl = getEmbedVideoUrl(activeVideoUrl);
  const isDirectVideoFile = Boolean(
    activeVideoUrl.match(/\.(mp4|webm|ogg|mov)(\?.*)?$/i)
  );

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={closeVideoModal}
    >
      <div 
        className="relative w-full max-w-4xl bg-gray-950 rounded-3xl overflow-hidden shadow-2xl border border-gray-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-gray-900 border-b border-gray-800 text-white">
          <div className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse"></span>
            <span className="text-sm font-bold font-cairo">
              {lang === 'ar' ? 'توثيق ميداني لأعمال منظمة مصر أولاً' : 'Misr Awalan Field Footage'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={activeVideoUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-red-600/20 hover:bg-red-600 text-red-300 hover:text-white text-xs font-bold transition-all"
              title="مشاهدة على يوتيوب مباشرة"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{lang === 'ar' ? 'مشاهدة على يوتيوب' : 'Open in YouTube'}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <button
              onClick={closeVideoModal}
              className="p-1.5 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
              aria-label="إغلاق"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Video Player Display */}
        <div className="relative aspect-video w-full bg-black flex items-center justify-center">
          {isDirectVideoFile ? (
            <video 
              src={activeVideoUrl} 
              controls 
              autoPlay 
              className="w-full h-full object-contain"
            />
          ) : embedUrl && !iframeError ? (
            <iframe
              src={embedUrl}
              title="Field Video Documentation"
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              onError={() => setIframeError(true)}
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-center p-8 text-gray-300 space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-red-950/80 border border-red-700/50 flex items-center justify-center text-red-400">
                <AlertCircle className="w-8 h-8" />
              </div>
              <p className="text-sm font-cairo text-gray-200 max-w-md">
                {lang === 'ar' 
                  ? 'يمكنك مشاهدة الفيديو مباشرة بجودة عالية على منصة يوتيوب الرسمية للمنظمة.' 
                  : 'You can watch the video directly in high quality on YouTube.'}
              </p>
              <a
                href={activeVideoUrl}
                target="_blank"
                rel="noreferrer"
                className="px-6 py-2.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-bold font-cairo text-xs shadow-lg shadow-red-600/30 flex items-center gap-2 transition-all"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>{lang === 'ar' ? 'اضغط هنا للتشغيل على يوتيوب الآن' : 'Watch on YouTube'}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}
        </div>

        {/* Footer info bar */}
        <div className="px-5 py-2.5 bg-gray-900/90 border-t border-gray-800/80 flex items-center justify-between text-[11px] text-gray-400 font-cairo">
          <span>{lang === 'ar' ? 'توثيق حقيقي من أرض الواقع' : 'Verified field documentary'}</span>
          <a
            href={activeVideoUrl}
            target="_blank"
            rel="noreferrer"
            className="hover:text-emerald-400 transition-colors flex items-center gap-1"
          >
            <span>{lang === 'ar' ? 'الرابط المباشر' : 'Direct Link'}</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
};
