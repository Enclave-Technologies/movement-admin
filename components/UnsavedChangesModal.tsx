import React from "react";

interface UnsavedChangesModalProps {
  isOpen: boolean;
  onLeave: () => void;
  onCancel: () => void;
}

const UnsavedChangesModal: React.FC<UnsavedChangesModalProps> = ({
  isOpen,
  onLeave,
  onCancel
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-md w-[500px] max-w-[90%]">
        <h2 className="text-xl font-semibold mb-2">Unsaved Changes</h2>
        <p className="text-gray-600 mb-6">
          You have unsaved changes. What would you like to do?
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg transition-transform active:scale-95 hover:bg-gray-200"
          >
            Continue Editing
          </button>
          <button
            onClick={onLeave}
            className="bg-red-100 text-red-700 px-4 py-2 rounded-lg transition-transform active:scale-95 hover:bg-red-200"
          >
            Leave Without Saving
          </button>
        </div>
      </div>
    </div>
  );
};

export default UnsavedChangesModal; 