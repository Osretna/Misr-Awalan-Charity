import React, { useEffect, useState, useCallback } from 'react';
import { ShieldCheck, Lock } from 'lucide-react';

export const SiteProtection: React.FC = () => {
  const [warningMessage, setWarningMessage] = useState<string | null>(null);

  const showSecurityNotice = useCallback((msg: string) => {
    setWarningMessage(msg);
    setTimeout(() => {
      setWarningMessage(null);
    }, 2500);
  }, []);

  useEffect(() => {
    // 1. Disable Right-Click (Context Menu / Inspect)
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      showSecurityNotice('🔒 تم حظر القائمة الجانبية وفحص العناصر لحماية محتوى المنظمة');
    };

    // 2. Disable DevTools keyboard shortcuts (F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C, Ctrl+U)
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      const ctrlOrCmd = isMac ? e.metaKey : e.ctrlKey;

      // F12 key
      if (e.key === 'F12' || e.keyCode === 123) {
        e.preventDefault();
        e.stopPropagation();
        showSecurityNotice('🔒 تم تعطيل اختصار F12 لحماية الموقع وأمان البيانات');
        return false;
      }

      // Ctrl + Shift + I or Cmd + Opt + I (Inspect)
      if (ctrlOrCmd && (e.shiftKey || (isMac && e.altKey)) && (e.key === 'I' || e.key === 'i')) {
        e.preventDefault();
        e.stopPropagation();
        showSecurityNotice('🔒 تم قفل أدوات المطور (Developer Tools) لحماية الموقع');
        return false;
      }

      // Ctrl + Shift + J or Cmd + Opt + J (Console)
      if (ctrlOrCmd && (e.shiftKey || (isMac && e.altKey)) && (e.key === 'J' || e.key === 'j')) {
        e.preventDefault();
        e.stopPropagation();
        showSecurityNotice('🔒 تم قفل وحدة التحكم (Console) لحماية النظام');
        return false;
      }

      // Ctrl + Shift + C or Cmd + Opt + C (Element Inspector)
      if (ctrlOrCmd && (e.shiftKey || (isMac && e.altKey)) && (e.key === 'C' || e.key === 'c')) {
        // Only prevent if not in input/textarea (so admin can still copy text if needed)
        const target = e.target as HTMLElement | null;
        const isInputField = target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable);
        if (!isInputField) {
          e.preventDefault();
          e.stopPropagation();
          showSecurityNotice('🔒 تم قفل أداة فحص العناصر (Element Inspector)');
          return false;
        }
      }

      // Ctrl + U or Cmd + Opt + U (View Source)
      if (ctrlOrCmd && (e.key === 'U' || e.key === 'u')) {
        e.preventDefault();
        e.stopPropagation();
        showSecurityNotice('🔒 تم حظر عرض شفرة المصدر (View Source)');
        return false;
      }
    };

    window.addEventListener('contextmenu', handleContextMenu);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('contextmenu', handleContextMenu);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [showSecurityNotice]);

  if (!warningMessage) return null;

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[9999] pointer-events-none transition-all duration-300 animate-in fade-in slide-in-from-top-4">
      <div className="bg-[#0A5C4B] text-white px-5 py-3 rounded-2xl shadow-2xl border border-[#E0BA3E]/40 flex items-center gap-3 backdrop-blur-md">
        <div className="w-8 h-8 rounded-xl bg-[#E0BA3E] text-[#0A5C4B] flex items-center justify-center shrink-0 shadow-sm font-bold">
          <Lock className="w-4 h-4" />
        </div>
        <div className="text-right">
          <p className="text-sm font-bold font-cairo text-white">{warningMessage}</p>
          <p className="text-[10px] text-emerald-200">نظام الحماية المتقدم - منظمة مصر أولاً</p>
        </div>
        <ShieldCheck className="w-5 h-5 text-[#E0BA3E] shrink-0" />
      </div>
    </div>
  );
};
