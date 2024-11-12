import React from "react";

const ExerciseTable = ({ exercises }: { exercises: SessionExercise[] }) => {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Order
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Motion
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Description
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Reps
                        </th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Sets
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                    {exercises.map((exercise) => (
                        <tr key={exercise.id}>
                            <td className="px-4 py-2 whitespace-nowrap">
                                {exercise.exerciseOrder}
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap">
                                {exercise.motion}
                            </td>
                            <td className="px-4 py-2">
                                {exercise.specificDescription}
                            </td>
                            <td className="px-4 py-2 whitespace-nowrap">{`${exercise.repsMin}-${exercise.repsMax}`}</td>
                            <td className="px-4 py-2 whitespace-nowrap">{`${exercise.setsMin}-${exercise.setsMax}`}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ExerciseTable;
