import React, { useState, useMemo, useRef, useEffect, createContext, useContext } from 'react';
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import {
  BookmarkProvider,
  useBookmarks,
  CollectionWithItems,
} from './context/BookmarkContext';
import { CodeBlockProvider, useCodeBlocks } from './context/CodeBlockContext';
import { useAuth } from './context/AuthContext';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';

import ProfilePage from './pages/ProfilePage';
import LandingPage from './pages/LandingPage';
import AdminPage from './pages/AdminPage';
import CodeBlockView from './pages/CodeBlockView';
import Header from './components/layout/Header';
import { useRecentlyAccessed } from './hooks/useRecentlyAccessed';
import Sidebar from './components/layout/Sidebar';
import BookmarkGrid from './components/bookmark/BookmarkGrid';
// CollectionHeader removed as it's no longer used in BookmarksViewWithSidebar
import MobileNavigation from './components/layout/MobileNavigation';
import AddBookmarkModal from './components/bookmark/AddBookmarkModal';
import AddCollectionModal from './components/collection/AddCollectionModal'; // Import AddCollectionModal
import AddCodeBlockModal from './components/ui/AddCodeBlockModal';
import FilterModal from './components/filter/FilterModal';
import LoginModal from './components/auth/LoginModal';
import RegisterModal from './components/auth/RegisterModal';
import ProtectedRoute from './components/auth/ProtectedRoute';
import RootRoute from './components/auth/RootRoute';
import AdminLayout from './components/admin/AdminLayout';
import SettingsModal from './components/settings/SettingsModal';
import BackgroundAnimation from './components/layout/BackgroundAnimation';
import KeyboardShortcutsButton from './components/ui/KeyboardShortcutsButton';
import { CustomIcon } from './utils/iconMapping';
import { Pointer } from './components/magicui/pointer';
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
import {
  DndContext,
  DragOverEvent,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';

// Create DragContext to share drag position between components
export const DragContext = createContext<{
  dragPosition: { x: number; y: number };
  setDragPosition: (pos: { x: number; y: number }) => void;
}>({
  dragPosition: { x: 0, y: 0 },
  setDragPosition: () => {},
});


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
  
  const {
    isModalOpen: isAddCodeBlockModalOpen,
    closeModal: closeAddCodeBlockModal,
    addCodeBlock
  } = useCodeBlocks();

  const searchInputRef = useRef<HTMLInputElement>(null);
  
  // Function to focus search input
  const focusSearchInput = () => {
    searchInputRef.current?.focus();
  };

  // Use keyboard shortcuts hook
  useKeyboardShortcuts({
    openSettingsModal,
    focusSearchInput
  });

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
            searchInputRef={searchInputRef}
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
      {/* AddCodeBlockModal controlled by CodeBlockContext */}
      {isAddCodeBlockModalOpen && (
        <AddCodeBlockModal
          isOpen={isAddCodeBlockModalOpen}
          onClose={closeAddCodeBlockModal}
          onSave={addCodeBlock}
        />
      )}
    </div>
  );
};

import CollectionTabs from './components/collection/CollectionTabs';

const BookmarksViewWithSidebar: React.FC = () => {
  const {
    activeCollection,
    collectionData,
    searchTerm,
    openModal,
    viewMode,
    setViewMode,
    // Filter functionality
    activeFilters,
    isFilterModalOpen,
    openFilterModal,
    closeFilterModal,
    applyFilter,
  } = useBookmarks();

  const { openModal: openCodeBlockModal } = useCodeBlocks();
  const { addRecentlyAccessed } = useRecentlyAccessed();

  const currentViewData = collectionData?.[activeCollection];
  const icon = currentViewData?.icon || 'folder';
  const name = currentViewData?.name || 'Loading...';

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
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={openFilterModal}
              className={`flex items-center gap-2 px-3 py-1.5 border border-white/10 rounded-md text-sm transition-colors ${
                Object.values(activeFilters).some(value => value !== undefined && value !== null && value !== '') 
                  ? 'bg-primary/20 text-primary border-primary/30' 
                  : 'bg-black/20 hover:bg-black/30 text-white/90'
              }`}
            >
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

      {/* Collection Tabs Section */}
      <CollectionTabs
        collectionId={activeCollection}
        collectionName={name}
        collectionIcon={icon}
        searchTerm={searchTerm}
        viewMode={viewMode}
        onOpenBookmarkModal={openModal}
        onOpenCodeBlockModal={openCodeBlockModal}
      />

      {/* Filter Modal */}
      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={closeFilterModal}
        onApplyFilter={applyFilter}
        currentFilters={activeFilters}
      />
    </div>
  );
};

const ProfileView: React.FC = () => (
  <main className="flex-1 w-full px-4 py-6 md:p-6 flex justify-center items-start pt-6 md:pt-10 pb-16 md:pb-6">
    <ProfilePage />
  </main>
);

// Inner component that has access to BookmarkProvider context
const AppWithDragHandlers: React.FC = () => {
  const { moveBookmarkToCollection, reorderBookmarks, bookmarks } = useBookmarks();
  const { user: currentUser } = useAuth();
  const { dragPosition, setDragPosition } = useContext(DragContext);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [activeId, setActiveId] = useState<number | null>(null);
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

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as number);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;

    if (over && over.id.toString().startsWith('collection-')) {
      const collectionId = over.id.toString().replace('collection-', '');
      console.log(`Dragging over collection: ${collectionId}`);
      // Handle logic for checking available collections to drop into
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    // Check if dropped on a collection
    if (over && over.id.toString().startsWith('collection-')) {
      const collectionId = over.id.toString().replace('collection-', '');
      const bookmarkId = active.id as number;
      
      console.log(`Moving bookmark ${bookmarkId} to collection ${collectionId}`);
      // Use the moveBookmarkToCollection function from BookmarkProvider
      moveBookmarkToCollection(bookmarkId, collectionId);
    }
    // Check if dropped on another bookmark for reordering
    else if (over && typeof over.id === 'number') {
      const oldIndex = bookmarks.findIndex((bookmark) => bookmark.id === active.id);
      const newIndex = bookmarks.findIndex((bookmark) => bookmark.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        const movedItem = bookmarks[oldIndex];
        const targetItem = bookmarks[newIndex];

        let targetId: number | null = null;

        if (oldIndex < newIndex) {
          targetId = newIndex === bookmarks.length - 1 ? null : bookmarks[newIndex + 1]?.id || null;
        } else {
          targetId = targetItem.id;
        }

        reorderBookmarks(movedItem.id, targetId);
      }
    }
  };

  const activeBookmark = activeId ? bookmarks.find((bookmark) => bookmark.id === activeId) : null;

  return (
    <DndContext
sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
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
          <Route
            path="codeblocks"
            element={<CodeBlockView />}
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
      
<DragOverlay>
        {activeId && activeBookmark ? (
          <div className="bg-white/15 backdrop-blur-xl border border-white/30 rounded-2xl px-4 py-3 shadow-2xl max-w-xs transform scale-90 cursor-grabbing">
            <div className="flex items-center gap-3">
              {/* Enhanced bookmark icon with glow effect */}
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500/60 to-purple-500/60 rounded-xl flex items-center justify-center flex-shrink-0 shadow-xl border border-white/20">
                <svg className="w-6 h-6 text-white drop-shadow-lg" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                </svg>
              </div>
              
              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="text-white font-semibold text-sm truncate drop-shadow-sm">
                  {activeBookmark.title}
                </div>
                <div className="text-white/70 text-xs mt-0.5 truncate">
                  {activeBookmark.url.replace(/^https?:\/\//, '').split('/')[0]}
                </div>
              </div>
              
              {/* Enhanced moving indicator with glow */}
              <div className="w-4 h-4 bg-gradient-to-r from-green-400 to-blue-500 rounded-full animate-pulse flex-shrink-0 shadow-lg" />
            </div>
            
            {/* Enhanced arrow indicator */}
            <div className="mt-3 pt-2 border-t border-white/20">
              <div className="flex items-center gap-2 text-white/80 text-xs">
                <svg className="w-4 h-4 animate-pulse text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                <span className="animate-pulse font-medium">Moving to collection...</span>
              </div>
            </div>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

function App() {
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });

  return (
    <DragContext.Provider value={{ dragPosition, setDragPosition }}>
      <Pointer>
        <BookmarkProvider>
          <CodeBlockProvider>
            <AppWithDragHandlers />
          </CodeBlockProvider>
        </BookmarkProvider>
      </Pointer>
    </DragContext.Provider>
  );
}

export default App;