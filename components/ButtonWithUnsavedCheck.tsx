import React, { useCallback, useEffect } from 'react';

interface ButtonWithUnsavedCheckProps {
  onClick: () => void;
  children: React.ReactNode;
  className?: string;
  hasUnsavedChanges: boolean;
  onNavigateAttempt: () => void;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

/**
 * A Button component that checks for unsaved changes before executing an action
 */
const ButtonWithUnsavedCheck: React.FC<ButtonWithUnsavedCheckProps> = ({
  onClick,
  children,
  className,
  hasUnsavedChanges,
  onNavigateAttempt,
  disabled = false,
  type = 'button'
}) => {
  // Handle clicks with unsaved changes check
  const handleClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    // Prevent default button behavior
    e.preventDefault();
    
    if (hasUnsavedChanges) {
      // If dirty, trigger warning via callback
      onNavigateAttempt();
      console.log('ButtonWithUnsavedCheck: Showing warning due to unsaved changes');
    } else {
      // If not dirty, proceed with action
      console.log('ButtonWithUnsavedCheck: Executing action immediately');
      onClick();
    }
  }, [hasUnsavedChanges, onClick, onNavigateAttempt]);

  // For debugging
  useEffect(() => {
    console.log('ButtonWithUnsavedCheck rendering, isDirty:', hasUnsavedChanges);
  }, [hasUnsavedChanges]);

  return (
    <button
      type={type}
      className={className}
      onClick={handleClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default ButtonWithUnsavedCheck; 