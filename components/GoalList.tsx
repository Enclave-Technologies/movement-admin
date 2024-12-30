import React, { useCallback, useState } from "react";
import { GoalTile } from "./GoalTile";
import AddGoalModal from "./GoalModal";
import { useTrainer } from "@/context/TrainerContext";
import { goalTypes } from "@/configs/constants";
import axios from "axios";
import { GoalListSkeleton } from "./GoalListSkeleton";
import EditGoalModal from "./EditGoalModal";
import { API_BASE_URL } from "@/configs/constants";
import { FaEdit, FaPlus } from "react-icons/fa";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog";
const GoalList = ({ goals, setGoals, clientData, pageLoading }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [editingGoal, setEditingGoal] = useState(null);
    const [goalToDelete, setGoalToDelete] = useState<string | null>(null);
    const {
        trainerData,
        trainerLoading: loading,
        trainerError: error,
    } = useTrainer();

    console.log(trainerData);

    const updateGoalInBackend = useCallback(
        async (id: string, completed: boolean) => {
            try {
                // Implement your API call here
                // For example:
                // await api.updateGoal(id, completed);

                const response = await axios.put(
                    `${API_BASE_URL}/mvmt/v1/client/goals/${id}`,
                    {
                        status: completed ? "completed" : "pending",
                    },
                    { withCredentials: true }
                );

                console.log(
                    `Updating goal ${id} to ${
                        completed ? "completed" : "not completed"
                    }`
                );
            } catch (error) {
                console.error("Failed to update goal:", error);
                throw error; // Re-throw the error to be handled in GoalTile
            }
        },
        []
    );

    const deleteGoal = async (goalId, goalType) => {
        if (window.confirm("Are you sure you want to delete this goal?")) {
            try {
                await axios.delete(
                    `${API_BASE_URL}/mvmt/v1/client/goals/${goalId}`,
                    {
                        withCredentials: true,
                    }
                );
                const updatedGoals = goals.map((category) => ({
                    ...category,
                    goals: category.goals.filter((goal) => goal.id !== goalId),
                }));
                setGoals(updatedGoals);
            } catch (error) {
                console.error("Failed to delete goal:", error);
            }
        }
    };

    const handleDeleteGoal = async (goalId) => {
        setGoalToDelete(goalId);
    };

    const confirmDeleteGoal = async () => {
        if (goalToDelete) {
            try {
                const updatedGoals = goals.map((category) => ({
                    ...category,
                    goals: category.goals.filter(
                        (goal) => goal.id !== goalToDelete
                    ),
                }));
                console.log(updatedGoals);
                setGoals(updatedGoals);
                setGoalToDelete(null);
                await axios.delete(
                    `${API_BASE_URL}/mvmt/v1/client/goals/${goalToDelete}`,
                    {
                        withCredentials: true,
                    }
                );
            } catch (error) {
                console.error("Failed to delete goal:", error);
            }
        }
    };

    const cancelDeleteGoal = () => {
        setGoalToDelete(null);
    };

    const addGoal = (goalType, newGoal) => {
        async function addGoalToDatabase() {
            const response = await axios.post(
                `${API_BASE_URL}/mvmt/v1/client/goals`,
                {
                    users: clientData.uid,
                    trainers: trainerData.$id,
                    goal_type: goalType,
                    description: newGoal,
                    status: "pending",
                },
                { withCredentials: true }
            );
            const data = response.data;
            let updatedGoals = goalTypes.map(({ value }) => ({
                type: `${value}`.toLowerCase(),
                goals: [],
            }));

            if (goals?.length > 0) {
                updatedGoals = updatedGoals.map((updatedGoal) => {
                    const existingGoal = goals.find(
                        (g) =>
                            g.type.toLowerCase() ===
                            updatedGoal.type.toLowerCase()
                    );
                    if (existingGoal) {
                        return {
                            ...existingGoal,
                            goals:
                                existingGoal.type.toLowerCase() ===
                                `${goalType}`.toLowerCase()
                                    ? [
                                          ...existingGoal.goals,
                                          {
                                              id: data.id,
                                              description: newGoal,
                                              completed: false,
                                          },
                                      ]
                                    : existingGoal.goals,
                        };
                    }
                    return updatedGoal;
                });
            } else {
                updatedGoals = updatedGoals.map((updatedGoal) =>
                    updatedGoal.type.toLowerCase() ===
                    `${goalType}`.toLowerCase()
                        ? {
                              ...updatedGoal,
                              goals: [
                                  {
                                      id: data.id,
                                      description: newGoal,
                                      completed: false,
                                  },
                              ],
                          }
                        : updatedGoal
                );
            }

            setGoals(updatedGoals);
        }
        addGoalToDatabase();
    };

    const editGoal = (goal, goalType) => {
        setEditingGoal({ ...goal, type: goalType });
        setIsModalOpen(true);
    };

    const saveEditedGoal = async (editedGoal) => {
        try {
            const response = await axios.put(
                `${API_BASE_URL}/mvmt/v1/client/goals/${editedGoal.id}`,
                {
                    description: editedGoal.description,
                    goal_type: editedGoal.type,
                },
                { withCredentials: true }
            );
            console.log("SAVING EDITED GOALS");
            console.log(goals);

            // Create a new array of categories
            const updatedGoals = goalTypes.map((goalType) => ({
                type: `${goalType.value}`.toLowerCase(),
                goals: [],
            }));

            // Distribute goals to their respective categories
            goals.forEach((category) => {
                category.goals.forEach((goal) => {
                    if (goal.id === editedGoal.id) {
                        // This is the edited goal, put it in its new category
                        const targetCategory = updatedGoals.find(
                            (cat) =>
                                cat.type.toLowerCase() === `${editedGoal.type}`
                        );
                        if (targetCategory) {
                            targetCategory.goals.push({
                                ...goal,
                                description: editedGoal.description,
                            });
                        }
                    } else {
                        // This is not the edited goal, keep it in its original category
                        const targetCategory = updatedGoals.find(
                            (cat) =>
                                cat.type.toLowerCase() ===
                                category.type.toLowerCase()
                        );
                        if (targetCategory) {
                            targetCategory.goals.push(goal);
                        }
                    }
                });
            });

            setGoals(updatedGoals);
            setIsModalOpen(false);
        } catch (error) {
            console.error("Failed to update goal:", error);
        }
    };

    if (goals?.length == 0) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center py-8">
                <div className="text-lg text-gray-700 mb-2">
                    {clientData?.name} does not have any goals added yet.
                </div>
                <div className="text-sm text-gray-500 mb-6">
                    Add a Custom Goal or Select a goal from your{" "}
                    <span className="font-medium text-gray-700 hover:text-black cursor-pointer">
                        Template Library
                    </span>
                </div>
                <button
                    className="bg-white
                     text-gray-700 text-sm font-medium 
                     py-2 px-4 border border-gray-300 
                     rounded-md shadow-sm transition duration-150 ease-in-out"
                    onClick={() => setIsModalOpen(true)}
                >
                    + Add Goal
                </button>
                <AddGoalModal
                    goalTypes={goalTypes}
                    isOpen={isModalOpen}
                    onAddGoal={addGoal}
                    onClose={() => setIsModalOpen(false)}
                />
            </div>
        );
    }

    if (pageLoading) {
        return <GoalListSkeleton />;
    }

    return (
        <div className="flex flex-col gap-8">
            <div className="w-full flex flex-row justify-start gap-4">
                <button
                    className={`
        px-4 py-2 rounded-md text-sm
        transition-all duration-200 ease-in-out
        focus:outline-none focus:ring-2 focus:ring-offset-2
        ${
            isEditMode
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : "flex items-center justify-center uppercase gap-2 bg-green-500 text-white"
        }
    `}
                    onClick={() => setIsModalOpen(true)}
                    disabled={isEditMode}
                >
                    {!isEditMode && <FaPlus />}{" "}
                    {isEditMode ? "Exit Edit Mode to Add" : `Add Goal`}
                </button>

                <button
                    className="flex items-center justify-center uppercase secondary-btn gap-2 px-4 py-2 rounded-md text-sm
        transition-all duration-200 ease-in-out
        focus:outline-none focus:ring-2 focus:ring-offset-2"
                    // {`secondary-btn ${
                    //     isEditMode ? "bg-gold-500 text-white" : ""
                    // }`}
                    onClick={() => setIsEditMode(!isEditMode)}
                >
                    {!isEditMode && <FaEdit />}{" "}
                    {isEditMode ? "Done Editing" : "Edit Goals"}
                </button>
            </div>
            <AddGoalModal
                goalTypes={goalTypes}
                isOpen={isModalOpen && !editingGoal}
                onAddGoal={addGoal}
                onClose={() => setIsModalOpen(false)}
            />
            <EditGoalModal
                goalTypes={goalTypes}
                isOpen={isModalOpen && editingGoal}
                onSaveGoal={saveEditedGoal}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditingGoal(null);
                }}
                goal={editingGoal}
            />
            <div className="flex flex-col w-full gap-8">
                {goals?.map((goal, idx) => (
                    <div
                        key={idx}
                        className="flex flex-col w-full items-start gap-4"
                    >
                        <h1 className="uppercase text-xl font-bold">
                            {goal.type} Goals
                        </h1>
                        <div className="flex flex-col gap-1 w-full">
                            {goal.goals.length > 0 ? (
                                goal.goals.map((goalItem) => (
                                    <React.Fragment key={goalItem.id}>
                                        {goalToDelete === goalItem.id && ( // Show confirmation only for the selected exercise
                                            <DeleteConfirmationDialog
                                                title={`Goal: ${goalItem.description}`}
                                                confirmDelete={
                                                    confirmDeleteGoal
                                                }
                                                cancelDelete={cancelDeleteGoal}
                                            />
                                        )}
                                        <GoalTile
                                            goal={goalItem}
                                            onUpdateGoal={updateGoalInBackend}
                                            isEditMode={isEditMode}
                                            onEdit={() =>
                                                editGoal(goalItem, goal.type)
                                            }
                                            // onDelete={() =>
                                            //     deleteGoal(goalItem.id, goal.type)
                                            // }
                                            onDelete={() =>
                                                handleDeleteGoal(goalItem.id)
                                            }
                                        />
                                    </React.Fragment>
                                ))
                            ) : (
                                <div className="text-center py-4 px-6 bg-gray-100 rounded-md shadow-sm">
                                    <p className="text-gray-500 text-sm font-medium uppercase">
                                        No goals added yet for {goal.type}
                                    </p>
                                    <p className="text-gray-400 text-xs mt-1 uppercase">
                                        Click &ldquo;Add Goal&rdquo; to get
                                        started
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GoalList;
