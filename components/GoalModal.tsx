import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";

export default function GoalModal({
  isOpen,
  onClose,
  onAddGoal,
  goalTypes = [],
  setShowToast = null,
  setToastMessage = null,
  setToastType = null,
}) {
  const [goalType, setGoalType] = useState("");
  const [description, setDescription] = useState("");
  // Notes commented out due to collection attribute limit
  // const [notes, setNotes] = useState("");
  const [deadline, setDeadline] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      // Reset form state when modal closes
      setError("");
      // Don't reset the fields here since we'll do it after successful submission
    }
  }, [isOpen]);

  // Close modal on escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen && !isSubmitting) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose, isSubmitting]);

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

  const handleAddGoal = async () => {
    if (description.trim() === "") {
      setError("Goal title is required");
      return;
    }

    if (goalType === "") {
      setError("Please select a goal type");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      // Convert deadline to ISO format if it exists
      const formattedDeadline = deadline
        ? new Date(deadline + "T23:59:59.999Z").toISOString()
        : "";

      await onAddGoal(goalType, description, "", formattedDeadline);

      // Reset form after successful submission
      setDescription("");
      setGoalType("");
      setDeadline("");
      onClose();

      // Show success toast if toast functions are provided
      if (setShowToast && setToastMessage && setToastType) {
        setToastMessage("Goal successfully added!");
        setToastType("success");
        setShowToast(true);
      }
    } catch (error) {
      setError(error.message || "Failed to add goal. Please try again.");

      // Show error toast if toast functions are provided
      if (setShowToast && setToastMessage && setToastType) {
        setToastMessage(error.message || "Failed to add goal");
        setToastType("error");
        setShowToast(true);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  // Don't allow closing the modal by clicking backdrop while submitting
  const handleBackdropClick = () => {
    if (!isSubmitting) {
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
              Add New Goal
            </h3>
            {!isSubmitting && (
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
                value={goalType}
                onChange={(e) => setGoalType(e.target.value)}
                required
                disabled={isSubmitting}
              >
                <option value="">Select Goal Type</option>
                {goalTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.name}
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
                placeholder="Enter goal title"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                disabled={isSubmitting}
              />
            </div>

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
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              className="inline-flex justify-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="button"
              className={`inline-flex justify-center rounded-md border border-transparent px-4 py-2 text-sm font-medium text-white shadow-sm ${
                description.trim() === "" || goalType === "" || isSubmitting
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
              }`}
              onClick={handleAddGoal}
              disabled={
                description.trim() === "" || goalType === "" || isSubmitting
              }
            >
              {isSubmitting ? (
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
                  Adding...
                </>
              ) : (
                "Add Goal"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
