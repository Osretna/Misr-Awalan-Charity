import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { t } from '../utils/translations';
import { 
  HeartHandshake, 
  Send, 
  CheckCircle2, 
  Users, 
  Sparkles, 
  ShieldCheck, 
  Clock, 
  MapPin, 
  GraduationCap 
} from 'lucide-react';

export const VolunteerPage: React.FC = () => {
  const { lang, registerVolunteer } = useApp();
  const strings = t[lang];

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [skills, setSkills] = useState('');
  const [availability, setAvailability] = useState('weekends');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone || !city) return;

    setLoading(true);
    try {
      await registerVolunteer({
        fullName,
        phone,
        email,
        city,
        skills,
        availability,
        notes,
      });
      setSuccess(true);
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
          {lang === 'ar' ? 'سواعد الخير' : 'Field Volunteers'}
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-[#0A5C4B] font-cairo">
          {strings.volunteerTitle}
        </h1>
        <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
          {strings.volunteerSubtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Form (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-10 border border-gray-200/80 shadow-md">
          {success ? (
            <div className="text-center py-12 space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 text-[#0A5C4B] flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 font-cairo">
                {lang === 'ar' ? 'تم استلام طلب تطوعك بنجاح!' : 'Application Submitted!'}
              </h3>
              <p className="text-sm text-gray-600 max-w-md mx-auto leading-relaxed">
                {strings.volunteerSuccess}
              </p>
              <button
                onClick={() => {
                  setSuccess(false);
                  setFullName('');
                  setPhone('');
                  setEmail('');
                  setCity('');
                  setSkills('');
                  setNotes('');
                }}
                className="mt-4 px-6 py-2.5 rounded-xl bg-[#0A5C4B] text-white text-xs font-bold"
              >
                {lang === 'ar' ? 'تسجيل متطوع آخر' : 'Register Another'}
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    {lang === 'ar' ? 'الاسم الثلاثي بالكامل *' : 'Full Name *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-900 focus:outline-hidden focus:border-[#0A5C4B]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    {lang === 'ar' ? 'رقم الهاتف (واتساب) *' : 'Phone / WhatsApp *'}
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="01xxxxxxxxx"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-900 focus:outline-hidden focus:border-[#0A5C4B]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    {lang === 'ar' ? 'البريد الإلكتروني' : 'Email Address'}
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-900 focus:outline-hidden focus:border-[#0A5C4B]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">
                    {lang === 'ar' ? 'المحافظة / المدينة *' : 'City / Governorate *'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={lang === 'ar' ? 'مثال: سوهاج، القاهرة، الإسكندرية...' : 'e.g. Sohag, Cairo...'}
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-900 focus:outline-hidden focus:border-[#0A5C4B]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  {lang === 'ar' ? 'المجال أو المهارة التي تود التطوع بها' : 'Your Skills / Preferred Area'}
                </label>
                <input
                  type="text"
                  placeholder={lang === 'ar' ? 'مثال: قوافل طبية، تعبئة وتوزيع كراتين، تصوير وتوثيق، تدريس للأيتام...' : 'e.g. Medical, Logistics, Media, Teaching...'}
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-900 focus:outline-hidden focus:border-[#0A5C4B]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  {lang === 'ar' ? 'أوقات التفرغ المتاحة' : 'Availability'}
                </label>
                <select
                  value={availability}
                  onChange={(e) => setAvailability(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-900 focus:outline-hidden focus:border-[#0A5C4B]"
                >
                  <option value="weekends">{lang === 'ar' ? 'عطلات نهاية الأسبوع (الجمعة والسبت)' : 'Weekends (Fri/Sat)'}</option>
                  <option value="weekdays">{lang === 'ar' ? 'أيام وسط الأسبوع' : 'Weekdays'}</option>
                  <option value="seasonal">{lang === 'ar' ? 'في الحملات والمواسم الكبرى فقط (رمضان، الأعياد)' : 'Major drives only (Ramadan, Eid)'}</option>
                  <option value="flexible">{lang === 'ar' ? 'مرن ومستعد للنداءات العاجلة' : 'Flexible / Emergency calls'}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">
                  {lang === 'ar' ? 'ملاحظات أو خبرات سابقة' : 'Previous Experience / Notes'}
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={lang === 'ar' ? 'أي تجارب تطوعية سابقة أو تفاصيل تود مشاركتها معنا...' : 'Any previous voluntary work or details...'}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-900 focus:outline-hidden focus:border-[#0A5C4B]"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-2xl bg-[#0A5C4B] hover:bg-[#073229] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 font-cairo"
              >
                {loading ? (
                  <span>{lang === 'ar' ? 'جاري الإرسال...' : 'Submitting...'}</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>{strings.applyVolunteer}</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* Right Info (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-gradient-to-br from-[#0A5C4B] to-[#073229] text-white rounded-3xl p-6 sm:p-8 shadow-xl space-y-4">
            <h3 className="text-xl font-bold text-[#E0BA3E] font-cairo">
              {lang === 'ar' ? 'لماذا تتطوع مع مصر أولاً؟' : 'Why Volunteer With Us?'}
            </h3>
            <div className="space-y-3 text-xs text-emerald-100 leading-relaxed font-normal">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#C9A227] shrink-0 mt-0.5" />
                <span>{lang === 'ar' ? 'أثر مباشر ترى نتيجته في وجوه الأهالي والأطفال في القرى' : 'Direct tangible impact in the field'}</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#C9A227] shrink-0 mt-0.5" />
                <span>{lang === 'ar' ? 'شهادات تطوع رسمية معتمدة من المنظمة بعد إتمام الساعات' : 'Certified volunteer certificates upon completion'}</span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-[#C9A227] shrink-0 mt-0.5" />
                <span>{lang === 'ar' ? 'بيئة عمل إنسانية تسودها الأخوة والتعاون والشفافية' : 'A respectful, mission-driven team spirit'}</span>
              </div>
            </div>
          </div>

          <div className="bg-[#F8F5F0] rounded-3xl p-6 border border-gray-200 space-y-3">
            <h4 className="font-bold text-sm text-gray-900 font-cairo">
              {lang === 'ar' ? 'قطاعات التطوع النشطة' : 'Active Volunteer Sectors'}
            </h4>
            <div className="flex flex-wrap gap-2 text-xs text-gray-700">
              <span className="bg-white px-3 py-1.5 rounded-lg border border-gray-200">الإطعام والوجبات</span>
              <span className="bg-white px-3 py-1.5 rounded-lg border border-gray-200">القوافل الطبية</span>
              <span className="bg-white px-3 py-1.5 rounded-lg border border-gray-200">أبحاث الحالة الميدانية</span>
              <span className="bg-white px-3 py-1.5 rounded-lg border border-gray-200">التصوير والتوثيق</span>
              <span className="bg-white px-3 py-1.5 rounded-lg border border-gray-200">تعليم ورعاية الأيتام</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
