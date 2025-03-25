import React, { useState, useEffect } from 'react';
import useUnsavedChanges from '@/hooks/useUnsavedChanges';
import UnsavedChangesModal from '@/components/UnsavedChangesModal';
import LinkWithUnsavedCheck from './LinkWithUnsavedCheck';
import { useRouter } from 'next/navigation';
import ButtonWithUnsavedCheck from './ButtonWithUnsavedCheck';
// Import context version for compatibility testing
import { useUnsavedChanges as useContextUnsavedChanges } from '@/context/UnsavedChangesContext';
import { IoRefreshOutline } from 'react-icons/io5';

/**
 * A test component to debug unsaved changes functionality
 */
const TestUnsavedChanges: React.FC = () => {
  const [isDirty, setIsDirty] = useState(false);
  const router = useRouter();
  
  // Hook-based approach
  const { 
    showModal, 
    blockNavigation, 
    continueEditing, 
    discardChanges 
  } = useUnsavedChanges(isDirty);
  
  // Context-based approach for compatibility
  const contextUnsavedChanges = useContextUnsavedChanges();
  
  // Sync state between the two approaches
  useEffect(() => {
    if (contextUnsavedChanges) {
      contextUnsavedChanges.setHasUnsavedChanges(isDirty);
    }
  }, [isDirty, contextUnsavedChanges]);
  
  // Debug logs
  useEffect(() => {
    console.log('isDirty changed:', isDirty);
  }, [isDirty]);
  
  useEffect(() => {
    console.log('showModal changed:', showModal);
  }, [showModal]);

  // Monitor navigation events
  useEffect(() => {
    const logNavigationEvent = (event: any) => {
      console.log('Navigation event detected:', event.detail);
    };
    
    window.addEventListener('navigationChanged', logNavigationEvent);
    return () => window.removeEventListener('navigationChanged', logNavigationEvent);
  }, []);

  // Force modal to show
  const forceShowModal = () => {
    blockNavigation(() => {
      console.log('Action allowed after modal interaction');
    });
  };

  // Navigation handler
  const handleNavigate = () => {
    blockNavigation(() => {
      console.log('Navigation allowed after modal interaction');
    });
  };

  // Context-based navigation handler
  const handleContextNavigate = () => {
    if (contextUnsavedChanges) {
      contextUnsavedChanges.handleNavigationAttempt('/');
    }
  };

  // Direct router navigation
  const navigateToHome = () => {
    router.push('/');
  };

  // Test the refresh behavior
  const refreshPage = () => {
    window.location.reload();
  };

  return (
    <div className="p-6 max-w-lg mx-auto bg-white rounded-xl shadow-md space-y-6 mt-10">
      <h1 className="text-2xl font-bold text-blue-600">Unsaved Changes Test</h1>
      
      <div className="bg-yellow-50 p-4 rounded-md border-l-4 border-yellow-400">
        <p className="text-yellow-700">
          This is a test component to debug unsaved changes warnings.
          Open your browser console to see debug info.
        </p>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <input 
            type="checkbox" 
            id="isDirty" 
            checked={isDirty}
            onChange={(e) => setIsDirty(e.target.checked)}
            className="h-5 w-5 text-blue-600"
          />
          <label htmlFor="isDirty" className="font-medium text-gray-700">
            Simulate unsaved changes
          </label>
        </div>
        
        <button
          onClick={refreshPage}
          className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
          title="Test browser refresh (beforeunload event)"
        >
          <IoRefreshOutline size={20} />
        </button>
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <button 
          onClick={forceShowModal}
          className="py-2 px-4 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Test Show Modal
        </button>
        
        <LinkWithUnsavedCheck 
          href="/"
          hasUnsavedChanges={isDirty}
          onNavigate={handleNavigate}
          className="py-2 px-4 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 text-center"
        >
          Test Link Navigation
        </LinkWithUnsavedCheck>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <ButtonWithUnsavedCheck
          onClick={navigateToHome}
          hasUnsavedChanges={isDirty}
          onNavigateAttempt={handleNavigate}
          className="py-2 px-4 bg-purple-500 text-white rounded-md hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          Test Button Navigation
        </ButtonWithUnsavedCheck>

        <button 
          onClick={() => {
            if (isDirty) {
              setShowModal(true);
            } else {
              router.push('/my-clients');
            }
          }}
          className="py-2 px-4 bg-orange-500 text-white rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          Direct Router Push
        </button>
      </div>

      <div className="mt-6 p-4 bg-gray-100 rounded-lg">
        <h2 className="text-lg font-semibold mb-2">Context-Based Testing</h2>
        <button 
          onClick={handleContextNavigate}
          className="py-2 px-4 w-full bg-teal-500 text-white rounded-md hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          Test Context Navigation
        </button>
      </div>
      
      {/* The unsaved changes modal */}
      <UnsavedChangesModal
        isOpen={showModal}
        onContinue={continueEditing}
        onDiscard={discardChanges}
      />
    </div>
  );
};

export default TestUnsavedChanges; 