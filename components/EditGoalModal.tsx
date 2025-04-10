import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";

const EditGoalModal = ({
  isOpen,
  onClose,
  onSaveGoal,
  goalTypes,
  goal,
  setShowToast = null,
  setToastMessage = null,
  setToastType = null,
}) => {
  const [editedGoal, setEditedGoal] = useState(goal);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (goal) {
      setEditedGoal({
        ...goal,
        // notes: goal.notes || "", // Notes attribute commented out due to collection limit
        deadline: goal.deadline || "",
      });
    }
  }, [goal]);

  // Reset error when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setError("");
    }
  }, [isOpen]);

  // Close modal on escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !isSaving) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose, isSaving]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleSaveGoal = async () => {
    if (!editedGoal.description.trim()) {
      setError("Goal title is required");
      return;
    }

    if (!editedGoal.type) {
      setError("Please select a goal type");
      return;
    }

    setIsSaving(true);
    setError("");

    try {
      // Create a copy of the goal with formatted deadline
      const goalToSave = { ...editedGoal };

      // Convert deadline to ISO format if it exists
      if (goalToSave.deadline) {
        goalToSave.deadline = new Date(
          goalToSave.deadline + "T23:59:59.999Z"
        ).toISOString();
      }

      await onSaveGoal(goalToSave);

      // Show success toast if toast functions are provided
      if (setShowToast && setToastMessage && setToastType) {
        setToastMessage("Goal successfully updated!");
        setToastType("success");
        setShowToast(true);
      }

      onClose();
    } catch (error) {
      console.error("Error saving goal:", error);
      setError(error.message || "Failed to save goal. Please try again.");

      // Show error toast if toast functions are provided
      if (setShowToast && setToastMessage && setToastType) {
        setToastMessage(error.message || "Failed to update goal");
        setToastType("error");
        setShowToast(true);
      }
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen || !editedGoal) return null;

  // Don't allow closing the modal by clicking backdrop while saving
  const handleBackdropClick = () => {
    if (!isSaving) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={handleBackdropClick}
      ></div>

      {/* Modal */}
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
        <div
          className="relative inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium leading-6 text-gray-900">
              Edit Goal
            </h3>
            {!isSaving && (
              <button
                type="button"
                className="inline-flex justify-center rounded-full p-2 text-gray-700 hover:bg-gray-100 focus:outline-none"
                onClick={onClose}
              >
                <FaTimes />
              </button>
            )}
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 text-sm rounded">
              {error}
            </div>
          )}

          {/* Form */}
          <div className="space-y-4">
            <div>
              <label
                htmlFor="goalType"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Goal Type
              </label>
              <select
                id="goalType"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                value={editedGoal.type.toLowerCase()}
                onChange={(e) =>
                  setEditedGoal({ ...editedGoal, type: e.target.value })
                }
                disabled={isSaving}
              >
                <option value="">Select Goal Type</option>
                {goalTypes.map((goalType) => (
                  <option key={goalType.value} value={goalType.value}>
                    {goalType.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Goal Title
              </label>
              <input
                type="text"
                id="description"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                value={editedGoal.description}
                onChange={(e) =>
                  setEditedGoal({
                    ...editedGoal,
                    description: e.target.value,
                  })
                }
                placeholder="Goal Title"
                disabled={isSaving}
              />
            </div>

            {/* Notes field commented out due to collection attribute limit */}
            {/* <div>
              <label
                htmlFor="notes"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Notes/Description (Optional)
              </label>
              <textarea
                id="notes"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                value={editedGoal.notes || ""}
                onChange={(e) =>
                  setEditedGoal({
                    ...editedGoal,
                    notes: e.target.value,
                  })
                }
                placeholder="Add detailed notes about this goal (optional)"
                rows={3}
                disabled={isSaving}
              />
            </div> */}

            <div>
              <label
                htmlFor="deadline"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Deadline (Optional)
              </label>
              <input
                type="date"
                id="deadline"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                value={editedGoal.deadline || ""}
                onChange={(e) =>
                  setEditedGoal({
                    ...editedGoal,
                    deadline: e.target.value,
                  })
                }
                disabled={isSaving}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              className="inline-flex justify-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
              onClick={onClose}
              disabled={isSaving}
            >
              Cancel
            </button>
            <button
              type="button"
              className={`inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white shadow-sm ${
                editedGoal.description.trim() === "" ||
                editedGoal.type === "" ||
                isSaving
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
              }`}
              onClick={handleSaveGoal}
              disabled={
                editedGoal.description.trim() === "" ||
                editedGoal.type === "" ||
                isSaving
              }
            >
              {isSaving ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Saving...
                </>
              ) : (
                "Save Goal"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditGoalModal;
