import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { t } from '../utils/translations';
import { PaymentMethod } from '../types';
import { formatCurrency, formatNumber } from '../utils/helpers';
import confetti from 'canvas-confetti';
import { 
  Heart, 
  Sparkles, 
  ShieldCheck, 
  CreditCard, 
  QrCode, 
  Smartphone, 
  Building, 
  Copy, 
  Check, 
  Printer, 
  Share2, 
  Lock,
  MessageSquare,
  UserCheck,
  Phone,
  MessageCircle
} from 'lucide-react';

export const DonatePage: React.FC = () => {
  const { lang, projects, addDonation, settings } = useApp();
  const strings = t[lang];

  const [frequency, setFrequency] = useState<'one-time' | 'monthly'>('one-time');
  const [amount, setAmount] = useState<number>(500);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [selectedCampaign, setSelectedCampaign] = useState<string>('general');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('vodafone_cash');

  // Donor form
  const [donorName, setDonorName] = useState<string>('');
  const [donorPhone, setDonorPhone] = useState<string>('');
  const [donorEmail, setDonorEmail] = useState<string>('');
  const [isAnonymous, setIsAnonymous] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Card Simulation inputs
  const [cardNumber, setCardNumber] = useState<string>('');
  const [cardExpiry, setCardExpiry] = useState<string>('');
  const [cardCvc, setCardCvc] = useState<string>('');

  const presetAmounts = [200, 500, 1000, 2500, 5000];

  const handleAmountClick = (val: number) => {
    setAmount(val);
    setCustomAmount('');
  };

  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '');
    setCustomAmount(val);
    if (val) {
      setAmount(Number(val));
    }
  };

  const copyText = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0) return;

    setLoading(true);
    try {
      const project = projects.find(p => p.id === selectedCampaign);
      const campaignTitle = project ? project.title : (lang === 'ar' ? 'صدقة عامة وتفريج كرب' : 'General Relief Fund');

      await addDonation({
        donorName: isAnonymous ? (lang === 'ar' ? 'فاعل خير' : 'Anonymous Donor') : (donorName.trim() || (lang === 'ar' ? 'فاعل خير' : 'Anonymous Donor')),
        donorPhone: donorPhone.trim(),
        donorEmail: donorEmail.trim(),
        amount,
        currency: 'EGP',
        campaignId: selectedCampaign,
        campaignTitle,
        type: frequency,
        paymentMethod,
        status: 'completed',
        isPublic: !isAnonymous,
      });

      // Confetti burst
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // ignore
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-[#0A5C4B] bg-[#0A5C4B]/10 px-3.5 py-1 rounded-full">
          {settings.licenseNumber}
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-[#0A5C4B] font-cairo">
          {strings.donationHeader}
        </h1>
        <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
          {lang === 'ar'
            ? `تبرعك يصل مباشرة للحسابات المعتمدة لـ ${settings.orgNameAr} تحت إشراف رسمي كامل.`
            : strings.donationSubheader}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left / Main Donation Form (8 Cols) */}
        <div className="lg:col-span-8 bg-white rounded-3xl border border-gray-200/80 shadow-md p-6 sm:p-10 space-y-8">
          
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* 1. Frequency (One-Time vs Monthly Sadaqa) */}
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-3">
                1. {lang === 'ar' ? 'نوع المساهمة' : 'Contribution Frequency'}
              </label>
              <div className="grid grid-cols-2 gap-3 p-1.5 bg-[#F8F5F0] rounded-2xl border border-gray-200">
                <button
                  type="button"
                  onClick={() => setFrequency('one-time')}
                  className={`py-3 rounded-xl font-bold text-sm transition-all ${
                    frequency === 'one-time'
                      ? 'bg-white text-[#0A5C4B] shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  {strings.oneTime}
                </button>
                <button
                  type="button"
                  onClick={() => setFrequency('monthly')}
                  className={`py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-1.5 ${
                    frequency === 'monthly'
                      ? 'bg-[#C9A227] text-gray-950 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Sparkles className="w-4 h-4 text-emerald-950" />
                  <span>{strings.monthly} ({lang === 'ar' ? 'صدقة جارية' : 'Recurring'})</span>
                </button>
              </div>
            </div>

            {/* 2. Amount Selection */}
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-3">
                2. {lang === 'ar' ? 'تحديد مبلغ التبرع' : 'Donation Amount (EGP)'}
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 mb-3">
                {presetAmounts.map((val) => {
                  const isSelected = amount === val && !customAmount;
                  return (
                    <button
                      key={val}
                      type="button"
                      onClick={() => handleAmountClick(val)}
                      className={`py-3 rounded-2xl border text-center transition-all ${
                        isSelected
                          ? 'border-[#0A5C4B] bg-[#0A5C4B] text-white font-extrabold shadow-sm scale-102'
                          : 'border-gray-200 bg-gray-50 text-gray-800 hover:border-gray-300 font-bold'
                      }`}
                    >
                      <span className="text-base block">{val}</span>
                      <span className="text-[10px] opacity-80">{strings.egp}</span>
                    </button>
                  );
                })}
              </div>

              <div className="relative">
                <input
                  type="text"
                  placeholder={lang === 'ar' ? 'أو اكتب أي مبلغ آخر بالجنيه المصري...' : 'Or enter another amount...'}
                  value={customAmount}
                  onChange={handleCustomChange}
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-3.5 text-sm font-bold text-gray-900 focus:outline-hidden focus:border-[#0A5C4B] focus:bg-white"
                />
                <span className="absolute end-5 top-3.5 text-sm font-bold text-gray-500">
                  {strings.egp}
                </span>
              </div>
            </div>

            {/* 3. Campaign / Field Initiative Selector */}
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-3">
                3. {lang === 'ar' ? 'المصرف / المبادرة المراد دعمها' : 'Designated Initiative'}
              </label>
              <select
                value={selectedCampaign}
                onChange={(e) => setSelectedCampaign(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-3.5 text-sm font-bold text-gray-900 focus:outline-hidden focus:border-[#0A5C4B] focus:bg-white"
              >
                <option value="general">
                  {lang === 'ar' ? 'صدقة عامة وتفريج كرب (يوجه للأكثر احتياجاً)' : 'General Relief / Most In Need'}
                </option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    [{strings.categories[p.category] || p.category}] {p.title}
                  </option>
                ))}
              </select>
            </div>

            {/* 4. Payment Methods From Organization Card */}
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-3">
                4. {lang === 'ar' ? 'طريقة الدفع وقنوات التبرع الرسمية' : 'Select Official Payment Channel'}
              </label>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 mb-6">
                {[
                  { id: 'vodafone_cash', label: 'فودافون كاش', icon: Smartphone, highlight: '*9*240#' },
                  { id: 'instapay', label: 'InstaPay', icon: QrCode, highlight: 'لحظي' },
                  { id: 'bank_transfer', label: 'تحويل بنكي', icon: Building, highlight: 'بنك مصر' },
                  { id: 'representative', label: 'مندوب تحصيل', icon: UserCheck, highlight: 'منزلي' },
                  { id: 'oppay', label: 'OpPay أوباي', icon: Building, highlight: settings.opPayCode },
                  { id: 'sms', label: 'رسالة SMS', icon: MessageSquare, highlight: settings.smsNumber },
                  { id: 'card', label: 'فيزا / ميزة', icon: CreditCard, highlight: 'أونلاين' },
                ].map((m) => {
                  const Icon = m.icon;
                  const isSelected = paymentMethod === m.id;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setPaymentMethod(m.id as PaymentMethod)}
                      className={`p-3 rounded-2xl border text-center transition-all flex flex-col items-center gap-1.5 ${
                        isSelected
                          ? 'border-[#0A5C4B] bg-[#0A5C4B]/10 text-[#0A5C4B] font-bold shadow-xs'
                          : 'border-gray-200 bg-gray-50 text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <Icon className="w-5 h-5 text-gray-800" />
                      <span className="text-xs font-bold">{m.label}</span>
                      <span className="text-[10px] bg-white px-2 py-0.5 rounded-full border border-gray-200 text-gray-500 font-mono">
                        {m.highlight}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Instructions Panel per payment method */}
              <div className="p-5 rounded-2xl bg-[#F8F5F0] border border-gray-200 space-y-4">
                
                {paymentMethod === 'vodafone_cash' && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-rose-700">
                      <Smartphone className="w-4 h-4" />
                      <span>{lang === 'ar' ? 'فودافون كاش ومحافظ المحمول (كود التبرع الفوري والمحفظة)' : 'Vodafone Cash & Mobile Wallets'}</span>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="bg-white p-3.5 rounded-xl border border-gray-200 flex items-center justify-between">
                        <div>
                          <div className="text-[11px] text-gray-500 font-semibold">{lang === 'ar' ? 'كود التبرع السريع المباشر:' : 'Direct USSD Code:'}</div>
                          <div className="font-mono font-bold text-red-600 text-lg">{settings.vodafoneCashCode || '*9*240#'}</div>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <a
                            href="tel:*9*240%23"
                            className="px-3 py-1.5 rounded-lg bg-red-600 text-white text-xs font-bold hover:bg-red-700 flex items-center gap-1 shadow-xs"
                          >
                            <Phone className="w-3.5 h-3.5" />
                            <span>{lang === 'ar' ? 'اتصال الآن' : 'Dial'}</span>
                          </a>
                          <button
                            type="button"
                            onClick={() => copyText(settings.vodafoneCashCode || '*9*240#', 'vfcode')}
                            className="px-2.5 py-1.5 rounded-lg bg-gray-100 text-gray-700 text-xs font-bold hover:bg-gray-200"
                          >
                            {copiedKey === 'vfcode' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                      </div>

                      <div className="bg-white p-3.5 rounded-xl border border-gray-200 flex items-center justify-between">
                        <div>
                          <div className="text-[11px] text-gray-500 font-semibold">{lang === 'ar' ? 'أرقام كاش المباشرة:' : 'Direct Wallet:'}</div>
                          <div className="font-mono font-bold text-gray-900 text-sm">{settings.phone2 || '01007267403'}</div>
                        </div>
                        <button
                          type="button"
                          onClick={() => copyText(settings.phone2 || '01007267403', 'vfnum')}
                          className="px-3 py-1.5 rounded-lg bg-emerald-50 text-[#0A5C4B] text-xs font-bold hover:bg-emerald-100 flex items-center gap-1"
                        >
                          {copiedKey === 'vfnum' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedKey === 'vfnum' ? 'تم النسخ' : 'نسخ'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'bank_transfer' && (
                  <div className="space-y-3">
                    <div className="text-xs font-bold text-[#0A5C4B] flex items-center gap-2">
                      <Building className="w-4 h-4" />
                      <span>{lang === 'ar' ? 'الحسابات الرسمية بالبنوك المصرية المعتمدة:' : 'Official Bank Accounts in Egypt:'}</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {settings.bankAccounts.map((b, idx) => (
                        <div key={idx} className="bg-white p-3 rounded-xl border border-gray-200 text-xs flex flex-col justify-between">
                          <div>
                            <div className="font-bold text-gray-900 line-clamp-1">{b.bankName}</div>
                            <div className="font-mono font-bold text-[#0A5C4B] text-sm mt-1">{b.accountNumber}</div>
                          </div>
                          <button
                            type="button"
                            onClick={() => copyText(b.accountNumber, `bank-${idx}`)}
                            className="mt-2 text-xs text-gray-500 hover:text-gray-900 flex items-center gap-1 self-start font-medium"
                          >
                            {copiedKey === `bank-${idx}` ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{copiedKey === `bank-${idx}` ? 'تم النسخ' : 'نسخ الرقم'}</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {paymentMethod === 'oppay' && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#0A5C4B]">
                      <Building className="w-4 h-4" />
                      <span>{lang === 'ar' ? 'سداد التبرع عبر شبكة أوباي (OpPay)' : 'OpPay Payment Network'}</span>
                    </div>
                    <div className="bg-white p-3.5 rounded-xl border border-gray-200 flex items-center justify-between">
                      <div>
                        <div className="text-[11px] text-gray-500 font-semibold">{lang === 'ar' ? 'كود خدمة منظمة مصر أولاً على OpPay:' : 'OpPay Code:'}</div>
                        <div className="font-mono font-bold text-gray-900 text-xl tracking-wider">{settings.opPayCode}</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => copyText(settings.opPayCode, 'oppay')}
                        className="px-3 py-1.5 rounded-lg bg-emerald-50 text-[#0A5C4B] text-xs font-bold hover:bg-emerald-100 flex items-center gap-1"
                      >
                        {copiedKey === 'oppay' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedKey === 'oppay' ? 'تم النسخ' : 'نسخ الكود'}</span>
                      </button>
                    </div>
                    <p className="text-xs text-gray-600">
                      {lang === 'ar' ? 'ادخل كود 230976 في أي ماكينة أو محفظة OpPay لدعم مشروعات المنظمة.' : 'Enter code 230976 at any OpPay POS point.'}
                    </p>
                  </div>
                )}

                {paymentMethod === 'sms' && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#0A5C4B]">
                      <MessageSquare className="w-4 h-4" />
                      <span>{lang === 'ar' ? 'التبرع السريع عبر الرسائل النصية القصيرة (SMS)' : 'Quick SMS Contribution'}</span>
                    </div>
                    <div className="bg-white p-3.5 rounded-xl border border-gray-200 flex items-center justify-between">
                      <div>
                        <div className="text-[11px] text-gray-500 font-semibold">{lang === 'ar' ? 'أرسل رسالة فارغة أو كلمة (مصر) إلى الرقم:' : 'Send SMS to:'}</div>
                        <div className="font-mono font-bold text-[#0A5C4B] text-2xl tracking-widest">{settings.smsNumber}</div>
                      </div>
                      <span className="text-xs font-bold bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full">
                        5 جنيهات للرسالة
                      </span>
                    </div>
                  </div>
                )}

                {paymentMethod === 'instapay' && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-[#0A5C4B]">
                      <QrCode className="w-4 h-4" />
                      <span>{lang === 'ar' ? 'التحويل الفوري عبر شبكة المدفوعات اللحظية (InstaPay)' : 'Instant transfer via InstaPay Egypt'}</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="bg-white p-3.5 rounded-xl border border-gray-200 flex items-center justify-between">
                        <div>
                          <div className="text-[11px] text-gray-500 font-semibold">{lang === 'ar' ? 'عنوان الدفع اللحظي (IPA):' : 'InstaPay Address:'}</div>
                          <div className="font-mono font-bold text-gray-900 text-sm">{settings.instaPayAddress || '01007267403@instapay'}</div>
                        </div>
                        <button
                          type="button"
                          onClick={() => copyText(settings.instaPayAddress || '01007267403@instapay', 'ipa')}
                          className="px-3 py-1.5 rounded-lg bg-emerald-50 text-[#0A5C4B] text-xs font-bold hover:bg-emerald-100 flex items-center gap-1"
                        >
                          {copiedKey === 'ipa' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedKey === 'ipa' ? 'تم النسخ' : 'نسخ'}</span>
                        </button>
                      </div>

                      <div className="bg-white p-3.5 rounded-xl border border-gray-200 flex items-center justify-between">
                        <div>
                          <div className="text-[11px] text-gray-500 font-semibold">{lang === 'ar' ? 'أو تحويل برقم الهاتف المسجل:' : 'Mobile Number:'}</div>
                          <div className="font-mono font-bold text-gray-900 text-sm">{settings.phone2 || '01007267403'}</div>
                        </div>
                        <button
                          type="button"
                          onClick={() => copyText(settings.phone2 || '01007267403', 'ipa-phone')}
                          className="px-3 py-1.5 rounded-lg bg-emerald-50 text-[#0A5C4B] text-xs font-bold hover:bg-emerald-100 flex items-center gap-1"
                        >
                          {copiedKey === 'ipa-phone' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedKey === 'ipa-phone' ? 'تم النسخ' : 'نسخ'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'representative' && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-amber-800">
                      <UserCheck className="w-4 h-4" />
                      <span>{lang === 'ar' ? 'خدمة التحصيل المنزلي (مندوب يصلك أينما كنت)' : 'Home Collection Representative Service'}</span>
                    </div>
                    <div className="bg-white p-4 rounded-xl border border-amber-200 text-xs space-y-3">
                      <p className="text-gray-700 leading-relaxed">
                        {lang === 'ar'
                          ? 'يسعدنا إرسال مندوب رسمي معتمد من الجمعية يحمل هوية رسمية وإيصال استلام ورقي مختوم بختم الجمعية حتى باب منزلك أو مقر عملك.'
                          : 'An official verified representative with ID and stamped paper receipt will visit you at your door or office.'}
                      </p>
                      <div className="flex flex-wrap items-center gap-2 pt-1">
                        <a
                          href={`https://wa.me/${settings.whatsappNumber.replace(/\D/g, '') || '201118150007'}?text=${encodeURIComponent(
                            lang === 'ar'
                              ? `السلام عليكم ورحمة الله، أود طلب مندوب تحصيل للتبرع بمبلغ (${amount} ج.م) لصالح مشروع (${projects.find(p => p.id === selectedCampaign)?.title || 'صدقة عامة'}). رقم هاتفي: ${donorPhone || settings.phone1}`
                              : `Hello, I would like to request a home collection representative for ${amount} EGP.`
                          )}`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-4 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold flex items-center gap-2 shadow-xs transition-colors"
                        >
                          <MessageCircle className="w-4 h-4 fill-current" />
                          <span>{lang === 'ar' ? 'طلب المندوب فوراً عبر واتساب' : 'Request via WhatsApp'}</span>
                        </a>
                        <a
                          href={`tel:${settings.phone1}`}
                          className="px-4 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold flex items-center gap-2 transition-colors"
                        >
                          <Phone className="w-4 h-4" />
                          <span>{settings.phone1}</span>
                        </a>
                      </div>
                    </div>
                  </div>
                )}

                {paymentMethod === 'card' && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-800">
                      <CreditCard className="w-4 h-4 text-[#0A5C4B]" />
                      <span>{lang === 'ar' ? 'بطاقة ميزة / فيزا / ماستركارد' : 'Meeza / Visa / MasterCard'}</span>
                    </div>
                    <div className="space-y-2">
                      <input
                        type="text"
                        placeholder="0000 0000 0000 0000"
                        maxLength={19}
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-mono"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="MM/YY"
                          maxLength={5}
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-mono"
                        />
                        <input
                          type="password"
                          placeholder="CVV"
                          maxLength={3}
                          value={cardCvc}
                          onChange={(e) => setCardCvc(e.target.value)}
                          className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-mono"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 5. Optional Donor Information */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between">
                <label className="block text-sm font-bold text-gray-800">
                  5. {strings.donorInfo}
                </label>
                <label className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isAnonymous}
                    onChange={(e) => setIsAnonymous(e.target.checked)}
                    className="rounded text-[#0A5C4B] focus:ring-[#0A5C4B]"
                  />
                  <span>{lang === 'ar' ? 'التبرع كـ "فاعل خير" دون إظهار الاسم' : 'Donate anonymously'}</span>
                </label>
              </div>

              {!isAnonymous && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <input
                      type="text"
                      placeholder={strings.fullName}
                      value={donorName}
                      onChange={(e) => setDonorName(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:outline-hidden focus:border-[#0A5C4B]"
                    />
                  </div>
                  <div>
                    <input
                      type="tel"
                      placeholder={strings.phoneNumber}
                      value={donorPhone}
                      onChange={(e) => setDonorPhone(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:outline-hidden focus:border-[#0A5C4B]"
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      placeholder={strings.email}
                      value={donorEmail}
                      onChange={(e) => setDonorEmail(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs text-gray-900 focus:outline-hidden focus:border-[#0A5C4B]"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Submit Confirmation Button */}
            <button
              type="submit"
              disabled={loading || amount <= 0}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#0A5C4B] via-[#117863] to-[#0A5C4B] text-white font-black text-lg shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-3 font-cairo"
            >
              {loading ? (
                <span>{strings.processing}</span>
              ) : (
                <>
                  <Heart className="w-5 h-5 fill-rose-300 text-rose-300" />
                  <span>
                    {strings.confirmDonation} • {amount} {strings.egp} {frequency === 'monthly' ? strings.monthly : ''}
                  </span>
                </>
              )}
            </button>

            {/* Trust Footer */}
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-gray-500 pt-2 border-t border-gray-100">
              <span className="flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-[#0A5C4B]" />
                <span>{lang === 'ar' ? 'تشفير آمن 256-bit SSL' : '256-bit SSL Encryption'}</span>
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#C9A227]" />
                <span>{settings.licenseNumber}</span>
              </span>
            </div>

          </form>

        </div>

        {/* Right / Trust & Impact Summary (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Card: Why Misr Awalan */}
          <div className="bg-gradient-to-br from-[#0A5C4B] to-[#073229] text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-4">
            <h3 className="text-lg font-bold font-cairo text-[#E0BA3E]">
              {settings.orgNameAr}
            </h3>
            <p className="text-xs text-emerald-100/90 leading-relaxed font-normal">
              {settings.licenseNumber} - {settings.address}
            </p>
            <div className="space-y-2 pt-2 border-t border-emerald-800/80 text-xs text-emerald-200">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#C9A227]" />
                <span>{lang === 'ar' ? 'حسابات بنكية رسمية ومعتمدة' : 'Official certified accounts'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#C9A227]" />
                <span>{lang === 'ar' ? 'إيصال إلكتروني فوري قابل للطباعة' : 'Instant printable digital receipt'}</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#C9A227]" />
                <span>{lang === 'ar' ? 'تصلك رسالة وفيديو توثيقي للعمل الميداني' : 'Video documentation for donations'}</span>
              </div>
            </div>
          </div>

          {/* Quick Contact & Inquiries */}
          <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-sm space-y-3">
            <h4 className="text-sm font-bold text-gray-900">
              {lang === 'ar' ? 'هل تحتاج لمساعدة؟' : 'Need Assistance?'}
            </h4>
            <p className="text-xs text-gray-600 leading-relaxed">
              {lang === 'ar' ? 'يسعدنا الرد على اتصالاتكم واستفساراتكم على الأرقام الرسمية.' : 'Call our official numbers for any inquiry.'}
            </p>
            <div className="pt-1 flex flex-col gap-2">
              <a
                href={`tel:${settings.phone1}`}
                className="w-full py-2.5 rounded-xl bg-gray-100 hover:bg-[#0A5C4B] hover:text-white text-gray-800 text-xs font-bold transition-colors flex items-center justify-center gap-2"
              >
                <span>{settings.phone1}</span>
              </a>
              <a
                href={`tel:${settings.phone2}`}
                className="w-full py-2.5 rounded-xl bg-gray-100 hover:bg-[#0A5C4B] hover:text-white text-gray-800 text-xs font-bold transition-colors flex items-center justify-center gap-2"
              >
                <span>{settings.phone2}</span>
              </a>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
