import React from 'react';

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
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (hasUnsavedChanges) {
      e.preventDefault();
      onNavigateAttempt();
    } else {
      onClick();
    }
  };

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