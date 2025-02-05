import React, { FC, useState } from "react";
import { FaEdit, FaSave, FaTrash } from "react-icons/fa";
import Select from "react-select";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog";
import LoadingSpinner from "./LoadingSpinner";
import { DEFAULT_WORKOUT_VALUES } from "@/configs/constants";
import {
    SortableContext,
    verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import DraggableRow from "./DraggableRow";

const EditModeTable: FC<EditableTableProps> = ({
    phaseId,
    sessionId,
    targetAreas,
    workoutOptions,
    exercises,
    setSelTargetArea,
    editingExerciseId,
    handleExerciseSave,
    onEditExercise,
    onExerciseUpdate,
    onExerciseDelete,
    savingState,
}) => {
    const [exerciseToDelete, setExerciseToDelete] = useState<string | null>(
        null
    ); // Store the exercise ID for deletion

    // const lenShortOptions = [
    //   { value: "lengthened", label: "Lengthened" },
    //   { value: "shortened", label: "Shortened" },
    //   { value: "variable", label: "Variable" },
    //   { value: "midrange", label: "Midrange" },
    //   { value: "none", label: "" },
    // ];

    // const gripOptions = [
    //   { value: "neutral", label: "Neutral" },
    //   { value: "underhand", label: "Underhand" },
    //   { value: "overhand", label: "Overhand" },
    //   { value: "none", label: "" },
    // ];

    // const angleOptions = [
    //   { value: "flat", label: "Flat" },
    //   { value: "incline", label: "Incline" },
    //   { value: "decline", label: "Decline" },
    //   { value: "none", label: "" },
    // ];

    const handleDeleteExercise = async (exerciseId: string) => {
        setExerciseToDelete(exerciseId); // Set the ID of the exercise to delete
    };
    const confirmExerciseDelete = () => {
        if (exerciseToDelete) {
            onExerciseDelete(phaseId, sessionId, exerciseToDelete); // Perform delete
            setExerciseToDelete(null); // Reset the state after confirmation
        }
    };

    const cancelExerciseDelete = () => {
        setExerciseToDelete(null); // Close dialog
    };

    const filteredExercises = (exercise) => {
        let results = workoutOptions.filter((option) => {
            return option.workout.targetArea == exercise.targetArea;
        });
        return results;
    };

    const calculateTUT = ({ tempo, setsMax, repsMax }) => {
        var tempoSum = 0;
        for (const i in tempo.split(" ")) {
            tempoSum += Number(tempo.split(" ")[i]);
        }
        return tempoSum * setsMax * repsMax;
    };

    // function handleDragEnd(event) {
    //   const { active, over } = event;

    //   if (active.id !== over.id) {
    //     const originalPos = exercises.findIndex((e) => e.id === active.id);
    //     const newPos = exercises.findIndex((e) => e.id === over.id);
    //     const newExercises = [...exercises];
    //     newExercises.splice(originalPos, 1);
    //     newExercises.splice(newPos, 0, exercises[originalPos]);
    //     // onExerciseOrderChange(phaseId, sessionId, newExercises);

    //   }
    // }

    return (
        <div className="overflow-y-hidden pb-72">
            {exercises.length === 0 ? (
                <div className="text-center py-4 px-6 bg-gray-100 rounded-md shadow-sm">
                    <p className="text-gray-500 text-sm font-medium capitalize">
                        No exercises added yet
                    </p>
                    <p className="text-gray-400 text-xs mt-1 capitalize">
                        Click &ldquo;Add exercise&rdquo; to get started
                    </p>
                </div>
            ) : (
                <table className="min-w-full bg-white table-fixed">
                    <thead className="bg-gray-200 text-black">
                        <tr>
                            <th className="px-2 py-2 text-xs text-center min-w-32">
                                Order
                            </th>
                            <th className="px-2 py-2 text-xs text-center min-w-64">
                                Motion
                            </th>
                            <th className="px-2 py-2 text-xs text-center min-w-64">
                                Target Area
                            </th>
                            <th className="px-2 py-2 text-xs text-center min-w-64">
                                Description
                            </th>
                            <th className="px-2 py-2 text-xs text-center min-w-48">
                                Sets
                            </th>
                            <th className="px-2 py-2 text-xs text-center min-w-48">
                                Reps
                            </th>
                            <th className="px-2 py-2 text-xs text-center min-w-48">
                                TUT
                            </th>
                            <th className="px-2 py-2 text-xs text-center min-w-48">
                                Tempo
                            </th>
                            <th className="px-2 py-2 text-xs text-center min-w-48">
                                Rest
                            </th>
                            <th className="px-2 py-2 text-xs text-center min-w-48">
                                Additional Information
                            </th>

                            <th className="sticky right-0 bg-gray-200 z-20 px-2 py-2 text-xs min-w-32 border-l-[1px] border-gray-500 flex justify-center">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {exercises
                            .sort((a, b) => a.exerciseOrder - b.exerciseOrder)
                            .map((exercise) => (
                                <React.Fragment key={exercise.id}>
                                    {editingExerciseId === exercise.id ? (
                                        <tr>
                                            <td className="px-1 py-2">
                                                <input
                                                    autoFocus
                                                    className="w-full text-center px-0 py-1 border rounded"
                                                    value={
                                                        exercise.setOrderMarker ||
                                                        ""
                                                    }
                                                    onChange={(e) =>
                                                        onExerciseUpdate(
                                                            phaseId,
                                                            sessionId,
                                                            {
                                                                ...exercise,
                                                                setOrderMarker:
                                                                    e.target
                                                                        .value,
                                                            }
                                                        )
                                                    }
                                                />
                                            </td>
                                            <td className="px-1 py-2">
                                                <input
                                                    className="w-full px-0 text-center py-1 border rounded cursor-not-allowed bg-gray-100"
                                                    disabled
                                                    value={exercise.motion}
                                                    onChange={(e) =>
                                                        onExerciseUpdate(
                                                            phaseId,
                                                            sessionId,
                                                            {
                                                                ...exercise,
                                                                motion: e.target
                                                                    .value,
                                                            }
                                                        )
                                                    }
                                                />
                                            </td>
                                            <td className="px-1 py-2 relative">
                                                <Select
                                                    options={targetAreas}
                                                    value={targetAreas.find(
                                                        (option) =>
                                                            option.value ===
                                                            exercise.targetArea
                                                    )}
                                                    onChange={(
                                                        selectedOption
                                                    ) => {
                                                        onExerciseUpdate(
                                                            phaseId,
                                                            sessionId,
                                                            {
                                                                ...exercise,
                                                                targetArea:
                                                                    selectedOption.value,
                                                            }
                                                        );

                                                        setSelTargetArea(
                                                            selectedOption.value
                                                        );
                                                    }}
                                                />
                                            </td>
                                            {/* <td className="w-2"></td> */}
                                            <td className="px-1 py-2 relative">
                                                <Select
                                                    options={filteredExercises(
                                                        exercise
                                                    )}
                                                    value={workoutOptions.find(
                                                        (option) =>
                                                            option.value ===
                                                            exercise.exerciseId
                                                    )}
                                                    onChange={(
                                                        selectedOption
                                                    ) => {
                                                        if (selectedOption) {
                                                            const { workout } =
                                                                selectedOption;
                                                            onExerciseUpdate(
                                                                phaseId,
                                                                sessionId,
                                                                {
                                                                    ...exercise,
                                                                    exerciseId:
                                                                        workout.id,
                                                                    motion: workout.motion,
                                                                    fullName:
                                                                        workout.fullName,
                                                                    targetArea:
                                                                        workout.targetArea,
                                                                    exerciseVideo:
                                                                        workout.videoUrl,
                                                                    repsMin:
                                                                        DEFAULT_WORKOUT_VALUES.repsMin,
                                                                    repsMax:
                                                                        DEFAULT_WORKOUT_VALUES.repsMax,
                                                                    setsMin:
                                                                        DEFAULT_WORKOUT_VALUES.setsMin,
                                                                    setsMax:
                                                                        DEFAULT_WORKOUT_VALUES.setsMax,
                                                                    tempo: DEFAULT_WORKOUT_VALUES.tempo,
                                                                    TUT: DEFAULT_WORKOUT_VALUES.TUT,
                                                                    restMin:
                                                                        DEFAULT_WORKOUT_VALUES.restMin,
                                                                    restMax:
                                                                        DEFAULT_WORKOUT_VALUES.restMax,
                                                                }
                                                            );
                                                        }
                                                    }}
                                                />
                                            </td>
                                            <td className="px-1 py-2">
                                                <div className="flex items-center text-center justify-center gap-1">
                                                    <input
                                                        className="w-12 px-0 py-1 text-center border rounded"
                                                        type="number"
                                                        value={
                                                            exercise.setsMin ||
                                                            ""
                                                        } // Ensure it's a controlled input
                                                        onChange={(e) => {
                                                            const value =
                                                                e.target.value;
                                                            const newValue =
                                                                value === ""
                                                                    ? 0
                                                                    : parseInt(
                                                                          value
                                                                      ); // Handle empty input
                                                            onExerciseUpdate(
                                                                phaseId,
                                                                sessionId,
                                                                {
                                                                    ...exercise,
                                                                    setsMin:
                                                                        newValue,
                                                                }
                                                            );
                                                        }}
                                                    />
                                                    <span className="text-xs">
                                                        {" "}
                                                        -{" "}
                                                    </span>
                                                    <input
                                                        className="w-12 px-0 py-1 text-center border rounded"
                                                        type="number"
                                                        value={
                                                            exercise.setsMax ||
                                                            ""
                                                        }
                                                        onChange={(e) => {
                                                            const value =
                                                                e.target.value;
                                                            const newValue =
                                                                value === ""
                                                                    ? 0
                                                                    : parseInt(
                                                                          value
                                                                      ); // Handle empty input
                                                            onExerciseUpdate(
                                                                phaseId,
                                                                sessionId,
                                                                {
                                                                    ...exercise,
                                                                    setsMax:
                                                                        newValue,
                                                                }
                                                            );
                                                        }}
                                                    />
                                                </div>
                                            </td>
                                            <td className="px-1 py-2">
                                                <div className="flex items-center text-center justify-center gap-1">
                                                    <input
                                                        className="w-12 px-0 py-1 text-center border rounded"
                                                        type="number"
                                                        value={
                                                            exercise.repsMin ||
                                                            ""
                                                        }
                                                        onChange={(e) => {
                                                            const value =
                                                                e.target.value;
                                                            const newValue =
                                                                value === ""
                                                                    ? 0
                                                                    : parseInt(
                                                                          value
                                                                      ); // Handle empty input
                                                            onExerciseUpdate(
                                                                phaseId,
                                                                sessionId,
                                                                {
                                                                    ...exercise,
                                                                    repsMin:
                                                                        newValue,
                                                                }
                                                            );
                                                        }}
                                                    />
                                                    <span className="text-xs">
                                                        {" "}
                                                        -{" "}
                                                    </span>
                                                    <input
                                                        className="w-12 px-0 py-1 text-center border rounded"
                                                        type="number"
                                                        value={
                                                            exercise.repsMax ||
                                                            ""
                                                        }
                                                        onChange={(e) => {
                                                            const value =
                                                                e.target.value;
                                                            const newValue =
                                                                value === ""
                                                                    ? 0
                                                                    : parseInt(
                                                                          value
                                                                      ); // Handle empty input
                                                            onExerciseUpdate(
                                                                phaseId,
                                                                sessionId,
                                                                {
                                                                    ...exercise,
                                                                    repsMax:
                                                                        newValue,
                                                                }
                                                            );
                                                        }}
                                                    />
                                                </div>
                                            </td>

                                            <td className="px-1 py-2">
                                                <input
                                                    className="w-full px-0 text-center py-1 border rounded"
                                                    value={calculateTUT({
                                                        tempo: exercise.tempo,
                                                        setsMax:
                                                            exercise.setsMax,
                                                        repsMax:
                                                            exercise.repsMax,
                                                    })}
                                                    disabled
                                                    onChange={(e) =>
                                                        onExerciseUpdate(
                                                            phaseId,
                                                            sessionId,
                                                            {
                                                                ...exercise,
                                                                TUT: Number(
                                                                    e.target
                                                                        .value
                                                                ),
                                                            }
                                                        )
                                                    }
                                                />
                                            </td>
                                            <td className="px-1 py-2">
                                                <input
                                                    className="w-full px-0 text-center py-1 border rounded"
                                                    value={exercise.tempo || ""}
                                                    onChange={(e) =>
                                                        onExerciseUpdate(
                                                            phaseId,
                                                            sessionId,
                                                            {
                                                                ...exercise,
                                                                tempo: e.target
                                                                    .value,
                                                            }
                                                        )
                                                    }
                                                />
                                            </td>
                                            <td className="px-1 py-2">
                                                <div className="flex items-center text-center justify-center gap-1">
                                                    <input
                                                        className="w-12 px-0 py-1 text-center border rounded"
                                                        type="number"
                                                        value={
                                                            exercise.restMin ||
                                                            ""
                                                        }
                                                        onChange={(e) => {
                                                            const value =
                                                                e.target.value;
                                                            const newValue =
                                                                value === ""
                                                                    ? 0
                                                                    : parseInt(
                                                                          value
                                                                      ); // Handle empty input
                                                            onExerciseUpdate(
                                                                phaseId,
                                                                sessionId,
                                                                {
                                                                    ...exercise,
                                                                    restMin:
                                                                        newValue,
                                                                }
                                                            );
                                                        }}
                                                    />
                                                    <span className="text-xs">
                                                        {" "}
                                                        -{" "}
                                                    </span>
                                                    <input
                                                        className="w-12 px-0 py-1 text-center border rounded"
                                                        type="number"
                                                        value={
                                                            exercise.restMax ||
                                                            ""
                                                        }
                                                        onChange={(e) => {
                                                            const value =
                                                                e.target.value;
                                                            const newValue =
                                                                value === ""
                                                                    ? 0
                                                                    : parseInt(
                                                                          value
                                                                      ); // Handle empty input
                                                            onExerciseUpdate(
                                                                phaseId,
                                                                sessionId,
                                                                {
                                                                    ...exercise,
                                                                    restMax:
                                                                        newValue,
                                                                }
                                                            );
                                                        }}
                                                    />
                                                </div>
                                            </td>
                                            <td className="px-1 py-2">
                                                <input
                                                    className="w-full text-center px-0 py-1 border rounded"
                                                    value={
                                                        exercise.xtraInstructions ||
                                                        ""
                                                    }
                                                    onChange={(e) =>
                                                        onExerciseUpdate(
                                                            phaseId,
                                                            sessionId,
                                                            {
                                                                ...exercise,
                                                                xtraInstructions:
                                                                    e.target
                                                                        .value,
                                                            }
                                                        )
                                                    }
                                                />
                                            </td>
                                            <td className="sticky right-0 bg-white z-10 px-2 py-2 h-14 flex items-center justify-center border-l-[1px] border-gray-500">
                                                {savingState ? (
                                                    <div className="text-black">
                                                        <LoadingSpinner className="w-4 h-4" />
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => {
                                                            // DONE: Saving to DB
                                                            onEditExercise(
                                                                null
                                                            );
                                                            handleExerciseSave();
                                                        }}
                                                        className="text-black hover:text-black"
                                                    >
                                                        <FaSave className="text-lg" />
                                                    </button>
                                                )}
                                            </td>
                                        </tr>
                                    ) : (
                                        <tr>
                                            <td className="px-2 py-2 overflow-hidden text-ellipsis whitespace-nowrap h-10 capitalize">
                                                {exercise.setOrderMarker}
                                            </td>
                                            <td className="px-2 py-2 overflow-hidden text-ellipsis whitespace-nowrap min-w-64 h-10 capitalize">
                                                {exercise.motion}
                                            </td>
                                            <td className="px-2 py-2 overflow-hidden text-ellipsis whitespace-nowrap min-w-64 h-10 capitalize">
                                                {exercise.targetArea}
                                            </td>
                                            <td className="px-2 py-2 overflow-hidden text-ellipsis whitespace-nowrap min-w-64 h-10 capitalize">
                                                {exercise.fullName}
                                            </td>
                                            <td className="px-2 py-2 overflow-hidden text-ellipsis whitespace-nowrap min-w-32 h-10 capitalize">{`${exercise.setsMin}-${exercise.setsMax}`}</td>
                                            <td className="px-2 py-2 overflow-hidden text-ellipsis whitespace-nowrap min-w-32 h-10 capitalize">{`${exercise.repsMin}-${exercise.repsMax}`}</td>
                                            <td className="px-2 py-2 overflow-hidden text-ellipsis whitespace-nowrap min-w-32 h-10 capitalize">
                                                {calculateTUT({
                                                    tempo: exercise.tempo,
                                                    setsMax: exercise.setsMax,
                                                    repsMax: exercise.repsMax,
                                                })}
                                            </td>
                                            <td className="px-2 py-2 overflow-hidden text-ellipsis whitespace-nowrap h-10 capitalize">
                                                {exercise.tempo}
                                            </td>
                                            <td className="px-2 py-2 overflow-hidden text-ellipsis whitespace-nowrap h-10 capitalize">{`${exercise.restMin}-${exercise.restMax}`}</td>
                                            <td className="px-2 py-2 overflow-hidden text-ellipsis whitespace-nowrap h-10 capitalize">{`${exercise.xtraInstructions}`}</td>
                                            <td className="sticky right-0 bg-white z-10 px-2 py-2 h-10 flex items-center justify-center border-l-[1px] border-gray-500">
                                                {savingState ? (
                                                    <div className="text-black">
                                                        <LoadingSpinner className="w-4 h-4" />
                                                    </div>
                                                ) : (
                                                    <>
                                                        <button
                                                            onClick={() =>
                                                                onEditExercise(
                                                                    exercise.id
                                                                )
                                                            }
                                                            className="text-black hover:text-black mr-2"
                                                        >
                                                            <FaEdit />
                                                        </button>
                                                        <button
                                                            // onClick={() =>
                                                            //     onExerciseDelete(
                                                            //         phaseId,
                                                            //         sessionId,
                                                            //         exercise.id
                                                            //     )
                                                            // }
                                                            onClick={
                                                                () =>
                                                                    handleDeleteExercise(
                                                                        exercise.id
                                                                    ) // Pass the exercise ID here
                                                            }
                                                            className="text-red-500 hover:text-red-700 mr-2"
                                                        >
                                                            <FaTrash />
                                                        </button>
                                                    </>
                                                )}
                                            </td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))}
                        {exercises
                            .sort((a, b) => a.exerciseOrder - b.exerciseOrder)
                            .map((exercise) => (
                                <tr key={exercise.id} className="border-b">
                                    {/* <td className="px-1 py-2">
                                        {exercise.exerciseOrder}
                                    </td> */}
                                    {exerciseToDelete === exercise.id && ( // Show confirmation only for the selected exercise
                                        <DeleteConfirmationDialog
                                            title={`Exercise: ${exercise.fullName}`}
                                            confirmDelete={
                                                confirmExerciseDelete
                                            }
                                            cancelDelete={cancelExerciseDelete}
                                        />
                                    )}
                                </tr>
                            ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default EditModeTable;
