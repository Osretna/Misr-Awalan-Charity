import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ContactSettings, ContactHistoryItem } from '../types/contact';

const STORAGE_KEY = 'app_contact_settings_v3';
const HISTORY_KEY = 'app_contact_history_v3';
const BROADCAST_CHANNEL_NAME = 'contact_sync_channel';

export const DEFAULT_CONTACT_SETTINGS: ContactSettings = {
  primaryPhone: '01007267403',
  primaryPhoneLabel: 'الرقم المباشر الأول',
  secondaryPhone: '01118150007',
  secondaryPhoneLabel: 'الرقم المباشر الثاني',
  additionalPhones: [],
  whatsappNumber: '01118150007',
  whatsappLabel: 'واتساب خدمة العملاء والطلبات',
  whatsappSecondaryNumber: '',
  whatsappMessage: 'السلام عليكم ورحمة الله، أود الاستفسار والتواصل معكم.',
  sectionTitle: 'التواصل المباشر',
  workingHours: 'يومياً على مدار الساعة لخدمتكم',
  isAvailableNow: true,
  updatedAt: new Date().toISOString(),
  lastUpdatedBy: 'لوحة التحكم المركزية',
};

interface ContactContextType {
  settings: ContactSettings;
  updateSettings: (newSettings: Partial<ContactSettings>) => void;
  resetToDefault: () => void;
  history: ContactHistoryItem[];
  rollbackToHistory: (historyItem: ContactHistoryItem) => void;
  clearHistory: () => void;
  lastSavedAt: string | null;
  syncStatus: 'synced' | 'saving' | 'offline';
}

const ContactContext = createContext<ContactContextType | undefined>(undefined);

export const ContactProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<ContactSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...DEFAULT_CONTACT_SETTINGS, ...parsed };
      }
    } catch (e) {
      console.warn('Failed to load contact settings from localStorage', e);
    }
    return DEFAULT_CONTACT_SETTINGS;
  });

  const [history, setHistory] = useState<ContactHistoryItem[]>(() => {
    try {
      const savedHistory = localStorage.getItem(HISTORY_KEY);
      if (savedHistory) {
        return JSON.parse(savedHistory);
      }
    } catch (e) {
      console.warn('Failed to load contact history from localStorage', e);
    }
    return [
      {
        id: 'initial',
        timestamp: new Date().toISOString(),
        primaryPhone: '01007267403',
        secondaryPhone: '01118150007',
        whatsappNumber: '01118150007',
        note: 'الإعدادات الافتراضية الأولية المسجلة',
      },
    ];
  });

  const [lastSavedAt, setLastSavedAt] = useState<string | null>(null);
  const [syncStatus, setSyncStatus] = useState<'synced' | 'saving' | 'offline'>('synced');

  // Multi-tab and broadcast synchronization
  useEffect(() => {
    let broadcastChannel: BroadcastChannel | null = null;
    try {
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        broadcastChannel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
        broadcastChannel.onmessage = (event) => {
          if (event.data?.type === 'SYNC_CONTACT_SETTINGS' && event.data.settings) {
            setSettings(event.data.settings);
            setLastSavedAt(event.data.settings.updatedAt || new Date().toISOString());
            setSyncStatus('synced');
          }
        };
      }
    } catch (e) {
      console.warn('BroadcastChannel not supported or restricted', e);
    }

    // Standard storage listener for window sync
    const handleStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY && event.newValue) {
        try {
          const parsed = JSON.parse(event.newValue);
          setSettings(parsed);
          setLastSavedAt(parsed.updatedAt || new Date().toISOString());
          setSyncStatus('synced');
        } catch (err) {
          console.error('Error parsing updated settings from storage event', err);
        }
      }
    };

    // Custom window event for intra-window instantaneous updates
    const handleCustomUpdate = (event: Event) => {
      const customEvent = event as CustomEvent<ContactSettings>;
      if (customEvent.detail) {
        setSettings(customEvent.detail);
        setLastSavedAt(customEvent.detail.updatedAt || new Date().toISOString());
        setSyncStatus('synced');
      }
    };

    window.addEventListener('storage', handleStorage);
    window.addEventListener('contact_settings_updated', handleCustomUpdate);

    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('contact_settings_updated', handleCustomUpdate);
      if (broadcastChannel) {
        broadcastChannel.close();
      }
    };
  }, []);

  // Update and broadcast settings immediately
  const updateSettings = useCallback((newPartial: Partial<ContactSettings>) => {
    setSyncStatus('saving');
    const nowIso = new Date().toISOString();

    setSettings((prev) => {
      const updated: ContactSettings = {
        ...prev,
        ...newPartial,
        updatedAt: nowIso,
      };

      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

        // Add to history if numbers changed
        if (
          newPartial.primaryPhone !== undefined ||
          newPartial.secondaryPhone !== undefined ||
          newPartial.whatsappNumber !== undefined
        ) {
          const newHistoryItem: ContactHistoryItem = {
            id: `hist_${Date.now()}`,
            timestamp: nowIso,
            primaryPhone: updated.primaryPhone,
            secondaryPhone: updated.secondaryPhone,
            whatsappNumber: updated.whatsappNumber,
            note: 'تم التعديل والحفظ من لوحة التحكم',
          };

          setHistory((prevHistory) => {
            const nextHistory = [newHistoryItem, ...prevHistory.slice(0, 19)];
            try {
              localStorage.setItem(HISTORY_KEY, JSON.stringify(nextHistory));
            } catch (e) {
              console.warn('Failed to save history', e);
            }
            return nextHistory;
          });
        }

        // Broadcast to other tabs & listeners
        try {
          if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
            const channel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
            channel.postMessage({ type: 'SYNC_CONTACT_SETTINGS', settings: updated });
            channel.close();
          }
        } catch (e) {
          console.warn('Failed broadcast channel message', e);
        }

        // Dispatch custom event for current window
        window.dispatchEvent(
          new CustomEvent('contact_settings_updated', { detail: updated })
        );

        setLastSavedAt(nowIso);
        setSyncStatus('synced');
      } catch (err) {
        console.error('Failed to save settings to localStorage', err);
        setSyncStatus('offline');
      }

      return updated;
    });
  }, []);

  const resetToDefault = useCallback(() => {
    updateSettings(DEFAULT_CONTACT_SETTINGS);
  }, [updateSettings]);

  const rollbackToHistory = useCallback(
    (historyItem: ContactHistoryItem) => {
      updateSettings({
        primaryPhone: historyItem.primaryPhone,
        secondaryPhone: historyItem.secondaryPhone,
        whatsappNumber: historyItem.whatsappNumber,
      });
    },
    [updateSettings]
  );

  const clearHistory = useCallback(() => {
    setHistory([]);
    try {
      localStorage.removeItem(HISTORY_KEY);
    } catch (e) {
      console.warn('Failed to remove history', e);
    }
  }, []);

  return (
    <ContactContext.Provider
      value={{
        settings,
        updateSettings,
        resetToDefault,
        history,
        rollbackToHistory,
        clearHistory,
        lastSavedAt,
        syncStatus,
      }}
    >
      {children}
    </ContactContext.Provider>
  );
};

export const useContactSettings = () => {
  const context = useContext(ContactContext);
  if (!context) {
    throw new Error('useContactSettings must be used within a ContactProvider');
  }
  return context;
};
