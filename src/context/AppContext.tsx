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
  setDoc,
  updateDoc, 
  deleteDoc, 
  onSnapshot, 
  onAuthStateChanged, 
  User 
} from '../firebase';
import { generateRefNumber, cleanFirestoreData } from '../utils/helpers';

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

// Cache keys for instant zero-latency loading
const CACHE_PROJECTS_KEY = 'misr_cache_projects_v2';
const CACHE_SETTINGS_KEY = 'misr_cache_settings_v2';
const CACHE_STATS_KEY = 'misr_cache_stats_v2';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<'ar' | 'en'>('ar');

  // Initialize from cache or defaults for instantaneous UI
  const [projects, setProjects] = useState<Project[]>(() => {
    try {
      const cached = localStorage.getItem(CACHE_PROJECTS_KEY);
      if (cached) return JSON.parse(cached);
    } catch {}
    return [];
  });

  const [stats, setStats] = useState<ImpactStats>(() => {
    try {
      const cached = localStorage.getItem(CACHE_STATS_KEY);
      if (cached) return JSON.parse(cached);
    } catch {}
    return INITIAL_STATS;
  });

  const [news, setNews] = useState<NewsItem[]>(INITIAL_NEWS);

  const [settings, setSettings] = useState<SiteSettings>(() => {
    try {
      const cached = localStorage.getItem(CACHE_SETTINGS_KEY);
      if (cached) return JSON.parse(cached);
    } catch {}
    return INITIAL_SETTINGS;
  });

  const [donations, setDonations] = useState<Donation[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return typeof window !== 'undefined' && window.sessionStorage.getItem('misr_admin_session') === 'true';
  });
  const [loading, setLoading] = useState<boolean>(false);

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
      const isSessionAdmin = window.sessionStorage.getItem('misr_admin_session') === 'true';
      const isUserAdmin = isSessionAdmin || Boolean(
        currentUser && (
          currentUser.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase() ||
          currentUser.email?.includes('admin')
        )
      );
      setIsAdmin(isUserAdmin);
    });
    return () => unsubscribe();
  }, []);

  // --- FIRESTORE REAL-TIME SYNC ---

  // 1. Sync Settings with Firestore (Document: settings/site_settings)
  useEffect(() => {
    try {
      const settingsDocRef = doc(db, 'settings', 'site_settings');
      const unsub = onSnapshot(settingsDocRef, (snapshot) => {
        if (snapshot.exists()) {
          const remoteData = snapshot.data() as SiteSettings;
          setSettings(remoteData);
          try {
            localStorage.setItem(CACHE_SETTINGS_KEY, JSON.stringify(remoteData));
          } catch {}
        } else {
          // Document does not exist yet in Firestore, initialize it with INITIAL_SETTINGS
          setDoc(settingsDocRef, INITIAL_SETTINGS, { merge: true }).catch(err => {
            console.warn('Initial settings seed note:', err);
          });
        }
      }, (error) => {
        console.warn('Settings listener fallback:', error);
      });
      return () => unsub();
    } catch (e) {
      console.warn(e);
    }
  }, []);

  // 2. Sync Stats with Firestore (Document: stats/impact_stats)
  useEffect(() => {
    try {
      const statsDocRef = doc(db, 'stats', 'impact_stats');
      const unsub = onSnapshot(statsDocRef, (snapshot) => {
        if (snapshot.exists()) {
          const remoteData = snapshot.data() as ImpactStats;
          setStats(remoteData);
          try {
            localStorage.setItem(CACHE_STATS_KEY, JSON.stringify(remoteData));
          } catch {}
        } else {
          // Initialize in Firestore
          setDoc(statsDocRef, INITIAL_STATS, { merge: true }).catch(err => {
            console.warn('Initial stats seed note:', err);
          });
        }
      }, (error) => {
        console.warn('Stats listener fallback:', error);
      });
      return () => unsub();
    } catch (e) {
      console.warn(e);
    }
  }, []);

  // 3. Sync Projects with Firestore (Collection: projects)
  useEffect(() => {
    try {
      const unsub = onSnapshot(collection(db, 'projects'), (snapshot) => {
        const loadedProjects: Project[] = [];
        snapshot.forEach((d) => {
          loadedProjects.push({ id: d.id, ...d.data() } as Project);
        });
        // Sort projects so latest added/updated appears first
        loadedProjects.sort((a, b) => {
          const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
          const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
          return timeB - timeA;
        });
        setProjects(loadedProjects);
        try {
          localStorage.setItem(CACHE_PROJECTS_KEY, JSON.stringify(loadedProjects));
        } catch {}
      }, (error) => {
        console.warn('Projects listener warning:', error);
      });
      return () => unsub();
    } catch (e) {
      console.warn(e);
    }
  }, []);

  // 4. Sync Donations for admin
  useEffect(() => {
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
    } catch {}
  }, []);

  // --- ACTIONS WITH INSTANT PERSISTENCE ---

  const addProject = async (data: Omit<Project, 'id' | 'createdAt'>): Promise<string> => {
    // Generate clean ID
    const newId = 'proj-' + Date.now();
    const payload: Project = {
      ...data,
      id: newId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const sanitizedPayload = cleanFirestoreData(payload);

    // 1. INSTANT STATE & LOCALSTORAGE UPDATE (0ms latency for user)
    setProjects((prev) => {
      const updated = [sanitizedPayload, ...prev];
      try {
        localStorage.setItem(CACHE_PROJECTS_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });

    // 2. SAVE DIRECTLY TO FIRESTORE
    try {
      await setDoc(doc(db, 'projects', newId), sanitizedPayload);
      console.log('Project successfully persisted to Firestore:', newId);
    } catch (error) {
      console.error('Firestore addProject error:', error);
      throw error;
    }

    return newId;
  };

  const updateProject = async (id: string, updates: Partial<Project>): Promise<void> => {
    const timestamp = new Date().toISOString();
    const mergedUpdates = cleanFirestoreData({ ...updates, updatedAt: timestamp });

    // 1. INSTANT STATE & LOCALSTORAGE UPDATE
    setProjects((prev) => {
      const updated = prev.map((p) => (p.id === id ? { ...p, ...mergedUpdates } : p));
      try {
        localStorage.setItem(CACHE_PROJECTS_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });

    // 2. SAVE DIRECTLY TO FIRESTORE
    try {
      await setDoc(doc(db, 'projects', id), mergedUpdates, { merge: true });
      console.log('Project successfully updated in Firestore:', id);
    } catch (error) {
      console.error('Firestore updateProject error:', error);
      throw error;
    }
  };

  const deleteProject = async (id: string): Promise<void> => {
    // 1. INSTANT STATE & LOCALSTORAGE UPDATE (immediately removed from view)
    setProjects((prev) => {
      const updated = prev.filter((p) => p.id !== id);
      try {
        localStorage.setItem(CACHE_PROJECTS_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });

    // 2. DELETE DIRECTLY FROM FIRESTORE
    try {
      await deleteDoc(doc(db, 'projects', id));
      console.log('Project successfully deleted from Firestore:', id);
    } catch (error) {
      console.error('Firestore deleteProject error:', error);
      throw error;
    }
  };

  const updateStats = async (updates: Partial<ImpactStats>): Promise<void> => {
    const newStats: ImpactStats = {
      ...stats,
      ...updates,
      lastUpdated: new Date().toISOString(),
    };

    const sanitizedStats = cleanFirestoreData(newStats);

    // 1. INSTANT STATE & LOCALSTORAGE UPDATE
    setStats(sanitizedStats);
    try {
      localStorage.setItem(CACHE_STATS_KEY, JSON.stringify(sanitizedStats));
    } catch {}

    // 2. SAVE DIRECTLY TO FIRESTORE (fixed doc: stats/impact_stats)
    try {
      await setDoc(doc(db, 'stats', 'impact_stats'), sanitizedStats, { merge: true });
      console.log('Impact stats saved to Firestore successfully');
    } catch (error) {
      console.error('Firestore updateStats error:', error);
      throw error;
    }
  };

  const updateSettings = async (updates: Partial<SiteSettings>): Promise<void> => {
    const newSettings: SiteSettings = {
      ...settings,
      ...updates,
    };

    const sanitizedSettings = cleanFirestoreData(newSettings);

    // 1. INSTANT STATE & LOCALSTORAGE UPDATE
    setSettings(sanitizedSettings);
    try {
      localStorage.setItem(CACHE_SETTINGS_KEY, JSON.stringify(sanitizedSettings));
    } catch {}

    // 2. SAVE DIRECTLY TO FIRESTORE (fixed doc: settings/site_settings)
    try {
      await setDoc(doc(db, 'settings', 'site_settings'), sanitizedSettings, { merge: true });
      console.log('Site settings saved to Firestore successfully');
    } catch (error) {
      console.error('Firestore updateSettings error:', error);
      throw error;
    }
  };


  const addDonation = async (
    data: Omit<Donation, 'id' | 'createdAt' | 'referenceNumber'>
  ): Promise<Donation> => {
    const refNumber = generateRefNumber();
    const donId = 'don-' + Date.now();
    const payload: Donation = {
      ...data,
      id: donId,
      referenceNumber: refNumber,
      status: 'completed' as const,
      createdAt: new Date().toISOString(),
    };

    // Instant local state
    setDonations((prev) => [payload, ...prev]);
    setLatestDonationReceipt(payload);

    // Save to Firestore
    try {
      await setDoc(doc(db, 'donations', donId), payload);
    } catch (error) {
      console.warn('Firestore donation error:', error);
    }

    return payload;
  };

  const registerVolunteer = async (
    data: Omit<Volunteer, 'id' | 'createdAt' | 'status'>
  ): Promise<void> => {
    const volId = 'vol-' + Date.now();
    const payload = {
      ...data,
      id: volId,
      status: 'pending' as const,
      createdAt: new Date().toISOString(),
    };

    try {
      await setDoc(doc(db, 'volunteers', volId), payload);
    } catch (error) {
      console.warn('Volunteer registration error:', error);
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
