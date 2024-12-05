"use client";
import React, { useMemo, useState } from "react";
import Table from "./Table";
import axios from "axios";
import { API_BASE_URL } from "@/configs/constants";

const ExercisesTable = ({
    search,
    exercises,
    trainerDetails,
    setAllExercises,
}) => {
    const [updatingExercise, setUpdatingExercise] = useState<string | null>(
        null
    );

    const filteredExercises = useMemo(() => {
        return exercises.filter((exercise) => {
            return (
                exercise.fullName
                    .toLowerCase()
                    .includes(search.toLowerCase()) ||
                exercise.shortName
                    ?.toLowerCase()
                    .includes(search.toLowerCase()) ||
                exercise.motion?.toLowerCase().includes(search.toLowerCase()) ||
                exercise.targetArea
                    ?.toLowerCase()
                    .includes(search.toLowerCase())
            );
        });
    }, [exercises, search]);

    const handleApprovalChange = async (
        exerciseId: string,
        approved: boolean
    ) => {
        setUpdatingExercise(exerciseId);

        try {
            console.log(exerciseId);
            const response = await axios.put(
                `${API_BASE_URL}/mvmt/v1/admin/exercises/${exerciseId}`,
                {
                    approved,
                },
                {
                    withCredentials: true,
                }
            );

            // Update the local state with the new approved value
            setAllExercises((prevExercises) =>
                prevExercises.map((exercise) =>
                    exercise.$id === exerciseId
                        ? { ...exercise, approved }
                        : exercise
                )
            );
        } catch (error) {
            console.error("Error updating exercise approval:", error);
        } finally {
            setUpdatingExercise(null);
        }
    };

    const head = useMemo(() => {
        return [
            "Motion",
            "Target Area",
            "Exercise",
            "Shortend Name",
            // "Bias",
            // "Lengthened / Shortened",
            // "Impliment",
            // "Grip",
            // "Angle",
            // "Support",
            "Status",
        ].map((header, index) => {
            if (header == "Status") {
                return (
                    <th
                        key={index}
                        className="sticky right-0 z-10 text-xs uppercase font-bold pl-5 pr-4 h-8  whitespace-nowrap"
                    >
                        <div className="inline-block whitespace-nowrap">
                            Approved
                        </div>
                    </th>
                );
            }
            return (
                <th
                    key={index}
                    className="text-xs uppercase font-bold pl-5 pr-4 h-8  whitespace-nowrap"
                >
                    {header}
                </th>
            );
        });
    }, []);

    const rows = useMemo(() => {
        return filteredExercises.map((exercise, index) => (
            <tr
                key={index}
                className={`${
                    index % 2 ? "bg-white" : "bg-gray-100"
                } h-12 touch-action-none cursor-pointer hover:bg-gray-200`}
                // onClick={() => handleRowClick(client)}
            >
                <td className="pl-5 whitespace-nowrap text-sm">
                    {exercise.motion}
                </td>

                <td className="pl-5 whitespace-nowrap text-sm capitalize">
                    {exercise.targetArea || "Not Assigned"}
                </td>

                <td className="pl-5 whitespace-nowrap text-sm">
                    {exercise.fullName || "-"}
                </td>
                <td className="pl-5 whitespace-nowrap text-sm">
                    {exercise.shortName || "-"}
                </td>
                {trainerDetails?.team.name === "Admins" ? (
                    <td className="sticky right-0 bg-gray-50 z-10">
                        <select
                            className="w-full whitespace-nowrap"
                            value={exercise.approved}
                            onChange={(e) =>
                                handleApprovalChange(
                                    exercise.$id,
                                    e.target.value === "true"
                                )
                            }
                            disabled={updatingExercise === exercise.$id}
                        >
                            <option value="true">Approved</option>
                            <option value="false">Not Approved</option>
                        </select>
                    </td>
                ) : (
                    <td className="pl-5 whitespace-nowrap text-sm">
                        {exercise.approved ? "Approved" : "Not Approved"}
                    </td>
                )}
            </tr>
        ));
    }, [filteredExercises]);

    if (exercises.length === 0) {
        return (
            <div className="flex flex-col justify-center items-center h-[100vh] text-gray-600">
                <p className="font-bold text-lg mb-2">No Exercises added</p>
                <p className="font-medium">Press add to get started</p>
            </div>
        );
    }

    return <Table rows={rows} head={head} />;
};

export default ExercisesTable;
