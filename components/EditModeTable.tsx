import React, { FC, useState, useEffect, useCallback } from "react";
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
import { useRouter } from "next/navigation";
import UnsavedChangesModal from "./UnsavedChangesModal";
import useUnsavedChangesWarning from "@/hooks/useUnsavedChangesWarning";

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
    const [exerciseToDelete, setExerciseToDelete] = useState<string | null>(null);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    
    const router = useRouter();

    // Use our simplified hook
    const {
        showWarningModal,
        handleNavigationAttempt,
        handleLeaveWithoutSaving,
        handleContinueEditing
    } = useUnsavedChangesWarning(hasUnsavedChanges);

    // Track unsaved changes when editing begins or ends
    useEffect(() => {
        if (editingExerciseId) {
            setHasUnsavedChanges(true);
        }
    }, [editingExerciseId]);

    // Modified update handler to track changes
    const handleExerciseUpdate = (phaseId, sessionId, updatedExercise) => {
        setHasUnsavedChanges(true);
        onExerciseUpdate(phaseId, sessionId, updatedExercise);
    };
    
    // Save changes handler
    const handleSaveChanges = () => {
        handleExerciseSave();
        setHasUnsavedChanges(false);
        onEditExercise(null);
    };

    const handleDeleteExercise = async (exerciseId: string) => {
        setExerciseToDelete(exerciseId); 
    };
    
    const confirmExerciseDelete = () => {
        if (exerciseToDelete) {
            onExerciseDelete(phaseId, sessionId, exerciseToDelete);
            setExerciseToDelete(null);
        }
    };

    const cancelExerciseDelete = () => {
        setExerciseToDelete(null);
    };

    const filteredExercises = (exercise) => {
        return workoutOptions;
    };

    const calculateTUT = ({ tempo, setsMax, repsMax }) => {
        var tempoSum = 0;
        for (const i in tempo.split(" ")) {
            tempoSum += Number(tempo.split(" ")[i]);
        }
        return tempoSum * setsMax * repsMax;
    };

    return (
        <div className="overflow-y-hidden pb-72">
            {/* Unsaved Changes Warning Modal - simple version */}
            <UnsavedChangesModal 
                isOpen={showWarningModal}
                onLeave={handleLeaveWithoutSaving}
                onCancel={handleContinueEditing}
            />

            {/* Delete Confirmation Modal */}
            {exerciseToDelete && (
                <DeleteConfirmationDialog
                    title={`Exercise: ${exercises.find(e => e.id === exerciseToDelete)?.fullName || ''}`}
                    confirmDelete={confirmExerciseDelete}
                    cancelDelete={cancelExerciseDelete}
                />
            )}

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
                                                        handleExerciseUpdate(
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
                                                        handleExerciseUpdate(
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
                                                        handleExerciseUpdate(
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
                                                            handleExerciseUpdate(
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
                                                            handleExerciseUpdate(
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
                                                            handleExerciseUpdate(
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
                                                            handleExerciseUpdate(
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
                                                            handleExerciseUpdate(
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
                                                        handleExerciseUpdate(
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
                                                        handleExerciseUpdate(
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
                                                            handleExerciseUpdate(
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
                                                            handleExerciseUpdate(
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
                                                        handleExerciseUpdate(
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
                                                        onClick={handleSaveChanges}
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
                                                            onClick={
                                                                () =>
                                                                    handleDeleteExercise(
                                                                        exercise.id
                                                                    )
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
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default EditModeTable;
