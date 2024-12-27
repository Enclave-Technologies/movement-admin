import React, { FC, useMemo, useState } from "react";
import EditModeTable from "./EditModeTable";
const SessionExerciseComponent: FC<SessionExerciseProps> = ({
  phaseId,
  sessionId,
  exercises,
  workouts,
  editingExerciseId,
  onExerciseUpdate,
  onExerciseDelete,
  handleExerciseSave,
  onEditExercise,
  onCancelEdit,
  savingState,
}) => {
  // const [mode, setMode] = useState<"edit" | "draggable">("draggable");
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
  };

  const workoutOptions = useMemo(() => {
    let options = getWorkoutOptions(selTargetArea);
    return options;
  }, [selTargetArea]);

  return (
    <div className="mt-4 overflow-x-auto touch-action-none">
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
    </div>
  );
};

export default SessionExerciseComponent;
