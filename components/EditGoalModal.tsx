import { useState, useEffect } from "react";

const EditGoalModal = ({ isOpen, onClose, onSaveGoal, goalTypes, goal }) => {
    const [editedGoal, setEditedGoal] = useState(goal);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        setEditedGoal(goal);
    }, [goal]);

    const handleSaveGoal = async () => {
        if (editedGoal.description.trim() && editedGoal.type) {
            setIsSaving(true);
            await onSaveGoal(editedGoal);
            setIsSaving(false);
            onClose();
        }
    };

    if (!isOpen || !editedGoal) return null;

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-90 flex items-center justify-center  z-20">
            <div className="bg-white p-6 rounded shadow-lg max-w-lg w-full">
                <h1 className="text-lg font-bold mb-4">Edit Goal</h1>
                <select
                    value={editedGoal.type.toLowerCase()}
                    onChange={(e) =>
                        setEditedGoal({ ...editedGoal, type: e.target.value })
                    }
                    className="border rounded px-2 py-1 mb-2 w-full"
                >
                    <option value="">Select Goal Type</option>
                    {goalTypes.map((goalType) => (
                        <option key={goalType.value} value={goalType.value}>
                            {goalType.name}
                        </option>
                    ))}
                </select>
                <input
                    type="text"
                    value={editedGoal.description}
                    onChange={(e) =>
                        setEditedGoal({
                            ...editedGoal,
                            description: e.target.value,
                        })
                    }
                    placeholder="Goal Description"
                    className="border rounded px-2 py-1 mb-4 w-full"
                />
                <div className="flex justify-end">
                    <button
                        className={`secondary-btn mr-2 ${
                            isSaving ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                        onClick={onClose}
                        disabled={isSaving}
                    >
                        Cancel
                    </button>
                    <button
                        className={`primary-btn flex items-center justify-center ${
                            isSaving ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                        onClick={handleSaveGoal}
                        disabled={isSaving}
                    >
                        {isSaving ? (
                            <>
                                <svg
                                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
    );
};

export default EditGoalModal;
