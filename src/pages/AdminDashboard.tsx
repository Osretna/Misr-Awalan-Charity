import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { t } from '../utils/translations';
import { Project, ProjectCategory, BankAccount, OrganizationValue, BoardMember } from '../types';
import { formatCurrency, formatNumber } from '../utils/helpers';
import { 
  auth, 
  fbSignOut, 
  signInWithEmailAndPassword 
} from '../firebase';
import { 
  ShieldCheck, 
  Plus, 
  Edit2, 
  Trash2, 
  Star, 
  Image, 
  Video, 
  Play,
  Save, 
  Lock, 
  LogIn, 
  LogOut, 
  Sparkles, 
  BarChart3, 
  Globe, 
  FileText, 
  Users, 
  Heart,
  CheckCircle2,
  X,
  Building,
  Phone,
  MapPin,
  Smartphone,
  CreditCard,
  QrCode,
  Info,
  Check
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { 
    lang, 
    user, 
    isAdmin, 
    projects, 
    stats, 
    settings, 
    donations, 
    addProject, 
    updateProject, 
    deleteProject, 
    updateStats, 
    updateSettings,
    openVideoModal
  } = useApp();

  const strings = t[lang];

  // Auth inputs - strictly secret (no credentials shown on screen)
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);

  // Tabs: 'projects' | 'org_info' | 'donation_channels' | 'stats' | 'seo' | 'donations'
  const [activeTab, setActiveTab] = useState<'projects' | 'org_info' | 'donation_channels' | 'stats' | 'seo' | 'donations'>('projects');

  // Success banners
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setSaveSuccessMsg(msg);
    setTimeout(() => setSaveSuccessMsg(null), 3500);
  };

  // --- PROJECT FORM MODAL STATE ---
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState<ProjectCategory>('water');
  const [formShortDesc, setFormShortDesc] = useState('');
  const [formFullDesc, setFormFullDesc] = useState('');
  const [formCoverImage, setFormCoverImage] = useState('');
  const [formVideoUrl, setFormVideoUrl] = useState('');
  const [formLocation, setFormLocation] = useState('');
  const [formTargetAmount, setFormTargetAmount] = useState<string>('500000');
  const [formRaisedAmount, setFormRaisedAmount] = useState<string>('0');
  const [formBeneficiaries, setFormBeneficiaries] = useState<string>('5000');
  const [formIsFeatured, setFormIsFeatured] = useState<boolean>(true);
  const [formStatus, setFormStatus] = useState<'active' | 'completed' | 'ongoing'>('active');
  const [savingProject, setSavingProject] = useState(false);

  // --- ORG & ABOUT SETTINGS FORM STATE ---
  const [orgLogoUrl, setOrgLogoUrl] = useState(settings.logoUrl);
  const [orgNameAr, setOrgNameAr] = useState(settings.orgNameAr);
  const [orgNameEn, setOrgNameEn] = useState(settings.orgNameEn);
  const [sloganAr, setSloganAr] = useState(settings.sloganAr);
  const [licenseNumber, setLicenseNumber] = useState(settings.licenseNumber);
  const [phone1, setPhone1] = useState(settings.phone1);
  const [phone2, setPhone2] = useState(settings.phone2);
  const [address, setAddress] = useState(settings.address);
  const [officialEmail, setOfficialEmail] = useState(settings.officialEmail);
  const [taxNumber, setTaxNumber] = useState(settings.taxNumber);

  const [aboutBrief, setAboutBrief] = useState(settings.aboutBrief);
  const [aboutVision, setAboutVision] = useState(settings.aboutVision);
  const [aboutMission, setAboutMission] = useState(settings.aboutMission);
  const [aboutHistory, setAboutHistory] = useState(settings.aboutHistory);
  const [valuesList, setValuesList] = useState<OrganizationValue[]>(settings.values || []);
  const [boardList, setBoardList] = useState<BoardMember[]>(settings.boardMembers || []);

  // --- DONATION CHANNELS STATE ---
  const [bankAccountsList, setBankAccountsList] = useState<BankAccount[]>(settings.bankAccounts || []);
  const [vodafoneCashCode, setVodafoneCashCode] = useState(settings.vodafoneCashCode);
  const [opPayCode, setOpPayCode] = useState(settings.opPayCode);
  const [smsNumber, setSmsNumber] = useState(settings.smsNumber);
  const [instaPayAddress, setInstaPayAddress] = useState(settings.instaPayAddress);

  // --- STATS FORM STATE ---
  const [statFamilies, setStatFamilies] = useState(stats.familiesHelped);
  const [statMeals, setStatMeals] = useState(stats.mealsDistributed);
  const [statOrphans, setStatOrphans] = useState(stats.orphansSponsored);
  const [statWells, setStatWells] = useState(stats.waterWellsBuilt);
  const [statMedical, setStatMedical] = useState(stats.medicalConvoys);
  const [statHomes, setStatHomes] = useState(stats.homesRestored);

  // --- SEO FORM STATE ---
  const [seoMetaTitle, setSeoMetaTitle] = useState(settings.metaTitle);
  const [seoMetaDesc, setSeoMetaDesc] = useState(settings.metaDescription);
  const [seoKeywords, setSeoKeywords] = useState(settings.keywords);

  // --- DELETE CONFIRMATION STATE (Works 100% in sandboxed iframes) ---
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [isDeletingProject, setIsDeletingProject] = useState(false);

  // Sync settings whenever updated or loaded from Firestore
  React.useEffect(() => {
    if (settings) {
      setOrgLogoUrl(settings.logoUrl || '');
      setOrgNameAr(settings.orgNameAr || '');
      setOrgNameEn(settings.orgNameEn || '');
      setSloganAr(settings.sloganAr || '');
      setLicenseNumber(settings.licenseNumber || '');
      setPhone1(settings.phone1 || '');
      setPhone2(settings.phone2 || '');
      setAddress(settings.address || '');
      setOfficialEmail(settings.officialEmail || '');
      setTaxNumber(settings.taxNumber || '');
      setAboutBrief(settings.aboutBrief || '');
      setAboutVision(settings.aboutVision || '');
      setAboutMission(settings.aboutMission || '');
      setAboutHistory(settings.aboutHistory || '');
      if (settings.values) setValuesList(settings.values);
      if (settings.boardMembers) setBoardList(settings.boardMembers);
      if (settings.bankAccounts) setBankAccountsList(settings.bankAccounts);
      setVodafoneCashCode(settings.vodafoneCashCode || '');
      setOpPayCode(settings.opPayCode || '');
      setSmsNumber(settings.smsNumber || '');
      setInstaPayAddress(settings.instaPayAddress || '');
      setSeoMetaTitle(settings.metaTitle || '');
      setSeoMetaDesc(settings.metaDescription || '');
      setSeoKeywords(settings.keywords || '');
    }
  }, [settings]);

  // Sync stats whenever updated or loaded from Firestore
  React.useEffect(() => {
    if (stats) {
      setStatFamilies(stats.familiesHelped || 0);
      setStatMeals(stats.mealsDistributed || 0);
      setStatOrphans(stats.orphansSponsored || 0);
      setStatWells(stats.waterWellsBuilt || 0);
      setStatMedical(stats.medicalConvoys || 0);
      setStatHomes(stats.homesRestored || 0);
    }
  }, [stats]);

  // AUTHENTICATION LOGIC
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError(null);

    const cleanUser = usernameInput.trim();
    const cleanPass = passwordInput.trim();

    // Check exact secret admin credentials requested: admin / admin1234
    if (
      (cleanUser === 'admin' || cleanUser === 'admin@misrawalan.org') &&
      cleanPass === 'admin1234'
    ) {
      window.sessionStorage.setItem('misr_admin_session', 'true');
      setAuthLoading(false);
      window.location.reload();
      return;
    }

    // Also attempt Firebase auth if email is provided
    try {
      if (cleanUser.includes('@')) {
        await signInWithEmailAndPassword(auth, cleanUser, cleanPass);
        setAuthLoading(false);
        return;
      }
      setAuthError(lang === 'ar' ? 'بيانات الدخول غير صحيحة.' : 'Invalid credentials.');
    } catch (err: unknown) {
      setAuthError(lang === 'ar' ? 'اسم المستخدم أو كلمة المرور غير صحيحة.' : 'Invalid credentials.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = async () => {
    window.sessionStorage.removeItem('misr_admin_session');
    await fbSignOut(auth);
    window.location.reload();
  };

  const isSessionAdmin = typeof window !== 'undefined' && window.sessionStorage.getItem('misr_admin_session') === 'true';
  const hasAccess = isSessionAdmin || isAdmin;

  // --- PROJECT ACTIONS ---
  const openCreateProjectModal = () => {
    setEditingProjectId(null);
    setFormTitle('');
    setFormCategory('water');
    setFormShortDesc('');
    setFormFullDesc('');
    setFormCoverImage('https://images.unsplash.com/photo-1541544741938-0af808871cc0?auto=format&fit=crop&w=1200&q=80');
    setFormVideoUrl('');
    setFormLocation('محافظة سوهاج، صعيد مصر');
    setFormTargetAmount('500000');
    setFormRaisedAmount('0');
    setFormBeneficiaries('5000');
    setFormIsFeatured(true);
    setFormStatus('active');
    setIsProjectModalOpen(true);
  };

  const openEditProjectModal = (proj: Project) => {
    setEditingProjectId(proj.id);
    setFormTitle(proj.title);
    setFormCategory(proj.category);
    setFormShortDesc(proj.shortDescription);
    setFormFullDesc(proj.fullDescription || proj.shortDescription);
    setFormCoverImage(proj.coverImage);
    setFormVideoUrl(proj.videoUrl || '');
    setFormLocation(proj.location);
    setFormTargetAmount(String(proj.targetAmount || 0));
    setFormRaisedAmount(String(proj.raisedAmount || 0));
    setFormBeneficiaries(String(proj.beneficiaries || 0));
    setFormIsFeatured(proj.isFeatured);
    setFormStatus(proj.status);
    setIsProjectModalOpen(true);
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formShortDesc.trim() || !formCoverImage.trim()) {
      showToast(lang === 'ar' ? 'يرجى ملء الحقول الإلزامية (العنوان، الوصف المختصر، صورة الغلاف)' : 'Please fill required fields');
      return;
    }

    setSavingProject(true);
    try {
      const payload = {
        title: formTitle.trim(),
        category: formCategory,
        shortDescription: formShortDesc.trim(),
        fullDescription: (formFullDesc || formShortDesc).trim(),
        coverImage: formCoverImage.trim(),
        videoUrl: formVideoUrl.trim() || '',
        location: formLocation.trim() || 'شبرا الخيمة، مصر',
        targetAmount: Number(formTargetAmount) || 0,
        raisedAmount: Number(formRaisedAmount) || 0,
        beneficiaries: Number(formBeneficiaries) || 0,
        isFeatured: Boolean(formIsFeatured),
        status: formStatus,
      };

      if (editingProjectId) {
        await updateProject(editingProjectId, payload);
        showToast(lang === 'ar' ? '✅ تم حفظ تعديلات المشروع في قاعدة البيانات فوراً!' : 'Project updated in Firestore!');
      } else {
        await addProject(payload);
        showToast(lang === 'ar' ? '✅ تم نشر وإضافة المشروع الجديد فوراً في قاعدة البيانات!' : 'Project created in Firestore!');
      }

      setIsProjectModalOpen(false);
    } catch (err) {
      console.error('Error saving project:', err);
      showToast(lang === 'ar' ? '❌ حدث خطأ أثناء الحفظ، يرجى إعادة المحاولة' : 'Failed to save project');
    } finally {
      setSavingProject(false);
    }
  };

  const confirmDeleteProject = async () => {
    if (!projectToDelete) return;
    setIsDeletingProject(true);
    try {
      await deleteProject(projectToDelete.id);
      showToast(lang === 'ar' ? '✅ تم حذف المشروع نهائياً وبنجاح من الموقع وقاعدة البيانات.' : 'Project deleted from Firestore.');
      setProjectToDelete(null);
    } catch (err) {
      console.error('Error deleting project:', err);
      showToast(lang === 'ar' ? '❌ حدث خطأ أثناء الحذف.' : 'Failed to delete project');
    } finally {
      setIsDeletingProject(false);
    }
  };

  // --- SAVE ORG & ABOUT INFORMATION ---
  const handleSaveOrgInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateSettings({
        logoUrl: orgLogoUrl.trim(),
        orgNameAr: orgNameAr.trim(),
        orgNameEn: orgNameEn.trim(),
        sloganAr: sloganAr.trim(),
        licenseNumber: licenseNumber.trim(),
        phone1: phone1.trim(),
        phone2: phone2.trim(),
        address: address.trim(),
        officialEmail: officialEmail.trim(),
        taxNumber: taxNumber.trim(),
        aboutBrief: aboutBrief.trim(),
        aboutVision: aboutVision.trim(),
        aboutMission: aboutMission.trim(),
        aboutHistory: aboutHistory.trim(),
        values: valuesList,
        boardMembers: boardList,
      });
      showToast(lang === 'ar' ? '✅ تم حفظ وتحديث بيانات المنظمة في قاعدة بيانات Firebase فوراً!' : 'Organization info updated in Firestore!');
    } catch (err) {
      console.error(err);
      showToast(lang === 'ar' ? '❌ حدث خطأ أثناء الحفظ، يرجى المحاولة مرة أخرى.' : 'Error updating organization info');
    }
  };

  // --- SAVE DONATION CHANNELS ---
  const handleSaveDonationChannels = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateSettings({
        bankAccounts: bankAccountsList,
        vodafoneCashCode: vodafoneCashCode.trim(),
        opPayCode: opPayCode.trim(),
        smsNumber: smsNumber.trim(),
        instaPayAddress: instaPayAddress.trim(),
      });
      showToast(lang === 'ar' ? '✅ تم تحديث أرقام وحسابات التبرع في قاعدة البيانات فوراً!' : 'Donation channels saved!');
    } catch (err) {
      console.error(err);
      showToast(lang === 'ar' ? '❌ حدث خطأ أثناء الحفظ.' : 'Error updating donation channels');
    }
  };

  // Bank management helpers
  const handleAddBank = () => {
    setBankAccountsList(prev => [
      ...prev,
      { bankName: 'اسم البنك الجديد', accountNumber: '0000000000', currency: 'حساب رسمي' }
    ]);
  };

  const handleUpdateBank = (index: number, key: keyof BankAccount, value: string) => {
    setBankAccountsList(prev => {
      const next = [...prev];
      next[index] = { ...next[index], [key]: value };
      return next;
    });
  };

  const handleDeleteBank = (index: number) => {
    setBankAccountsList(prev => prev.filter((_, i) => i !== index));
    showToast(lang === 'ar' ? 'تم حذف الحساب من القائمة (اضغط حفظ بالأسفل للتأكيد)' : 'Bank removed from list');
  };

  // Values management helpers
  const handleAddValue = () => {
    setValuesList(prev => [
      ...prev,
      { id: 'val-' + Date.now(), title: 'قيمة جديدة', desc: 'اكتب وصفاً مختصراً لهذه القيمة...' }
    ]);
  };

  const handleUpdateValue = (index: number, key: 'title' | 'desc', val: string) => {
    setValuesList(prev => {
      const next = [...prev];
      next[index] = { ...next[index], [key]: val };
      return next;
    });
  };

  const handleDeleteValue = (index: number) => {
    setValuesList(prev => prev.filter((_, i) => i !== index));
    showToast(lang === 'ar' ? 'تم حذف القيمة من القائمة (اضغط حفظ بالأسفل للتأكيد)' : 'Value removed from list');
  };

  // Board management helpers
  const handleAddBoardMember = () => {
    setBoardList(prev => [
      ...prev,
      { id: 'bm-' + Date.now(), name: 'الاسم الكريم', role: 'المنصب / الصفة', bio: 'نبذة مختصرة...' }
    ]);
  };

  const handleUpdateBoardMember = (index: number, key: 'name' | 'role' | 'bio', val: string) => {
    setBoardList(prev => {
      const next = [...prev];
      next[index] = { ...next[index], [key]: val };
      return next;
    });
  };

  const handleDeleteBoardMember = (index: number) => {
    setBoardList(prev => prev.filter((_, i) => i !== index));
    showToast(lang === 'ar' ? 'تم حذف العضو من القائمة (اضغط حفظ بالأسفل للتأكيد)' : 'Member removed from list');
  };

  // --- SAVE STATS ---
  const handleSaveStats = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateStats({
        familiesHelped: Number(statFamilies),
        mealsDistributed: Number(statMeals),
        orphansSponsored: Number(statOrphans),
        waterWellsBuilt: Number(statWells),
        medicalConvoys: Number(statMedical),
        homesRestored: Number(statHomes),
      });
      showToast(lang === 'ar' ? '✅ تم تحديث أرقام وإحصائيات الأثر في قاعدة البيانات فوراً!' : 'Stats updated in Firestore!');
    } catch (err) {
      console.error(err);
      showToast(lang === 'ar' ? '❌ حدث خطأ أثناء تحديث الإحصائيات.' : 'Error updating stats');
    }
  };

  // --- SAVE SEO ---
  const handleSaveSeo = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateSettings({
        metaTitle: seoMetaTitle.trim(),
        metaDescription: seoMetaDesc.trim(),
        keywords: seoKeywords.trim(),
      });
      showToast(lang === 'ar' ? '✅ تم حفظ إعدادات محركات البحث SEO بنجاح في قاعدة البيانات!' : 'SEO settings saved!');
    } catch (err) {
      console.error(err);
      showToast(lang === 'ar' ? '❌ حدث خطأ أثناء حفظ إعدادات SEO.' : 'Error updating SEO');
    }
  };


  // 1. IF NOT LOGGED IN: SECURE LOGIN SCREEN (NO VISIBLE CREDENTIALS)
  if (!hasAccess) {
    return (
      <div className="py-20 px-4 sm:px-6 lg:px-8 max-w-md mx-auto">
        <div className="bg-white rounded-3xl p-8 border border-gray-200/90 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 mx-auto rounded-3xl bg-[#0A5C4B] text-[#E0BA3E] flex items-center justify-center shadow-lg">
              <Lock className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-black text-gray-900 font-cairo">
              {lang === 'ar' ? 'بوابة إدارة منظمة مصر أولاً' : 'Admin Portal Login'}
            </h2>
            <p className="text-xs text-gray-500">
              {lang === 'ar' ? 'يرجى إدخال بيانات المشرف المصرح له' : 'Enter authorized credentials'}
            </p>
          </div>

          {authError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 text-center font-medium animate-in fade-in">
              {authError}
            </div>
          )}

          {/* Secure Login Form */}
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                {lang === 'ar' ? 'اسم المستخدم أو البريد الإلكتروني' : 'Username or Email'}
              </label>
              <input
                type="text"
                required
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                autoComplete="username"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs text-gray-900 focus:outline-hidden focus:border-[#0A5C4B] focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1.5">
                {lang === 'ar' ? 'كلمة المرور' : 'Password'}
              </label>
              <input
                type="password"
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                autoComplete="current-password"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-xs text-gray-900 focus:outline-hidden focus:border-[#0A5C4B] focus:bg-white"
              />
            </div>

            <button
              type="submit"
              disabled={authLoading}
              className="w-full py-3.5 rounded-xl bg-[#0A5C4B] hover:bg-[#073229] text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 mt-2"
            >
              <LogIn className="w-4 h-4" />
              <span>{authLoading ? (lang === 'ar' ? 'جاري التحقق...' : 'Checking...') : (lang === 'ar' ? 'دخول لوحة التحكم' : 'Log In')}</span>
            </button>
          </form>

          <div className="pt-2 text-center text-[11px] text-gray-400">
            {settings.licenseNumber}
          </div>
        </div>
      </div>
    );
  }

  // 2. AUTHENTICATED ADMIN DASHBOARD
  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      
      {/* Toast Notification */}
      {saveSuccessMsg && (
        <div className="fixed top-5 start-1/2 -translate-x-1/2 z-50 bg-[#0A5C4B] text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-2 text-xs font-bold animate-in fade-in slide-in-from-top-4 border-2 border-[#C9A227]">
          <CheckCircle2 className="w-5 h-5 text-[#E0BA3E]" />
          <span>{saveSuccessMsg}</span>
        </div>
      )}

      {/* Top Banner: Admin Info & Quick Actions */}
      <div className="bg-white rounded-3xl p-6 border border-gray-200/80 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-2xl bg-white p-1 border-2 border-[#C9A227] flex items-center justify-center shrink-0">
            <img src={settings.logoUrl} alt="Logo" className="w-full h-full object-contain rounded-full" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold text-gray-900 font-cairo">
                {lang === 'ar' ? 'لوحة تحكم منظمة مصر أولاً' : 'Misr Awalan Admin Portal'}
              </h1>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-extrabold px-2.5 py-0.5 rounded-full">
                {settings.licenseNumber}
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              {settings.address} • {settings.phone1}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={openCreateProjectModal}
            className="px-4 py-2.5 rounded-xl bg-[#0A5C4B] hover:bg-[#073229] text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>{lang === 'ar' ? 'إضافة مشروع جديد' : 'New Project'}</span>
          </button>

          <button
            onClick={handleLogout}
            className="p-2.5 rounded-xl bg-gray-100 hover:bg-red-50 hover:text-red-600 text-gray-600 text-xs font-bold transition-colors"
            title="تسجيل الخروج"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-gray-200 pb-2 overflow-x-auto">
        {[
          { id: 'projects', label: lang === 'ar' ? 'إدارة المشاريع والأعمال' : 'Projects Manager', icon: FileText },
          { id: 'org_info', label: lang === 'ar' ? 'بيانات المنظمة و"عن المنظمة"' : 'About & Identity', icon: Info },
          { id: 'donation_channels', label: lang === 'ar' ? 'قنوات وحسابات التبرع' : 'Donation Channels', icon: CreditCard },
          { id: 'stats', label: lang === 'ar' ? 'أرقام وإحصائيات الأثر' : 'Impact Stats', icon: BarChart3 },
          { id: 'seo', label: lang === 'ar' ? 'إعدادات SEO' : 'SEO Settings', icon: Globe },
          { id: 'donations', label: lang === 'ar' ? 'سجل التبرعات' : 'Donations Log', icon: Heart },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`whitespace-nowrap px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
                isActive
                  ? 'bg-[#0A5C4B] text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: PROJECTS MANAGEMENT */}
      {activeTab === 'projects' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-gray-900 font-cairo">
              {lang === 'ar' ? `قائمة الأعمال الميدانية (${projects.length})` : `All Projects (${projects.length})`}
            </h3>
            <button
              onClick={openCreateProjectModal}
              className="px-4 py-2 rounded-xl bg-[#0A5C4B] text-white text-xs font-bold hover:bg-[#073229] transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'إضافة عمل' : 'Add Work'}</span>
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-gray-200/80 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-start">
                <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-bold uppercase">
                  <tr>
                    <th className="py-3 px-4">{lang === 'ar' ? 'المشروع' : 'Project'}</th>
                    <th className="py-3 px-4">{lang === 'ar' ? 'التصنيف' : 'Category'}</th>
                    <th className="py-3 px-4">{lang === 'ar' ? 'الموقع' : 'Location'}</th>
                    <th className="py-3 px-4">{lang === 'ar' ? 'فيديو' : 'Video'}</th>
                    <th className="py-3 px-4">{lang === 'ar' ? 'الرئيسية' : 'Featured'}</th>
                    <th className="py-3 px-4 text-center">{lang === 'ar' ? 'إجراءات' : 'Actions'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {projects.map((proj) => (
                    <tr key={proj.id} className="hover:bg-gray-50/70 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={proj.coverImage}
                            alt=""
                            className="w-12 h-10 rounded-lg object-cover bg-gray-100 shrink-0"
                          />
                          <div>
                            <div className="font-bold text-gray-900 line-clamp-1">{proj.title}</div>
                            <div className="text-[11px] text-gray-400">{proj.shortDescription.slice(0, 45)}...</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="bg-[#0A5C4B]/10 text-[#0A5C4B] font-bold px-2 py-0.5 rounded-md">
                          {strings.categories[proj.category] || proj.category}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-600">{proj.location}</td>
                      <td className="py-3 px-4">
                        {proj.videoUrl ? (
                          <button
                            type="button"
                            onClick={() => openVideoModal(proj.videoUrl!)}
                            className="text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-2.5 py-1 rounded-xl font-bold flex items-center gap-1.5 transition-colors text-xs border border-red-200 shadow-2xs cursor-pointer"
                            title={lang === 'ar' ? 'تشغيل ومعاينة الفيديو' : 'Preview Video'}
                          >
                            <Video className="w-3.5 h-3.5" />
                            <span>{lang === 'ar' ? 'معاينة الفيديو' : 'Watch'}</span>
                          </button>
                        ) : (
                          <span className="text-gray-400 text-xs">-</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => updateProject(proj.id, { isFeatured: !proj.isFeatured })}
                          className={`p-1.5 rounded-lg transition-colors ${
                            proj.isFeatured
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-gray-100 text-gray-400 hover:text-gray-700'
                          }`}
                          title="تثبيت بالرئيسية"
                        >
                          <Star className={`w-4 h-4 ${proj.isFeatured ? 'fill-current' : ''}`} />
                        </button>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => openEditProjectModal(proj)}
                            className="p-1.5 rounded-lg bg-gray-100 hover:bg-[#0A5C4B] hover:text-white text-gray-700 transition-colors"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setProjectToDelete(proj)}
                            title={lang === 'ar' ? 'حذف المشروع' : 'Delete project'}
                            className="p-1.5 rounded-lg bg-gray-100 hover:bg-red-600 hover:text-white text-gray-700 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: ORGANIZATION DETAILS & "ABOUT US" MANAGEMENT */}
      {activeTab === 'org_info' && (
        <form onSubmit={handleSaveOrgInfo} className="space-y-8">
          
          {/* Section A: Brand & Contact Info */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-sm space-y-5">
            <h3 className="font-bold text-lg text-gray-900 font-cairo flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#0A5C4B]" />
              <span>{lang === 'ar' ? 'الهوية الرسمية وبيانات الاتصال والترخيص' : 'Identity & Official Licenses'}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  {lang === 'ar' ? 'رابط الشعار الرسمي (Logo URL)' : 'Logo Image URL'}
                </label>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-12 h-12 rounded-full border border-gray-300 overflow-hidden bg-white shrink-0 flex items-center justify-center p-0.5 shadow-sm">
                    {orgLogoUrl ? (
                      <img src={orgLogoUrl} alt="Logo" className="w-full h-full object-contain" />
                    ) : (
                      <span className="text-[10px] text-gray-400">لا يوجد</span>
                    )}
                  </div>
                  <input
                    type="text"
                    value={orgLogoUrl}
                    onChange={(e) => setOrgLogoUrl(e.target.value)}
                    placeholder="/assets/aistudio/..."
                    className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-900 focus:outline-hidden focus:border-[#0A5C4B]"
                  />
                </div>
                <div className="flex flex-wrap gap-1.5 text-[11px]">
                  <span className="text-gray-500 font-bold self-center text-[10px]">اختيار سريع:</span>
                  <button
                    type="button"
                    onClick={() => setOrgLogoUrl('/assets/aistudio/309211266_404166348563693_8027332630712114535_n__1__bf2c442e.png')}
                    className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-[#0A5C4B] font-bold border border-emerald-200 transition-colors"
                  >
                    الشعار الدائري الرسمي
                  </button>
                  <button
                    type="button"
                    onClick={() => setOrgLogoUrl('/assets/aistudio/content_7eaea990.png')}
                    className="px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold border border-amber-200 transition-colors"
                  >
                    كارت المنظمة الرسمي
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  {lang === 'ar' ? 'رقم الترخيص الرسمي *' : 'Official License *'}
                </label>
                <input
                  type="text"
                  required
                  value={licenseNumber}
                  onChange={(e) => setLicenseNumber(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-900 focus:outline-hidden focus:border-[#0A5C4B]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  {lang === 'ar' ? 'اسم المنظمة بالعربية' : 'Org Name (AR)'}
                </label>
                <input
                  type="text"
                  value={orgNameAr}
                  onChange={(e) => setOrgNameAr(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-900 focus:outline-hidden focus:border-[#0A5C4B]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  {lang === 'ar' ? 'الشعار النصي (Slogan)' : 'Slogan'}
                </label>
                <input
                  type="text"
                  value={sloganAr}
                  onChange={(e) => setSloganAr(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-900 focus:outline-hidden focus:border-[#0A5C4B]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  {lang === 'ar' ? 'رقم الهاتف الأول (واتساب وتواصل)' : 'Phone 1'}
                </label>
                <input
                  type="text"
                  value={phone1}
                  onChange={(e) => setPhone1(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-900 focus:outline-hidden focus:border-[#0A5C4B]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  {lang === 'ar' ? 'رقم الهاتف الثاني' : 'Phone 2'}
                </label>
                <input
                  type="text"
                  value={phone2}
                  onChange={(e) => setPhone2(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-900 focus:outline-hidden focus:border-[#0A5C4B]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  {lang === 'ar' ? 'عنوان المقر الرئيسي بالتفصيل' : 'Official Headquarters Address'}
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-900 focus:outline-hidden focus:border-[#0A5C4B]"
                />
              </div>
            </div>
          </div>

          {/* Section B: About Us Page Content */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-sm space-y-5">
            <h3 className="font-bold text-lg text-gray-900 font-cairo flex items-center gap-2">
              <Info className="w-5 h-5 text-[#0A5C4B]" />
              <span>{lang === 'ar' ? 'محتوى صفحة "عن المنظمة" (الرؤية، الرسالة، النبذة، والنشأة)' : 'About Page Content'}</span>
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  {lang === 'ar' ? 'نبذة تعريفية عن المنظمة' : 'About Organization Brief'}
                </label>
                <textarea
                  rows={4}
                  value={aboutBrief}
                  onChange={(e) => setAboutBrief(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-900 focus:outline-hidden focus:border-[#0A5C4B]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    {lang === 'ar' ? 'رؤيتنا (Vision)' : 'Our Vision'}
                  </label>
                  <textarea
                    rows={3}
                    value={aboutVision}
                    onChange={(e) => setAboutVision(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-900 focus:outline-hidden focus:border-[#0A5C4B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    {lang === 'ar' ? 'رسالتنا (Mission)' : 'Our Mission'}
                  </label>
                  <textarea
                    rows={3}
                    value={aboutMission}
                    onChange={(e) => setAboutMission(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-900 focus:outline-hidden focus:border-[#0A5C4B]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  {lang === 'ar' ? 'مسيرة وتاريخ المنظمة' : 'History & Foundations'}
                </label>
                <textarea
                  rows={3}
                  value={aboutHistory}
                  onChange={(e) => setAboutHistory(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-900 focus:outline-hidden focus:border-[#0A5C4B]"
                />
              </div>
            </div>
          </div>

          {/* Section C: Values List Management */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-gray-900 font-cairo">
                {lang === 'ar' ? 'قيم المنظمة الجوهرية (إضافة / تعديل / حذف)' : 'Core Values Manager'}
              </h3>
              <button
                type="button"
                onClick={handleAddValue}
                className="px-3 py-1.5 rounded-xl bg-emerald-50 text-[#0A5C4B] font-bold text-xs hover:bg-emerald-100 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{lang === 'ar' ? 'إضافة قيمة' : 'Add Value'}</span>
              </button>
            </div>

            <div className="space-y-3">
              {valuesList.map((val, idx) => (
                <div key={val.id} className="p-3.5 bg-gray-50 rounded-2xl border border-gray-200 flex flex-col sm:flex-row items-center gap-3">
                  <div className="w-full sm:w-1/3">
                    <input
                      type="text"
                      value={val.title}
                      onChange={(e) => handleUpdateValue(idx, 'title', e.target.value)}
                      placeholder="عنوان القيمة"
                      className="w-full bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-xs font-bold"
                    />
                  </div>
                  <div className="w-full sm:flex-1">
                    <input
                      type="text"
                      value={val.desc}
                      onChange={(e) => handleUpdateValue(idx, 'desc', e.target.value)}
                      placeholder="وصف القيمة"
                      className="w-full bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-xs"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteValue(idx)}
                    className="p-1.5 text-red-500 hover:text-red-700 shrink-0"
                    title="حذف"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Save All Org Info Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-8 py-3.5 rounded-2xl bg-[#0A5C4B] hover:bg-[#073229] text-white font-bold text-xs shadow-md flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{lang === 'ar' ? 'حفظ كافة بيانات المنظمة ونشرها' : 'Save All Org Info'}</span>
            </button>
          </div>

        </form>
      )}

      {/* TAB 3: DONATION CHANNELS MANAGEMENT */}
      {activeTab === 'donation_channels' && (
        <form onSubmit={handleSaveDonationChannels} className="space-y-8">
          
          {/* Quick Pay Codes */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-sm space-y-4">
            <h3 className="font-bold text-base text-gray-900 font-cairo">
              {lang === 'ar' ? 'أكواد ومحافظ الدفع السريع المعتمدة' : 'Quick Payment & Wallet Codes'}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  {lang === 'ar' ? 'كود فودافون كاش ميجا خير' : 'Vodafone Cash Code'}
                </label>
                <input
                  type="text"
                  value={vodafoneCashCode}
                  onChange={(e) => setVodafoneCashCode(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-bold font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  {lang === 'ar' ? 'كود شبكة OpPay (أوباي)' : 'OpPay Code'}
                </label>
                <input
                  type="text"
                  value={opPayCode}
                  onChange={(e) => setOpPayCode(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-bold font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  {lang === 'ar' ? 'رقم التبرع برسائل SMS' : 'SMS Number'}
                </label>
                <input
                  type="text"
                  value={smsNumber}
                  onChange={(e) => setSmsNumber(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-bold font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  {lang === 'ar' ? 'عنوان إنستاباي اللحظي (IPA)' : 'InstaPay Handle'}
                </label>
                <input
                  type="text"
                  value={instaPayAddress}
                  onChange={(e) => setInstaPayAddress(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-bold font-mono"
                />
              </div>
            </div>
          </div>

          {/* Bank Accounts List (Banque Misr, NBE, Faisal Islamic Bank, etc.) */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-base text-gray-900 font-cairo">
                {lang === 'ar' ? 'الحسابات البنكية الرسمية (تعديل / إضافة / حذف)' : 'Official Bank Accounts'}
              </h3>
              <button
                type="button"
                onClick={handleAddBank}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-50 text-[#0A5C4B] font-bold text-xs hover:bg-emerald-100 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{lang === 'ar' ? 'إضافة بنك جديد' : 'Add Bank'}</span>
              </button>
            </div>

            <div className="space-y-3">
              {bankAccountsList.map((account, idx) => (
                <div key={idx} className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-[#0A5C4B]">حساب {idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => handleDeleteBank(idx)}
                      className="text-red-500 hover:text-red-700 text-xs font-bold flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>حذف</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] text-gray-500 mb-1">اسم البنك</label>
                      <input
                        type="text"
                        value={account.bankName}
                        onChange={(e) => handleUpdateBank(idx, 'bankName', e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-xs font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-gray-500 mb-1">رقم الحساب البنكي</label>
                      <input
                        type="text"
                        value={account.accountNumber}
                        onChange={(e) => handleUpdateBank(idx, 'accountNumber', e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-xs font-mono font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-gray-500 mb-1">بيان الحساب / العملة</label>
                      <input
                        type="text"
                        value={account.currency || ''}
                        onChange={(e) => handleUpdateBank(idx, 'currency', e.target.value)}
                        className="w-full bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-xs"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-8 py-3.5 rounded-2xl bg-[#0A5C4B] hover:bg-[#073229] text-white font-bold text-xs shadow-md flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{lang === 'ar' ? 'حفظ قنوات التبرع والحسابات' : 'Save Channels'}</span>
            </button>
          </div>

        </form>
      )}

      {/* TAB 4: IMPACT STATS */}
      {activeTab === 'stats' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-sm max-w-2xl mx-auto space-y-6">
          <div className="space-y-1">
            <h3 className="font-bold text-lg text-gray-900 font-cairo">
              {lang === 'ar' ? 'تعديل أرقام الإحصائيات والأثر الحي' : 'Live Impact Numbers'}
            </h3>
            <p className="text-xs text-gray-500">
              {lang === 'ar'
                ? 'أي تعديل هنا يتم حفظه مباشرة في قاعدة بيانات Firestore ويظهر فورياً على الموقع.'
                : 'Updates sync instantly with Firestore.'}
            </p>
          </div>

          <form onSubmit={handleSaveStats} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  {strings.stats.families}
                </label>
                <input
                  type="number"
                  value={statFamilies}
                  onChange={(e) => setStatFamilies(Number(e.target.value))}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-bold text-gray-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  {strings.stats.meals}
                </label>
                <input
                  type="number"
                  value={statMeals}
                  onChange={(e) => setStatMeals(Number(e.target.value))}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-bold text-gray-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  {strings.stats.orphans}
                </label>
                <input
                  type="number"
                  value={statOrphans}
                  onChange={(e) => setStatOrphans(Number(e.target.value))}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-bold text-gray-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  {strings.stats.water}
                </label>
                <input
                  type="number"
                  value={statWells}
                  onChange={(e) => setStatWells(Number(e.target.value))}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-bold text-gray-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  {strings.stats.medical}
                </label>
                <input
                  type="number"
                  value={statMedical}
                  onChange={(e) => setStatMedical(Number(e.target.value))}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-bold text-gray-900"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  {strings.stats.homes}
                </label>
                <input
                  type="number"
                  value={statHomes}
                  onChange={(e) => setStatHomes(Number(e.target.value))}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs font-bold text-gray-900"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#0A5C4B] hover:bg-[#073229] text-white font-bold text-xs shadow-md flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{lang === 'ar' ? 'حفظ التحديثات في Firestore' : 'Save To Firestore'}</span>
            </button>
          </form>
        </div>
      )}

      {/* TAB 5: SEO SETTINGS */}
      {activeTab === 'seo' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200/80 shadow-sm max-w-2xl mx-auto space-y-6">
          <div className="space-y-1">
            <h3 className="font-bold text-lg text-gray-900 font-cairo">
              {lang === 'ar' ? 'إعدادات محركات البحث (SEO & OpenGraph)' : 'SEO & Metadata Settings'}
            </h3>
          </div>

          <form onSubmit={handleSaveSeo} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                {lang === 'ar' ? 'عنوان الموقع (Meta Title)' : 'Meta Title'}
              </label>
              <input
                type="text"
                value={seoMetaTitle}
                onChange={(e) => setSeoMetaTitle(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-900 focus:outline-hidden focus:border-[#0A5C4B]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                {lang === 'ar' ? 'الوصف التعريفي (Meta Description)' : 'Meta Description'}
              </label>
              <textarea
                rows={3}
                value={seoMetaDesc}
                onChange={(e) => setSeoMetaDesc(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-900 focus:outline-hidden focus:border-[#0A5C4B]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                {lang === 'ar' ? 'الكلمات المفتاحية (Keywords)' : 'Keywords'}
              </label>
              <input
                type="text"
                value={seoKeywords}
                onChange={(e) => setSeoKeywords(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-900 focus:outline-hidden focus:border-[#0A5C4B]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#0A5C4B] hover:bg-[#073229] text-white font-bold text-xs shadow-md flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{lang === 'ar' ? 'حفظ إعدادات SEO' : 'Save SEO'}</span>
            </button>
          </form>
        </div>
      )}

      {/* TAB 6: DONATIONS LOG */}
      {activeTab === 'donations' && (
        <div className="space-y-4">
          <h3 className="font-bold text-base text-gray-900 font-cairo">
            {lang === 'ar' ? 'سجل التبرعات الواردة' : 'Recent Contributions'}
          </h3>

          <div className="bg-white rounded-3xl border border-gray-200/80 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-start">
                <thead className="bg-gray-50 border-b border-gray-200 text-gray-600 font-bold uppercase">
                  <tr>
                    <th className="py-3 px-4">{lang === 'ar' ? 'رقم الإيصال' : 'Reference'}</th>
                    <th className="py-3 px-4">{lang === 'ar' ? 'المتبرع' : 'Donor'}</th>
                    <th className="py-3 px-4">{lang === 'ar' ? 'المبلغ' : 'Amount'}</th>
                    <th className="py-3 px-4">{lang === 'ar' ? 'المصرف' : 'Campaign'}</th>
                    <th className="py-3 px-4">{lang === 'ar' ? 'الوسيلة' : 'Method'}</th>
                    <th className="py-3 px-4">{lang === 'ar' ? 'التاريخ' : 'Date'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {donations.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-gray-400">
                        {lang === 'ar' ? 'لا توجد تبرعات مسجلة حتى الآن.' : 'No donations recorded yet.'}
                      </td>
                    </tr>
                  ) : (
                    donations.map((d) => (
                      <tr key={d.id} className="hover:bg-gray-50 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-gray-900">{d.referenceNumber}</td>
                        <td className="py-3 px-4 font-semibold text-gray-800">{d.donorName}</td>
                        <td className="py-3 px-4 font-bold text-[#0A5C4B]">{formatCurrency(d.amount, d.currency, lang)}</td>
                        <td className="py-3 px-4 text-gray-600">{d.campaignTitle}</td>
                        <td className="py-3 px-4 uppercase text-gray-500">{d.paymentMethod}</td>
                        <td className="py-3 px-4 text-gray-400">{new Date(d.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* CREATE / EDIT PROJECT MODAL */}
      {isProjectModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto"
          onClick={() => setIsProjectModalOpen(false)}
        >
          <div 
            className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200 my-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="bg-[#0A5C4B] text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#E0BA3E]" />
                <h3 className="font-bold text-base font-cairo">
                  {editingProjectId
                    ? (lang === 'ar' ? 'تعديل بيانات المشروع' : 'Edit Project')
                    : (lang === 'ar' ? 'إضافة عمل ومبادرة جديدة' : 'Add New Project')}
                </h3>
              </div>
              <button
                onClick={() => setIsProjectModalOpen(false)}
                className="p-1 rounded-lg text-white/80 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleSaveProject} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  {lang === 'ar' ? 'عنوان المشروع / المبادرة *' : 'Project Title *'}
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder={lang === 'ar' ? 'مثال: حفر بئر مياه وتوصيل شبكة شرب بقرية...' : 'Project title...'}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-900 focus:outline-hidden focus:border-[#0A5C4B]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    {lang === 'ar' ? 'التصنيف *' : 'Category *'}
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as ProjectCategory)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-900 focus:outline-hidden focus:border-[#0A5C4B]"
                  >
                    <option value="water">سقيا الماء وحفر الآبار</option>
                    <option value="orphans">كفالة ورعاية الأيتام</option>
                    <option value="food">إطعام وكراتين الخير</option>
                    <option value="health">الصحة والقوافل الطبية</option>
                    <option value="housing">سكن وستر ودفا</option>
                    <option value="education">التعليم والتمكين الاقتصادي</option>
                    <option value="mosques">إعمار وفرش المساجد</option>
                    <option value="seasonal">حملات موسمية وإغاثة</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    {lang === 'ar' ? 'الموقع الجغرافي *' : 'Location *'}
                  </label>
                  <input
                    type="text"
                    required
                    value={formLocation}
                    onChange={(e) => setFormLocation(e.target.value)}
                    placeholder={lang === 'ar' ? 'مثال: شبرا الخيمة، أو صعيد مصر' : 'Location...'}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-900 focus:outline-hidden focus:border-[#0A5C4B]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  {lang === 'ar' ? 'وصف مختصر (يظهر في البطاقة) *' : 'Short Description *'}
                </label>
                <textarea
                  rows={2}
                  required
                  value={formShortDesc}
                  onChange={(e) => setFormShortDesc(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-900 focus:outline-hidden focus:border-[#0A5C4B]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  {lang === 'ar' ? 'الوصف الكامل والتفاصيل' : 'Full Description'}
                </label>
                <textarea
                  rows={4}
                  value={formFullDesc}
                  onChange={(e) => setFormFullDesc(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-900 focus:outline-hidden focus:border-[#0A5C4B]"
                />
              </div>

              {/* Cover Image & Video Link (External URL only to save storage) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    {lang === 'ar' ? 'رابط صورة الغلاف (Cover Image URL) *' : 'Cover Image URL *'}
                  </label>
                  <input
                    type="url"
                    required
                    value={formCoverImage}
                    onChange={(e) => setFormCoverImage(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-900 focus:outline-hidden focus:border-[#0A5C4B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    {lang === 'ar' ? 'رابط الفيديو (يوتيوب عادي / شورتس Shorts / فيميو)' : 'Video Link (YouTube / Shorts / Vimeo)'}
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={formVideoUrl}
                      onChange={(e) => setFormVideoUrl(e.target.value)}
                      placeholder="https://www.youtube.com/shorts/... أو watch?v=..."
                      className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-900 focus:outline-hidden focus:border-[#0A5C4B]"
                    />
                    {formVideoUrl.trim() && (
                      <button
                        type="button"
                        onClick={() => openVideoModal(formVideoUrl.trim())}
                        className="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 rounded-xl text-xs font-bold flex items-center gap-1 shrink-0 transition-colors cursor-pointer"
                        title="تجربة ومعاينة الفيديو الآن"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>معاينة</span>
                      </button>
                    )}
                  </div>
                  <span className="text-[10px] text-gray-500 mt-1 block">
                    {lang === 'ar' ? 'يدعم فيديوهات يوتيوب العادية، شورتس (Shorts)، وفيميو ويتم تشغيلها بسلاسة' : 'Supports YouTube, Shorts, and Vimeo links'}
                  </span>
                </div>
              </div>

              {/* Funding targets and beneficiaries */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    {lang === 'ar' ? 'المبلغ المستهدف (ج.م)' : 'Target Amount'}
                  </label>
                  <input
                    type="number"
                    value={formTargetAmount}
                    onChange={(e) => setFormTargetAmount(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    {lang === 'ar' ? 'المبلغ المحصل (ج.م)' : 'Raised So Far'}
                  </label>
                  <input
                    type="number"
                    value={formRaisedAmount}
                    onChange={(e) => setFormRaisedAmount(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-700 mb-1">
                    {lang === 'ar' ? 'عدد المستفيدين' : 'Beneficiaries'}
                  </label>
                  <input
                    type="number"
                    value={formBeneficiaries}
                    onChange={(e) => setFormBeneficiaries(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-xs text-gray-900"
                  />
                </div>
              </div>

              {/* Checkboxes: Featured & Status */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-gray-100">
                <label className="flex items-center gap-2 text-xs font-bold text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formIsFeatured}
                    onChange={(e) => setFormIsFeatured(e.target.checked)}
                    className="rounded text-[#0A5C4B] focus:ring-[#0A5C4B]"
                  />
                  <span>{lang === 'ar' ? 'تثبيت في المشاريع المميزة على الصفحة الرئيسية' : 'Feature on Homepage'}</span>
                </label>

                <div className="flex items-center gap-2">
                  <label className="text-xs font-bold text-gray-700">{lang === 'ar' ? 'الحالة:' : 'Status:'}</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value as any)}
                    className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 text-xs"
                  >
                    <option value="active">نشط</option>
                    <option value="ongoing">مستمر</option>
                    <option value="completed">مكتمل</option>
                  </select>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-4 border-t border-gray-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsProjectModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold"
                >
                  {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  disabled={savingProject}
                  className="px-6 py-2.5 rounded-xl bg-[#0A5C4B] hover:bg-[#073229] text-white text-xs font-bold shadow-md flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>{savingProject ? (lang === 'ar' ? 'جاري الحفظ...' : 'Saving...') : (lang === 'ar' ? 'حفظ ونشر فوراً' : 'Save & Publish')}</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL (Reliable in sandboxed iframes) */}
      {projectToDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-red-100 text-center space-y-5">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-red-50 text-red-600 flex items-center justify-center shadow-inner">
              <Trash2 className="w-8 h-8" />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold font-cairo text-gray-900">
                {lang === 'ar' ? 'تأكيد حذف المشروع' : 'Confirm Project Deletion'}
              </h3>
              <p className="text-xs text-gray-600 font-cairo leading-relaxed">
                {lang === 'ar' ? (
                  <>هل أنت متأكد من رغبتك في حذف المشروع: <strong className="text-red-700 font-bold block mt-1 text-sm">"{projectToDelete.title}"</strong>؟ سيتم حذفه فوراً من قاعدة البيانات والموقع بدون أي تأخير.</>
                ) : (
                  <>Are you sure you want to delete <strong className="text-red-700 font-bold block mt-1">"{projectToDelete.title}"</strong>? It will be removed immediately from Firestore.</>
                )}
              </p>
            </div>
            <div className="flex items-center gap-3 justify-center pt-2">
              <button
                type="button"
                onClick={() => setProjectToDelete(null)}
                className="px-5 py-2.5 rounded-xl border border-gray-300 font-cairo text-gray-700 hover:bg-gray-100 transition-colors text-xs font-semibold"
              >
                {lang === 'ar' ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                type="button"
                disabled={isDeletingProject}
                onClick={confirmDeleteProject}
                className="px-6 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-cairo text-xs font-bold shadow-lg shadow-red-600/30 transition-all flex items-center gap-2"
              >
                {isDeletingProject ? (
                  <span>{lang === 'ar' ? 'جاري الحذف...' : 'Deleting...'}</span>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    <span>{lang === 'ar' ? 'نعم، حذف نهائي الآن' : 'Yes, Delete Permanently'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
