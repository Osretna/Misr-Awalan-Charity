import React from 'react';
import { useApp } from '../context/AppContext';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  lang?: 'ar' | 'en';
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  showText = false,
  lang = 'ar',
}) => {
  const { settings } = useApp();

  const sizeMap = {
    sm: 'h-10 max-w-[140px]',
    md: 'h-14 max-w-[220px]',
    lg: 'h-14 sm:h-16 max-w-[280px]',
    xl: 'h-20 sm:h-24 max-w-[360px]',
  };

  const currentLogo = settings?.logoUrl || '/assets/aistudio/309211266_404166348563693_8027332630712114535_n__1__bf2c442e.png';

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      {/* Official Logo Image (Adaptable to circular or rectangular banners) */}
      <div className={`relative shrink-0 flex items-center justify-center ${sizeMap[size]}`}>
        <img
          src={currentLogo}
          alt={settings?.orgNameAr || 'منظمة مصر أولاً'}
          className="h-full w-auto max-w-full object-contain drop-shadow-xs transition-transform duration-300 hover:scale-[1.02] rounded-lg"
        />
      </div>

      {/* Optional Accompanying Text (Hidden by default as requested) */}
      {showText && (
        <div className="flex flex-col text-start">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#0A5C4B]">
              {lang === 'ar' ? 'منظمة' : 'ORGANIZATION'}
            </span>
            <span className="h-1 w-1 rounded-full bg-[#C9A227]"></span>
            <span className="text-[10px] font-medium text-gray-500">
              {settings?.licenseNumber || 'ترخيص رقم 417 لسنة 2026م'}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black text-[#0A5C4B] tracking-tight leading-none mt-0.5 font-cairo">
            {lang === 'ar' ? (
              <>
                <span className="text-[#C8102E]">مِصْـر</span> أَوَّلًا
              </>
            ) : (
              settings?.orgNameEn || 'MISR AWALAN'
            )}
          </h1>
          <p className="text-[11px] text-gray-600 font-medium leading-tight mt-1">
            {lang === 'ar' 
              ? (settings?.sloganAr || 'تنميه - رعاية - حقوق | من أجل مستقبل أفضل')
              : (settings?.sloganEn || 'Development - Care - Rights')}
          </p>
        </div>
      )}
    </div>
  );
};
