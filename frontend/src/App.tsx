import React, { useState, useMemo } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import {
  BookmarkProvider,
  useBookmarks,
  CollectionWithItems,
} from './context/BookmarkContext';
import { useAuth } from './context/AuthContext';

import ProfilePage from './pages/ProfilePage';
import LandingPage from './pages/LandingPage';
import AdminPage from './pages/AdminPage';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import BookmarkGrid from './components/bookmark/BookmarkGrid';
// CollectionHeader removed as it's no longer used in BookmarksViewWithSidebar
import MobileNavigation from './components/layout/MobileNavigation';
import AddBookmarkModal from './components/bookmark/AddBookmarkModal';
import AddCollectionModal from './components/collection/AddCollectionModal'; // Import AddCollectionModal
import LoginModal from './components/auth/LoginModal';
import RegisterModal from './components/auth/RegisterModal';
import ProtectedRoute from './components/auth/ProtectedRoute';
import RootRoute from './components/auth/RootRoute';
import AdminLayout from './components/admin/AdminLayout';
import SettingsModal from './components/settings/SettingsModal';
import BackgroundAnimation from './components/layout/BackgroundAnimation';
import KeyboardShortcutsButton from './components/ui/KeyboardShortcutsButton';
import { CustomIcon } from './utils/iconMapping';
import {
  Archive,
  FolderKanban,
  Heart,
  Globe,
  Filter,
  ArrowUpDown,
  PlusCircle,
  ListPlus,
  Grid,
  List,
} from 'lucide-react';


// Props for AppLayout
interface AppLayoutProps {
  openLoginModal: () => void;
  openRegisterModal: () => void;
  openSettingsModal: () => void;
  openCollectionsModal: () => void;
}

const AppLayout: React.FC<AppLayoutProps> = ({
  openLoginModal,
  openRegisterModal,
  openSettingsModal,
  openCollectionsModal,
}) => {
  const {
    isModalOpen: isAddBookmarkModalOpen,
    collectionData,
    isAddCollectionModalOpen, // Destructure new state and functions
    closeAddCollectionModal,
    addCollection
  } = useBookmarks();

  const stats = React.useMemo(() => {
    const cd = collectionData || {}; // Handle initial undefined state

    const totalBookmarksStat = cd.all?.count || 0;

    const collectionsStat = Object.values(
      cd as { [key: string]: CollectionWithItems },
    ) // Type assertion for filter
      .filter(
        (col) =>
          col.id !== 'all' &&
          col.id !== 'favorites' &&
          col.id !== 'recently_added',
      ).length;

    const favoritesStat = cd.favorites?.count || 0;

    // Placeholder for publicStat, e.g., 30% of total (rounded down)
    const publicStat = Math.floor(totalBookmarksStat * 0.3);

    return { totalBookmarksStat, collectionsStat, favoritesStat, publicStat };
  }, [collectionData]);

  return (
    <div className="relative flex min-h-screen bg-background text-foreground">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-screen w-64 bg-background border-r border-border z-40 overflow-y-auto flex flex-col">
        <Sidebar />
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


        {/* Outlet for child route components */}
        <main className="p-6 flex-1 overflow-y-auto">
          <Outlet /> {/* BookmarksViewWithSidebar or ProfileView will render here */}
        </main>
      </div>

      {/* MobileNavigation - retains fixed positioning & high z-index */}
      <MobileNavigation
        openSettingsModal={openSettingsModal}
        openCollectionsModal={openCollectionsModal}
      />

      {/* KeyboardShortcutsButton - retains fixed positioning & high z-index */}
      <div className="fixed bottom-6 right-6 z-50">
        <KeyboardShortcutsButton />
      </div>

      {/* AddBookmarkModal is controlled by BookmarkContext, so it's rendered if its state is open */}
      {isAddBookmarkModalOpen && <AddBookmarkModal />}
      {/* AddCollectionModal controlled by BookmarkContext */}
      {isAddCollectionModalOpen && (
        <AddCollectionModal
          isOpen={isAddCollectionModalOpen}
          onClose={closeAddCollectionModal}
          onAddCollection={addCollection}
        />
      )}
    </div>
  );
};

const BookmarksViewWithSidebar: React.FC = () => {
  const {
    activeCollection,
    collectionData,
    searchTerm,
    openModal,
    reorderBookmarks, // Added for passing to BookmarkGrid
    deleteBookmarks, // Added for passing to BookmarkGrid
    viewMode,
    setViewMode,
  } = useBookmarks();

  const currentViewData = collectionData?.[activeCollection];
  const icon = currentViewData?.icon || 'folder';
  const name = currentViewData?.name || 'Loading...';

  const baseItems = currentViewData?.items || [];
  const finalItemsToDisplay =
    searchTerm.trim() === ''
      ? baseItems
      : baseItems.filter((bookmark) => {
          const searchTermLower = searchTerm.toLowerCase();
          return (
            bookmark.title.toLowerCase().includes(searchTermLower) ||
            (bookmark.description &&
              bookmark.description.toLowerCase().includes(searchTermLower)) ||
            bookmark.tags.some((tag) =>
              tag.toLowerCase().includes(searchTermLower),
            )
          );
        });

  const titleBookmarkCount = currentViewData?.count || 0; // For display in title, before search filtering

  return (
    <div className="flex-1 flex flex-col min-h-screen">
      {/* New Page Title Section */}
      <section className="px-6 pt-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-white flex items-center gap-2">
              <CustomIcon icon={icon} size={24} className="text-white" />
              {name}
            </h2>
            <p className="text-sm text-white/70">
              {titleBookmarkCount} bookmarks found
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-3 py-1.5 bg-black/20 hover:bg-black/30 border border-white/10 rounded-md text-sm text-white/90 transition-colors">
              <Filter size={16} /> Filter
            </button>
            <button className="flex items-center gap-2 px-3 py-1.5 bg-black/20 hover:bg-black/30 border border-white/10 rounded-md text-sm text-white/90 transition-colors">
              <ArrowUpDown size={16} /> Sort
            </button>
            <button 
              onClick={() => setViewMode('grid')}
              className={`p-2 border border-white/10 rounded-md transition-colors ${
                viewMode === 'grid' 
                  ? 'bg-white/20 text-white' 
                  : 'bg-black/20 hover:bg-black/30 text-white/90'
              }`} 
              title="Grid View"
            >
              <Grid size={16} />
            </button>
            <button 
              onClick={() => setViewMode('list')}
              className={`p-2 border border-white/10 rounded-md transition-colors ${
                viewMode === 'list' 
                  ? 'bg-white/20 text-white' 
                  : 'bg-black/20 hover:bg-black/30 text-white/90'
              }`} 
              title="List View"
            >
              <List size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* Recently Accessed Section (Wrapped) */}
      <section className="px-6 mb-8">
        <div className="rounded-2xl bg-black/20 backdrop-blur-lg border border-white/10 px-6 py-4 flex items-center gap-3 overflow-x-auto">
          <div className="text-white/80 font-medium mr-2">
            Recently Accessed
          </div>
          <span className="rounded-lg bg-white/10 px-3 py-1 text-white/80 text-sm">
            React Documentation
          </span>
          <span className="rounded-lg bg-white/10 px-3 py-1 text-white/80 text-sm">
            Node.js Best Practices
          </span>
          <span className="rounded-lg bg-white/10 px-3 py-1 text-white/80 text-sm">
            Tailwind CSS Docs
          </span>
          <span className="rounded-lg bg-white/10 px-3 py-1 text-white/80 text-sm">
            TypeScript Handbook
          </span>
          <span className="rounded-lg bg-white/10 px-3 py-1 text-white/80 text-sm">
            Express.js Guide
          </span>
        </div>
      </section>

      {/* Bookmark Grid Section (Wrapped) */}
      <section className="px-6 pb-6 flex-1 flex flex-col">
        {finalItemsToDisplay.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
            <PlusCircle size={48} className="mx-auto text-white/30 mb-4" />
            <h3 className="text-xl font-semibold text-white/80 mb-2">
              {searchTerm
                ? 'No Bookmarks Match Your Search'
                : 'This Collection is Empty'}
            </h3>
            <p className="text-white/50 mb-6 max-w-md">
              {searchTerm
                ? `Try refining your search term or clearing it to see all bookmarks in "${name}".`
                : `Add some bookmarks to "${name}" to see them here.`}
            </p>
            {!searchTerm && (
              <button
                onClick={openModal} // openModal from useBookmarks
                className="bg-primary hover:bg-primary/90 text-white font-medium py-2.5 px-5 rounded-lg flex items-center mx-auto text-sm transition-colors"
              >
                <ListPlus size={18} className="mr-2" /> Add Bookmark to "{name}"
              </button>
            )}
          </div>
        ) : (
          <BookmarkGrid
            bookmarks={finalItemsToDisplay}
            reorderBookmarks={reorderBookmarks}
            deleteBookmarks={deleteBookmarks}
            viewMode={viewMode}
          />
        )}
      </section>
    </div>
  );
};

const ProfileView: React.FC = () => (
  <main className="flex-1 w-full px-4 py-6 md:p-6 flex justify-center items-start pt-6 md:pt-10 pb-16 md:pb-6">
    <ProfilePage />
  </main>
);

function App() {
  const { user: currentUser } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const openCollectionsModal = () => {};

  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
    // Potentially navigate or refresh data if needed after login
  };
  const openRegisterModal = () => setIsRegisterModalOpen(true);
  const closeRegisterModal = () => {
    setIsRegisterModalOpen(false);
    // Potentially navigate or refresh data if needed after registration
  };

  const openSettingsModal = () => setIsSettingsModalOpen(true);
  const closeSettingsModal = () => setIsSettingsModalOpen(false);

  return (
    <BookmarkProvider>
      {/* Modals are rendered here, outside of Routes, so they can be displayed over any page */}
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={closeLoginModal} 
        openRegisterModal={openRegisterModal}
      />
      <RegisterModal
        isOpen={isRegisterModalOpen}
        onClose={closeRegisterModal}
        openLoginModal={openLoginModal}
      />
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={closeSettingsModal}
      />

      <Routes>
        {/* Root route - redirects based on authentication */}
        <Route path="/" element={<RootRoute />} />
        
        {/* Landing page without sidebar/layout */}
        <Route path="/landing" element={<LandingPage />} />
        
        {/* Protected app routes */}
        <Route
          path="/app"
          element={
            <ProtectedRoute>
              <AppLayout
                openLoginModal={openLoginModal}
                openRegisterModal={openRegisterModal}
                openSettingsModal={openSettingsModal}
                openCollectionsModal={openCollectionsModal}
              />
            </ProtectedRoute>
          }
        >
          <Route index element={<BookmarksViewWithSidebar />} />
          <Route
            path="profile"
            element={<ProfileView />}
          />
          {/* Add other routes that use AppLayout here */}
        </Route>
        
        {/* Admin routes with AdminLayout */}
        <Route
          path="/app/admin"
          element={
            <ProtectedRoute>
              {currentUser?.role === 'admin' ? (
                <AdminLayout
                  openLoginModal={openLoginModal}
                  openRegisterModal={openRegisterModal}
                  openSettingsModal={openSettingsModal}
                  openCollectionsModal={openCollectionsModal}
                />
              ) : (
                <Navigate to="/app" replace />
              )}
            </ProtectedRoute>
          }
        >
          <Route index element={<AdminPage />} />
          <Route path="users" element={<AdminPage />} />
          <Route path="roles" element={<div className="p-6"><h1 className="text-2xl font-bold text-white mb-4">Roles & Permissions</h1><p className="text-white/70">This feature is coming soon...</p></div>} />
          <Route path="analytics" element={<div className="p-6"><h1 className="text-2xl font-bold text-white mb-4">Analytics</h1><p className="text-white/70">This feature is coming soon...</p></div>} />
          <Route path="system" element={<div className="p-6"><h1 className="text-2xl font-bold text-white mb-4">System Status</h1><p className="text-white/70">This feature is coming soon...</p></div>} />
          <Route path="logs" element={<div className="p-6"><h1 className="text-2xl font-bold text-white mb-4">System Logs</h1><p className="text-white/70">This feature is coming soon...</p></div>} />
          <Route path="settings" element={<div className="p-6"><h1 className="text-2xl font-bold text-white mb-4">Admin Settings</h1><p className="text-white/70">This feature is coming soon...</p></div>} />
        </Route>
        
        {/* Fallback for unmatched routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {/* KeyboardShortcutsButton removed from here, now in AppLayout */}
    </BookmarkProvider>
  );
}

export default App;