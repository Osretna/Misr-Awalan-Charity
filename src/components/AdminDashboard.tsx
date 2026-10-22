import React, { useState, useEffect } from 'react';
import { useContactSettings } from '../context/ContactContext';
import {
  buildTelUrl,
  buildWhatsAppUrl,
  toInternationalWhatsAppNumber,
  cleanPhoneNumber,
} from '../utils/phoneUtils';
import confetti from 'canvas-confetti';
import {
  Save,
  RotateCcw,
  Phone,
  MessageSquare,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  History,
  ShieldCheck,
  Sparkles,
  Zap,
  Plus,
  Trash2,
  Clock,
  Send,
  Eye,
  Radio,
} from 'lucide-react';

interface Props {
  onPreviewClick?: () => void;
}

export const AdminDashboard: React.FC<Props> = ({ onPreviewClick }) => {
  const {
    settings,
    updateSettings,
    resetToDefault,
    history,
    rollbackToHistory,
    syncStatus,
    lastSavedAt,
  } = useContactSettings();

  // Local form state initialized from persistent settings
  const [formData, setFormData] = useState({
    primaryPhone: settings.primaryPhone,
    primaryPhoneLabel: settings.primaryPhoneLabel,
    secondaryPhone: settings.secondaryPhone,
    secondaryPhoneLabel: settings.secondaryPhoneLabel,
    whatsappNumber: settings.whatsappNumber,
    whatsappMessage: settings.whatsappMessage,
    sectionTitle: settings.sectionTitle,
    workingHours: settings.workingHours,
    isAvailableNow: settings.isAvailableNow,
  });

  const [additionalPhones, setAdditionalPhones] = useState(
    settings.additionalPhones || []
  );

  const [saveSuccess, setSaveSuccess] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'main' | 'history' | 'test'>('main');

  // Keep form in sync if settings update from external broadcast
  useEffect(() => {
    setFormData({
      primaryPhone: settings.primaryPhone,
      primaryPhoneLabel: settings.primaryPhoneLabel,
      secondaryPhone: settings.secondaryPhone,
      secondaryPhoneLabel: settings.secondaryPhoneLabel,
      whatsappNumber: settings.whatsappNumber,
      whatsappMessage: settings.whatsappMessage,
      sectionTitle: settings.sectionTitle,
      workingHours: settings.workingHours,
      isAvailableNow: settings.isAvailableNow,
    });
    setAdditionalPhones(settings.additionalPhones || []);
  }, [settings]);

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setValidationError(null);
  };

  const handleAddExtraPhone = () => {
    setAdditionalPhones((prev) => [
      ...prev,
      {
        id: `phone_${Date.now()}`,
        number: '',
        label: 'رقم هاتف إضافي',
        active: true,
      },
    ]);
  };

  const handleUpdateExtraPhone = (id: string, field: 'number' | 'label', value: string) => {
    setAdditionalPhones((prev) =>
      prev.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );
  };

  const handleRemoveExtraPhone = (id: string) => {
    setAdditionalPhones((prev) => prev.filter((p) => p.id !== id));
  };

  const handleSaveAndApply = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.primaryPhone.trim()) {
      setValidationError('يرجى إدخال رقم الهاتف الرسمي الأساسي.');
      return;
    }
    if (!formData.whatsappNumber.trim()) {
      setValidationError('يرجى إدخال رقم الواتساب المباشر.');
      return;
    }

    // Cleaned payload
    const cleanedPayload = {
      primaryPhone: cleanPhoneNumber(formData.primaryPhone),
      primaryPhoneLabel: formData.primaryPhoneLabel,
      secondaryPhone: cleanPhoneNumber(formData.secondaryPhone),
      secondaryPhoneLabel: formData.secondaryPhoneLabel,
      whatsappNumber: cleanPhoneNumber(formData.whatsappNumber),
      whatsappMessage: formData.whatsappMessage,
      sectionTitle: formData.sectionTitle,
      workingHours: formData.workingHours,
      isAvailableNow: formData.isAvailableNow,
      additionalPhones: additionalPhones.map((p) => ({
        ...p,
        number: cleanPhoneNumber(p.number),
      })),
    };

    // Update settings in state, localStorage, and BroadcastChannel
    updateSettings(cleanedPayload);

    // Launch celebratory confetti
    try {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#25D366', '#10b981', '#f3ba2f'],
      });
    } catch (err) {
      // ignore
    }

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 5000);
  };

  const handleReset = () => {
    if (confirm('هل أنت متأكد من رغبتك في استعادة الأرقام الافتراضية الأولية؟')) {
      resetToDefault();
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Top Banner & Status */}
      <div className="bg-[#04241a] border border-[#0e4e3a] rounded-2xl p-5 shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-emerald-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-white">
                لوحة تحكم أرقام الاتصال والواتساب
              </h1>
              <span className="bg-emerald-500/20 text-emerald-400 text-xs px-2.5 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1 font-semibold">
                <Radio className="w-3 h-3 animate-pulse text-emerald-400" />
                ربط فوري 100%
              </span>
            </div>
            <p className="text-sm text-emerald-300/80 mt-0.5">
              أي تعديل تقوم بحفظه هنا يتم تطبيقه فورياً على الموقع وعلى روابط الاتصال ومحادثات الواتساب دون تأخير.
            </p>
          </div>
        </div>

        {/* Action quick links */}
        <div className="flex items-center gap-2">
          {onPreviewClick && (
            <button
              onClick={onPreviewClick}
              className="flex items-center gap-2 bg-[#063325] hover:bg-[#0a4432] text-emerald-300 border border-emerald-700/60 px-4 py-2 rounded-xl text-sm font-bold transition-all shadow-md"
            >
              <Eye className="w-4 h-4 text-emerald-400" />
              <span>معاينة واجهة العميل</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs navigation */}
      <div className="flex items-center gap-2 border-b border-emerald-900/60 pb-2">
        <button
          onClick={() => setActiveTab('main')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
            activeTab === 'main'
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
              : 'text-emerald-300/80 hover:text-white hover:bg-emerald-950/40'
          }`}
        >
          <Phone className="w-4 h-4" />
          <span>تعديل الأرقام والبيانات</span>
        </button>

        <button
          onClick={() => setActiveTab('test')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
            activeTab === 'test'
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
              : 'text-emerald-300/80 hover:text-white hover:bg-emerald-950/40'
          }`}
        >
          <ExternalLink className="w-4 h-4" />
          <span>اختبار الروابط والاتصال المباشر</span>
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
            activeTab === 'history'
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
              : 'text-emerald-300/80 hover:text-white hover:bg-emerald-950/40'
          }`}
        >
          <History className="w-4 h-4" />
          <span>سجل التعديلات السابقة ({history.length})</span>
        </button>
      </div>

      {/* Success Notification Alert */}
      {saveSuccess && (
        <div className="bg-emerald-950/90 border border-emerald-500 text-emerald-100 p-4 rounded-2xl flex items-start gap-3 shadow-xl animate-fade-in">
          <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-bold text-base text-emerald-300">
              تم حفظ الأرقام وتطبيقها فورياً بنجاح!
            </h4>
            <p className="text-sm text-emerald-200/90 mt-1">
              تم تحديث الأرقام في الواجهة وفي روابط الاتصال ومحادثات الواتساب.
              الرقم المطبق حالياً: <strong className="text-white font-mono">{formData.primaryPhone}</strong> (اتصال) و <strong className="text-white font-mono">{formData.whatsappNumber}</strong> (واتساب).
            </p>
          </div>
        </div>
      )}

      {/* Error alert */}
      {validationError && (
        <div className="bg-red-950/80 border border-red-500/80 text-red-200 p-4 rounded-2xl flex items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
          <span className="text-sm font-bold">{validationError}</span>
        </div>
      )}

      {/* TAB 1: MAIN FORM */}
      {activeTab === 'main' && (
        <form onSubmit={handleSaveAndApply} className="space-y-6">
          {/* Card: Phone numbers */}
          <div className="bg-[#031f17] border border-[#0d4735] rounded-3xl p-6 shadow-xl space-y-5">
            <div className="flex items-center justify-between border-b border-[#0f4f3a] pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
                  <Phone className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white">
                    أرقام الهواتف الرسمية (الاتصال الهاتفي)
                  </h3>
                  <p className="text-xs text-emerald-400/80">
                    هذه الأرقام تظهر للعميل في صندوق "أرقام الهواتف الرسمية" وتبدأ الاتصال فور نقرها.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Primary Phone */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-emerald-200">
                  رقم الهاتف الرسمي الأول (الأساسي) <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.primaryPhone}
                    onChange={(e) => handleInputChange('primaryPhone', e.target.value)}
                    placeholder="مثال: 01007267403"
                    className="w-full bg-[#05291f] border border-[#115a43] focus:border-amber-400 focus:ring-1 focus:ring-amber-400 rounded-xl px-4 py-3 text-white font-mono text-lg tracking-wider placeholder-emerald-700 outline-none transition-all"
                    dir="ltr"
                    required
                  />
                  <span className="absolute left-3 top-3.5 text-xs text-amber-400/80 font-mono">
                    TEL
                  </span>
                </div>
                <p className="text-xs text-emerald-400/60">
                  الرقم الذي يظهر في السطر الأول عند العميل (الحالي: {settings.primaryPhone})
                </p>
              </div>

              {/* Secondary Phone */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-emerald-200">
                  رقم الهاتف الرسمي الثاني
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.secondaryPhone}
                    onChange={(e) => handleInputChange('secondaryPhone', e.target.value)}
                    placeholder="مثال: 01118150007"
                    className="w-full bg-[#05291f] border border-[#115a43] focus:border-amber-400 focus:ring-1 focus:ring-amber-400 rounded-xl px-4 py-3 text-white font-mono text-lg tracking-wider placeholder-emerald-700 outline-none transition-all"
                    dir="ltr"
                  />
                  <span className="absolute left-3 top-3.5 text-xs text-amber-400/80 font-mono">
                    TEL 2
                  </span>
                </div>
                <p className="text-xs text-emerald-400/60">
                  الرقم الذي يظهر في السطر الثاني (الحالي: {settings.secondaryPhone})
                </p>
              </div>
            </div>

            {/* Additional phone numbers dynamic list */}
            {additionalPhones.length > 0 && (
              <div className="pt-3 border-t border-emerald-900/50 space-y-3">
                <h4 className="text-xs font-bold text-emerald-300">
                  أرقام هواتف إضافية مفعلة:
                </h4>
                {additionalPhones.map((phone) => (
                  <div
                    key={phone.id}
                    className="flex items-center gap-3 bg-[#052b20] p-3 rounded-xl border border-emerald-800/50"
                  >
                    <input
                      type="text"
                      value={phone.number}
                      onChange={(e) =>
                        handleUpdateExtraPhone(phone.id, 'number', e.target.value)
                      }
                      placeholder="رقم الهاتف"
                      className="flex-1 bg-[#031d16] border border-emerald-700/60 rounded-lg px-3 py-2 text-white font-mono text-base outline-none"
                      dir="ltr"
                    />
                    <input
                      type="text"
                      value={phone.label}
                      onChange={(e) =>
                        handleUpdateExtraPhone(phone.id, 'label', e.target.value)
                      }
                      placeholder="وصف (مثال: الخط الساخن)"
                      className="w-48 bg-[#031d16] border border-emerald-700/60 rounded-lg px-3 py-2 text-white text-sm outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveExtraPhone(phone.id)}
                      className="p-2 text-red-400 hover:text-red-300 hover:bg-red-950/50 rounded-lg transition-colors"
                      title="حذف الرقم"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <button
              type="button"
              onClick={handleAddExtraPhone}
              className="inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 font-bold bg-[#063325] hover:bg-[#0a4734] px-3 py-1.5 rounded-lg border border-emerald-700/50 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>إضافة رقم هاتف إضافي</span>
            </button>
          </div>

          {/* Card: WhatsApp Section */}
          <div className="bg-[#031f17] border border-[#0d4735] rounded-3xl p-6 shadow-xl space-y-5">
            <div className="flex items-center justify-between border-b border-[#0f4f3a] pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#25D366]/10 border border-[#25D366]/30 flex items-center justify-center">
                  <MessageSquare className="w-4 h-4 text-[#25D366]" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-white">
                    رقم الواتساب المباشر (WhatsApp Direct)
                  </h3>
                  <p className="text-xs text-emerald-400/80">
                    الرقم المستخدم في صندوق "واتساب مباشر" وعند النقر عليه يفتح المحادثة الفورية مباشرة.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* WhatsApp Phone */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-emerald-200">
                  رقم الواتساب المعتمد <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.whatsappNumber}
                    onChange={(e) => handleInputChange('whatsappNumber', e.target.value)}
                    placeholder="مثال: 01118150007"
                    className="w-full bg-[#05291f] border border-[#115a43] focus:border-[#25D366] focus:ring-1 focus:ring-[#25D366] rounded-xl px-4 py-3 text-white font-mono text-lg tracking-wider placeholder-emerald-700 outline-none transition-all"
                    dir="ltr"
                    required
                  />
                  <span className="absolute left-3 top-3.5 text-xs text-[#25D366] font-mono">
                    WHATSAPP
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-emerald-400/70">
                  <span>الصيغة الدولية التلقائية:</span>
                  <span className="font-mono text-[#25D366]" dir="ltr">
                    +{toInternationalWhatsAppNumber(formData.whatsappNumber)}
                  </span>
                </div>
              </div>

              {/* Default Welcome message */}
              <div className="space-y-2">
                <label className="block text-sm font-bold text-emerald-200">
                  رسالة الترحيب المسبقة في واتساب
                </label>
                <input
                  type="text"
                  value={formData.whatsappMessage}
                  onChange={(e) => handleInputChange('whatsappMessage', e.target.value)}
                  placeholder="السلام عليكم، أود الاستفسار والتواصل معكم."
                  className="w-full bg-[#05291f] border border-[#115a43] focus:border-[#25D366] rounded-xl px-4 py-3 text-white text-sm outline-none"
                />
                <p className="text-xs text-emerald-400/60">
                  تظهر تلقائياً مكتوبة في خانة الدردشة عند فتح العميل للرابط لتسهيل التواصل.
                </p>
              </div>
            </div>
          </div>

          {/* Card: Section Title and Business Hours */}
          <div className="bg-[#031f17] border border-[#0d4735] rounded-3xl p-6 shadow-xl space-y-4">
            <h3 className="font-bold text-base text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-400" />
              <span>إعدادات العرض ومواعيد العمل</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="block text-sm font-bold text-emerald-200">
                  عنوان قسم التواصل
                </label>
                <input
                  type="text"
                  value={formData.sectionTitle}
                  onChange={(e) => handleInputChange('sectionTitle', e.target.value)}
                  placeholder="التواصل المباشر"
                  className="w-full bg-[#05291f] border border-[#115a43] rounded-xl px-4 py-2.5 text-white text-sm outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-bold text-emerald-200">
                  مواعيد وساعات الرد
                </label>
                <input
                  type="text"
                  value={formData.workingHours}
                  onChange={(e) => handleInputChange('workingHours', e.target.value)}
                  placeholder="يومياً على مدار الساعة لخدمتكم"
                  className="w-full bg-[#05291f] border border-[#115a43] rounded-xl px-4 py-2.5 text-white text-sm outline-none"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons: Save & Reset */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-emerald-900/50">
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-2 text-xs text-emerald-400 hover:text-emerald-200 bg-[#05281e] hover:bg-[#073628] border border-emerald-800/80 px-4 py-2.5 rounded-xl transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              <span>استعادة الأرقام الافتراضية الأولى (01007267403 / 0118150007)</span>
            </button>

            <button
              type="submit"
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-white font-extrabold px-8 py-3.5 rounded-2xl shadow-xl shadow-emerald-600/30 text-base transition-all active:scale-95"
            >
              <Save className="w-5 h-5" />
              <span>حفظ وتطبيق الأرقام الجديدة فوراً 🚀</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB 2: INSTANT TEST & VERIFICATION */}
      {activeTab === 'test' && (
        <div className="bg-[#031f17] border border-[#0d4735] rounded-3xl p-6 shadow-xl space-y-6">
          <div className="border-b border-[#0f4f3a] pb-4">
            <h3 className="font-bold text-lg text-white flex items-center gap-2">
              <ExternalLink className="w-5 h-5 text-emerald-400" />
              <span>فحص واختبار الروابط التنفيذية المباشرة</span>
            </h3>
            <p className="text-sm text-emerald-300/80 mt-1">
              هذه الروابط مبنية ديناميكياً 100% من الأرقام المسجلة في اللوحة. جرب الضغط على أي زر لتتأكد من فتح الرقم الصحيح.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Test Call 1 */}
            <div className="bg-[#052b20] border border-emerald-800/60 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-300">
                  اتصال هاتفي مباشر (الرقم 1)
                </span>
                <span className="font-mono text-xs text-white bg-emerald-950 px-2 py-0.5 rounded">
                  {settings.primaryPhone}
                </span>
              </div>
              <div className="text-xs text-emerald-400/80 font-mono break-all bg-[#021811] p-2 rounded-lg">
                {buildTelUrl(settings.primaryPhone)}
              </div>
              <a
                href={buildTelUrl(settings.primaryPhone)}
                className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-[#041a13] font-bold py-2 px-3 rounded-xl text-sm transition-all shadow"
              >
                <Phone className="w-4 h-4" />
                <span>جرّب الاتصال بالرقم الأول الآن</span>
              </a>
            </div>

            {/* Test Call 2 */}
            <div className="bg-[#052b20] border border-emerald-800/60 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-300">
                  اتصال هاتفي مباشر (الرقم 2)
                </span>
                <span className="font-mono text-xs text-white bg-emerald-950 px-2 py-0.5 rounded">
                  {settings.secondaryPhone}
                </span>
              </div>
              <div className="text-xs text-emerald-400/80 font-mono break-all bg-[#021811] p-2 rounded-lg">
                {buildTelUrl(settings.secondaryPhone)}
              </div>
              <a
                href={buildTelUrl(settings.secondaryPhone)}
                className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-[#041a13] font-bold py-2 px-3 rounded-xl text-sm transition-all shadow"
              >
                <Phone className="w-4 h-4" />
                <span>جرّب الاتصال بالرقم الثاني الآن</span>
              </a>
            </div>

            {/* Test WhatsApp */}
            <div className="md:col-span-2 bg-[#052b20] border border-[#25D366]/40 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#25D366]">
                  رابط فتح محادثة واتساب مباشر
                </span>
                <span className="font-mono text-xs text-white bg-emerald-950 px-2 py-0.5 rounded">
                  {settings.whatsappNumber}
                </span>
              </div>
              <div className="text-xs text-emerald-400/80 font-mono break-all bg-[#021811] p-2 rounded-lg">
                {buildWhatsAppUrl(settings.whatsappNumber, settings.whatsappMessage)}
              </div>
              <a
                href={buildWhatsAppUrl(settings.whatsappNumber, settings.whatsappMessage)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold py-2.5 px-4 rounded-xl text-sm transition-all shadow-lg shadow-[#25D366]/20"
              >
                <MessageSquare className="w-4 h-4" />
                <span>جرّب فتح محادثة واتساب بالرقم الجديد في تبويب جديد</span>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: HISTORY & AUDIT LOG */}
      {activeTab === 'history' && (
        <div className="bg-[#031f17] border border-[#0d4735] rounded-3xl p-6 shadow-xl space-y-4">
          <div className="border-b border-[#0f4f3a] pb-4 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-lg text-white flex items-center gap-2">
                <History className="w-5 h-5 text-emerald-400" />
                <span>سجل أرقام الاتصال المحفوظة</span>
              </h3>
              <p className="text-xs text-emerald-300/80 mt-1">
                يمكنك في أي لحظة استعادة أي رقم تم حفظه مسبقاً بنقرة زر واحدة.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {history.map((item, index) => (
              <div
                key={item.id}
                className="bg-[#052b20] border border-emerald-800/50 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-emerald-300">
                      تعديل #{history.length - index}
                    </span>
                    <span className="text-[11px] text-emerald-400/60">
                      {new Date(item.timestamp).toLocaleString('ar-EG')}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-xs font-mono pt-1">
                    <span className="text-amber-300">هاتف 1: {item.primaryPhone}</span>
                    <span className="text-amber-300/80">هاتف 2: {item.secondaryPhone}</span>
                    <span className="text-[#25D366]">واتساب: {item.whatsappNumber}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    rollbackToHistory(item);
                    setSaveSuccess(true);
                    setTimeout(() => setSaveSuccess(false), 4000);
                  }}
                  className="text-xs bg-[#063b2c] hover:bg-emerald-600 text-white font-bold px-3 py-1.5 rounded-lg border border-emerald-700/60 transition-colors flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>استعادة هذه الأرقام</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
