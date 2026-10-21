import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { t } from '../utils/translations';
import { formatNumber } from '../utils/helpers';
import { 
  Users, 
  Utensils, 
  Baby, 
  Droplet, 
  Activity, 
  Home, 
  MapPin, 
  CheckCircle2, 
  Sparkles,
  ArrowRight,
  TrendingUp,
  Award
} from 'lucide-react';

export const ImpactPage: React.FC = () => {
  const { lang, stats } = useApp();
  const strings = t[lang];

  const [selectedGovernorate, setSelectedGovernorate] = useState<string>('sohag');

  const governorates = [
    {
      id: 'sohag',
      name: lang === 'ar' ? 'محافظة سوهاج' : 'Sohag Governorate',
      region: 'Upper Egypt',
      families: '28,400',
      wells: 92,
      homes: 180,
      description: lang === 'ar' ? 'تركيز مكثف على مد شبكات مياه الشرب النقية وتطهير الآبار وتسقيف المنازل الطينية بقرى طهطا والمراغة والمنشاة.' : 'Focused on potable water grids and roofing mud brick homes.',
    },
    {
      id: 'qena',
      name: lang === 'ar' ? 'محافظة قنا' : 'Qena Governorate',
      region: 'Upper Egypt',
      families: '21,200',
      wells: 68,
      homes: 140,
      description: lang === 'ar' ? 'مبادرات إطعام شهرية، قوافل طبية شاملة، وكفالات للأيتام ودعم التعليم الأساسي بالقرى النائية.' : 'Monthly food security, health clinics, and comprehensive orphan stipends.',
    },
    {
      id: 'aswan',
      name: lang === 'ar' ? 'محافظة أسوان' : 'Aswan Governorate',
      region: 'Upper Egypt',
      families: '14,800',
      wells: 45,
      homes: 95,
      description: lang === 'ar' ? 'توفير فلاتر ومحطات تنقية المياه المركزية للقرى النوبية ومشاريع التمكين الحرفي لصانعات الخوص والمنسوجات.' : 'Central water purification and women craft vocational empowerment.',
    },
    {
      id: 'minya',
      name: lang === 'ar' ? 'محافظة المنيا' : 'Minya Governorate',
      region: 'Middle Egypt',
      families: '24,500',
      wells: 55,
      homes: 160,
      description: lang === 'ar' ? 'مشروع "ستر ودفا" لإعادة بناء المنازل المتهالكة وإجراء جراحات العيون ومكافحة العمى للأهالي.' : 'Shelter restoration and eyesight preservation surgeries.',
    },
    {
      id: 'cairo_giza',
      name: lang === 'ar' ? 'القاهرة الكبرى والجيزة' : 'Greater Cairo & Giza',
      region: 'Metropolitan',
      families: '26,100',
      wells: 12,
      homes: 85,
      description: lang === 'ar' ? 'مطابخ الإطعام اليومية الساخنة، كفالات الطلبة الأيتام في الجامعات، وتجهيز العرائس اليتيمات.' : 'Daily soup kitchens, university orphan sponsorships, and bridal aid.',
    },
    {
      id: 'sinai',
      name: lang === 'ar' ? 'شمال وجنوب سيناء' : 'Sinai Governorates',
      region: 'Frontier',
      families: '13,450',
      wells: 40,
      homes: 60,
      description: lang === 'ar' ? 'قوافل الشتاء، حفر آبار ارتوازية بالمناطق البدوية، وتوزيع الإمدادات الغذائية العاجلة.' : 'Artesian deep wells for Bedouin communities and seasonal emergency relief.',
    },
  ];

  const activeGov = governorates.find(g => g.id === selectedGovernorate) || governorates[0];

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-[#0A5C4B] bg-[#0A5C4B]/10 px-3.5 py-1 rounded-full">
          {lang === 'ar' ? 'أثرنا في أرقام' : 'Our Measured Impact'}
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-[#0A5C4B] font-cairo">
          {strings.impact}
        </h1>
        <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
          {lang === 'ar'
            ? 'خريطة انتشار أعمال منظمة مصر أولاً في محافظات مصر، وإحصائيات موثقة عن كل قطاع خدمي قمنا بتطويره.'
            : 'Geographic distribution and sector impact across Egypt powered by our donors.'}
        </p>
      </div>

      {/* Main Stats Big Banners */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: strings.stats.families, val: stats.familiesHelped, icon: Users, color: 'text-[#0A5C4B]', bg: 'bg-[#0A5C4B]/10' },
          { label: strings.stats.meals, val: stats.mealsDistributed, icon: Utensils, color: 'text-amber-600', bg: 'bg-amber-100/50' },
          { label: strings.stats.orphans, val: stats.orphansSponsored, icon: Baby, color: 'text-rose-600', bg: 'bg-rose-100/50' },
          { label: strings.stats.water, val: stats.waterWellsBuilt, icon: Droplet, color: 'text-blue-600', bg: 'bg-blue-100/50' },
          { label: strings.stats.medical, val: stats.medicalConvoys, icon: Activity, color: 'text-emerald-600', bg: 'bg-emerald-100/50' },
          { label: strings.stats.homes, val: stats.homesRestored, icon: Home, color: 'text-indigo-600', bg: 'bg-indigo-100/50' },
        ].map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="bg-white rounded-3xl p-5 border border-gray-200/80 shadow-xs text-center space-y-2">
              <div className={`w-12 h-12 mx-auto rounded-2xl ${item.bg} ${item.color} flex items-center justify-center`}>
                <Icon className="w-6 h-6" />
              </div>
              <div className="text-xl sm:text-2xl font-black text-gray-900 font-cairo">
                {formatNumber(item.val, lang)}+
              </div>
              <div className="text-xs text-gray-600 font-medium leading-snug">
                {item.label}
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Egyptian Governorates Map Breakdown */}
      <div className="bg-white rounded-3xl p-8 sm:p-12 border border-gray-200/80 shadow-md space-y-8">
        <div>
          <span className="text-xs font-bold text-[#0A5C4B] uppercase tracking-wider">
            {lang === 'ar' ? 'التوزيع الجغرافي الميداني' : 'Field Geography'}
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1 font-cairo">
            {lang === 'ar' ? 'أعمالنا عبر محافظات الجمهورية' : 'Initiatives Across Egyptian Governorates'}
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            {lang === 'ar' ? 'اضغط على المحافظة للاطلاع على تفاصيل التدخلات الإنسانية ونسب المستفيدين بها' : 'Select a governorate to inspect field achievements'}
          </p>
        </div>

        {/* Governorates Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {governorates.map((gov) => {
            const isSelected = selectedGovernorate === gov.id;
            return (
              <button
                key={gov.id}
                onClick={() => setSelectedGovernorate(gov.id)}
                className={`whitespace-nowrap px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
                  isSelected
                    ? 'bg-[#0A5C4B] text-white shadow-sm'
                    : 'bg-[#F8F5F0] text-gray-700 hover:bg-gray-200'
                }`}
              >
                <MapPin className="w-4 h-4 text-[#C9A227]" />
                <span>{gov.name}</span>
              </button>
            );
          })}
        </div>

        {/* Selected Governorate Card */}
        <div className="bg-[#F8F5F0] rounded-2xl p-6 sm:p-8 border border-gray-200/80 flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1 space-y-4 text-center md:text-start">
            <div className="inline-block px-3 py-1 bg-[#C9A227]/20 text-[#8F7015] rounded-full text-xs font-bold">
              {activeGov.region}
            </div>
            <h3 className="text-2xl font-black text-gray-900 font-cairo">
              {activeGov.name}
            </h3>
            <p className="text-sm text-gray-700 leading-relaxed font-normal">
              {activeGov.description}
            </p>

            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-200">
              <div>
                <span className="text-[11px] text-gray-500 block">{lang === 'ar' ? 'أسر مستفيدة' : 'Families'}</span>
                <span className="text-lg font-black text-[#0A5C4B] font-cairo">{activeGov.families}</span>
              </div>
              <div>
                <span className="text-[11px] text-gray-500 block">{lang === 'ar' ? 'آبار ومحطات مياه' : 'Water Wells'}</span>
                <span className="text-lg font-black text-blue-600 font-cairo">{activeGov.wells}</span>
              </div>
              <div>
                <span className="text-[11px] text-gray-500 block">{lang === 'ar' ? 'منازل مسقفة' : 'Roofed Homes'}</span>
                <span className="text-lg font-black text-amber-700 font-cairo">{activeGov.homes}</span>
              </div>
            </div>
          </div>

          <div className="w-full md:w-80 h-56 rounded-2xl bg-emerald-950/10 border-2 border-dashed border-[#0A5C4B]/30 flex flex-col items-center justify-center p-6 text-center shrink-0">
            <MapPin className="w-12 h-12 text-[#0A5C4B] animate-bounce" />
            <span className="text-sm font-bold text-gray-800 mt-2 font-cairo">
              {activeGov.name}
            </span>
            <span className="text-xs text-gray-500 mt-1">
              {lang === 'ar' ? 'فرق تطوع ومكاتب ميدانية نشطة' : 'Active Field Teams'}
            </span>
          </div>
        </div>

      </div>

    </div>
  );
};
