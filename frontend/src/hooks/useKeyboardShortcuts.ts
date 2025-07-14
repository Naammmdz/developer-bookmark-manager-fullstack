import { useEffect } from 'react';
import { useBookmarks } from '../context/BookmarkContext';

interface KeyboardShortcutsProps {
  openSettingsModal: () => void;
  focusSearchInput?: () => void;
}

export const useKeyboardShortcuts = ({ 
  openSettingsModal, 
  focusSearchInput 
}: KeyboardShortcutsProps) => {
  const { openModal } = useBookmarks();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs, textareas, or contenteditable elements
      const target = event.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      const { ctrlKey, shiftKey, key } = event;

      // Ctrl + Shift + B - Add new bookmark
      if (ctrlKey && shiftKey && key === 'B') {
        event.preventDefault();
        openModal();
        return;
      }

      // Ctrl + F - Focus search bar
      if (ctrlKey && key === 'f') {
        event.preventDefault();
        focusSearchInput?.();
        return;
      }

      // Ctrl + , - Open settings
      if (ctrlKey && key === ',') {
        event.preventDefault();
        openSettingsModal();
        return;
      }

      // Esc - Close modals/popups (handled by individual components)
      // This is handled by each modal component individually
    };

    // Add event listener to document
    document.addEventListener('keydown', handleKeyDown);

    // Cleanup function
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [openModal, openSettingsModal, focusSearchInput]);
};
