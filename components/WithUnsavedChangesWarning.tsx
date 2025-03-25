import React, { ComponentType, useEffect } from 'react';
import useUnsavedChangesWarning from '@/hooks/useUnsavedChangesWarning';
import UnsavedChangesModal from './UnsavedChangesModal';

export interface WithUnsavedChangesWarningProps {
  hasUnsavedChanges: boolean;
  setNavBlockEnabled?: (enabled: boolean) => void;
}

/**
 * A Higher Order Component that adds unsaved changes warnings to any component
 * 
 * @param WrappedComponent The component to wrap with unsaved changes warning
 * @returns A new component with unsaved changes warning functionality
 */
const withUnsavedChangesWarning = <P extends WithUnsavedChangesWarningProps>(
  WrappedComponent: ComponentType<P>
) => {
  // Return a new component
  const WithUnsavedWarning = (props: P) => {
    const { hasUnsavedChanges } = props;
    
    // Use our hook for handling unsaved changes
    const {
      showWarningModal,
      handleNavigationAttempt,
      handleLeaveWithoutSaving,
      handleContinueEditing
    } = useUnsavedChangesWarning(hasUnsavedChanges);

    // Expose navigation protection to the wrapped component
    useEffect(() => {
      if (props.setNavBlockEnabled) {
        props.setNavBlockEnabled(handleNavigationAttempt);
      }
    }, [handleNavigationAttempt, props]);

    // Return the wrapped component with added warning functionality
    return (
      <>
        {/* The unsaved changes warning modal */}
        <UnsavedChangesModal
          isOpen={showWarningModal}
          onLeave={handleLeaveWithoutSaving}
          onCancel={handleContinueEditing}
        />
        
        {/* Render the wrapped component with all its props */}
        <WrappedComponent 
          {...props} 
          handleNavigationAttempt={handleNavigationAttempt}
        />
      </>
    );
  };

  // Set display name for debugging
  WithUnsavedWarning.displayName = `WithUnsavedChangesWarning(${getDisplayName(WrappedComponent)})`;
  
  return WithUnsavedWarning;
};

// Helper function to get component display name
function getDisplayName<P>(WrappedComponent: ComponentType<P>): string {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

export default withUnsavedChangesWarning; 