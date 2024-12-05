import React, { FC, useState } from "react";
import { FaEdit, FaPlus, FaSave, FaTrash } from "react-icons/fa";
import { TiCancel } from "react-icons/ti";
import { InputActionMeta } from "react-select";
import Select from "react-select";
import DeleteConfirmationDialog from "./DeleteConfirmationDialog";

const EditModeTable: FC<EditableTableProps> = ({
  phaseId,
  sessionId,
  workoutOptions,
  exercises,
  editingExerciseId,
  onCancelEdit,
  onEditExercise,
  onExerciseUpdate,
  onExerciseDelete,
}) => {
  const [exerciseToDelete, setExerciseToDelete] = useState<string | null>(null); // Store the exercise ID for deletion

  const handleDeleteExercise = (exerciseId: string) => {
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

  return (
    <div>
      {exercises.length === 0 ? (
        <div className="text-center py-4 px-6 bg-gray-100 rounded-md shadow-sm">
          <p className="text-gray-500 text-sm font-medium uppercase">
            No exercises added yet
          </p>
          <p className="text-gray-400 text-xs mt-1 uppercase">
            Click &ldquo;Add exercise&rdquo; to get started
          </p>
        </div>
      ) : (
        <table className="min-w-full bg-white table-fixed">
          <colgroup>
            <col className="w-[140px]" />
            <col className="w-[150px]" />
            <col className="w-[200px]" />
            <col className="w-[320px]" />
            <col className="w-[320px]" />
            <col className="w-[200px]" />
            <col className="w-[200px]" />
            <col className="w-[100px]" />
            <col className="w-[150px]" />
            <col className="w-[150px]" />
            <col className="w-[150px]" />
          </colgroup>
          <thead className="bg-gray-200 text-black">
            <tr>
              <th className="px-2 py-2 text-xs text-left min-w-32">Order</th>
              <th className="px-2 py-2 text-xs text-left min-w-64">Motion</th>
              <th className="px-2 py-2 text-xs text-left min-w-64">
                Description
              </th>
              <th className="px-2 py-2 text-xs text-left min-w-64">
                Short Description
              </th>
              <th className="px-2 py-2 text-xs text-left min-w-32">Sets</th>
              <th className="px-2 py-2 text-xs text-left min-w-32">Reps</th>
              <th className="px-2 py-2 text-xs text-left min-w-32">TUT</th>
              <th className="px-2 py-2 text-xs text-left min-w-32">Tempo</th>
              <th className="px-2 py-2 text-xs text-left min-w-32">Rest</th>
              <th className="sticky right-0 bg-gray-100 z-20 px-2 py-2 text-xs min-w-32 border-l-[1px] border-gray-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {exercises
              .sort((a, b) => a.exerciseOrder - b.exerciseOrder)
              .map((exercise) => (
                <tr key={exercise.id} className="border-b">
                  {/* <td className="px-1 py-2">
                                        {exercise.exerciseOrder}
                                    </td> */}
                  {exerciseToDelete === exercise.id && ( // Show confirmation only for the selected exercise
                    <DeleteConfirmationDialog
                      title={`Exercise: ${exercise.exerciseDescription}`}
                      confirmDelete={confirmExerciseDelete}
                      cancelDelete={cancelExerciseDelete}
                    />
                  )}
                  {editingExerciseId === exercise.id ? (
                    <>
                      <td className="px-1 py-2">
                        <input
                          className="w-full text-center px-0 py-1 border rounded"
                          value={exercise.setOrderMarker || ""}
                          onChange={(e) =>
                            onExerciseUpdate(phaseId, sessionId, {
                              ...exercise,
                              setOrderMarker: e.target.value,
                            })
                          }
                        />
                      </td>
                      <td className="px-1 py-2">
                        <input
                          className="w-full px-0 text-center py-1 border rounded cursor-not-allowed bg-gray-100"
                          readOnly
                          value={exercise.exerciseMotion}
                          onChange={(e) =>
                            onExerciseUpdate(phaseId, sessionId, {
                              ...exercise,
                              exerciseMotion: e.target.value,
                            })
                          }
                        />
                      </td>
                      <td className="px-1 py-2 relative">
                        <Select
                          options={workoutOptions}
                          value={workoutOptions.find(
                            (option) => option.value === exercise.exerciseId
                          )}
                          onChange={(selectedOption) => {
                            if (selectedOption) {
                              const { workout } = selectedOption;
                              onExerciseUpdate(phaseId, sessionId, {
                                ...exercise,
                                exerciseId: workout.id,
                                exerciseMotion: workout.Motion,
                                exerciseDescription:
                                  workout.SpecificDescription,
                                exerciseShortDescription:
                                  workout.ShortDescription,
                                exerciseVideo: workout.videoURL,
                                repsMin: workout.RecommendedRepsMin,
                                repsMax: workout.RecommendedRepsMax,
                                setsMin: workout.RecommendedSetsMin,
                                setsMax: workout.RecommendedSetsMax,
                                tempo: workout.Tempo,
                                TUT: workout.TUT,
                                restMin: workout.RecommendedRestMin,
                                restMax: workout.RecommendedRestMax,
                              });
                            }
                          }}
                          styles={{
                            control: (base) => ({
                              ...base,
                              backgroundColor: "white",
                              border: "1px solid #e5e7eb",
                              borderRadius: "0.375rem",
                              minHeight: "36px",
                              height: "36px",
                              display: "flex",
                              alignItems: "center",
                              cursor: "pointer",
                              "&:hover": {
                                borderColor: "#9ca3af",
                              },
                            }),
                            menu: (base) => ({
                              ...base,
                              zIndex: 1000,
                              marginTop: "0.25rem",
                              width: "100%", // Ensure menu is width of the control
                            }),
                            option: (base, state) => ({
                              ...base,
                              backgroundColor: state.isSelected
                                ? "#e5e7eb"
                                : state.isFocused
                                ? "#f3f4f6"
                                : "white",
                              color: "#374151",
                              padding: "0.5rem 1rem",
                              "&:hover": {
                                backgroundColor: "#f3f4f6",
                              },
                            }),
                            singleValue: (base) => ({
                              ...base,
                              color: "#374151",
                              fontSize: "0.875rem",
                              lineHeight: "1.25rem",
                              fontWeight: "400",
                            }),
                          }}
                        />
                      </td>

                      <td className="px-1 py-2">
                        <input
                          className="w-full px-0 text-center py-1 border rounded  cursor-not-allowed bg-gray-100"
                          readOnly
                          value={exercise.exerciseShortDescription || ""}
                          onChange={(e) =>
                            onExerciseUpdate(phaseId, sessionId, {
                              ...exercise,
                              exerciseShortDescription: e.target.value,
                            })
                          }
                        />
                      </td>
                      <td className="px-1 py-2">
                        <div className="flex items-center text-center justify-center gap-1">
                          <input
                            className="w-12 px-0 py-1 text-center border rounded"
                            type="number"
                            value={exercise.setsMin || ""} // Ensure it's a controlled input
                            onChange={(e) => {
                              const value = e.target.value;
                              const newValue =
                                value === "" ? 0 : parseInt(value); // Handle empty input
                              onExerciseUpdate(phaseId, sessionId, {
                                ...exercise,
                                setsMin: newValue,
                              });
                            }}
                          />
                          <span className="text-xs"> - </span>
                          <input
                            className="w-12 px-0 py-1 text-center border rounded"
                            type="number"
                            value={exercise.setsMax || ""}
                            onChange={(e) => {
                              const value = e.target.value;
                              const newValue =
                                value === "" ? 0 : parseInt(value); // Handle empty input
                              onExerciseUpdate(phaseId, sessionId, {
                                ...exercise,
                                setsMax: newValue,
                              });
                            }}
                          />
                        </div>
                      </td>
                      <td className="px-1 py-2">
                        <div className="flex items-center text-center justify-center gap-1">
                          <input
                            className="w-12 px-0 py-1 text-center border rounded"
                            type="number"
                            value={exercise.repsMin || ""}
                            onChange={(e) => {
                              const value = e.target.value;
                              const newValue =
                                value === "" ? 0 : parseInt(value); // Handle empty input
                              onExerciseUpdate(phaseId, sessionId, {
                                ...exercise,
                                repsMin: newValue,
                              });
                            }}
                          />
                          <span className="text-xs"> - </span>
                          <input
                            className="w-12 px-0 py-1 text-center border rounded"
                            type="number"
                            value={exercise.repsMax || ""}
                            onChange={(e) => {
                              const value = e.target.value;
                              const newValue =
                                value === "" ? 0 : parseInt(value); // Handle empty input
                              onExerciseUpdate(phaseId, sessionId, {
                                ...exercise,
                                repsMax: newValue,
                              });
                            }}
                          />
                        </div>
                      </td>

                      <td className="px-1 py-2">
                        <input
                          className="w-full px-0 text-center py-1 border rounded"
                          value={exercise.TUT || ""}
                          onChange={(e) =>
                            onExerciseUpdate(phaseId, sessionId, {
                              ...exercise,
                              TUT: Number(e.target.value),
                            })
                          }
                        />
                      </td>
                      <td className="px-1 py-2">
                        <input
                          className="w-full px-0 text-center py-1 border rounded"
                          value={exercise.tempo || ""}
                          onChange={(e) =>
                            onExerciseUpdate(phaseId, sessionId, {
                              ...exercise,
                              tempo: e.target.value,
                            })
                          }
                        />
                      </td>
                      <td className="px-1 py-2">
                        {/* <input
                                                    className="w-full px-0 text-center py-1 border rounded"
                                                    value={`${exercise.restMin}-${exercise.restMax}`}
                                                    onChange={(e) => {
                                                        const [min, max] =
                                                            e.target.value
                                                                .split("-")
                                                                .map(Number);
                                                        onExerciseUpdate(
                                                            phaseId,
                                                            sessionId,
                                                            {
                                                                ...exercise,
                                                                restMin: min,
                                                                restMax: max,
                                                            }
                                                        );
                                                    }}
                                                /> */}
                        <div className="flex items-center text-center justify-center gap-1">
                          <input
                            className="w-12 px-0 py-1 text-center border rounded"
                            type="number"
                            value={exercise.restMin || ""}
                            onChange={(e) => {
                              const value = e.target.value;
                              const newValue =
                                value === "" ? 0 : parseInt(value); // Handle empty input
                              onExerciseUpdate(phaseId, sessionId, {
                                ...exercise,
                                restMin: newValue,
                              });
                            }}
                          />
                          <span className="text-xs"> - </span>
                          <input
                            className="w-12 px-0 py-1 text-center border rounded"
                            type="number"
                            value={exercise.restMax || ""}
                            onChange={(e) => {
                              const value = e.target.value;
                              const newValue =
                                value === "" ? 0 : parseInt(value); // Handle empty input
                              onExerciseUpdate(phaseId, sessionId, {
                                ...exercise,
                                restMax: newValue,
                              });
                            }}
                          />
                        </div>
                      </td>
                      <td className="sticky right-0 bg-white z-10 px-2 py-2 h-14 flex items-center justify-center border-l-[1px] border-gray-500">
                        {/* <button
                                                    onClick={() =>
                                                        onCancelEdit()
                                                    }
                                                    className="text-red-500 hover:text-red-700 mr-2"
                                                >
                                                    <TiCancel className="text-xl" />
                                                </button> */}
                        <button
                          onClick={() => {
                            // TODO: To save the exercise in DB
                            onEditExercise(null);
                          }}
                          className="text-black hover:text-black"
                        >
                          <FaSave className="text-lg" />
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-2 py-2 overflow-hidden text-ellipsis whitespace-nowrap h-10">
                        {exercise.setOrderMarker}
                      </td>
                      <td className="px-2 py-2 overflow-hidden text-ellipsis whitespace-nowrap min-w-64 h-10">
                        {exercise.exerciseMotion}
                      </td>
                      <td className="px-2 py-2 overflow-hidden text-ellipsis whitespace-nowrap min-w-64 h-10">
                        {exercise.exerciseDescription}
                      </td>
                      <td className="px-2 py-2 overflow-hidden text-ellipsis whitespace-nowrap min-w-64 h-10">
                        {exercise.exerciseShortDescription}
                      </td>
                      <td className="px-2 py-2 overflow-hidden text-ellipsis whitespace-nowrap min-w-32 h-10">{`${exercise.setsMin}-${exercise.setsMax}`}</td>
                      <td className="px-2 py-2 overflow-hidden text-ellipsis whitespace-nowrap min-w-32 h-10">{`${exercise.repsMin}-${exercise.repsMax}`}</td>
                      <td className="px-2 py-2 overflow-hidden text-ellipsis whitespace-nowrap min-w-32 h-10">
                        {exercise.TUT}
                      </td>
                      <td className="px-2 py-2 overflow-hidden text-ellipsis whitespace-nowrap h-10">
                        {exercise.tempo}
                      </td>
                      <td className="px-2 py-2 overflow-hidden text-ellipsis whitespace-nowrap h-10">{`${exercise.restMin}-${exercise.restMax}`}</td>
                      <td className="sticky right-0 bg-white z-10 px-2 py-2 h-10 flex items-center justify-center border-l-[1px] border-gray-500">
                        <button
                          onClick={() => onEditExercise(exercise.id)}
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
                            () => handleDeleteExercise(exercise.id) // Pass the exercise ID here
                          }
                          className="text-red-500 hover:text-red-700"
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </>
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
