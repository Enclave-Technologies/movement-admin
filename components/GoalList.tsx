import React, { useCallback, useState } from "react";
import { GoalTile } from "./GoalTile";
import AddGoalModal from "./GoalModal";
import { useTrainer } from "@/context/TrainerContext";
import { goalTypes } from "@/configs/constants";
import axios from "axios";
import { GoalListSkeleton } from "./GoalListSkeleton";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const GoalList = ({ goals, setGoals, clientData, pageLoading }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [goalToEdit, setGoalToEdit] = useState(null);
    const {
        trainerData,
        trainerLoading: loading,
        trainerError: error,
    } = useTrainer();

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
                type: `${value} Goals`.toUpperCase(),
                goals: [],
            }));

            if (goals?.length > 0) {
                updatedGoals = updatedGoals.map((updatedGoal) => {
                    const existingGoal = goals.find(
                        (g) =>
                            g.type.toUpperCase() ===
                            updatedGoal.type.toUpperCase()
                    );
                    if (existingGoal) {
                        return {
                            ...existingGoal,
                            goals:
                                existingGoal.type.toUpperCase() ===
                                `${goalType} Goals`.toUpperCase()
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
                    updatedGoal.type.toUpperCase() ===
                    `${goalType} Goals`.toUpperCase()
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
        <div>
            <div className="w-full flex flex-row justify-end gap-4">
                <button
                    className="primary-btn"
                    onClick={() => setIsModalOpen(true)}
                >
                    Add Goal
                </button>
                <button className="secondary-btn">Edit Goals</button>
            </div>
            <AddGoalModal
                goalTypes={goalTypes}
                isOpen={isModalOpen}
                onAddGoal={addGoal}
                onClose={() => setIsModalOpen(false)}
            />
            <div className="flex flex-col w-full gap-8">
                {goals?.map((goal) => (
                    <div
                        key={goal.id}
                        className="flex flex-col w-full items-start gap-4"
                    >
                        <h1 className="uppercase text-xl font-bold">
                            {goal.type}
                        </h1>
                        <div className="flex flex-col gap-1 w-full">
                            {goal.goals.map((goalItem) => (
                                <GoalTile
                                    key={goalItem.id}
                                    goal={goalItem}
                                    onUpdateGoal={updateGoalInBackend}
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default GoalList;
