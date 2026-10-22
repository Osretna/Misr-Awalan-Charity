import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { t } from '../utils/translations';
import { Logo } from './Logo';
import { 
  Heart, 
  Phone, 
  Mail, 
  MapPin, 
  Copy, 
  Check, 
  Building, 
  ExternalLink,
  ShieldCheck,
  Send,
  MessageCircle,
  Smartphone,
  CreditCard
} from 'lucide-react';
import { cleanPhoneForTel, cleanPhoneForWhatsApp } from '../utils/helpers';


interface FooterProps {
  setCurrentPage: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setCurrentPage }) => {
  const { lang, settings } = useApp();
  const strings = t[lang];
  const [copiedBankIndex, setCopiedBankIndex] = useState<number | null>(null);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubmitted, setNewsletterSubmitted] = useState(false);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedBankIndex(index);
    setTimeout(() => setCopiedBankIndex(null), 2500);
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setNewsletterSubmitted(true);
    setTimeout(() => {
      setNewsletterEmail('');
      setNewsletterSubmitted(false);
    }, 4000);
  };

  return (
    <footer className="bg-[#073229] text-white pt-16 pb-10 border-t-4 border-[#C9A227]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Top Grid: About, Quick Links, Official Accounts, Newsletter */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-emerald-900/60">
          
          {/* Column 1: Organization Identity & Mission */}
          <div className="space-y-4">
            <div className="bg-white/95 p-3 rounded-2xl inline-block shadow-md">
              <Logo size="md" lang={lang} />
            </div>
            <p className="text-sm text-emerald-100/80 leading-relaxed font-normal">
              {settings.aboutBrief || strings.aboutFooter}
            </p>
            <div className="space-y-1.5 pt-2 text-xs text-emerald-200/90">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#C9A227] shrink-0" />
                <span className="font-bold text-white">{settings.licenseNumber}</span>
              </div>
              <div className="flex items-center gap-2">
                <Building className="w-4 h-4 text-[#C9A227] shrink-0" />
                <span>{settings.taxNumber}</span>
              </div>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-base font-bold text-white mb-4 flex items-center gap-2 border-b border-emerald-800/80 pb-2">
              <span className="w-2 h-2 rounded-full bg-[#C9A227]"></span>
              <span>{strings.quickLinks}</span>
            </h4>
            <ul className="space-y-2 text-sm text-emerald-100/80">
              <li>
                <button
                  onClick={() => { setCurrentPage('about'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-[#C9A227] transition-colors"
                >
                  {strings.about}
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setCurrentPage('projects'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-[#C9A227] transition-colors"
                >
                  {strings.projects}
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setCurrentPage('impact'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-[#C9A227] transition-colors"
                >
                  {strings.impact}
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setCurrentPage('news'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-[#C9A227] transition-colors"
                >
                  {strings.news}
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setCurrentPage('volunteer'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-[#C9A227] transition-colors"
                >
                  {strings.volunteer}
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setCurrentPage('contact'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-[#C9A227] transition-colors"
                >
                  {strings.contact}
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setCurrentPage('donate'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="text-[#C9A227] font-bold hover:underline"
                >
                  {strings.donateNow}
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact & Direct Channels - Matches Exact Screenshot */}
          <div>
            <h4 className="text-base font-bold text-white mb-4 flex items-center gap-2 border-b border-emerald-800/80 pb-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#f3ba2f] inline-block shadow-[0_0_8px_#f3ba2f]"></span>
              <span>{lang === 'ar' ? 'التواصل المباشر' : 'Direct Channels'}</span>
            </h4>
            <div className="space-y-3 text-sm text-emerald-100/90">
              {/* Box 1: Official Phones */}
              <div className="p-3.5 rounded-2xl bg-[#062c21]/90 border border-[#11543f] space-y-2.5 shadow-sm">
                <div className="text-xs text-[#34d399] font-bold">{lang === 'ar' ? 'أرقام الهواتف الرسمية:' : 'Official Phones:'}</div>
                <div className="flex flex-col gap-2 font-bold text-white text-base">
                  {settings.phone1 && (
                    <a
                      href={`tel:${cleanPhoneForTel(settings.phone1)}`}
                      className="hover:text-[#f3ba2f] flex items-center justify-between group transition-colors"
                      title="اتصال مباشر"
                    >
                      <span className="font-mono tracking-wider text-sm sm:text-base direction-ltr">{settings.phone1}</span>
                      <Phone className="w-4 h-4 text-[#e6af2e] group-hover:scale-110 transition-transform" />
                    </a>
                  )}
                  {settings.phone2 && (
                    <a
                      href={`tel:${cleanPhoneForTel(settings.phone2)}`}
                      className="hover:text-[#f3ba2f] flex items-center justify-between group transition-colors"
                      title="اتصال مباشر"
                    >
                      <span className="font-mono tracking-wider text-sm sm:text-base direction-ltr">{settings.phone2}</span>
                      <Phone className="w-4 h-4 text-[#e6af2e] group-hover:scale-110 transition-transform" />
                    </a>
                  )}
                </div>
              </div>

              {/* Box 2: Direct WhatsApp Box */}
              <div className="p-3.5 rounded-2xl bg-[#062c21]/90 border border-[#11543f] shadow-sm">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-[#34d399] font-bold">
                    {lang === 'ar' ? 'واتساب مباشر' : strings.whatsapp}
                  </span>
                  <a
                    href={`https://wa.me/${cleanPhoneForWhatsApp(settings.whatsappNumber)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-7 h-7 rounded-lg bg-[#25D366] text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-transform shadow-xs"
                    title="محادثة واتساب"
                  >
                    <MessageCircle className="w-4 h-4 fill-white" />
                  </a>
                </div>
                <a
                  href={`https://wa.me/${cleanPhoneForWhatsApp(settings.whatsappNumber)}`}
                  target="_blank"
                  rel="noreferrer"
                  className="font-bold text-white hover:text-[#25D366] text-sm sm:text-base font-mono tracking-wider block transition-colors direction-ltr"
                >
                  {settings.whatsappNumber}
                </a>
              </div>

              <div className="flex items-start gap-2.5 text-xs text-emerald-200/90 pt-1">
                <MapPin className="w-4 h-4 text-[#C9A227] shrink-0 mt-0.5" />
                <span className="leading-relaxed">{settings.address}</span>
              </div>
            </div>
          </div>

          {/* Column 4: Quick Payment Channels from Card */}
          <div>
            <h4 className="text-base font-bold text-white mb-4 flex items-center gap-2 border-b border-emerald-800/80 pb-2">
              <span className="w-2 h-2 rounded-full bg-[#C9A227]"></span>
              <span>{lang === 'ar' ? 'قنوات التبرع السريع' : 'Quick Donation'}</span>
            </h4>
            
            <div className="space-y-2 text-xs">
              {/* Vodafone Cash */}
              <div className="p-2.5 bg-emerald-950/60 rounded-xl border border-emerald-800/40 flex items-center justify-between">
                <div>
                  <span className="text-gray-400 block text-[10px]">فودافون كاش ميجا خير</span>
                  <span className="font-mono font-bold text-white text-sm">{settings.vodafoneCashCode}</span>
                </div>
                <button
                  onClick={() => copyToClipboard(settings.vodafoneCashCode, 991)}
                  className="text-emerald-300 hover:text-white"
                >
                  {copiedBankIndex === 991 ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* OpPay */}
              <div className="p-2.5 bg-emerald-950/60 rounded-xl border border-emerald-800/40 flex items-center justify-between">
                <div>
                  <span className="text-gray-400 block text-[10px]">OpPay (أوباي)</span>
                  <span className="font-mono font-bold text-white text-sm">{settings.opPayCode}</span>
                </div>
                <button
                  onClick={() => copyToClipboard(settings.opPayCode, 992)}
                  className="text-emerald-300 hover:text-white"
                >
                  {copiedBankIndex === 992 ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* SMS */}
              <div className="p-2.5 bg-emerald-950/60 rounded-xl border border-emerald-800/40 flex items-center justify-between">
                <div>
                  <span className="text-gray-400 block text-[10px]">تبرع برسالة SMS على رقم:</span>
                  <span className="font-mono font-bold text-white text-sm">{settings.smsNumber}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bank Accounts Transparency Section */}
        <div className="py-8 border-b border-emerald-900/60">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
            <div>
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                <Building className="w-5 h-5 text-[#C9A227]" />
                <span>{strings.bankTitle}</span>
              </h4>
              <p className="text-xs text-emerald-200/80 mt-1">
                {lang === 'ar'
                  ? `الحسابات البنكية الرسمية المعتمدة لـ ${settings.orgNameAr} (${settings.licenseNumber})`
                  : 'Official Certified Bank Accounts'}
              </p>
            </div>
            <button
              onClick={() => { setCurrentPage('donate'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="text-xs font-bold text-[#C9A227] hover:underline flex items-center gap-1"
            >
              <span>{lang === 'ar' ? 'التبرع عبر المنصة' : 'Donate Now'}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {settings.bankAccounts.map((account, idx) => (
              <div
                key={idx}
                className="bg-emerald-950/60 border border-emerald-800/50 rounded-xl p-4 space-y-2 hover:border-[#C9A227] transition-colors"
              >
                <div className="font-bold text-sm text-white truncate">{account.bankName}</div>
                <div className="text-[11px] text-emerald-300">{account.currency}</div>
                <div className="pt-1 flex items-center justify-between bg-emerald-900/40 p-2.5 rounded-lg font-mono text-xs">
                  <span className="text-white font-extrabold tracking-wider">{account.accountNumber}</span>
                  <button
                    onClick={() => copyToClipboard(account.accountNumber, idx)}
                    title="نسخ رقم الحساب"
                    className="text-emerald-300 hover:text-white transition-colors"
                  >
                    {copiedBankIndex === idx ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Copyright & Disclaimer */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-emerald-300/80">
          <div>
            <p>{strings.rights}</p>
            <p className="text-[11px] text-emerald-400/60 mt-0.5">
              {settings.licenseNumber} | {settings.taxNumber} | {settings.address}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => { setCurrentPage('about'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="hover:underline"
            >
              {lang === 'ar' ? 'عن المنظمة' : 'About Organization'}
            </button>
            <span>•</span>
            <button
              onClick={() => { setCurrentPage('admin'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="hover:underline text-[#C9A227]"
            >
              {lang === 'ar' ? 'لوحة الإدارة' : 'Admin Portal'}
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
