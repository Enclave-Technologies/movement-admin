import React, { createContext, useState, useContext, useEffect, ReactNode, useCallback, useRef } from 'react';
import UnsavedChangesModal from '@/components/UnsavedChangesModal';
import { useRouter, usePathname } from 'next/navigation';

interface UnsavedChangesContextType {
  hasUnsavedChanges: boolean;
  setHasUnsavedChanges: (value: boolean) => void;
  showUnsavedModal: boolean;
  setShowUnsavedModal: (value: boolean) => void;
  pendingNavigation: any;
  setPendingNavigation: (destination: any) => void;
  pendingAction: (() => void) | null;
  setPendingAction: (action: (() => void) | null) => void;
  handleNavigationAttempt: (destination: string) => void;
  handleActionAttempt: (action: () => void) => void;
  handleSaveAndContinue: () => void;
  handleContinueWithoutSaving: () => void;
  handleStayOnPage: () => void;
  savingFunction: (() => Promise<void>) | null;
  setSavingFunction: (fn: (() => Promise<void>) | null) => void;
  isSaving: boolean;
}

const UnsavedChangesContext = createContext<UnsavedChangesContextType | undefined>(undefined);

export const UnsavedChangesProvider = ({ children, savingState = false }: { children: ReactNode, savingState?: boolean }) => {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showUnsavedModal, setShowUnsavedModal] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<any>(null);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  
  // Use a ref for the saving function to avoid re-renders
  const savingFunctionRef = useRef<(() => Promise<void>) | null>(null);
  
  const router = useRouter();
  const pathname = usePathname();

  // Create setSavingFunction and savingFunction as stable references
  const setSavingFunction = useCallback((fn: (() => Promise<void>) | null) => {
    savingFunctionRef.current = fn;
  }, []);

  const savingFunction = savingFunctionRef.current;

  // Handle browser back/forward button and tab close/refresh
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
        return '';
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('beforeunload', handleBeforeUnload);
      
      // Handle popstate (browser back/forward)
      window.addEventListener('popstate', (e) => {
        if (hasUnsavedChanges) {
          e.preventDefault();
          setShowUnsavedModal(true);
          setPendingNavigation(window.location.pathname);
        }
      });
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('beforeunload', handleBeforeUnload);
        window.removeEventListener('popstate', () => {});
      }
    };
  }, [hasUnsavedChanges, pathname]);

  // Handle navigation attempts (link clicks)
  const handleNavigationAttempt = useCallback((destination: string) => {
    if (hasUnsavedChanges) {
      setPendingNavigation(destination);
      setShowUnsavedModal(true);
      return false;
    }
    return true;
  }, [hasUnsavedChanges]);

  // Handle other action attempts (like changing tabs)
  const handleActionAttempt = useCallback((action: () => void) => {
    if (hasUnsavedChanges) {
      setPendingAction(action);
      setShowUnsavedModal(true);
      return false;
    } else {
      action();
      return true;
    }
  }, [hasUnsavedChanges]);

  // Save and then navigate/execute action
  const handleSaveAndContinue = useCallback(async () => {
    if (savingFunctionRef.current) {
      setIsSaving(true);
      try {
        await savingFunctionRef.current();
        setHasUnsavedChanges(false);
        setShowUnsavedModal(false);
        
        // Either navigate or execute pending action
        if (pendingNavigation) {
          router.push(pendingNavigation);
          setPendingNavigation(null);
        } else if (pendingAction) {
          pendingAction();
          setPendingAction(null);
        }
      } catch (error) {
        console.error('Error saving:', error);
      } finally {
        setIsSaving(false);
      }
    }
  }, [pendingNavigation, pendingAction, router]);

  // Navigate/execute action without saving
  const handleContinueWithoutSaving = useCallback(() => {
    setHasUnsavedChanges(false);
    setShowUnsavedModal(false);
    
    if (pendingNavigation) {
      router.push(pendingNavigation);
      setPendingNavigation(null);
    } else if (pendingAction) {
      pendingAction();
      setPendingAction(null);
    }
  }, [pendingNavigation, pendingAction, router]);

  // Cancel navigation/action
  const handleStayOnPage = useCallback(() => {
    setShowUnsavedModal(false);
    setPendingNavigation(null);
    setPendingAction(null);
  }, []);

  const contextValue = React.useMemo(() => ({
    hasUnsavedChanges,
    setHasUnsavedChanges,
    showUnsavedModal,
    setShowUnsavedModal,
    pendingNavigation,
    setPendingNavigation,
    pendingAction,
    setPendingAction,
    handleNavigationAttempt,
    handleActionAttempt,
    handleSaveAndContinue,
    handleContinueWithoutSaving,
    handleStayOnPage,
    savingFunction,
    setSavingFunction,
    isSaving
  }), [
    hasUnsavedChanges, 
    setHasUnsavedChanges,
    showUnsavedModal,
    pendingNavigation,
    pendingAction,
    handleNavigationAttempt,
    handleActionAttempt,
    handleSaveAndContinue,
    handleContinueWithoutSaving,
    handleStayOnPage,
    savingFunction,
    setSavingFunction,
    isSaving
  ]);

  return (
    <UnsavedChangesContext.Provider value={contextValue}>
      {children}
      
      <UnsavedChangesModal 
        isOpen={showUnsavedModal}
        onStay={handleStayOnPage}
        onLeave={handleContinueWithoutSaving}
        onSaveAndLeave={handleSaveAndContinue}
        isSaving={isSaving || savingState}
      />
    </UnsavedChangesContext.Provider>
  );
};

export const useUnsavedChanges = () => {
  const context = useContext(UnsavedChangesContext);
  if (context === undefined) {
    throw new Error('useUnsavedChanges must be used within an UnsavedChangesProvider');
  }
  return context;
}; 