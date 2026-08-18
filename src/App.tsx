import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.js';
import { Header } from './components/Header.js';
import { Sidebar } from './components/Sidebar.js';
import { MobileBottomNav } from './components/MobileBottomNav.js';
import { Toast } from './components/Toast.js';
import { LoginScreen } from './components/LoginScreen.js';
import { DashboardView } from './components/DashboardView.js';
import { AdmissionModule } from './components/AdmissionModule.js';
import { AttendanceMatrix } from './components/AttendanceMatrix.js';
import { WhatsAppMessageCenter } from './components/WhatsAppMessageCenter.js';
import { StudentManagement } from './components/StudentManagement.js';
import { TeacherManagement } from './components/TeacherManagement.js';
import { ClassesAndSections } from './components/ClassesAndSections.js';
import { FeesModule } from './components/FeesModule.js';
import { NoticeBoard } from './components/NoticeBoard.js';
import { ReportsModule } from './components/ReportsModule.js';
import { SettingsModule } from './components/SettingsModule.js';
import { SuperAdminPortal } from './components/SuperAdminPortal.js';

const MainLayout: React.FC = () => {
  const { isAuthenticated, activeView } = useAuth();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  const renderActiveModule = () => {
    switch (activeView) {
      case 'dashboard':
        return <DashboardView />;
      case 'admissions':
        return <AdmissionModule />;
      case 'attendance':
        return <AttendanceMatrix />;
      case 'messages':
        return <WhatsAppMessageCenter />;
      case 'students':
        return <StudentManagement />;
      case 'teachers':
        return <TeacherManagement />;
      case 'classes':
        return <ClassesAndSections />;
      case 'fees':
        return <FeesModule />;
      case 'notices':
        return <NoticeBoard />;
      case 'reports':
        return <ReportsModule />;
      case 'settings':
        return <SettingsModule />;
      case 'super_admin':
        return <SuperAdminPortal />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-100/70 flex flex-col font-sans text-slate-900 antialiased selection:bg-blue-600 selection:text-white">
      {/* Top Application Header */}
      <Header onToggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)} />

      {/* Body Layout: Sidebar + Main Content Stage */}
      <div className="flex-1 flex w-full max-w-[1700px] mx-auto">
        <Sidebar
          mobileOpen={mobileSidebarOpen}
          onCloseMobile={() => setMobileSidebarOpen(false)}
        />

        <main className="flex-1 p-3 sm:p-6 lg:p-8 min-w-0 overflow-y-auto pb-24 lg:pb-8">
          {renderActiveModule()}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar (< lg screens) */}
      <MobileBottomNav onOpenMoreMenu={() => setMobileSidebarOpen(true)} />

      {/* Global Toast System */}
      <Toast />
    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <MainLayout />
    </AuthProvider>
  );
}

export default App;
