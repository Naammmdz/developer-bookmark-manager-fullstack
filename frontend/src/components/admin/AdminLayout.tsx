import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import Header from '../layout/Header';
import MobileNavigation from '../layout/MobileNavigation';
import KeyboardShortcutsButton from '../ui/KeyboardShortcutsButton';

interface AdminLayoutProps {
  openLoginModal: () => void;
  openRegisterModal: () => void;
  openSettingsModal: () => void;
  openCollectionsModal: () => void;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({
  openLoginModal,
  openRegisterModal,
  openSettingsModal,
  openCollectionsModal,
}) => {
  return (
    <div className="relative flex min-h-screen bg-background text-foreground">
      {/* Admin Sidebar */}
      <aside className="fixed left-0 top-0 h-screen w-64 bg-background border-r border-border z-40 overflow-y-auto flex flex-col">
        <AdminSidebar />
      </aside>

      {/* Main content area */}
      <div className="ml-64 flex-1 flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-background border-b border-border">
          <Header
            openLoginModal={openLoginModal}
            openRegisterModal={openRegisterModal}
            openSettingsModal={openSettingsModal}
          />
        </header>

        {/* Main content */}
        <main className="p-6 flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* Mobile Navigation - for mobile admin access */}
      <MobileNavigation
        openSettingsModal={openSettingsModal}
        openCollectionsModal={openCollectionsModal}
      />

      {/* Keyboard Shortcuts Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <KeyboardShortcutsButton />
      </div>
    </div>
  );
};

export default AdminLayout;
