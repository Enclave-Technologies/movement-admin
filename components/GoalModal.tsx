import { useState } from "react";

const AddGoalModal = ({ isOpen, onClose, onAddGoal, goalTypes }) => {
    const [newGoal, setNewGoal] = useState("");
    const [selectedGoalType, setSelectedGoalType] = useState("");

    const handleAddGoal = () => {
        if (newGoal.trim() && selectedGoalType) {
            onAddGoal(selectedGoalType, newGoal);
            setNewGoal("");
            setSelectedGoalType("");
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-90 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-lg max-w-lg w-full">
                <h1 className="text-lg font-bold mb-4">Add Goal</h1>
                <select
                    value={selectedGoalType}
                    onChange={(e) => setSelectedGoalType(e.target.value)}
                    className="border rounded px-2 py-1 mb-2 w-full"
                >
                    <option value="">Select Goal Type</option>
                    {goalTypes.map((goal) => (
                        <option key={goal.value} value={goal.value}>
                            {goal.name}
                        </option>
                    ))}
                </select>
                <input
                    type="text"
                    value={newGoal}
                    onChange={(e) => setNewGoal(e.target.value)}
                    placeholder="New Goal"
                    className="border rounded px-2 py-1 mb-4 w-full"
                />
                <div className="flex justify-end">
                    <button className="secondary-btn mr-2" onClick={onClose}>
                        Cancel
                    </button>
                    <button className="primary-btn" onClick={handleAddGoal}>
                        Add Goal
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddGoalModal;
