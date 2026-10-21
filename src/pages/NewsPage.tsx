import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { t } from '../utils/translations';
import { Calendar, Tag, ArrowRight, ArrowLeft } from 'lucide-react';

export const NewsPage: React.FC = () => {
  const { lang, news } = useApp();
  const strings = t[lang];
  const [selectedNewsId, setSelectedNewsId] = useState<string | null>(null);

  const activeNewsItem = news.find(n => n.id === selectedNewsId);
  const ArrowIcon = lang === 'ar' ? ArrowLeft : ArrowRight;

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-[#0A5C4B] bg-[#0A5C4B]/10 px-3.5 py-1 rounded-full">
          {lang === 'ar' ? 'المركز الإعلامي والميداني' : 'Media Center'}
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-[#0A5C4B] font-cairo">
          {strings.news}
        </h1>
        <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
          {lang === 'ar'
            ? 'تابع آخر أخبار قوافل الخير، فعاليات تسليم المشروعات، والتقارير الميدانية الموثقة من كافة المحافظات.'
            : 'Stay updated with our latest humanitarian missions, inaugurations, and community news.'}
        </p>
      </div>

      {/* News Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {news.map((item) => (
          <article
            key={item.id}
            className="bg-white rounded-3xl overflow-hidden border border-gray-200/80 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col group"
          >
            <div className="relative aspect-video w-full overflow-hidden bg-gray-100">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute top-3 start-3">
                <span className="bg-[#0A5C4B]/90 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1 rounded-full">
                  {item.category}
                </span>
              </div>
            </div>

            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center gap-2 text-xs text-gray-400 mb-2">
                  <Calendar className="w-3.5 h-3.5 text-[#C9A227]" />
                  <span>{new Date(item.date).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US')}</span>
                </div>
                <h3 className="font-bold text-lg text-gray-900 group-hover:text-[#0A5C4B] transition-colors leading-snug font-cairo">
                  {item.title}
                </h3>
                <p className="text-xs text-gray-600 mt-2 line-clamp-3 leading-relaxed">
                  {item.summary}
                </p>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setSelectedNewsId(item.id)}
                  className="w-full py-2.5 rounded-xl bg-gray-100 hover:bg-[#0A5C4B] hover:text-white text-gray-800 text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>{lang === 'ar' ? 'قراءة التقرير كاملاً' : 'Read Full Report'}</span>
                  <ArrowIcon className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* News Article Modal */}
      {activeNewsItem && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto"
          onClick={() => setSelectedNewsId(null)}
        >
          <div 
            className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200 my-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative aspect-video w-full bg-gray-900 overflow-hidden">
              <img
                src={activeNewsItem.imageUrl}
                alt={activeNewsItem.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-4 start-4 end-4 text-white">
                <span className="bg-[#0A5C4B] px-3 py-1 rounded-full text-xs font-bold inline-block mb-2">
                  {activeNewsItem.category}
                </span>
                <h2 className="text-xl sm:text-2xl font-bold font-cairo leading-snug">
                  {activeNewsItem.title}
                </h2>
              </div>
            </div>

            <div className="p-6 sm:p-8 space-y-4">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Calendar className="w-4 h-4 text-[#C9A227]" />
                <span>{new Date(activeNewsItem.date).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-US')}</span>
              </div>
              <p className="text-sm text-gray-800 leading-relaxed font-normal whitespace-pre-line">
                {activeNewsItem.content || activeNewsItem.summary}
              </p>
              <div className="pt-4 border-t border-gray-100 flex justify-end">
                <button
                  onClick={() => setSelectedNewsId(null)}
                  className="px-6 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold"
                >
                  {lang === 'ar' ? 'إغلاق' : 'Close'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
