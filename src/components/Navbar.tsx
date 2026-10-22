import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { t } from '../utils/translations';
import { Logo } from './Logo';
import { 
  Heart, 
  Phone, 
  Globe, 
  Menu, 
  X, 
  ShieldCheck, 
  User as UserIcon,
  Sparkles,
  MapPin
} from 'lucide-react';
import { cleanPhoneForTel } from '../utils/helpers';


interface NavbarProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, setCurrentPage }) => {
  const { 
    lang, 
    toggleLang, 
    settings, 
    isAdmin, 
    setQuickDonateModalOpen 
  } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const strings = t[lang];

  const navLinks = [
    { id: 'home', label: strings.home },
    { id: 'about', label: strings.about },
    { id: 'projects', label: strings.projects },
    { id: 'impact', label: strings.impact },
    { id: 'news', label: strings.news },
    { id: 'volunteer', label: strings.volunteer },
    { id: 'contact', label: strings.contact },
  ];

  const handleNavClick = (pageId: string) => {
    setCurrentPage(pageId);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 w-full shadow-xs">
      {/* Top Utility & Trust Bar with Exact Official License and Phones */}
      <div className="bg-[#073229] text-white text-xs py-2 px-4 border-b border-[#117863]/40">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          {/* License & Address badge */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <span className="flex items-center gap-1 bg-[#0A5C4B] text-[#E0BA3E] px-2.5 py-0.5 rounded-full font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{settings.licenseNumber}</span>
            </span>
            <span className="hidden md:inline-flex items-center gap-1 text-white/80 text-[11px]">
              <MapPin className="w-3 h-3 text-[#E0BA3E]" />
              <span>{settings.address}</span>
            </span>
          </div>

          {/* Contact Phones & Language Switcher */}
          <div className="flex items-center gap-2 sm:gap-3 ms-auto">
            {/* Phone 1 */}
            <a
              href={`tel:${cleanPhoneForTel(settings.phone1)}`}
              className="flex items-center gap-1 text-white/90 hover:text-[#E0BA3E] transition-colors"
              title="اتصال مباشر"
            >
              <Phone className="w-3.5 h-3.5 text-[#E0BA3E]" />
              <span className="font-bold tracking-wide">{settings.phone1}</span>
            </a>

            <span className="text-white/40 hidden sm:inline">-</span>

            {/* Phone 2 */}
            <a
              href={`tel:${cleanPhoneForTel(settings.phone2)}`}
              className="hidden sm:flex items-center gap-1 text-white/90 hover:text-[#E0BA3E] transition-colors"
              title="اتصال مباشر"
            >
              <span className="font-bold tracking-wide">{settings.phone2}</span>
            </a>

            <span className="text-white/40">|</span>

            {/* Admin Portal link */}
            <button
              onClick={() => handleNavClick('admin')}
              className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded transition-colors ${
                currentPage === 'admin'
                  ? 'bg-[#C9A227] text-[#1E293B] font-bold'
                  : 'text-white/80 hover:text-white'
              }`}
            >
              <UserIcon className="w-3.5 h-3.5" />
              <span>{isAdmin ? (lang === 'ar' ? 'لوحة التحكم' : 'Admin Panel') : strings.admin}</span>
            </button>

            <span className="text-white/40">|</span>

            {/* Language Toggle */}
            <button
              onClick={toggleLang}
              className="flex items-center gap-1 font-semibold text-white/90 hover:text-[#E0BA3E] transition-colors bg-white/10 px-2 py-0.5 rounded"
            >
              <Globe className="w-3.5 h-3.5 text-[#E0BA3E]" />
              <span>{lang === 'ar' ? 'English' : 'عربي'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <nav className="glass-nav bg-white/95 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo - Single Image as requested with zero extra text */}
            <button
              onClick={() => handleNavClick('home')}
              className="focus:outline-hidden text-start py-1"
            >
              <Logo size="lg" showText={false} />
            </button>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex items-center gap-1 xl:gap-2">
              {navLinks.map((link) => {
                const isActive = currentPage === link.id;
                return (
                  <button
                    key={link.id}
                    onClick={() => handleNavClick(link.id)}
                    className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                      isActive
                        ? 'text-[#0A5C4B] bg-[#0A5C4B]/10 border-b-2 border-[#0A5C4B]'
                        : 'text-gray-700 hover:text-[#0A5C4B] hover:bg-gray-100/70'
                    }`}
                  >
                    {link.label}
                  </button>
                );
              })}
            </div>

            {/* Action Buttons */}
            <div className="hidden sm:flex items-center gap-3">
              <button
                onClick={() => setQuickDonateModalOpen(true)}
                className="flex items-center gap-2 bg-[#C9A227] hover:bg-[#b8911f] text-gray-900 font-bold px-4 py-2.5 rounded-xl shadow-xs transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]"
              >
                <Sparkles className="w-4 h-4 text-emerald-950" />
                <span>{strings.quickDonate}</span>
              </button>

              <button
                onClick={() => handleNavClick('donate')}
                className="flex items-center gap-2 bg-[#0A5C4B] hover:bg-[#074336] text-white font-bold px-5 py-2.5 rounded-xl shadow-md transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]"
              >
                <Heart className="w-4 h-4 text-rose-300 fill-rose-300" />
                <span>{strings.donateNow}</span>
              </button>
            </div>

            {/* Mobile Hamburger Button */}
            <div className="flex lg:hidden items-center gap-2">
              <button
                onClick={() => handleNavClick('donate')}
                className="sm:hidden flex items-center gap-1.5 bg-[#0A5C4B] text-white font-bold text-xs px-3 py-2 rounded-lg"
              >
                <Heart className="w-3.5 h-3.5 fill-current" />
                <span>{strings.donateNow}</span>
              </button>
              
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-gray-700 hover:text-[#0A5C4B] hover:bg-gray-100"
                aria-label="Toggle Navigation Menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 bg-white px-4 pt-3 pb-6 space-y-2 animate-in fade-in duration-200 shadow-xl">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`w-full text-start px-4 py-3 rounded-lg text-base font-bold transition-colors ${
                  currentPage === link.id
                    ? 'bg-[#0A5C4B]/10 text-[#0A5C4B]'
                    : 'text-gray-800 hover:bg-gray-50'
                }`}
              >
                {link.label}
              </button>
            ))}

            <div className="pt-4 border-t border-gray-100 space-y-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setQuickDonateModalOpen(true);
                }}
                className="w-full flex items-center justify-center gap-2 bg-[#C9A227] text-gray-900 font-bold py-3 rounded-xl shadow-xs"
              >
                <Sparkles className="w-5 h-5 text-emerald-950" />
                <span>{strings.quickDonate}</span>
              </button>

              <button
                onClick={() => handleNavClick('donate')}
                className="w-full flex items-center justify-center gap-2 bg-[#0A5C4B] text-white font-bold py-3 rounded-xl shadow-md"
              >
                <Heart className="w-5 h-5 fill-rose-300 text-rose-300" />
                <span>{strings.donateNow}</span>
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};
