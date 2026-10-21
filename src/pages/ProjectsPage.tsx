import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { t } from '../utils/translations';
import { ProjectCategory, Project } from '../types';
import { formatCurrency, formatNumber } from '../utils/helpers';
import { 
  Search, 
  Filter, 
  Play, 
  MapPin, 
  Heart, 
  Calendar, 
  Users, 
  CheckCircle2, 
  Clock, 
  Sparkles,
  X
} from 'lucide-react';

interface ProjectsPageProps {
  selectedProjectForModal: string | null;
  setSelectedProjectForModal: (projId: string | null) => void;
  setCurrentPage: (page: string) => void;
}

export const ProjectsPage: React.FC<ProjectsPageProps> = ({
  selectedProjectForModal,
  setSelectedProjectForModal,
  setCurrentPage
}) => {
  const { projects, lang, openVideoModal, setQuickDonateModalOpen } = useApp();
  const strings = t[lang];

  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  const categories: Array<{ id: string; label: string }> = [
    { id: 'all', label: strings.categories.all },
    { id: 'orphans', label: strings.categories.orphans },
    { id: 'water', label: strings.categories.water },
    { id: 'food', label: strings.categories.food },
    { id: 'health', label: strings.categories.health },
    { id: 'housing', label: strings.categories.housing },
    { id: 'education', label: strings.categories.education },
    { id: 'mosques', label: strings.categories.mosques },
    { id: 'seasonal', label: strings.categories.seasonal },
  ];

  // Filtered list
  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchesCategory = activeCategory === 'all' || p.category === activeCategory;
      const matchesStatus = selectedStatus === 'all' || p.status === selectedStatus;
      const matchesQuery = 
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.shortDescription.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.location.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesStatus && matchesQuery;
    });
  }, [projects, activeCategory, selectedStatus, searchQuery]);

  const activeModalProject = useMemo(() => {
    return projects.find((p) => p.id === selectedProjectForModal) || null;
  }, [projects, selectedProjectForModal]);

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      
      {/* Page Title & Breadcrumb */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-[#0A5C4B] bg-[#0A5C4B]/10 px-3.5 py-1 rounded-full">
          {lang === 'ar' ? 'سجل الإنجاز والعطاء' : 'Our Track Record'}
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-[#0A5C4B] font-cairo">
          {strings.projects}
        </h1>
        <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
          {lang === 'ar'
            ? 'تصفح كافة أعمالنا الإنسانية في محافظات مصر، موثقة بالصور والبيانات والفيديو الميداني لتعيش معنا فرحة المستحقين.'
            : 'Explore all our humanitarian initiatives across Egypt, fully documented with photos and field video footage.'}
        </p>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white p-5 rounded-3xl border border-gray-200/80 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row items-center gap-4">
          
          {/* Search Input */}
          <div className="relative flex-1 w-full">
            <Search className="w-5 h-5 absolute start-4 top-3.5 text-gray-400" />
            <input
              type="text"
              placeholder={lang === 'ar' ? 'ابحث باسم المشروع، المحافظة، أو النشاط...' : 'Search project, city, or cause...'}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl ps-12 pe-4 py-3 text-sm text-gray-900 focus:outline-hidden focus:border-[#0A5C4B] focus:bg-white"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute end-4 top-3.5 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Status Filter */}
          <div className="w-full md:w-auto flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400 shrink-0" />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-xs sm:text-sm text-gray-800 font-semibold focus:outline-hidden focus:border-[#0A5C4B]"
            >
              <option value="all">{lang === 'ar' ? 'كل الحالات' : 'All Statuses'}</option>
              <option value="active">{strings.status.active}</option>
              <option value="ongoing">{strings.status.ongoing}</option>
              <option value="completed">{strings.status.completed}</option>
            </select>
          </div>

        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none pt-2">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-[#0A5C4B] text-white shadow-sm'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Projects Gallery Count */}
      <div className="flex items-center justify-between text-xs text-gray-500 px-1">
        <span>
          {lang === 'ar' ? `عرض ${filteredProjects.length} مشروع` : `Showing ${filteredProjects.length} projects`}
        </span>
        {(searchQuery || activeCategory !== 'all' || selectedStatus !== 'all') && (
          <button
            onClick={() => {
              setActiveCategory('all');
              setSearchQuery('');
              setSelectedStatus('all');
            }}
            className="text-[#0A5C4B] font-bold hover:underline"
          >
            {lang === 'ar' ? 'إعادة ضبط التصفية' : 'Reset Filters'}
          </button>
        )}
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-gray-200 space-y-3">
          <p className="text-gray-500 font-semibold text-base">
            {lang === 'ar' ? 'لم يتم العثور على مشاريع مطابقة لبحثك' : 'No projects match your criteria'}
          </p>
          <button
            onClick={() => { setActiveCategory('all'); setSearchQuery(''); setSelectedStatus('all'); }}
            className="px-6 py-2.5 rounded-xl bg-[#0A5C4B] text-white text-xs font-bold"
          >
            {lang === 'ar' ? 'عرض كافة المشاريع' : 'Show All'}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => {
            const percent = project.targetAmount && project.raisedAmount
              ? Math.min(100, Math.round((project.raisedAmount / project.targetAmount) * 100))
              : null;

            return (
              <div
                key={project.id}
                className="bg-white rounded-3xl overflow-hidden border border-gray-200/80 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col group"
              >
                {/* Image & Video Thumbnail */}
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
                    <span className="bg-[#0A5C4B]/95 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full shadow-xs">
                      {strings.categories[project.category] || project.category}
                    </span>
                  </div>

                  {/* Status Pill */}
                  <div className="absolute top-3 end-3">
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full backdrop-blur-md ${
                      project.status === 'completed'
                        ? 'bg-emerald-600/90 text-white'
                        : project.status === 'ongoing'
                        ? 'bg-blue-600/90 text-white'
                        : 'bg-[#C9A227]/90 text-gray-950 font-extrabold'
                    }`}>
                      {strings.status[project.status]}
                    </span>
                  </div>

                  {/* Video Play Button (if exists) */}
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

                {/* Card Info */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="font-bold text-lg text-gray-900 group-hover:text-[#0A5C4B] transition-colors leading-snug font-cairo">
                      {project.title}
                    </h3>
                    <p className="text-xs text-gray-600 mt-2 line-clamp-2 leading-relaxed">
                      {project.shortDescription}
                    </p>
                  </div>

                  {/* Target & Progress */}
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

                  {/* Actions */}
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
      )}

      {/* DETAILED PROJECT MODAL (When clicked) */}
      {activeModalProject && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto"
          onClick={() => setSelectedProjectForModal(null)}
        >
          <div 
            className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200 my-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Image Header */}
            <div className="relative aspect-video w-full bg-gray-900 overflow-hidden">
              <img
                src={activeModalProject.coverImage}
                alt={activeModalProject.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/30" />

              <button
                onClick={() => setSelectedProjectForModal(null)}
                className="absolute top-4 end-4 p-2 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Video button if available */}
              {activeModalProject.videoUrl && (
                <button
                  onClick={() => openVideoModal(activeModalProject.videoUrl!)}
                  className="absolute bottom-4 end-4 flex items-center gap-2 px-4 py-2 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold text-xs shadow-lg transition-transform hover:scale-105"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>{strings.watchVideo}</span>
                </button>
              )}

              <div className="absolute bottom-4 start-4 text-white space-y-1">
                <span className="bg-[#0A5C4B] px-3 py-1 rounded-full text-xs font-bold inline-block">
                  {strings.categories[activeModalProject.category] || activeModalProject.category}
                </span>
                <div className="flex items-center gap-1.5 text-xs text-white/90">
                  <MapPin className="w-3.5 h-3.5 text-[#E0BA3E]" />
                  <span>{activeModalProject.location}</span>
                </div>
              </div>
            </div>

            {/* Modal Details Content */}
            <div className="p-6 sm:p-8 space-y-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-gray-900 font-cairo">
                  {activeModalProject.title}
                </h2>
                <p className="text-sm text-gray-700 mt-4 leading-relaxed whitespace-pre-line font-normal">
                  {activeModalProject.fullDescription || activeModalProject.shortDescription}
                </p>
              </div>

              {/* Progress and Numbers */}
              {activeModalProject.targetAmount && activeModalProject.raisedAmount && (
                <div className="p-5 bg-[#F8F5F0] rounded-2xl border border-gray-200/80 space-y-3">
                  <div className="flex justify-between items-center text-sm font-bold">
                    <span className="text-gray-600">{strings.raised}</span>
                    <span className="text-[#0A5C4B] text-lg">
                      {formatCurrency(activeModalProject.raisedAmount, 'EGP', lang)}
                    </span>
                  </div>

                  <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-[#0A5C4B] to-[#C9A227] h-full rounded-full"
                      style={{
                        width: `${Math.min(100, Math.round((activeModalProject.raisedAmount / activeModalProject.targetAmount) * 100))}%`
                      }}
                    />
                  </div>

                  <div className="flex justify-between text-xs text-gray-500 font-semibold">
                    <span>{strings.target}: {formatCurrency(activeModalProject.targetAmount, 'EGP', lang)}</span>
                    {activeModalProject.beneficiaries && (
                      <span className="text-emerald-700">
                        {formatNumber(activeModalProject.beneficiaries, lang)} {strings.beneficiaries}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                <button
                  onClick={() => {
                    setSelectedProjectForModal(null);
                    setQuickDonateModalOpen(true);
                  }}
                  className="w-full sm:flex-1 py-3.5 rounded-2xl bg-[#0A5C4B] hover:bg-[#073229] text-white font-bold text-base transition-transform hover:scale-[1.01] flex items-center justify-center gap-2 shadow-lg"
                >
                  <Heart className="w-5 h-5 fill-rose-300 text-rose-300" />
                  <span>{strings.donateNow} ({strings.sadaqaSubtitle.split(' ')[0]}...)</span>
                </button>

                <button
                  onClick={() => setSelectedProjectForModal(null)}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs"
                >
                  {lang === 'ar' ? 'إغلاق النافذة' : 'Close'}
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};
