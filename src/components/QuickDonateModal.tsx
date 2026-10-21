import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { t } from '../utils/translations';
import { PaymentMethod } from '../types';
import confetti from 'canvas-confetti';
import { 
  X, 
  Heart, 
  Sparkles, 
  Check, 
  ShieldCheck,
  CreditCard,
  Smartphone,
  QrCode,
  Building
} from 'lucide-react';

export const QuickDonateModal: React.FC = () => {
  const { 
    quickDonateModalOpen, 
    setQuickDonateModalOpen, 
    projects, 
    addDonation, 
    lang 
  } = useApp();
  const strings = t[lang];

  const [amount, setAmount] = useState<number>(500);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [frequency, setFrequency] = useState<'one-time' | 'monthly'>('one-time');
  const [campaignId, setCampaignId] = useState<string>('general');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('instapay');
  const [donorName, setDonorName] = useState<string>('');
  const [donorPhone, setDonorPhone] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0) return;

    setLoading(true);
    try {
      const selectedProject = projects.find(p => p.id === campaignId);
      const campaignTitle = selectedProject ? selectedProject.title : (lang === 'ar' ? 'صدقة عامة وتفريج كرب' : 'General Relief');

      await addDonation({
        donorName: donorName.trim() || (lang === 'ar' ? 'فاعل خير' : 'Anonymous Donor'),
        donorPhone: donorPhone.trim(),
        amount,
        currency: 'EGP',
        campaignId,
        campaignTitle,
        type: frequency,
        paymentMethod,
        status: 'completed',
        isPublic: true,
      });

      // Fire celebratory confetti!
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // ignore
      }

      setQuickDonateModalOpen(false);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto">
      <div 
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200 my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#0A5C4B] to-[#117863] text-white p-6 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-white/10 rounded-xl">
                <Sparkles className="w-5 h-5 text-[#E0BA3E]" />
              </div>
              <div>
                <h3 className="font-bold text-lg font-cairo">
                  {lang === 'ar' ? 'تبرع سريع وموثوق' : 'Quick Secure Donation'}
                </h3>
                <p className="text-xs text-white/80">
                  {lang === 'ar' ? 'خطوة واحدة تصنع فارقاً حقيقياً في حياة أسرة' : 'One step brings hope and relief'}
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

          {/* Frequency Toggle */}
          <div className="mt-5 grid grid-cols-2 bg-black/20 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setFrequency('one-time')}
              className={`py-2 text-xs font-bold rounded-lg transition-all ${
                frequency === 'one-time'
                  ? 'bg-white text-[#0A5C4B] shadow-xs'
                  : 'text-white/80 hover:text-white'
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
                  : 'text-white/80 hover:text-white'
              }`}
            >
              {strings.monthly} ({lang === 'ar' ? 'صدقة جارية' : 'Continuous'})
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          
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
              {lang === 'ar' ? 'المصرف أو المبادرة' : 'Initiative / Campaign'}
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
              {lang === 'ar' ? 'طريقة الدفع' : 'Payment Method'}
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'instapay', label: 'InstaPay', icon: QrCode, badge: 'لحظي' },
                { id: 'vodafone_cash', label: 'محافظ إلكترونية', icon: Smartphone, badge: 'كاش' },
                { id: 'fawry', label: 'فوري (Fawry)', icon: Building, badge: 'كود' },
                { id: 'card', label: 'بطاقة بنكية', icon: CreditCard, badge: 'فيزا' },
              ].map((m) => {
                const Icon = m.icon;
                const isSelected = paymentMethod === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setPaymentMethod(m.id as PaymentMethod)}
                    className={`p-2.5 rounded-xl border text-center transition-all flex flex-col items-center gap-1 relative ${
                      isSelected
                        ? 'border-[#0A5C4B] bg-[#0A5C4B]/5 text-[#0A5C4B] font-bold'
                        : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-5 h-5 text-gray-700" />
                    <span className="text-[11px] leading-tight">{m.label}</span>
                    {isSelected && (
                      <span className="absolute top-1 end-1 w-2 h-2 rounded-full bg-[#0A5C4B]"></span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Optional Donor Name & Phone */}
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

          {/* Submit Button */}
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
                  {strings.confirmDonation} ({amount} {strings.egp})
                </span>
              </>
            )}
          </button>

          {/* Security Seal */}
          <div className="flex items-center justify-center gap-2 text-[11px] text-gray-500 pt-1">
            <ShieldCheck className="w-3.5 h-3.5 text-[#C9A227]" />
            <span>
              {lang === 'ar' ? 'معاملة آمنة وموثقة 100% بإشراف رسمي' : '100% Secure & Officially Verified Transaction'}
            </span>
          </div>

        </form>
      </div>
    </div>
  );
};
