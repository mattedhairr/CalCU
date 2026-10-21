import { useEffect, type Dispatch, type SetStateAction } from 'react';
import type { WindowsOverlayConfig } from '../utils/windowsOverlay';

// Mirrors the Windows app on this page: the chosen shortcut toggles the
// floating calculator, and Esc hides it when that option is on.
export function useOverlayHotkey(
  config: WindowsOverlayConfig,
  isOpen: boolean,
  setIsOpen: Dispatch<SetStateAction<boolean>>
) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const pressedKey = e.code === 'Space' ? 'SPACE' : e.key.toUpperCase();

      const modifierMatches =
        (config.modifier === 'Alt' && e.altKey && !e.ctrlKey && !e.shiftKey) ||
        (config.modifier === 'Ctrl+Alt' && e.ctrlKey && e.altKey && !e.shiftKey) ||
        (config.modifier === 'Ctrl+Shift' && e.ctrlKey && e.shiftKey && !e.altKey) ||
        (config.modifier === 'Win' && e.metaKey);

      if (modifierMatches && pressedKey === config.key.toUpperCase()) {
        e.preventDefault();
        setIsOpen((open) => !open);
        return;
      }

      if (config.hideOnEscape && e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [config, isOpen, setIsOpen]);
}
