import React, { useEffect } from "react";

type UnsavedChangesModalProps = {
  isOpen: boolean;
  onContinue: () => void;
  onDiscard: () => void;
};

/**
 * A simple modal that warns users about unsaved changes
 */
const UnsavedChangesModal: React.FC<UnsavedChangesModalProps> = ({
  isOpen,
  onContinue,
  onDiscard,
}) => {
  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onContinue();
      }
    };
    
    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
    }
    
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onContinue]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm animate-fadeIn"
      onClick={() => onContinue()} // Close on backdrop click
    >
      <div 
        className="w-full max-w-md p-6 bg-white rounded-lg shadow-xl border-2 border-red-500 animate-slideIn"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking on modal
      >
        <div className="bg-red-50 p-3 rounded-md mb-4 border-l-4 border-red-500">
          <h2 className="text-2xl font-bold text-red-600 mb-2">⚠️ Unsaved Changes</h2>
          <p className="text-gray-700">
            You have unsaved changes that will be lost if you leave this page.
          </p>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onContinue}
            className="px-4 py-2 font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
          >
            Continue Editing
          </button>
          <button
            onClick={onDiscard}
            className="px-4 py-2 font-medium text-white bg-red-500 rounded-md hover:bg-red-600 transition-colors"
          >
            Discard Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default UnsavedChangesModal; 