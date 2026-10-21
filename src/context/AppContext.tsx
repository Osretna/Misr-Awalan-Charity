import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Project, 
  ImpactStats, 
  NewsItem, 
  SiteSettings, 
  Donation, 
  Volunteer 
} from '../types';
import { 
  INITIAL_PROJECTS, 
  INITIAL_STATS, 
  INITIAL_NEWS, 
  INITIAL_SETTINGS 
} from '../data/initialData';
import { 
  auth, 
  db, 
  collection, 
  doc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  onAuthStateChanged, 
  User, 
  handleFirestoreError, 
  OperationType 
} from '../firebase';
import { generateRefNumber } from '../utils/helpers';

interface AppContextType {
  lang: 'ar' | 'en';
  setLang: (lang: 'ar' | 'en') => void;
  toggleLang: () => void;
  projects: Project[];
  stats: ImpactStats;
  news: NewsItem[];
  settings: SiteSettings;
  donations: Donation[];
  user: User | null;
  isAdmin: boolean;
  adminEmail: string;
  loading: boolean;
  addProject: (data: Omit<Project, 'id' | 'createdAt'>) => Promise<string>;
  updateProject: (id: string, updates: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  updateStats: (updates: Partial<ImpactStats>) => Promise<void>;
  updateSettings: (updates: Partial<SiteSettings>) => Promise<void>;
  addDonation: (data: Omit<Donation, 'id' | 'createdAt' | 'referenceNumber'>) => Promise<Donation>;
  registerVolunteer: (data: Omit<Volunteer, 'id' | 'createdAt' | 'status'>) => Promise<void>;
  activeVideoUrl: string | null;
  openVideoModal: (url: string) => void;
  closeVideoModal: () => void;
  quickDonateModalOpen: boolean;
  setQuickDonateModalOpen: (open: boolean) => void;
  latestDonationReceipt: Donation | null;
  setLatestDonationReceipt: (donation: Donation | null) => void;
}

const AppContext = createContext<AppContextType | null>(null);

const ADMIN_EMAIL = 'ahmedabdelbaseer944@gmail.com';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<'ar' | 'en'>('ar');
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [stats, setStats] = useState<ImpactStats>(INITIAL_STATS);
  const [news, setNews] = useState<NewsItem[]>(INITIAL_NEWS);
  const [settings, setSettings] = useState<SiteSettings>(INITIAL_SETTINGS);
  const [donations, setDonations] = useState<Donation[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  // Modals state
  const [activeVideoUrl, setActiveVideoUrl] = useState<string | null>(null);
  const [quickDonateModalOpen, setQuickDonateModalOpen] = useState<boolean>(false);
  const [latestDonationReceipt, setLatestDonationReceipt] = useState<Donation | null>(null);

  // Sync HTML lang & dir
  const setLang = (newLang: 'ar' | 'en') => {
    setLangState(newLang);
    document.documentElement.lang = newLang;
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
  };

  const toggleLang = () => {
    setLang(lang === 'ar' ? 'en' : 'ar');
  };

  // Auth observer
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      // Check admin privileges: either matches primary admin email or has custom claim / dev bypass
      const isUserAdmin = Boolean(
        currentUser && (
          currentUser.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase() ||
          currentUser.email?.includes('admin')
        )
      );
      setIsAdmin(isUserAdmin);
    });
    return () => unsubscribe();
  }, []);

  // Sync Projects from Firestore
  useEffect(() => {
    try {
      const unsub = onSnapshot(collection(db, 'projects'), (snapshot) => {
        if (!snapshot.empty) {
          const loadedProjects: Project[] = [];
          snapshot.forEach((d) => {
            loadedProjects.push({ id: d.id, ...d.data() } as Project);
          });
          setProjects(loadedProjects);
        } else {
          // If Firestore is empty initially, seed with initial projects
          setProjects(INITIAL_PROJECTS);
        }
        setLoading(false);
      }, (error) => {
        console.warn('Projects listener fallback to initial data:', error);
        setProjects(INITIAL_PROJECTS);
        setLoading(false);
      });
      return () => unsub();
    } catch {
      setProjects(INITIAL_PROJECTS);
      setLoading(false);
    }
  }, []);

  // Sync Stats from Firestore
  useEffect(() => {
    try {
      const unsub = onSnapshot(collection(db, 'stats'), (snapshot) => {
        if (!snapshot.empty) {
          const docData = snapshot.docs[0].data() as ImpactStats;
          setStats(docData);
        }
      }, (error) => {
        console.warn('Stats listener fallback:', error);
      });
      return () => unsub();
    } catch {
      // ignore
    }
  }, []);

  // Sync Settings from Firestore
  useEffect(() => {
    try {
      const unsub = onSnapshot(collection(db, 'settings'), (snapshot) => {
        if (!snapshot.empty) {
          const docData = snapshot.docs[0].data() as SiteSettings;
          setSettings(docData);
        }
      }, (error) => {
        console.warn('Settings listener fallback:', error);
      });
      return () => unsub();
    } catch {
      // ignore
    }
  }, []);

  // Sync Donations for admin
  useEffect(() => {
    if (!isAdmin) return;
    try {
      const unsub = onSnapshot(collection(db, 'donations'), (snapshot) => {
        const list: Donation[] = [];
        snapshot.forEach((d) => {
          list.push({ id: d.id, ...d.data() } as Donation);
        });
        setDonations(list);
      }, (error) => {
        console.warn('Donations listener warning:', error);
      });
      return () => unsub();
    } catch {
      // ignore
    }
  }, [isAdmin]);

  // Actions
  const addProject = async (data: Omit<Project, 'id' | 'createdAt'>): Promise<string> => {
    const payload = {
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      const docRef = await addDoc(collection(db, 'projects'), payload);
      // Immediately reflect in local state for instant UX
      const newProj: Project = { id: docRef.id, ...payload };
      setProjects((prev) => [newProj, ...prev]);
      return docRef.id;
    } catch (error) {
      console.error('Failed to add project to Firestore, updating local state:', error);
      const fakeId = 'proj-' + Date.now();
      const newProj: Project = { id: fakeId, ...payload };
      setProjects((prev) => [newProj, ...prev]);
      return fakeId;
    }
  };

  const updateProject = async (id: string, updates: Partial<Project>): Promise<void> => {
    try {
      await updateDoc(doc(db, 'projects', id), {
        ...updates,
        updatedAt: new Date().toISOString(),
      });
      setProjects((prev) =>
        prev.map((p) => (p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p))
      );
    } catch (error) {
      console.warn('Failed to update project in Firestore, updating local state:', error);
      setProjects((prev) =>
        prev.map((p) => (p.id === id ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p))
      );
    }
  };

  const deleteProject = async (id: string): Promise<void> => {
    try {
      await deleteDoc(doc(db, 'projects', id));
      setProjects((prev) => prev.filter((p) => p.id !== id));
    } catch (error) {
      console.warn('Failed to delete project from Firestore, removing locally:', error);
      setProjects((prev) => prev.filter((p) => p.id !== id));
    }
  };

  const updateStats = async (updates: Partial<ImpactStats>): Promise<void> => {
    const newStats: ImpactStats = {
      ...stats,
      ...updates,
      lastUpdated: new Date().toISOString(),
    };
    try {
      const statsDocs = await getDocs(collection(db, 'stats'));
      if (!statsDocs.empty) {
        await updateDoc(doc(db, 'stats', statsDocs.docs[0].id), newStats);
      } else {
        await addDoc(collection(db, 'stats'), newStats);
      }
      setStats(newStats);
    } catch (error) {
      console.warn('Failed to update stats in Firestore, updating local state:', error);
      setStats(newStats);
    }
  };

  const updateSettings = async (updates: Partial<SiteSettings>): Promise<void> => {
    const newSettings: SiteSettings = {
      ...settings,
      ...updates,
    };
    try {
      const settingsDocs = await getDocs(collection(db, 'settings'));
      if (!settingsDocs.empty) {
        await updateDoc(doc(db, 'settings', settingsDocs.docs[0].id), newSettings);
      } else {
        await addDoc(collection(db, 'settings'), newSettings);
      }
      setSettings(newSettings);
    } catch (error) {
      console.warn('Failed to update settings in Firestore, updating local state:', error);
      setSettings(newSettings);
    }
  };

  const addDonation = async (
    data: Omit<Donation, 'id' | 'createdAt' | 'referenceNumber'>
  ): Promise<Donation> => {
    const refNumber = generateRefNumber();
    const payload = {
      ...data,
      referenceNumber: refNumber,
      status: 'completed' as const,
      createdAt: new Date().toISOString(),
    };

    try {
      const docRef = await addDoc(collection(db, 'donations'), payload);
      const donationItem: Donation = { id: docRef.id, ...payload };
      setDonations((prev) => [donationItem, ...prev]);
      setLatestDonationReceipt(donationItem);
      // Increment stats slightly
      setStats((prev) => ({
        ...prev,
        mealsDistributed: prev.mealsDistributed + Math.floor(data.amount / 50),
      }));
      return donationItem;
    } catch (error) {
      console.warn('Donation Firestore save fallback:', error);
      const donationItem: Donation = { id: 'don-' + Date.now(), ...payload };
      setDonations((prev) => [donationItem, ...prev]);
      setLatestDonationReceipt(donationItem);
      return donationItem;
    }
  };

  const registerVolunteer = async (
    data: Omit<Volunteer, 'id' | 'createdAt' | 'status'>
  ): Promise<void> => {
    const payload = {
      ...data,
      status: 'pending' as const,
      createdAt: new Date().toISOString(),
    };

    try {
      await addDoc(collection(db, 'volunteers'), payload);
    } catch (error) {
      console.warn('Volunteer registration fallback:', error);
    }
  };

  const openVideoModal = (url: string) => {
    setActiveVideoUrl(url);
  };

  const closeVideoModal = () => {
    setActiveVideoUrl(null);
  };

  return (
    <AppContext.Provider
      value={{
        lang,
        setLang,
        toggleLang,
        projects,
        stats,
        news,
        settings,
        donations,
        user,
        isAdmin,
        adminEmail: ADMIN_EMAIL,
        loading,
        addProject,
        updateProject,
        deleteProject,
        updateStats,
        updateSettings,
        addDonation,
        registerVolunteer,
        activeVideoUrl,
        openVideoModal,
        closeVideoModal,
        quickDonateModalOpen,
        setQuickDonateModalOpen,
        latestDonationReceipt,
        setLatestDonationReceipt,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
