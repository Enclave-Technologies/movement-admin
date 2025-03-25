import React from "react";

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
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-xl border-2 border-red-500">
        <h2 className="text-xl font-semibold text-gray-800">Unsaved Changes</h2>
        <p className="mt-2 text-gray-600">
          You have unsaved changes that will be lost if you leave this page.
        </p>
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onContinue}
            className="px-4 py-2 font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            Continue Editing
          </button>
          <button
            onClick={onDiscard}
            className="px-4 py-2 font-medium text-white bg-red-500 rounded-md hover:bg-red-600"
          >
            Discard Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default UnsavedChangesModal; 