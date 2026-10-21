import React from 'react';
import { useApp } from '../context/AppContext';
import { t } from '../utils/translations';
import { Logo } from '../components/Logo';
import { 
  ShieldCheck, 
  Target, 
  Compass, 
  FileText, 
  Download, 
  Building, 
  HeartHandshake,
  History,
  Users,
  MapPin,
  Phone
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { lang, settings } = useApp();
  const strings = t[lang];

  const annualReports = [
    { year: '2025', title: lang === 'ar' ? 'التقرير السنوي الشامل للإنجازات والتدقيق المالي 2025' : 'Comprehensive Annual Report 2025', size: '4.8 MB' },
    { year: '2024', title: lang === 'ar' ? 'تقرير قوافل الإغاثة وسقيا الماء والمشروعات المستدامة 2024' : 'Field Relief & Water Networks Report 2024', size: '3.9 MB' },
    { year: '2023', title: lang === 'ar' ? 'تقرير الحوكمة والامتثال القانوني وكفالات الأيتام 2023' : 'Governance & Orphan Care Audit 2023', size: '3.2 MB' },
  ];

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
      
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-[#0A5C4B] bg-[#0A5C4B]/10 px-3.5 py-1 rounded-full">
          {settings.licenseNumber}
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-[#0A5C4B] font-cairo">
          {strings.about}
        </h1>
        <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
          {settings.sloganAr || 'تنميه - رعاية - حقوق | من أجل مستقبل أفضل'}
        </p>
      </div>

      {/* Brief Overview Section */}
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-gray-200/80 shadow-md">
        <div className="flex flex-col lg:flex-row items-center gap-8">
          <div className="w-40 h-40 sm:w-52 sm:h-52 shrink-0 bg-white p-2 rounded-full shadow-lg border-4 border-[#C9A227]/40 flex items-center justify-center">
            <img
              src={settings.logoUrl}
              alt={settings.orgNameAr}
              className="w-full h-full object-contain rounded-full"
            />
          </div>

          <div className="space-y-4 text-center lg:text-start flex-1">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0A5C4B] bg-emerald-50 px-3 py-1 rounded-full">
              {lang === 'ar' ? 'نبذة عن المنظمة' : 'About Organization'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 font-cairo">
              {settings.orgNameAr}
            </h2>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed font-normal whitespace-pre-line">
              {settings.aboutBrief}
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs font-semibold text-gray-600">
              <span className="flex items-center gap-1.5 text-[#0A5C4B] bg-[#0A5C4B]/10 px-3 py-1.5 rounded-xl font-bold">
                <ShieldCheck className="w-4 h-4 text-[#C9A227]" />
                <span>{settings.licenseNumber}</span>
              </span>
              <span className="flex items-center gap-1.5 bg-gray-100 px-3 py-1.5 rounded-xl">
                <MapPin className="w-4 h-4 text-[#C9A227]" />
                <span>{settings.address}</span>
              </span>
              <span className="flex items-center gap-1.5 bg-gray-100 px-3 py-1.5 rounded-xl">
                <Phone className="w-4 h-4 text-[#0A5C4B]" />
                <span>{settings.phone1} - {settings.phone2}</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Vision & Mission Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Vision */}
        <div className="bg-white rounded-3xl p-8 border border-gray-200/80 shadow-md space-y-4 relative overflow-hidden">
          <div className="w-12 h-12 rounded-2xl bg-[#0A5C4B]/10 text-[#0A5C4B] flex items-center justify-center">
            <Compass className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 font-cairo">
            {lang === 'ar' ? 'رؤيتنا الإنسانية' : 'Our Vision'}
          </h2>
          <p className="text-sm text-gray-700 leading-relaxed font-normal whitespace-pre-line">
            {settings.aboutVision}
          </p>
        </div>

        {/* Mission */}
        <div className="bg-white rounded-3xl p-8 border border-gray-200/80 shadow-md space-y-4 relative overflow-hidden">
          <div className="w-12 h-12 rounded-2xl bg-[#C9A227]/15 text-[#99730E] flex items-center justify-center">
            <Target className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 font-cairo">
            {lang === 'ar' ? 'رسالتنا وأهدافنا' : 'Our Mission'}
          </h2>
          <p className="text-sm text-gray-700 leading-relaxed font-normal whitespace-pre-line">
            {settings.aboutMission}
          </p>
        </div>
      </div>

      {/* History & Journey */}
      {settings.aboutHistory && (
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-gray-200/80 shadow-md space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <History className="w-5 h-5" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 font-cairo">
              {lang === 'ar' ? 'مسيرة المنظمة ونشأتها' : 'History & Foundations'}
            </h3>
          </div>
          <p className="text-sm text-gray-700 leading-relaxed font-normal whitespace-pre-line">
            {settings.aboutHistory}
          </p>
        </div>
      )}

      {/* Core Values (Dynamic from Settings) */}
      {settings.values && settings.values.length > 0 && (
        <div className="space-y-6">
          <div className="text-center max-w-2xl mx-auto">
            <h3 className="text-2xl font-extrabold text-[#0A5C4B] font-cairo">
              {lang === 'ar' ? 'قيمنا الجوهرية الراسخة' : 'Our Guiding Values'}
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              {lang === 'ar' ? 'المبادئ الأخلاقية والمهنية التي تحكم كل خطوة نخطوها في الميدان' : 'Ethical foundations guiding every relief action'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {settings.values.map((v) => (
              <div
                key={v.id}
                className="bg-[#F8F5F0] rounded-2xl p-6 border border-gray-200/80 hover:border-[#0A5C4B] transition-colors space-y-3"
              >
                <div className="w-10 h-10 rounded-xl bg-white text-[#0A5C4B] flex items-center justify-center shadow-xs">
                  <HeartHandshake className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-base text-gray-900 font-cairo">{v.title}</h4>
                <p className="text-xs text-gray-600 leading-relaxed font-normal">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Board Members Section (Dynamic from Settings) */}
      {settings.boardMembers && settings.boardMembers.length > 0 && (
        <div className="bg-white rounded-3xl p-8 border border-gray-200/80 shadow-md space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0A5C4B]/10 text-[#0A5C4B] flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 font-cairo">
              {lang === 'ar' ? 'الهيئة الإدارية ومجلس الأمناء' : 'Board of Directors'}
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {settings.boardMembers.map((bm) => (
              <div key={bm.id} className="p-4 rounded-2xl bg-gray-50 border border-gray-200 space-y-1">
                <h4 className="font-bold text-sm text-gray-900">{bm.name}</h4>
                <div className="text-xs text-[#0A5C4B] font-semibold">{bm.role}</div>
                {bm.bio && <p className="text-xs text-gray-500 pt-1 leading-relaxed">{bm.bio}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Legal Status & Licensing Card */}
      <div className="bg-[#F8F5F0] rounded-3xl p-8 border border-gray-200/80 shadow-xs">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="p-4 rounded-2xl bg-white shadow-xs shrink-0">
            <Building className="w-12 h-12 text-[#0A5C4B]" />
          </div>
          <div className="space-y-2 text-center md:text-start flex-1">
            <h3 className="text-xl font-bold text-gray-900 font-cairo">
              {lang === 'ar' ? 'الموقف القانوني والإشهار الرسمي' : 'Official Legal Registration'}
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              {lang === 'ar'
                ? `منظمة مصر أولاً مشهرة رسمياً بجمهورية مصر العربية بـ (${settings.licenseNumber})، والمقر الرئيسي في (${settings.address}). تخضع حساباتها البنكية للرقابة الدورية والمراجعة المالية المعتمدة.`
                : 'Misr Awalan is an officially registered non-governmental organization in Egypt.'}
            </p>
          </div>
          <div className="shrink-0 bg-white border border-gray-200 px-5 py-3.5 rounded-2xl text-center shadow-xs">
            <div className="text-sm text-[#0A5C4B] font-extrabold">{settings.licenseNumber}</div>
            <div className="text-xs text-gray-500 mt-1">{settings.taxNumber}</div>
          </div>
        </div>
      </div>

      {/* Downloadable Annual Reports */}
      <div className="bg-white rounded-3xl p-8 sm:p-10 border border-gray-200/80 space-y-6">
        <div>
          <h3 className="text-2xl font-bold text-[#0A5C4B] font-cairo">
            {lang === 'ar' ? 'التقارير السنوية والبيانات المالية' : 'Annual Reports & Financial Audits'}
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            {lang === 'ar'
              ? 'نؤمن بحق المتبرع في معرفة كل تفاصيل الإنفاق. يمكنك تحميل تقاريرنا المدققة بصيغة PDF.'
              : 'Download our certified periodic financial statements and project achievements.'}
          </p>
        </div>

        <div className="space-y-3">
          {annualReports.map((report, idx) => (
            <div
              key={idx}
              className="bg-gray-50 p-4 rounded-2xl border border-gray-200 flex items-center justify-between gap-4 hover:border-[#0A5C4B] transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-red-50 text-red-600">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-gray-900">{report.title}</h4>
                  <div className="text-xs text-gray-400 mt-0.5">PDF • {report.size}</div>
                </div>
              </div>

              <button
                onClick={() => {
                  alert(lang === 'ar' ? `جاري تجهيز تحميل ${report.title}` : `Downloading ${report.title}`);
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-[#0A5C4B] hover:text-white text-gray-700 text-xs font-bold transition-colors border border-gray-200 shadow-xs"
              >
                <Download className="w-4 h-4" />
                <span>{lang === 'ar' ? 'تحميل' : 'Download'}</span>
              </button>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
