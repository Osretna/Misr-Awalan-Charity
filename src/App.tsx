/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { VideoModal } from './components/VideoModal';
import { QuickDonateModal } from './components/QuickDonateModal';
import { DonationReceiptModal } from './components/DonationReceiptModal';
import { StickyDonateButton } from './components/StickyDonateButton';

// Pages
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { ProjectsPage } from './pages/ProjectsPage';
import { DonatePage } from './pages/DonatePage';
import { ImpactPage } from './pages/ImpactPage';
import { NewsPage } from './pages/NewsPage';
import { VolunteerPage } from './pages/VolunteerPage';
import { ContactPage } from './pages/ContactPage';
import { AdminDashboard } from './pages/AdminDashboard';

function MainLayout() {
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [selectedProjectForModal, setSelectedProjectForModal] = useState<string | null>(null);
  const { lang, settings } = useApp();

  // Dynamic document title update according to current page
  useEffect(() => {
    const titles: Record<string, string> = {
      home: settings.metaTitle || 'منظمة مصر أولاً | Misr Awalan Charity',
      about: lang === 'ar' ? 'عن المنظمة | منظمة مصر أولاً' : 'About Us | Misr Awalan',
      projects: lang === 'ar' ? 'أعمالنا ومشاريعنا | منظمة مصر أولاً' : 'Our Projects | Misr Awalan',
      donate: lang === 'ar' ? 'تبرع الآن | منظمة مصر أولاً' : 'Donate Now | Misr Awalan',
      impact: lang === 'ar' ? 'أثرنا وإحصائياتنا | منظمة مصر أولاً' : 'Our Impact | Misr Awalan',
      news: lang === 'ar' ? 'الأخبار والتقارير | منظمة مصر أولاً' : 'News & Updates | Misr Awalan',
      volunteer: lang === 'ar' ? 'تطوع معنا | منظمة مصر أولاً' : 'Volunteer | Misr Awalan',
      contact: lang === 'ar' ? 'تواصل معنا | منظمة مصر أولاً' : 'Contact Us | Misr Awalan',
      admin: lang === 'ar' ? 'لوحة التحكم المركزية | منظمة مصر أولاً' : 'Admin Portal | Misr Awalan',
    };
    document.title = titles[currentPage] || titles.home;
  }, [currentPage, lang, settings.metaTitle]);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F5F0] text-[#1E293B]">
      {/* Navigation */}
      <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />

      {/* Main Page Content */}
      <main className="flex-1">
        {currentPage === 'home' && (
          <HomePage 
            setCurrentPage={setCurrentPage} 
            setSelectedProjectForModal={setSelectedProjectForModal} 
          />
        )}
        {currentPage === 'about' && <AboutPage />}
        {currentPage === 'projects' && (
          <ProjectsPage 
            selectedProjectForModal={selectedProjectForModal}
            setSelectedProjectForModal={setSelectedProjectForModal}
            setCurrentPage={setCurrentPage}
          />
        )}
        {currentPage === 'donate' && <DonatePage />}
        {currentPage === 'impact' && <ImpactPage />}
        {currentPage === 'news' && <NewsPage />}
        {currentPage === 'volunteer' && <VolunteerPage />}
        {currentPage === 'contact' && <ContactPage />}
        {currentPage === 'admin' && <AdminDashboard />}
      </main>

      {/* Sticky Fast Donation & WhatsApp Buttons */}
      <StickyDonateButton />

      {/* Interactive Global Modals */}
      <VideoModal />
      <QuickDonateModal />
      <DonationReceiptModal />

      {/* Official Footer */}
      <Footer setCurrentPage={setCurrentPage} />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
