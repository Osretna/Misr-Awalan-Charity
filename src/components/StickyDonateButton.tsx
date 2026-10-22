import React from 'react';
import { useApp } from '../context/AppContext';
import { t } from '../utils/translations';
import { Heart, MessageCircle, Sparkles } from 'lucide-react';
import { cleanPhoneForWhatsApp } from '../utils/helpers';

export const StickyDonateButton: React.FC = () => {
  const { setQuickDonateModalOpen, settings, lang } = useApp();
  const strings = t[lang];

  return (
    <>
      {/* WhatsApp Quick Floating Button (Left on RTL, Right on LTR) */}
      <a
        href={`https://wa.me/${cleanPhoneForWhatsApp(settings.whatsappNumber)}?text=${encodeURIComponent(
          lang === 'ar' ? 'السلام عليكم، أود الاستفسار عن التبرع وكفالات منظمة مصر أولاً' : 'Hello, I would like to inquire about donating to Misr Awalan'
        )}`}
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-6 start-6 z-40 flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] text-white shadow-xl hover:bg-[#20ba5a] hover:scale-110 active:scale-95 transition-all duration-300 group"

        aria-label="تواصل عبر واتساب"
        title={strings.whatsapp}
      >
        <MessageCircle className="w-7 h-7" />
        <span className="sr-only">{strings.whatsapp}</span>
        {/* Tooltip on hover */}
        <span className="absolute start-16 px-3 py-1.5 bg-gray-900 text-white text-xs font-bold rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity whitespace-nowrap shadow-lg">
          {strings.whatsapp}
        </span>
      </a>

      {/* Floating Sticky Donate Button (Right on RTL, Left on LTR) */}
      <div className="fixed bottom-6 end-6 z-40">
        <button
          onClick={() => setQuickDonateModalOpen(true)}
          className="flex items-center gap-2.5 px-5 py-3.5 rounded-full bg-gradient-to-r from-[#0A5C4B] via-[#117863] to-[#0A5C4B] text-white font-black text-sm sm:text-base shadow-2xl hover:shadow-[#0A5C4B]/50 hover:scale-105 active:scale-95 transition-all duration-300 border-2 border-[#C9A227] animate-pulse"
          aria-label={strings.quickDonate}
        >
          <div className="p-1 rounded-full bg-[#C9A227] text-gray-900">
            <Heart className="w-4 h-4 fill-current" />
          </div>
          <span className="font-cairo tracking-wide drop-shadow-xs">{strings.quickDonate}</span>
        </button>
      </div>
    </>
  );
};
