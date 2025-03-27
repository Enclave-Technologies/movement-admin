"use client";

import React from 'react';
import LoadingSpinner from "./LoadingSpinner";

interface UnsavedChangesModalProps {
  isOpen: boolean;
  onStay: () => void;
  onLeave: () => void;
  isSaving?: boolean;
}

const UnsavedChangesModal: React.FC<UnsavedChangesModalProps> = ({
  isOpen,
  onStay,
  onLeave,
  isSaving = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-md w-[400px] max-w-[90%]">
        <h3 className="text-xl font-semibold mb-4">Unsaved Changes</h3>
        <p className="text-gray-600 mb-6">
          You have unsaved changes that will be lost if you leave. Are you sure you want to leave?
        </p>
        <div className="flex justify-end gap-4">
          <button
            className="px-4 py-2 bg-primary text-white rounded-lg transition-colors"
            onClick={onStay}
            disabled={isSaving}
          >
            Continue Editing
          </button>
          <button
            className="px-4 py-2 bg-red-500 text-white rounded-lg transition-colors"
            onClick={onLeave}
            disabled={isSaving}
          >
            {isSaving ? (
              <div className="flex items-center gap-2">
                <LoadingSpinner className="h-4 w-4" />
                <span>Processing...</span>
              </div>
            ) : (
              "Leave"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UnsavedChangesModal;