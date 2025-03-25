import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';

/**
 * A hook that handles unsaved changes warnings
 * 
 * @param isDirty - Whether there are unsaved changes
 * @returns Methods and state to handle unsaved changes warnings
 */
export default function useUnsavedChanges(isDirty: boolean) {
  const [showModal, setShowModal] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const previousPathnameRef = useRef(pathname);
  const pendingNavigationRef = useRef<string | null>(null);

  // Intercept navigation events
  useEffect(() => {
    // If pathname changed and we have unsaved changes, we need to handle it
    if (pathname !== previousPathnameRef.current && isDirty) {
      // We can't actually prevent navigation in Next.js App Router
      // But we can show the modal when component re-renders
      setShowModal(true);
      setPendingAction(() => () => {
        // Let navigation happen naturally on next render
        previousPathnameRef.current = pathname;
      });
    }
  }, [pathname, isDirty]);

  // Update our ref to track pathname
  useEffect(() => {
    previousPathnameRef.current = pathname;
  }, [pathname]);

  // Listen for custom navigation events from our NavigationEvents component
  useEffect(() => {
    const handleNavigation = (event: CustomEvent) => {
      const { pathname: newPathname } = event.detail;
      
      if (isDirty && newPathname !== pathname) {
        // Store the destination for later use
        pendingNavigationRef.current = newPathname;
        // Show warning modal
        setShowModal(true);
      }
    };

    // Add event listener with type assertion
    window.addEventListener('navigationChanged', handleNavigation as EventListener);
    
    return () => {
      window.removeEventListener('navigationChanged', handleNavigation as EventListener);
    };
  }, [isDirty, pathname]);

  // Set up warning when user tries to close tab or refresh
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        // Standard browser confirmation message
        e.preventDefault();
        e.returnValue = '';
        return '';
      }
    };

    if (isDirty) {
      window.addEventListener('beforeunload', handleBeforeUnload);
    }

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isDirty]);

  // Function to block navigation and show modal
  const handleBlockNavigation = useCallback(
    (action: () => void) => {
      if (isDirty) {
        setShowModal(true);
        setPendingAction(() => action);
        return true; // Blocked
      }
      
      // Not dirty, proceed with action
      action();
      return false; // Not blocked
    },
    [isDirty]
  );

  // Function when user chooses to continue editing
  const handleContinueEditing = useCallback(() => {
    setShowModal(false);
    setPendingAction(null);
    pendingNavigationRef.current = null;
  }, []);

  // Function when user chooses to discard changes
  const handleDiscardChanges = useCallback(() => {
    if (pendingAction) {
      pendingAction();
    } 
    // If we have a stored navigation destination, use it
    else if (pendingNavigationRef.current) {
      router.push(pendingNavigationRef.current);
      pendingNavigationRef.current = null;
    }
    
    setShowModal(false);
    setPendingAction(null);
  }, [pendingAction, router]);

  return {
    showModal,
    blockNavigation: handleBlockNavigation,
    continueEditing: handleContinueEditing,
    discardChanges: handleDiscardChanges,
  };
} 