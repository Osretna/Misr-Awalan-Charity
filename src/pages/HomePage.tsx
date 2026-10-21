import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { t } from '../utils/translations';
import { formatNumber, formatCurrency } from '../utils/helpers';
import { 
  Heart, 
  Play, 
  ShieldCheck, 
  Users, 
  Utensils, 
  Baby, 
  Droplet, 
  Activity, 
  Home, 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles,
  MapPin,
  TrendingUp,
  Building,
  Calendar,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Eye
} from 'lucide-react';

interface HomePageProps {
  setCurrentPage: (page: string) => void;
  setSelectedProjectForModal: (projId: string | null) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ 
  setCurrentPage,
  setSelectedProjectForModal
}) => {
  const { 
    lang, 
    projects, 
    stats, 
    settings, 
    openVideoModal, 
    setQuickDonateModalOpen 
  } = useApp();
  const strings = t[lang];

  // Testimonials carousel state
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const testimonials = [
    {
      name: 'الحاجة أم أحمد',
      location: 'محافظة سوهاج - مركز طهطا',
      story: 'كنت بمشي مسافة ساعتين كل يوم عشان أجيب جردل مية لعيالي، والحمد لله لما منظمة مصر أولاً وصلت خط المياه لحد باب البيت كأنهم ردوا فينا الروح وحموا عيالي من المرض.',
      project: 'مشروع سقيا الماء',
      image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    },
    {
      name: 'عبد الرحمن م.',
      location: 'محافظة الجيزة',
      story: 'بعد وفاة والدي، كفالة مصر أولاً مكنتني أكمل دراستي في كلية الهندسة وأوفر مصاريف إخواتي الصغيرين دون أن نمد أيدينا لأحد. شكراً لكل من ساهم في تعليمي.',
      project: 'كفالة الأيتام والتعليم',
      image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=80',
    },
    {
      name: 'أم فاطمة',
      location: 'محافظة قنا',
      story: 'استلمت ماكينة خياطة وقماش بعد ما دربتني المنظمة، والنهارده بشتغل وبصرف على ولادي الأربعة من عرق جبيني وبشرف وعزة نفس. حولو بيتنا من الفقر للستر.',
      project: 'التمكين الاقتصادي',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
    }
  ];

  // Latest 6 featured projects
  const featuredProjects = projects.filter(p => p.isFeatured).slice(0, 6);
  const displayProjects = featuredProjects.length > 0 ? featuredProjects : projects.slice(0, 6);

  const ArrowIcon = lang === 'ar' ? ArrowLeft : ArrowRight;

  return (
    <div className="space-y-20 pb-20 overflow-hidden">
      
      {/* 1. CINEMATIC HERO SECTION */}
      <section className="relative min-h-[620px] sm:min-h-[680px] lg:min-h-[740px] flex items-center justify-center text-white overflow-hidden">
        {/* Background Image with Dark Emerald & Warm Gradient Overlay */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=2000&q=85"
            alt="Humanitarian Care in Egypt"
            className="w-full h-full object-cover object-center scale-105 transform animate-pulse duration-10000"
          />
          {/* Multi-layered cinematic gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#073229]/95 via-[#0A5C4B]/88 to-[#07251E]/95" />
          <div className="absolute inset-0 bg-radial from-transparent via-[#073229]/50 to-black/70" />
        </div>

        {/* Decorative Floating Geometry */}
        <div className="absolute top-10 end-10 w-72 h-72 rounded-full bg-[#C9A227]/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 start-10 w-96 h-96 rounded-full bg-[#117863]/20 blur-3xl pointer-events-none" />

        {/* Content Container */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-8 pb-12">
          
          {/* Trust Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#E0BA3E] text-xs sm:text-sm font-bold mb-6 shadow-lg animate-in fade-in slide-in-from-top-4 duration-500">
            <ShieldCheck className="w-4 h-4 text-[#C9A227]" />
            <span>{strings.heroBadge}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#C9A227]"></span>
            <span className="text-white font-normal">{settings.licenseNumber}</span>
          </div>

          {/* Main Powerful Headline */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white font-cairo tracking-tight leading-tight sm:leading-tight lg:leading-tight drop-shadow-md">
            {lang === 'ar' ? (
              <>
                معاً نصنع الأمل ونبني <span className="text-[#E0BA3E]">كرامة الإنسان</span> في ربوع مصر
              </>
            ) : (
              settings.heroHeadline
            )}
          </h1>

          {/* Sincere Subtitle */}
          <p className="mt-6 text-base sm:text-xl text-emerald-100/90 max-w-3xl mx-auto leading-relaxed font-normal">
            {lang === 'ar' ? settings.heroSubheadline : strings.heroSubtitle}
          </p>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4 sm:gap-5">
            <button
              onClick={() => { setCurrentPage('donate'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-gradient-to-r from-[#C9A227] via-[#DFB738] to-[#C9A227] text-gray-900 font-extrabold text-base sm:text-lg shadow-xl shadow-[#C9A227]/30 hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-200"
            >
              <Heart className="w-5 h-5 fill-current text-gray-900" />
              <span>{strings.donateNow}</span>
            </button>

            <button
              onClick={() => {
                if (displayProjects[0]?.videoUrl) {
                  openVideoModal(displayProjects[0].videoUrl);
                } else {
                  setCurrentPage('projects');
                }
              }}
              className="flex items-center gap-2.5 px-7 py-4 rounded-2xl bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/30 font-bold text-base sm:text-lg transition-all duration-200 hover:scale-105"
            >
              <div className="w-7 h-7 rounded-full bg-[#E0BA3E] text-gray-900 flex items-center justify-center">
                <Play className="w-3.5 h-3.5 fill-current ms-0.5" />
              </div>
              <span>{strings.watchOurWork}</span>
            </button>
          </div>

          {/* Live Impact Pill */}
          <div className="mt-12 inline-flex items-center gap-2 sm:gap-3 px-5 py-2.5 rounded-2xl bg-black/30 backdrop-blur-md border border-white/15 text-xs sm:text-sm text-emerald-100">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
            <span className="font-semibold text-white">{strings.impactBadgeTitle}</span>
          </div>

        </div>
      </section>

      {/* 2. LIVE IMPACT METRICS SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 sm:-mt-24 relative z-20">
        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6 sm:p-10">
          
          <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0A5C4B] bg-[#0A5C4B]/10 px-3 py-1 rounded-full">
              {lang === 'ar' ? 'شفافية وأثر مباشر' : 'Real-time Impact'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0A5C4B] mt-2 font-cairo">
              {strings.impactTitle}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {strings.impactSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
            
            {/* Metric 1: Families */}
            <div className="bg-[#F8F5F0] rounded-2xl p-4 text-center border border-gray-200/70 hover:border-[#0A5C4B] transition-colors group">
              <div className="w-12 h-12 mx-auto rounded-xl bg-[#0A5C4B]/10 text-[#0A5C4B] flex items-center justify-center mb-3 group-hover:bg-[#0A5C4B] group-hover:text-white transition-colors">
                <Users className="w-6 h-6" />
              </div>
              <div className="text-xl sm:text-2xl font-black text-gray-900 font-cairo">
                {formatNumber(stats.familiesHelped, lang)}+
              </div>
              <div className="text-xs text-gray-600 font-medium mt-1 leading-snug">
                {strings.stats.families}
              </div>
            </div>

            {/* Metric 2: Meals */}
            <div className="bg-[#F8F5F0] rounded-2xl p-4 text-center border border-gray-200/70 hover:border-[#0A5C4B] transition-colors group">
              <div className="w-12 h-12 mx-auto rounded-xl bg-[#C9A227]/15 text-[#99730E] flex items-center justify-center mb-3 group-hover:bg-[#C9A227] group-hover:text-gray-900 transition-colors">
                <Utensils className="w-6 h-6" />
              </div>
              <div className="text-xl sm:text-2xl font-black text-gray-900 font-cairo">
                {formatNumber(stats.mealsDistributed, lang)}+
              </div>
              <div className="text-xs text-gray-600 font-medium mt-1 leading-snug">
                {strings.stats.meals}
              </div>
            </div>

            {/* Metric 3: Orphans */}
            <div className="bg-[#F8F5F0] rounded-2xl p-4 text-center border border-gray-200/70 hover:border-[#0A5C4B] transition-colors group">
              <div className="w-12 h-12 mx-auto rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-3 group-hover:bg-rose-500 group-hover:text-white transition-colors">
                <Baby className="w-6 h-6" />
              </div>
              <div className="text-xl sm:text-2xl font-black text-gray-900 font-cairo">
                {formatNumber(stats.orphansSponsored, lang)}+
              </div>
              <div className="text-xs text-gray-600 font-medium mt-1 leading-snug">
                {strings.stats.orphans}
              </div>
            </div>

            {/* Metric 4: Water Wells */}
            <div className="bg-[#F8F5F0] rounded-2xl p-4 text-center border border-gray-200/70 hover:border-[#0A5C4B] transition-colors group">
              <div className="w-12 h-12 mx-auto rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-3 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <Droplet className="w-6 h-6" />
              </div>
              <div className="text-xl sm:text-2xl font-black text-gray-900 font-cairo">
                {formatNumber(stats.waterWellsBuilt, lang)}
              </div>
              <div className="text-xs text-gray-600 font-medium mt-1 leading-snug">
                {strings.stats.water}
              </div>
            </div>

            {/* Metric 5: Medical Convoys */}
            <div className="bg-[#F8F5F0] rounded-2xl p-4 text-center border border-gray-200/70 hover:border-[#0A5C4B] transition-colors group">
              <div className="w-12 h-12 mx-auto rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                <Activity className="w-6 h-6" />
              </div>
              <div className="text-xl sm:text-2xl font-black text-gray-900 font-cairo">
                {formatNumber(stats.medicalConvoys, lang)}
              </div>
              <div className="text-xs text-gray-600 font-medium mt-1 leading-snug">
                {strings.stats.medical}
              </div>
            </div>

            {/* Metric 6: Homes Restored */}
            <div className="bg-[#F8F5F0] rounded-2xl p-4 text-center border border-gray-200/70 hover:border-[#0A5C4B] transition-colors group">
              <div className="w-12 h-12 mx-auto rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-3 group-hover:bg-amber-600 group-hover:text-white transition-colors">
                <Home className="w-6 h-6" />
              </div>
              <div className="text-xl sm:text-2xl font-black text-gray-900 font-cairo">
                {formatNumber(stats.homesRestored, lang)}
              </div>
              <div className="text-xs text-gray-600 font-medium mt-1 leading-snug">
                {strings.stats.homes}
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 3. MONTHLY SADAQA JARIYA TIERS (200 / 500 / 1000 EGP) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-[#0A5C4B] to-[#073229] rounded-3xl p-8 sm:p-12 text-white shadow-2xl relative overflow-hidden">
          
          <div className="relative z-10 max-w-3xl mx-auto text-center mb-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C9A227]/20 text-[#E0BA3E] text-xs font-bold border border-[#C9A227]/30">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'سهم الخير المستدام' : 'Sustainable Giving'}</span>
            </span>
            <h2 className="text-2xl sm:text-4xl font-black mt-3 font-cairo">
              {strings.sadaqaTitle}
            </h2>
            <p className="text-sm sm:text-base text-emerald-100/90 mt-2">
              {strings.sadaqaSubtitle}
            </p>
          </div>

          {/* Cards Grid: 200, 500, 1000, Custom */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
            
            {/* Tier 1: 200 EGP */}
            <div className="bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/20 rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between group">
              <div>
                <span className="text-xs text-emerald-300 font-bold block mb-1">
                  {lang === 'ar' ? 'سهم الإطعام والسقيا' : 'Food & Water Share'}
                </span>
                <div className="flex items-baseline gap-1 my-3">
                  <span className="text-4xl font-black text-white font-cairo">200</span>
                  <span className="text-xs text-[#E0BA3E] font-bold">{strings.egp} {strings.monthly}</span>
                </div>
                <p className="text-xs text-emerald-100/80 leading-relaxed mb-6">
                  {strings.sadaqaAmounts.tier1Desc}
                </p>
              </div>

              <button
                onClick={() => setQuickDonateModalOpen(true)}
                className="w-full py-2.5 rounded-xl bg-white/20 hover:bg-white text-white hover:text-[#0A5C4B] font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <span>{lang === 'ar' ? 'تبرع بهذا السهم' : 'Select This Share'}</span>
                <ArrowIcon className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Tier 2: 500 EGP (Most Popular - Highlighted in Gold) */}
            <div className="bg-gradient-to-b from-[#C9A227] to-[#A07B18] text-gray-950 rounded-2xl p-6 shadow-xl transform lg:-translate-y-2 transition-all duration-300 flex flex-col justify-between border-2 border-amber-300 relative">
              <div className="absolute -top-3 start-1/2 -translate-x-1/2 bg-[#0A5C4B] text-white text-[10px] font-black uppercase px-3 py-0.5 rounded-full shadow-md">
                {lang === 'ar' ? 'الأكثر إقبالاً ونفعاً' : 'Most Popular'}
              </div>

              <div>
                <span className="text-xs text-emerald-950 font-bold block mb-1">
                  {lang === 'ar' ? 'سهم كفالة يتيم' : 'Orphan Sponsorship'}
                </span>
                <div className="flex items-baseline gap-1 my-3">
                  <span className="text-4xl font-black text-gray-950 font-cairo">500</span>
                  <span className="text-xs text-emerald-950 font-bold">{strings.egp} {strings.monthly}</span>
                </div>
                <p className="text-xs text-gray-900/90 leading-relaxed mb-6 font-medium">
                  {strings.sadaqaAmounts.tier2Desc}
                </p>
              </div>

              <button
                onClick={() => setQuickDonateModalOpen(true)}
                className="w-full py-3 rounded-xl bg-[#0A5C4B] hover:bg-[#073229] text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-1.5"
              >
                <span>{lang === 'ar' ? 'اكفل يتيماً الآن' : 'Sponsor An Orphan'}</span>
                <ArrowIcon className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Tier 3: 1000 EGP */}
            <div className="bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/20 rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between group">
              <div>
                <span className="text-xs text-emerald-300 font-bold block mb-1">
                  {lang === 'ar' ? 'سهم بناء وترميم' : 'Shelter & Health Share'}
                </span>
                <div className="flex items-baseline gap-1 my-3">
                  <span className="text-4xl font-black text-white font-cairo">1000</span>
                  <span className="text-xs text-[#E0BA3E] font-bold">{strings.egp} {strings.monthly}</span>
                </div>
                <p className="text-xs text-emerald-100/80 leading-relaxed mb-6">
                  {strings.sadaqaAmounts.tier3Desc}
                </p>
              </div>

              <button
                onClick={() => setQuickDonateModalOpen(true)}
                className="w-full py-2.5 rounded-xl bg-white/20 hover:bg-white text-white hover:text-[#0A5C4B] font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <span>{lang === 'ar' ? 'تبرع بهذا السهم' : 'Select This Share'}</span>
                <ArrowIcon className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Tier 4: Custom Amount */}
            <div className="bg-white/10 hover:bg-white/15 backdrop-blur-md border border-white/20 rounded-2xl p-6 transition-all duration-300 flex flex-col justify-between group">
              <div>
                <span className="text-xs text-emerald-300 font-bold block mb-1">
                  {lang === 'ar' ? 'بأي مبلغ تجود به نفسك' : 'Any Desired Amount'}
                </span>
                <div className="my-3">
                  <span className="text-2xl font-black text-white font-cairo">
                    {lang === 'ar' ? 'مبلغ مخصص' : 'Custom Amount'}
                  </span>
                </div>
                <p className="text-xs text-emerald-100/80 leading-relaxed mb-6">
                  {lang === 'ar'
                    ? 'ضع مساهمتك في الصدقات الجارية أو زكاة المال وفق مقدرتك وما ييسره الله لك.'
                    : 'Contribute any amount towards our continuous charity or Zakat funds.'}
                </p>
              </div>

              <button
                onClick={() => { setCurrentPage('donate'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                className="w-full py-2.5 rounded-xl bg-[#E0BA3E] hover:bg-[#C9A227] text-gray-950 font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <span>{strings.donateNow}</span>
                <ArrowIcon className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* 4. FEATURED PROJECTS GRID (LATEST 6 WORKS) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#0A5C4B] bg-[#0A5C4B]/10 px-3 py-1 rounded-full">
              {lang === 'ar' ? 'مشاريع حية وموثقة' : 'Field Projects'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0A5C4B] mt-2 font-cairo">
              {strings.featuredTitle}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {strings.featuredSubtitle}
            </p>
          </div>

          <button
            onClick={() => { setCurrentPage('projects'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="flex items-center gap-2 text-sm font-bold text-[#0A5C4B] hover:text-[#C9A227] transition-colors"
          >
            <span>{strings.viewAllProjects}</span>
            <ArrowIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Grid of 6 Projects */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayProjects.map((project) => {
            const percent = project.targetAmount && project.raisedAmount
              ? Math.min(100, Math.round((project.raisedAmount / project.targetAmount) * 100))
              : null;

            return (
              <div
                key={project.id}
                className="bg-white rounded-3xl overflow-hidden border border-gray-200/80 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col group"
              >
                {/* Image & Video Badge */}
                <div className="relative aspect-video w-full overflow-hidden bg-gray-100">
                  <img
                    src={project.coverImage}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />

                  {/* Category Pill */}
                  <div className="absolute top-3 start-3">
                    <span className="bg-[#0A5C4B]/90 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-xs">
                      {strings.categories[project.category] || project.category}
                    </span>
                  </div>

                  {/* Video Trigger Button (if video exists) */}
                  {project.videoUrl && (
                    <button
                      onClick={() => openVideoModal(project.videoUrl!)}
                      className="absolute bottom-3 end-3 flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white text-[11px] font-bold px-3 py-1.5 rounded-full shadow-lg transition-transform hover:scale-105"
                      title={strings.watchVideo}
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>{lang === 'ar' ? 'فيديو ميداني' : 'Video'}</span>
                    </button>
                  )}

                  {/* Location badge */}
                  <div className="absolute bottom-3 start-3 text-white text-[11px] font-medium flex items-center gap-1 drop-shadow-xs">
                    <MapPin className="w-3.5 h-3.5 text-[#E0BA3E]" />
                    <span className="truncate max-w-[200px]">{project.location}</span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 group-hover:text-[#0A5C4B] transition-colors leading-snug font-cairo">
                      {project.title}
                    </h3>
                    <p className="text-xs text-gray-600 mt-2 line-clamp-2 leading-relaxed">
                      {project.shortDescription}
                    </p>
                  </div>

                  {/* Progress Bar (if target amount exists) */}
                  {project.targetAmount && project.raisedAmount && (
                    <div className="space-y-1.5 pt-2 border-t border-gray-100">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-gray-500">{strings.raised}:</span>
                        <span className="text-[#0A5C4B] font-bold">
                          {formatCurrency(project.raisedAmount, 'EGP', lang)} ({percent}%)
                        </span>
                      </div>
                      <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-[#0A5C4B] to-[#C9A227] h-full rounded-full transition-all duration-500"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-[11px] text-gray-500">
                        <span>{strings.target}: {formatCurrency(project.targetAmount, 'EGP', lang)}</span>
                        {project.beneficiaries && (
                          <span>{formatNumber(project.beneficiaries, lang)} {strings.beneficiaries}</span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Card Actions */}
                  <div className="pt-2 flex items-center gap-2">
                    <button
                      onClick={() => setSelectedProjectForModal(project.id)}
                      className="flex-1 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold transition-colors text-center"
                    >
                      {strings.readMore}
                    </button>
                    <button
                      onClick={() => setQuickDonateModalOpen(true)}
                      className="px-4 py-2.5 rounded-xl bg-[#0A5C4B] hover:bg-[#073229] text-white text-xs font-bold transition-colors flex items-center gap-1 shadow-sm"
                    >
                      <Heart className="w-3.5 h-3.5 fill-rose-300 text-rose-300" />
                      <span>{strings.donateNow}</span>
                    </button>
                  </div>

                </div>

              </div>
            );
          })}
        </div>

        {/* View All Projects Button */}
        <div className="mt-12 text-center">
          <button
            onClick={() => { setCurrentPage('projects'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-white border-2 border-[#0A5C4B] text-[#0A5C4B] hover:bg-[#0A5C4B] hover:text-white font-bold text-sm shadow-md transition-all duration-200 hover:scale-105"
          >
            <span>{strings.viewAllProjects}</span>
            <ArrowIcon className="w-4 h-4" />
          </button>
        </div>

      </section>

      {/* 5. TRUST & LEGAL GOVERNANCE BAR */}
      <section className="bg-white border-y border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 font-cairo">
              {strings.trustTitle}
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              {strings.trustSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            
            <div className="p-4 rounded-2xl bg-[#F8F5F0] border border-gray-200">
              <ShieldCheck className="w-8 h-8 text-[#0A5C4B] mx-auto mb-2" />
              <div className="text-xs text-gray-500 font-semibold">{strings.license}</div>
              <div className="text-sm font-bold text-gray-900 mt-1">{settings.licenseNumber}</div>
              <div className="text-[10px] text-gray-500 mt-0.5">{settings.address}</div>
            </div>

            <div className="p-4 rounded-2xl bg-[#F8F5F0] border border-gray-200">
              <Building className="w-8 h-8 text-[#C9A227] mx-auto mb-2" />
              <div className="text-xs text-gray-500 font-semibold">{strings.taxCard}</div>
              <div className="text-sm font-bold text-gray-900 mt-1">492-381-901</div>
              <div className="text-[10px] text-gray-500 mt-0.5">مصلحة الضرائب المصرية</div>
            </div>

            <div className="p-4 rounded-2xl bg-[#F8F5F0] border border-gray-200">
              <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
              <div className="text-xs text-gray-500 font-semibold">{lang === 'ar' ? 'الرقابة المالية' : 'Audit'}</div>
              <div className="text-sm font-bold text-gray-900 mt-1">{lang === 'ar' ? 'مكتب محاسبة معتمد' : 'Certified CPA'}</div>
              <div className="text-[10px] text-gray-500 mt-0.5">{lang === 'ar' ? 'تقارير مالية ربع سنوية' : 'Quarterly Audit'}</div>
            </div>

            <div className="p-4 rounded-2xl bg-[#F8F5F0] border border-gray-200">
              <TrendingUp className="w-8 h-8 text-[#0A5C4B] mx-auto mb-2" />
              <div className="text-xs text-gray-500 font-semibold">{lang === 'ar' ? 'كفاءة المصروفات' : 'Expense Ratio'}</div>
              <div className="text-sm font-bold text-emerald-700 mt-1">94.8% للميدان</div>
              <div className="text-[10px] text-gray-500 mt-0.5">{lang === 'ar' ? 'أعلى كفاءة إنسانية' : 'High Field Efficiency'}</div>
            </div>

          </div>

        </div>
      </section>

      {/* 6. SUCCESS STORIES / TESTIMONIALS CAROUSEL */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#F8F5F0] rounded-3xl p-8 sm:p-12 border border-gray-200/80">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#0A5C4B] bg-[#0A5C4B]/10 px-3 py-1 rounded-full">
                {lang === 'ar' ? 'شهادات المستفيدين' : 'Field Stories'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0A5C4B] mt-2 font-cairo">
                {strings.testimonialsTitle}
              </h2>
              <p className="text-xs sm:text-sm text-gray-600 mt-1">
                {strings.testimonialsSubtitle}
              </p>
            </div>

            {/* Navigation Arrows */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveTestimonial((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1))}
                className="p-2.5 rounded-full bg-white border border-gray-200 hover:bg-[#0A5C4B] hover:text-white transition-colors"
                aria-label="Previous Testimonial"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
              <button
                onClick={() => setActiveTestimonial((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1))}
                className="p-2.5 rounded-full bg-white border border-gray-200 hover:bg-[#0A5C4B] hover:text-white transition-colors"
                aria-label="Next Testimonial"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Active Story Card */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-200 flex flex-col md:flex-row items-center gap-6 sm:gap-8">
            <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl overflow-hidden shrink-0 border-2 border-[#C9A227] shadow-md">
              <img
                src={testimonials[activeTestimonial].image}
                alt={testimonials[activeTestimonial].name}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="space-y-3 text-center md:text-start flex-1">
              <div className="inline-block text-xs font-bold text-[#0A5C4B] bg-[#0A5C4B]/10 px-3 py-1 rounded-full">
                {testimonials[activeTestimonial].project}
              </div>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed italic">
                "{testimonials[activeTestimonial].story}"
              </p>
              <div>
                <h4 className="font-bold text-base text-gray-900">
                  {testimonials[activeTestimonial].name}
                </h4>
                <div className="text-xs text-gray-500 flex items-center justify-center md:justify-start gap-1 mt-0.5">
                  <MapPin className="w-3.5 h-3.5 text-[#C9A227]" />
                  <span>{testimonials[activeTestimonial].location}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Pagination Indicators */}
          <div className="flex justify-center gap-2 mt-6">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setActiveTestimonial(idx)}
                className={`h-2 rounded-full transition-all ${
                  activeTestimonial === idx ? 'w-8 bg-[#0A5C4B]' : 'w-2 bg-gray-300'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

        </div>
      </section>

      {/* 7. TRANSPARENCY LEDGER (RECENT PUBLIC CONTRIBUTIONS) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <h3 className="font-bold text-gray-900 text-sm sm:text-base">
                {lang === 'ar' ? 'سجل العطاء الحي والشفافية' : 'Live Community Giving Ledger'}
              </h3>
            </div>
            <span className="text-xs text-gray-400">
              {lang === 'ar' ? 'محدث لحظياً' : 'Real-time updates'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { name: 'فاعل خير', amount: 1000, cause: 'سقيا ماء', time: 'منذ 5 دقائق' },
              { name: 'م. حسام ع.', amount: 500, cause: 'كفالة أيتام', time: 'منذ 18 دقيقة' },
              { name: 'فاعلة خير', amount: 200, cause: 'كرتونة رمضان', time: 'منذ 34 دقيقة' },
              { name: 'د. طارق س.', amount: 2500, cause: 'عمليات عيون', time: 'منذ ساعة' },
            ].map((item, idx) => (
              <div
                key={idx}
                className="p-3 rounded-xl bg-gray-50 border border-gray-200/60 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="font-bold text-gray-800">{item.name}</div>
                  <div className="text-gray-500 text-[11px]">{item.cause} • {item.time}</div>
                </div>
                <div className="font-bold text-[#0A5C4B] bg-[#0A5C4B]/10 px-2.5 py-1 rounded-lg">
                  {item.amount} {strings.egp}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. VOLUNTEER & COMMUNITY CALLOUT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-[#117863] via-[#0A5C4B] to-[#073229] rounded-3xl p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
          <div className="space-y-3 text-center md:text-start max-w-xl">
            <span className="text-xs font-bold text-[#E0BA3E] uppercase tracking-wider">
              {lang === 'ar' ? 'كن شريكاً في الميدان' : 'Be Our Field Partner'}
            </span>
            <h3 className="text-2xl sm:text-3xl font-black font-cairo">
              {strings.volunteerTitle}
            </h3>
            <p className="text-sm text-emerald-100/90 leading-relaxed">
              {strings.volunteerSubtitle}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0">
            <button
              onClick={() => { setCurrentPage('volunteer'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="px-8 py-3.5 rounded-xl bg-white text-[#0A5C4B] font-bold text-sm shadow-md hover:bg-[#F8F5F0] transition-colors"
            >
              {strings.volunteer}
            </button>
            <button
              onClick={() => { setCurrentPage('contact'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/20 transition-colors"
            >
              {strings.contact}
            </button>
          </div>
        </div>
      </section>

    </div>
  );
};
