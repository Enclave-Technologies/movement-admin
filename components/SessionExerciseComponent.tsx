import React, { FC, useMemo, useState } from "react";
import { FaPlus } from "react-icons/fa";
import EditModeTable from "./EditModeTable";
import DragModeTable from "./DragModeTable";
import LoadingSpinner from "./LoadingSpinner";

const SessionExerciseComponent: FC<SessionExerciseProps> = ({
  phaseId,
  sessionId,
  exercises,
  workouts,
  editingExerciseId,
  onExerciseAdd,
  onExerciseUpdate,
  onExerciseDelete,
  handleExerciseSave,
  onExerciseOrderChange,
  onEditExercise,
  onCancelEdit,
  savingState,
}) => {
  const [mode, setMode] = useState<"edit" | "draggable">("draggable");
  const [selTargetArea, setSelTargetArea] = useState("");

  const targetAreas = workouts.reduce((acc, workout) => {
    const { targetArea } = workout;
    if (targetArea === undefined) return acc;
    const capitalizedLabel =
      targetArea.charAt(0).toUpperCase() + targetArea.slice(1);
    if (!acc.some((item) => item.value === targetArea)) {
      acc.push({
        value: targetArea,
        label: capitalizedLabel,
      });
    }
    return acc;
  }, []);

  const getWorkoutOptions: (selectedTargetArea: string | null) => {
    value: string;
    label: string;
    workout: WorkoutData;
  }[] = (selectedTargetArea) => {
    return workouts.map((workout) => ({
      value: workout.$id,
      label: workout.fullName,
      workout: workout,
    }));
    // .filter((option) => {
    //   if (!selectedTargetArea) {
    //     return true; // Return all options if no target area is selected
    //   }
    //   return option.workout.targetArea === selectedTargetArea;
    // });
  };

  const workoutOptions = useMemo(() => {
    let options = getWorkoutOptions(selTargetArea);
    return options;
  }, [selTargetArea]);

  // const workoutOptions = workouts.map((workout) => ({
  //     value: workout.$id,
  //     label: workout.fullName,
  //     workout: workout,
  // }));

  return (
    <div className="mt-4 overflow-x-auto touch-action-none">
      {/* {mode === "edit" ? ( */}
      <EditModeTable
        phaseId={phaseId}
        sessionId={sessionId}
        exercises={exercises}
        setSelTargetArea={setSelTargetArea}
        targetAreas={targetAreas}
        workoutOptions={workoutOptions}
        editingExerciseId={editingExerciseId}
        onEditExercise={onEditExercise}
        onExerciseDelete={onExerciseDelete}
        handleExerciseSave={handleExerciseSave}
        onExerciseUpdate={onExerciseUpdate}
        onCancelEdit={onCancelEdit}
        savingState={savingState}
      />
      {/* ) : (
         <DragModeTable exercises={exercises} handleDragEnd={handleDragEnd} />
   )} */}
      {/* <div className="sticky bottom-0 left-0 bg-white shadow-md py-4">
        {savingState ? (
          <div className="w-full secondary-btn flex mt-4 px-4 py-2 items-center justify-center h-12 ">
            <LoadingSpinner className="w-4 h-4" />
          </div>
        ) : (
          <button
            className={`flex h-12 items-center justify-center w-full rounded mt-4 px-4 py-2
                         bg-green-500 text-white hover:bg-green-900 
                         transition-colors duration-200`}
            onClick={() => onExerciseAdd(phaseId, sessionId)}
          >
            <FaPlus className="mr-2" /> Add Exercise
          </button>
        )}
      </div> */}
    </div>
  );
};

export default SessionExerciseComponent;
