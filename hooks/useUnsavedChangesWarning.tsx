import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

/**
 * A hook to manage unsaved changes warnings
 * 
 * @param {boolean} hasUnsavedChanges - Whether there are unsaved changes
 * @returns An object with methods and state for handling unsaved changes
 */
const useUnsavedChangesWarning = (hasUnsavedChanges: boolean) => {
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [navigationCallback, setNavigationCallback] = useState<(() => void | Promise<void>) | null>(null);
  
  const router = useRouter();

  // Set up the beforeunload event handler
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        // Standard browser warning
        e.preventDefault();
        e.returnValue = '';
        return '';
      }
    };

    if (hasUnsavedChanges) {
      window.addEventListener('beforeunload', handleBeforeUnload);
    }

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [hasUnsavedChanges]);

  // Function to handle a navigation attempt
  const handleNavigationAttempt = useCallback((callback: () => void | Promise<void>) => {
    if (hasUnsavedChanges) {
      // Store the navigation callback and show the warning
      setNavigationCallback(() => callback);
      setShowWarningModal(true);
      return false; // Prevent default navigation
    } else {
      // No unsaved changes, just navigate
      callback();
      return true;
    }
  }, [hasUnsavedChanges]);

  // Function to leave without saving
  const handleLeaveWithoutSaving = useCallback(() => {
    // Execute the navigation callback
    if (navigationCallback) {
      navigationCallback();
    }
    setShowWarningModal(false);
    setNavigationCallback(null);
  }, [navigationCallback]);

  // Function to continue editing
  const handleContinueEditing = useCallback(() => {
    setShowWarningModal(false);
    setNavigationCallback(null);
  }, []);

  return {
    showWarningModal,
    handleNavigationAttempt,
    handleLeaveWithoutSaving,
    handleContinueEditing
  };
};

export default useUnsavedChangesWarning; 