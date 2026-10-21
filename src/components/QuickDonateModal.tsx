import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { t } from '../utils/translations';
import { PaymentMethod, Donation } from '../types';
import confetti from 'canvas-confetti';
import { 
  X, 
  Heart, 
  Sparkles, 
  Check, 
  ShieldCheck, 
  Smartphone, 
  QrCode, 
  Building, 
  UserCheck, 
  Copy, 
  Phone, 
  MessageCircle, 
  ArrowLeft, 
  ArrowRight,
  ExternalLink,
  Receipt,
  AlertCircle
} from 'lucide-react';

export const QuickDonateModal: React.FC = () => {
  const { 
    quickDonateModalOpen, 
    setQuickDonateModalOpen, 
    projects, 
    addDonation, 
    settings,
    setLatestDonationReceipt,
    lang 
  } = useApp();
  const strings = t[lang];

  const [step, setStep] = useState<'select' | 'execute'>('select');
  const [amount, setAmount] = useState<number>(500);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [frequency, setFrequency] = useState<'one-time' | 'monthly'>('one-time');
  const [campaignId, setCampaignId] = useState<string>('general');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('vodafone_cash');
  const [donorName, setDonorName] = useState<string>('');
  const [donorPhone, setDonorPhone] = useState<string>('');
  const [donorAddress, setDonorAddress] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [activeDonation, setActiveDonation] = useState<Donation | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!quickDonateModalOpen) return null;

  const presetAmounts = [200, 500, 1000, 2500];

  const handlePresetClick = (val: number) => {
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

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const handleProceedToExecute = async (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0) return;

    setLoading(true);
    try {
      const selectedProject = projects.find(p => p.id === campaignId);
      const campaignTitle = selectedProject ? selectedProject.title : (lang === 'ar' ? 'صدقة عامة وتفريج كرب' : 'General Relief');

      const createdDonation = await addDonation({
        donorName: donorName.trim() || (lang === 'ar' ? 'فاعل خير' : 'Anonymous Donor'),
        donorPhone: donorPhone.trim(),
        amount,
        currency: 'EGP',
        campaignId,
        campaignTitle,
        type: frequency,
        paymentMethod,
        status: 'pending',
        isPublic: true,
      });

      setActiveDonation(createdDonation);
      setStep('execute');

      // Fire celebratory confetti!
      try {
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch {
        // ignore
      }
    } catch (err) {
      console.error('Error creating donation:', err);
    } finally {
      setLoading(false);
    }
  };

  const getMethodName = (m: PaymentMethod): string => {
    switch (m) {
      case 'vodafone_cash':
        return lang === 'ar' ? 'فودافون كاش ومحافظ المحمول' : 'Vodafone Cash & Wallets';
      case 'instapay':
        return 'InstaPay (إنستاباي)';
      case 'bank_transfer':
        return lang === 'ar' ? 'تحويل بنكي رسمي' : 'Bank Transfer';
      case 'representative':
        return lang === 'ar' ? 'مندوب تحصيل منزلي' : 'Home Representative';
      case 'fawry':
        return lang === 'ar' ? 'فوري (Fawry)' : 'Fawry Code';
      default:
        return m;
    }
  };

  // WhatsApp transfer confirmation text
  const currentCampaign = projects.find(p => p.id === campaignId)?.title || (lang === 'ar' ? 'صدقة عامة وتفريج كرب' : 'General Relief');
  const refNum = activeDonation?.referenceNumber || 'REF-2026';
  const waTarget = settings.whatsappNumber.replace(/\D/g, '') || '201118150007';

  const whatsappTransferMsg = lang === 'ar'
    ? `السلام عليكم ورحمة الله وبركاته،\nأود إتمام تبرعي لصالح منظمة مصر أولاً (${currentCampaign}).\n- المبلغ: ${amount} جنيه مصري.\n- وسيلة التحويل: ${getMethodName(paymentMethod)}.\n- رقم المرجع: ${refNum}.\n- اسم المتبرع: ${donorName.trim() || 'فاعل خير'}.\n- رقم الهاتف: ${donorPhone.trim() || 'غير مسجل'}${donorAddress ? `\n- العنوان المطلوب للمندوب: ${donorAddress}` : ''}.\nمرفق لكم إشعار التحويل لتأكيد القيد بالسجلات الرسمية وجزاكم الله خيراً.`
    : `Hello Misr Awalan Organization,\nI am confirming my donation for (${currentCampaign}).\n- Amount: ${amount} EGP\n- Method: ${getMethodName(paymentMethod)}\n- Ref No: ${refNum}\n- Donor: ${donorName.trim() || 'Anonymous'}\nPlease confirm receipt.`;

  const handleOpenWhatsAppConfirmation = () => {
    const url = `https://wa.me/${waTarget}?text=${encodeURIComponent(whatsappTransferMsg)}`;
    window.open(url, '_blank');
  };

  const handleViewReceipt = () => {
    if (activeDonation) {
      setLatestDonationReceipt(activeDonation);
    }
    setQuickDonateModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
      <div 
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200 my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0A5C4B] to-[#117863] text-white p-6 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-white/10 rounded-xl">
                <Sparkles className="w-5 h-5 text-[#E0BA3E]" />
              </div>
              <div>
                <h3 className="font-bold text-lg font-cairo">
                  {step === 'select' 
                    ? (lang === 'ar' ? 'تبرع سريع وموثوق' : 'Quick Secure Donation')
                    : (lang === 'ar' ? 'إتمام التحويل الفعلي الآن' : 'Execute Real Transfer Now')}
                </h3>
                <p className="text-xs text-emerald-100">
                  {step === 'select'
                    ? (lang === 'ar' ? 'اختر المبلغ وطريقة الدفع المفضلة لديك' : 'Choose amount and preferred payment method')
                    : (lang === 'ar' ? 'حول المبلغ فعلياً بدون متاعب خلال لحظات' : 'Transfer funds seamlessly within seconds')}
                </p>
              </div>
            </div>
            <button
              onClick={() => setQuickDonateModalOpen(false)}
              className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Stepper Indicator */}
          <div className="mt-4 flex items-center justify-between text-xs font-bold pt-2 border-t border-white/15">
            <div className={`flex items-center gap-1.5 ${step === 'select' ? 'text-[#E0BA3E]' : 'text-white/70'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step === 'select' ? 'bg-[#E0BA3E] text-gray-900 font-black' : 'bg-white/20'}`}>1</span>
              <span>{lang === 'ar' ? 'تحديد التبرع' : 'Details'}</span>
            </div>
            <div className="flex-1 mx-3 h-0.5 bg-white/20">
              <div className={`h-full bg-[#E0BA3E] transition-all duration-300 ${step === 'execute' ? 'w-full' : 'w-0'}`} />
            </div>
            <div className={`flex items-center gap-1.5 ${step === 'execute' ? 'text-[#E0BA3E]' : 'text-white/70'}`}>
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step === 'execute' ? 'bg-[#E0BA3E] text-gray-900 font-black' : 'bg-white/20'}`}>2</span>
              <span>{lang === 'ar' ? 'إرسال النقود فعلياً' : 'Execute Payment'}</span>
            </div>
          </div>
        </div>

        {/* STEP 1: SELECT AMOUNT & METHOD */}
        {step === 'select' && (
          <form onSubmit={handleProceedToExecute} className="p-6 space-y-5">
            
            {/* Frequency Toggle */}
            <div className="grid grid-cols-2 bg-gray-100 p-1 rounded-xl">
              <button
                type="button"
                onClick={() => setFrequency('one-time')}
                className={`py-2 text-xs font-bold rounded-lg transition-all ${
                  frequency === 'one-time'
                    ? 'bg-white text-[#0A5C4B] shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {strings.oneTime}
              </button>
              <button
                type="button"
                onClick={() => setFrequency('monthly')}
                className={`py-2 text-xs font-bold rounded-lg transition-all ${
                  frequency === 'monthly'
                    ? 'bg-[#C9A227] text-gray-900 shadow-xs'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {strings.monthly} ({lang === 'ar' ? 'صدقة جارية' : 'Continuous'})
              </button>
            </div>

            {/* Preset Amount Grid */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2">
                {lang === 'ar' ? 'اختر مبلغ التبرع (جنيه مصري)' : 'Select Donation Amount (EGP)'}
              </label>
              <div className="grid grid-cols-4 gap-2 mb-2.5">
                {presetAmounts.map((val) => {
                  const isSelected = amount === val && !customAmount;
                  return (
                    <button
                      key={val}
                      type="button"
                      onClick={() => handlePresetClick(val)}
                      className={`py-2.5 px-1 rounded-xl border text-center font-bold text-sm transition-all ${
                        isSelected
                          ? 'border-[#0A5C4B] bg-[#0A5C4B] text-white shadow-sm scale-102'
                          : 'border-gray-200 bg-gray-50 text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <span>{val}</span>
                      <span className="text-[10px] block opacity-80 font-normal">{strings.egp}</span>
                    </button>
                  );
                })}
              </div>

              <div className="relative">
                <input
                  type="text"
                  placeholder={lang === 'ar' ? 'أو أدخل مبلغاً مخصصاً...' : 'Or enter custom amount...'}
                  value={customAmount}
                  onChange={handleCustomChange}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-hidden focus:border-[#0A5C4B] focus:bg-white"
                />
                <span className="absolute end-4 top-2.5 text-xs font-bold text-gray-500">
                  {strings.egp}
                </span>
              </div>
            </div>

            {/* Campaign Selector */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2">
                {lang === 'ar' ? 'المصرف أو المبادرة المستهدفة' : 'Initiative / Campaign'}
              </label>
              <select
                value={campaignId}
                onChange={(e) => setCampaignId(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-hidden focus:border-[#0A5C4B] focus:bg-white"
              >
                <option value="general">
                  {lang === 'ar' ? 'صدقة عامة وتفريج كرب (الأكثر احتياجاً)' : 'General Relief / Most In Need'}
                </option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Payment Method Selector */}
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2">
                {lang === 'ar' ? 'اختر طريقة التحويل الفعلي' : 'Payment Transfer Method'}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'vodafone_cash', label: 'فودافون كاش ومحافظ', icon: Smartphone, badge: '*9*240#' },
                  { id: 'instapay', label: 'إنستاباي (InstaPay)', icon: QrCode, badge: 'لحظي' },
                  { id: 'bank_transfer', label: 'تحويل بنكي (بنك مصر)', icon: Building, badge: 'رسمي' },
                  { id: 'representative', label: 'مندوب تحصيل منزلي', icon: UserCheck, badge: 'إيصال ورقي' },
                ].map((m) => {
                  const Icon = m.icon;
                  const isSelected = paymentMethod === m.id;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setPaymentMethod(m.id as PaymentMethod)}
                      className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center justify-between gap-1 relative ${
                        isSelected
                          ? 'border-[#0A5C4B] bg-[#0A5C4B]/5 text-[#0A5C4B] font-bold shadow-xs'
                          : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                      }`}
                    >
                      <Icon className="w-5 h-5 text-[#0A5C4B]" />
                      <span className="text-[11px] leading-tight font-bold">{m.label}</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-100 text-[#0A5C4B] font-mono">
                        {m.badge}
                      </span>
                      {isSelected && (
                        <span className="absolute top-1 end-1 w-2 h-2 rounded-full bg-[#0A5C4B]"></span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Optional Donor Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                  {strings.fullName} ({lang === 'ar' ? 'اختياري' : 'Optional'})
                </label>
                <input
                  type="text"
                  placeholder={strings.donorPlaceholder}
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-900 focus:outline-hidden focus:border-[#0A5C4B]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                  {strings.phoneNumber}
                </label>
                <input
                  type="tel"
                  placeholder="01xxxxxxxxx"
                  value={donorPhone}
                  onChange={(e) => setDonorPhone(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-900 focus:outline-hidden focus:border-[#0A5C4B]"
                />
              </div>
            </div>

            {paymentMethod === 'representative' && (
              <div>
                <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                  {lang === 'ar' ? 'عنوانك بالتفصيل لوصول المندوب' : 'Address for representative'}
                </label>
                <input
                  type="text"
                  placeholder={lang === 'ar' ? 'المدينة، الحي، اسم الشارع، رقم العقار' : 'City, district, street, building no.'}
                  value={donorAddress}
                  onChange={(e) => setDonorAddress(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-900 focus:outline-hidden focus:border-[#0A5C4B]"
                  required
                />
              </div>
            )}

            {/* Proceed Button */}
            <button
              type="submit"
              disabled={loading || amount <= 0}
              className="w-full flex items-center justify-center gap-2 bg-[#0A5C4B] hover:bg-[#074336] disabled:opacity-50 text-white font-bold py-3.5 rounded-xl shadow-md transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] font-cairo text-base"
            >
              {loading ? (
                <span>{strings.processing}</span>
              ) : (
                <>
                  <Heart className="w-5 h-5 fill-rose-300 text-rose-300" />
                  <span>
                    {lang === 'ar' ? `المتابعة لإرسال (${amount} ج.م) الآن` : `Proceed to Send (${amount} EGP) Now`}
                  </span>
                  {lang === 'ar' ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                </>
              )}
            </button>

            {/* Security Guarantee */}
            <div className="flex items-center justify-center gap-2 text-[11px] text-gray-500 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#C9A227]" />
              <span>
                {settings.licenseNumber} • {lang === 'ar' ? 'تحويل مباشر ومعتمد 100%' : '100% Direct & Verified'}
              </span>
            </div>

          </form>
        )}

        {/* STEP 2: EXECUTE REAL MONEY TRANSFER NOW */}
        {step === 'execute' && (
          <div className="p-6 space-y-5 animate-in fade-in duration-300">
            
            {/* Amount & Reference Highlight */}
            <div className="bg-[#0A5C4B]/5 border border-[#0A5C4B]/20 rounded-2xl p-4 flex items-center justify-between">
              <div>
                <span className="text-xs text-gray-600 block">
                  {lang === 'ar' ? 'المبلغ المطلوب تحويله فعلياً:' : 'Amount to transfer:'}
                </span>
                <span className="text-2xl font-black text-[#0A5C4B] font-cairo">
                  {amount} {strings.egp}
                </span>
                <span className="block text-[11px] text-gray-500 mt-0.5 truncate max-w-[200px]">
                  {currentCampaign}
                </span>
              </div>
              <div className="text-end">
                <span className="text-[10px] text-gray-500 uppercase font-mono block">
                  {lang === 'ar' ? 'رقم الإيصال المرجعي' : 'Ref No.'}
                </span>
                <span className="font-mono font-bold text-xs bg-white px-2.5 py-1 rounded-lg border border-gray-200 text-gray-900 inline-block mt-0.5">
                  {refNum}
                </span>
              </div>
            </div>

            {/* DYNAMIC REAL-WORLD PAYMENT EXECUTION BOX */}
            {paymentMethod === 'vodafone_cash' && (
              <div className="bg-red-50/70 border border-red-200 rounded-2xl p-4.5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-xs">
                      VF
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-red-900">
                        {lang === 'ar' ? 'فودافون كاش ومحافظ المحمول' : 'Vodafone Cash & Mobile Wallets'}
                      </h4>
                      <p className="text-[11px] text-red-700">
                        {lang === 'ar' ? 'طريقتان سهلتان لإتمام التحويل الفعلي فوراً:' : 'Two easy ways to transfer immediately:'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Option 1: Direct USSD Code Dialing */}
                <div className="bg-white p-3.5 rounded-xl border border-red-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-bold text-gray-700 block">
                        {lang === 'ar' ? 'الطريقة 1: اطلب كود التبرع الفوري المباشر:' : 'Option 1: Dial Instant USSD Code:'}
                      </span>
                      <span className="font-mono font-black text-red-600 text-xl tracking-wider">
                        {settings.vodafoneCashCode || '*9*240#'}
                      </span>
                    </div>
                    <a
                      href="tel:*9*240%23"
                      className="inline-flex items-center gap-1.5 px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>{lang === 'ar' ? 'اتصال الآن' : 'Dial Now'}</span>
                    </a>
                  </div>
                  <p className="text-[10px] text-gray-500 leading-tight">
                    {lang === 'ar' 
                      ? 'اضغط زر "اتصال الآن" لفتح شاشة الاتصال بهاتفك مباشرة بكود *9*240# للتبرع لمنظمة مصر أولاً.'
                      : 'Click Dial Now to open phone dialer with *9*240# directly.'}
                  </p>
                </div>

                {/* Option 2: Direct Wallet Transfer */}
                <div className="bg-white p-3.5 rounded-xl border border-red-200 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] font-bold text-gray-700 block">
                      {lang === 'ar' ? 'الطريقة 2: تحويل لمحفظة المنظمة مباشرة:' : 'Option 2: Direct Wallet Transfer:'}
                    </span>
                    <span className="font-mono font-bold text-gray-900 text-base">
                      {settings.phone2 || '01007267403'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(settings.phone2 || '01007267403', 'vf-wallet')}
                    className="inline-flex items-center gap-1.5 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold rounded-xl transition-colors"
                  >
                    {copiedKey === 'vf-wallet' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'vf-wallet' ? (lang === 'ar' ? 'تم النسخ' : 'Copied') : (lang === 'ar' ? 'نسخ الرقم' : 'Copy')}</span>
                  </button>
                </div>
              </div>
            )}

            {paymentMethod === 'instapay' && (
              <div className="bg-purple-50/70 border border-purple-200 rounded-2xl p-4.5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-purple-700 text-white flex items-center justify-center font-bold text-xs">
                      IPN
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-purple-950">
                        {lang === 'ar' ? 'التحويل الفوري عبر إنستاباي (InstaPay)' : 'Instant Transfer via InstaPay'}
                      </h4>
                      <p className="text-[11px] text-purple-800">
                        {lang === 'ar' ? 'تحويل لحظي بدون أي مصاريف إضافية' : 'Zero-fee instant bank-to-bank transfer'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Target 1: IPA Address */}
                <div className="bg-white p-3 rounded-xl border border-purple-200 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-gray-500 font-semibold block">
                      {lang === 'ar' ? 'عنوان الدفع اللحظي (IPA):' : 'InstaPay IPA Address:'}
                    </span>
                    <span className="font-mono font-bold text-purple-950 text-sm">
                      {settings.instaPayAddress || '01007267403@instapay'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(settings.instaPayAddress || '01007267403@instapay', 'ipa')}
                    className="px-3 py-1.5 bg-purple-100 hover:bg-purple-200 text-purple-900 text-xs font-bold rounded-lg transition-colors flex items-center gap-1"
                  >
                    {copiedKey === 'ipa' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'ipa' ? (lang === 'ar' ? 'تم النسخ' : 'Copied') : (lang === 'ar' ? 'نسخ IPA' : 'Copy')}</span>
                  </button>
                </div>

                {/* Target 2: Phone number for InstaPay */}
                <div className="bg-white p-3 rounded-xl border border-purple-200 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-gray-500 font-semibold block">
                      {lang === 'ar' ? 'أو تحويل برقم الهاتف المسجل:' : 'Or transfer via mobile number:'}
                    </span>
                    <span className="font-mono font-bold text-gray-900 text-sm">
                      {settings.phone2 || '01007267403'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(settings.phone2 || '01007267403', 'ipn-phone')}
                    className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold rounded-lg transition-colors flex items-center gap-1"
                  >
                    {copiedKey === 'ipn-phone' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'ipn-phone' ? (lang === 'ar' ? 'تم النسخ' : 'Copied') : (lang === 'ar' ? 'نسخ الرقم' : 'Copy')}</span>
                  </button>
                </div>

                {/* 3 Steps Guide */}
                <div className="text-[11px] text-gray-600 space-y-1 bg-white/60 p-2.5 rounded-lg border border-purple-100">
                  <div className="font-bold text-purple-950 mb-1">
                    {lang === 'ar' ? 'خطوات التحويل في تطبيق InstaPay:' : 'How to send on InstaPay app:'}
                  </div>
                  <div>1. {lang === 'ar' ? 'انسخ الـ IPA أو رقم الهاتف أعلاه.' : 'Copy IPA address or mobile number above.'}</div>
                  <div>2. {lang === 'ar' ? `افتح تطبيق InstaPay وأرسل مبلغ (${amount} ج.م).` : `Open InstaPay app and send (${amount} EGP).`}</div>
                  <div>3. {lang === 'ar' ? `اكتب رقم المرجع (${refNum}) في خانة الملاحظات.` : `Put reference (${refNum}) in notes.`}</div>
                </div>
              </div>
            )}

            {paymentMethod === 'bank_transfer' && (
              <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4.5 space-y-3">
                <div className="flex items-center gap-2">
                  <Building className="w-5 h-5 text-[#0A5C4B]" />
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">
                      {lang === 'ar' ? 'الحسابات البنكية الرسمية لمنظمة مصر أولاً' : 'Official Misr Awalan Bank Accounts'}
                    </h4>
                    <p className="text-[11px] text-gray-600">
                      {lang === 'ar' ? 'تحويل بنكي مباشر من أي بنك مصري أو تطبيق بنكي' : 'Direct bank wire from any Egyptian bank'}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  {settings.bankAccounts && settings.bankAccounts.length > 0 ? (
                    settings.bankAccounts.map((acc, i) => (
                      <div key={i} className="bg-white p-3 rounded-xl border border-gray-200 flex items-center justify-between">
                        <div>
                          <div className="font-bold text-xs text-gray-800">{acc.bankName}</div>
                          <div className="font-mono font-bold text-[#0A5C4B] text-sm mt-0.5">{acc.accountNumber}</div>
                          {acc.currency && <div className="text-[10px] text-gray-500">{acc.currency}</div>}
                        </div>
                        <button
                          type="button"
                          onClick={() => copyToClipboard(acc.accountNumber, `bank-${i}`)}
                          className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-[#0A5C4B] text-xs font-bold rounded-lg transition-colors flex items-center gap-1"
                        >
                          {copiedKey === `bank-${i}` ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedKey === `bank-${i}` ? (lang === 'ar' ? 'تم النسخ' : 'Copied') : (lang === 'ar' ? 'نسخ' : 'Copy')}</span>
                        </button>
                      </div>
                    ))
                  ) : (
                    <div className="bg-white p-3 rounded-xl border border-gray-200 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-xs text-gray-800">بنك مصر (Banque Misr)</div>
                        <div className="font-mono font-bold text-[#0A5C4B] text-sm mt-0.5">1400001000042729</div>
                      </div>
                      <button
                        type="button"
                        onClick={() => copyToClipboard('1400001000042729', 'bm-acc')}
                        className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-[#0A5C4B] text-xs font-bold rounded-lg transition-colors flex items-center gap-1"
                      >
                        {copiedKey === 'bm-acc' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copiedKey === 'bm-acc' ? (lang === 'ar' ? 'تم النسخ' : 'Copied') : (lang === 'ar' ? 'نسخ' : 'Copy')}</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {paymentMethod === 'representative' && (
              <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4.5 space-y-3">
                <div className="flex items-center gap-2">
                  <UserCheck className="w-5 h-5 text-amber-700" />
                  <div>
                    <h4 className="text-sm font-bold text-amber-950">
                      {lang === 'ar' ? 'مندوب تحصيل حتى باب بيتك أو عملك' : 'Doorstep Representative Collection'}
                    </h4>
                    <p className="text-[11px] text-amber-800">
                      {lang === 'ar' ? 'يصلك مندوب رسمي يحمل بطاقة معتمدة وإيصال ورقي مختوم' : 'An official agent with ID and stamped paper receipt will visit you'}
                    </p>
                  </div>
                </div>

                <div className="bg-white p-3.5 rounded-xl border border-amber-200 text-xs space-y-2">
                  <div className="flex justify-between items-center text-gray-700">
                    <span>{lang === 'ar' ? 'المبلغ للتسليم للمندوب:' : 'Amount for agent:'}</span>
                    <span className="font-bold text-[#0A5C4B] font-mono text-sm">{amount} {strings.egp}</span>
                  </div>
                  {donorAddress && (
                    <div className="text-gray-600 text-[11px] border-t border-gray-100 pt-1.5">
                      <span className="font-bold">{lang === 'ar' ? 'عنوان التسليم:' : 'Address:'} </span>
                      <span>{donorAddress}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 pt-1">
                    <a
                      href={`tel:${settings.phone1 || '01118150007'}`}
                      className="flex-1 py-2 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-xl font-bold text-center transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>{lang === 'ar' ? 'اتصال بالمندوب' : 'Call Agent'}</span>
                    </a>
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'fawry' && (
              <div className="bg-blue-50/70 border border-blue-200 rounded-2xl p-4.5 space-y-3">
                <div className="flex items-center gap-2">
                  <Building className="w-5 h-5 text-blue-700" />
                  <div>
                    <h4 className="text-sm font-bold text-blue-950">
                      {lang === 'ar' ? 'سداد التبرع عبر شبكة فوري (Fawry)' : 'Pay via Fawry Retail Network'}
                    </h4>
                    <p className="text-[11px] text-blue-800">
                      {lang === 'ar' ? 'في أي كشك أو متجر به ماكينة فوري أو عبر تطبيق myFawry' : 'At any Fawry POS terminal or myFawry app'}
                    </p>
                  </div>
                </div>
                <div className="bg-white p-3.5 rounded-xl border border-blue-200 flex items-center justify-between">
                  <div>
                    <span className="text-[11px] text-gray-500 font-semibold block">
                      {lang === 'ar' ? 'كود خدمة منظمة مصر أولاً:' : 'Misr Awalan Service Code:'}
                    </span>
                    <span className="font-mono font-bold text-blue-900 text-xl tracking-wider">
                      {settings.opPayCode || '230976'}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(settings.opPayCode || '230976', 'fawry-code')}
                    className="px-3 py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-900 text-xs font-bold rounded-lg transition-colors flex items-center gap-1"
                  >
                    {copiedKey === 'fawry-code' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedKey === 'fawry-code' ? (lang === 'ar' ? 'تم النسخ' : 'Copied') : (lang === 'ar' ? 'نسخ الكود' : 'Copy')}</span>
                  </button>
                </div>
              </div>
            )}

            {/* REAL-WORLD CONFIRMATION ACTION BUTTONS */}
            <div className="space-y-2.5 pt-2">
              
              {/* WhatsApp One-Click Direct Transfer Confirmation */}
              <button
                type="button"
                onClick={handleOpenWhatsAppConfirmation}
                className="w-full py-3.5 rounded-xl bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold text-sm shadow-md transition-all duration-200 flex items-center justify-center gap-2 hover:scale-[1.01]"
              >
                <MessageCircle className="w-5 h-5 fill-current" />
                <span>
                  {lang === 'ar'
                    ? '📲 إرسال إشعار / صورة التحويل عبر واتساب'
                    : '📲 Send Transfer Proof via WhatsApp'}
                </span>
                <ExternalLink className="w-3.5 h-3.5 opacity-80" />
              </button>

              {/* View Official Receipt */}
              <button
                type="button"
                onClick={handleViewReceipt}
                className="w-full py-3 rounded-xl bg-[#0A5C4B] hover:bg-[#074336] text-white font-bold text-xs shadow-xs transition-colors flex items-center justify-center gap-2"
              >
                <Receipt className="w-4 h-4" />
                <span>
                  {lang === 'ar' ? 'عرض الإيصال المعتمد للطباعة والحفظ' : 'View Verified Receipt & Print'}
                </span>
              </button>

              {/* Back to Edit Button */}
              <button
                type="button"
                onClick={() => setStep('select')}
                className="w-full py-2 text-xs text-gray-500 hover:text-gray-800 font-semibold text-center transition-colors"
              >
                {lang === 'ar' ? '← تعديل المبلغ أو وسيلة التحويل' : '← Edit amount or method'}
              </button>
            </div>

            {/* Trust Footer */}
            <div className="text-[11px] text-gray-500 text-center flex items-center justify-center gap-1.5 pt-1 border-t border-gray-100">
              <ShieldCheck className="w-3.5 h-3.5 text-[#C9A227]" />
              <span>
                {lang === 'ar'
                  ? 'يتم فحص وتأكيد كافة التحويلات آلياً وإرسال رسالة الشكر والتوثيق'
                  : 'All transfers verified automatically with documentation sent'}
              </span>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
