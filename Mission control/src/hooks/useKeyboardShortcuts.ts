import { useEffect, useCallback } from 'react';
import { KEYBOARD_SHORTCUTS } from '../constants';

interface KeyboardShortcutHandlers {
  onSearch?: () => void;
  onNewWorkflow?: () => void;
  onNewRelease?: () => void;
  onSave?: () => void;
  onUndo?: () => void;
  onRedo?: () => void;
  onDelete?: () => void;
  onEscape?: () => void;
  onToggleSidebar?: () => void;
  onZoomIn?: () => void;
  onZoomOut?: () => void;
  onZoomReset?: () => void;
}

export const useKeyboardShortcuts = (handlers: KeyboardShortcutHandlers) => {
  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    const { metaKey, ctrlKey, shiftKey, key } = event;
    const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
    const cmdKey = isMac ? metaKey : ctrlKey;

    // Prevent shortcuts when typing in inputs
    const target = event.target as HTMLElement;
    if (
      target.tagName === 'INPUT' ||
      target.tagName === 'TEXTAREA' ||
      target.contentEditable === 'true'
    ) {
      // Only allow escape in inputs
      if (key === 'Escape' && handlers.onEscape) {
        handlers.onEscape();
        return;
      }
      return;
    }

    // Global search (Cmd/Ctrl + K)
    if (cmdKey && key === 'k' && handlers.onSearch) {
      event.preventDefault();
      handlers.onSearch();
      return;
    }

    // New workflow (Cmd/Ctrl + N)
    if (cmdKey && !shiftKey && key === 'n' && handlers.onNewWorkflow) {
      event.preventDefault();
      handlers.onNewWorkflow();
      return;
    }

    // New release (Cmd/Ctrl + Shift + N)
    if (cmdKey && shiftKey && key === 'n' && handlers.onNewRelease) {
      event.preventDefault();
      handlers.onNewRelease();
      return;
    }

    // Save (Cmd/Ctrl + S)
    if (cmdKey && key === 's' && handlers.onSave) {
      event.preventDefault();
      handlers.onSave();
      return;
    }

    // Undo (Cmd/Ctrl + Z)
    if (cmdKey && !shiftKey && key === 'z' && handlers.onUndo) {
      event.preventDefault();
      handlers.onUndo();
      return;
    }

    // Redo (Cmd/Ctrl + Shift + Z)
    if (cmdKey && shiftKey && key === 'z' && handlers.onRedo) {
      event.preventDefault();
      handlers.onRedo();
      return;
    }

    // Delete (Delete key)
    if (key === 'Delete' && handlers.onDelete) {
      event.preventDefault();
      handlers.onDelete();
      return;
    }

    // Escape
    if (key === 'Escape' && handlers.onEscape) {
      event.preventDefault();
      handlers.onEscape();
      return;
    }

    // Toggle sidebar (Cmd/Ctrl + \)
    if (cmdKey && key === '\\' && handlers.onToggleSidebar) {
      event.preventDefault();
      handlers.onToggleSidebar();
      return;
    }

    // Zoom in (Cmd/Ctrl + =)
    if (cmdKey && key === '=' && handlers.onZoomIn) {
      event.preventDefault();
      handlers.onZoomIn();
      return;
    }

    // Zoom out (Cmd/Ctrl + -)
    if (cmdKey && key === '-' && handlers.onZoomOut) {
      event.preventDefault();
      handlers.onZoomOut();
      return;
    }

    // Zoom reset (Cmd/Ctrl + 0)
    if (cmdKey && key === '0' && handlers.onZoomReset) {
      event.preventDefault();
      handlers.onZoomReset();
      return;
    }
  }, [handlers]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  // Return the shortcuts for documentation/help
  return {
    shortcuts: KEYBOARD_SHORTCUTS,
  };
};
