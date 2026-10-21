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
  showText = true,
  lang = 'ar',
}) => {
  const { settings } = useApp();

  const sizeMap = {
    sm: 'w-10 h-10',
    md: 'w-14 h-14',
    lg: 'w-20 h-20',
    xl: 'w-28 h-28',
  };

  const currentLogo = settings?.logoUrl || '/assets/aistudio/309211266_404166348563693_8027332630712114535_n__1__bf2c442e.png';

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      {/* Official Circular Logo */}
      <div className={`relative shrink-0 ${sizeMap[size]}`}>
        <img
          src={currentLogo}
          alt={settings?.orgNameAr || 'منظمة مصر أولاً'}
          className="w-full h-full object-contain drop-shadow-md rounded-full transition-transform duration-300 hover:rotate-3 bg-white"
        />
      </div>

      {/* Accompanying Title and Slogan */}
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
