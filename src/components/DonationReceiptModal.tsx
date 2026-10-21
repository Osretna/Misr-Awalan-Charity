import React from 'react';
import { useApp } from '../context/AppContext';
import { t } from '../utils/translations';
import { Logo } from './Logo';
import { formatCurrency } from '../utils/helpers';
import { 
  X, 
  Printer, 
  CheckCircle2, 
  Share2, 
  ShieldCheck, 
  Calendar,
  CreditCard,
  Hash,
  MessageCircle,
  ExternalLink,
  Phone,
  QrCode,
  Smartphone
} from 'lucide-react';

export const DonationReceiptModal: React.FC = () => {
  const { latestDonationReceipt, setLatestDonationReceipt, lang, settings } = useApp();
  const strings = t[lang];

  if (!latestDonationReceipt) return null;

  const handlePrint = () => {
    window.print();
  };

  const getMethodDisplay = (m: string) => {
    switch (m) {
      case 'vodafone_cash':
        return lang === 'ar' ? 'فودافون كاش ومحافظ المحمول (*9*240#)' : 'Vodafone Cash & Wallets';
      case 'instapay':
        return 'إنستاباي (InstaPay)';
      case 'bank_transfer':
        return lang === 'ar' ? 'تحويل بنكي رسمي' : 'Bank Transfer';
      case 'representative':
        return lang === 'ar' ? 'مندوب تحصيل منزلي' : 'Home Representative';
      case 'fawry':
        return lang === 'ar' ? 'فوري (Fawry)' : 'Fawry Network';
      default:
        return m.replace('_', ' ').toUpperCase();
    }
  };

  const shareText = lang === 'ar'
    ? `الحمد لله، تشرفت بالمساهمة في دعم أهالينا عبر منظمة مصر أولاً (${latestDonationReceipt.campaignTitle}) - رقم الإيصال: ${latestDonationReceipt.referenceNumber}. صدقة جارية ترفع البلاء وتصنع الأمل.`
    : `Honored to support Misr Awalan Organization (${latestDonationReceipt.campaignTitle}) - Receipt: ${latestDonationReceipt.referenceNumber}.`;

  const handleShare = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
  };

  const waTarget = settings.whatsappNumber.replace(/\D/g, '') || '201118150007';
  const confirmationMsg = lang === 'ar'
    ? `السلام عليكم ورحمة الله، مرفق لكم إشعار تحويل التبرع لصالح منظمة مصر أولاً:\n- المشروع: ${latestDonationReceipt.campaignTitle}\n- المبلغ: ${latestDonationReceipt.amount} جنيه مصري\n- وسيلة الدفع: ${getMethodDisplay(latestDonationReceipt.paymentMethod)}\n- رقم الإيصال المرجعي: ${latestDonationReceipt.referenceNumber}\n- اسم المتبرع: ${latestDonationReceipt.donorName || 'فاعل خير'}\nيرجى تأكيد القيد في السجلات الرسمية وجزاكم الله خيراً.`
    : `Hello, sending my donation confirmation for Misr Awalan:\n- Ref: ${latestDonationReceipt.referenceNumber}\n- Amount: ${latestDonationReceipt.amount} EGP\n- Campaign: ${latestDonationReceipt.campaignTitle}`;

  const handleSendProofWhatsApp = () => {
    const url = `https://wa.me/${waTarget}?text=${encodeURIComponent(confirmationMsg)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
      <div 
        className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200 my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Close Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#0A5C4B] text-white">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-[#E0BA3E]" />
            <span className="font-bold text-sm tracking-wide">
              {strings.receiptTitle}
            </span>
          </div>
          <button
            onClick={() => setLatestDonationReceipt(null)}
            className="p-1 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Receipt Body */}
        <div id="printable-receipt" className="p-6 sm:p-8 bg-gradient-to-b from-[#FDFBF7] to-white relative">
          
          {/* Subtle Watermark Logo in Background */}
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.04] pointer-events-none">
            <Logo size="xl" showText={false} />
          </div>

          {/* Header of the Official Receipt */}
          <div className="flex flex-col sm:flex-row items-center justify-between border-b-2 border-dashed border-gray-300 pb-6 gap-4">
            <Logo size="md" lang={lang} />
            <div className="text-center sm:text-end text-xs text-gray-500 space-y-1">
              <div className="font-bold text-emerald-900">{settings.licenseNumber}</div>
              <div>{settings.taxNumber}</div>
              <div className="font-mono text-[11px] text-gray-400">
                {new Date(latestDonationReceipt.createdAt).toLocaleString(lang === 'ar' ? 'ar-EG' : 'en-US')}
              </div>
            </div>
          </div>

          {/* Verified Badge */}
          <div className="mt-6 flex justify-center">
            <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-[#0A5C4B] px-4 py-1.5 rounded-full text-xs font-bold">
              <ShieldCheck className="w-4 h-4 text-[#C9A227]" />
              <span>{lang === 'ar' ? 'تبرع معتمد ومقيد بالحسابات الرسمية' : 'Officially Certified & Recorded Contribution'}</span>
            </div>
          </div>

          {/* Key Receipt Information Grid */}
          <div className="mt-6 bg-white rounded-2xl border border-gray-200 p-5 shadow-xs space-y-4">
            
            {/* Amount Banner */}
            <div className="flex items-center justify-between p-3.5 bg-[#0A5C4B]/5 rounded-xl border border-[#0A5C4B]/15">
              <span className="text-xs font-semibold text-gray-600">
                {lang === 'ar' ? 'مبلغ التبرع' : 'Donation Amount'}
              </span>
              <span className="text-2xl font-black text-[#0A5C4B] font-cairo">
                {formatCurrency(latestDonationReceipt.amount, latestDonationReceipt.currency, lang)}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <span className="text-gray-500 flex items-center gap-1.5">
                  <Hash className="w-3.5 h-3.5 text-gray-400" />
                  {lang === 'ar' ? 'رقم الإيصال المرجعي' : 'Reference No.'}
                </span>
                <span className="font-mono font-bold text-gray-900 block text-sm">
                  {latestDonationReceipt.referenceNumber}
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-gray-500 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-gray-400" />
                  {lang === 'ar' ? 'المستفيد / المبادرة' : 'Campaign'}
                </span>
                <span className="font-bold text-gray-900 block truncate">
                  {latestDonationReceipt.campaignTitle}
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-gray-500">
                  {lang === 'ar' ? 'اسم المتبرع' : 'Donor Name'}
                </span>
                <span className="font-bold text-gray-900 block">
                  {latestDonationReceipt.donorName || (lang === 'ar' ? 'فاعل خير' : 'Anonymous Donor')}
                </span>
              </div>

              <div className="space-y-1">
                <span className="text-gray-500 flex items-center gap-1.5">
                  <CreditCard className="w-3.5 h-3.5 text-gray-400" />
                  {lang === 'ar' ? 'وسيلة الدفع' : 'Payment Method'}
                </span>
                <span className="font-bold text-gray-900 block">
                  {getMethodDisplay(latestDonationReceipt.paymentMethod)}
                </span>
              </div>
            </div>

            {/* Quick Proof Dispatch Banner */}
            <div className="p-3.5 bg-emerald-50/80 rounded-xl border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-2.5">
              <div className="text-xs text-emerald-900">
                <span className="font-bold block">
                  {lang === 'ar' ? 'لتأكيد قيد التحويل فوراً:' : 'To confirm transfer instantly:'}
                </span>
                <span className="text-[11px] text-emerald-700">
                  {lang === 'ar'
                    ? 'أرسل لقطة شاشة التحويل للإدارة المالية عبر واتساب مع رقم الإيصال'
                    : 'Send screenshot with receipt number to finance team via WhatsApp'}
                </span>
              </div>
              <button
                type="button"
                onClick={handleSendProofWhatsApp}
                className="w-full sm:w-auto px-3.5 py-2 bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 shrink-0 shadow-xs"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>{lang === 'ar' ? 'إرسال الإشعار لواتساب' : 'WhatsApp Receipt'}</span>
              </button>
            </div>

            {/* Noble Prayer Quote */}
            <div className="p-3 bg-[#C9A227]/10 rounded-xl border border-[#C9A227]/30 text-center">
              <p className="text-xs font-semibold text-[#8F7015] italic">
                {lang === 'ar'
                  ? '﴿وَمَا أَنفَقْتُم مِّن شَيْءٍ فَهُوَ يُخْلِفُهُ ۖ وَهُوَ خَيْرُ الرَّازِقِينَ﴾'
                  : '"Whatever you spend in charity, He will compensate it; and He is the best of providers."'}
              </p>
            </div>
          </div>

          {/* Stamp & Seal Simulation */}
          <div className="mt-6 flex items-center justify-between pt-2">
            <div className="text-[11px] text-gray-400">
              {lang === 'ar' ? 'ختم الاعتماد المالي الإلكتروني' : 'Electronic Financial Stamp'}
            </div>
            <div className="w-20 h-20 rounded-full border-2 border-dashed border-[#0A5C4B] p-1 flex items-center justify-center text-center transform -rotate-12">
              <div className="w-full h-full rounded-full border border-[#0A5C4B] flex flex-col items-center justify-center text-[8px] font-bold text-[#0A5C4B] leading-none">
                <span>مصر أولاً</span>
                <span className="text-[7px] text-[#C9A227] my-0.5">معتمد</span>
                <span>MISR AWALAN</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-4 py-2 bg-gray-800 hover:bg-gray-900 text-white rounded-xl text-xs font-bold transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>{strings.printReceipt}</span>
            </button>

            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-xl text-xs font-bold transition-colors"
            >
              <Share2 className="w-4 h-4" />
              <span>{strings.shareWhatsApp}</span>
            </button>
          </div>

          <button
            onClick={() => setLatestDonationReceipt(null)}
            className="px-4 py-2 text-xs font-bold text-gray-600 hover:text-gray-900"
          >
            {lang === 'ar' ? 'إغلاق' : 'Close'}
          </button>
        </div>

      </div>
    </div>
  );
};
