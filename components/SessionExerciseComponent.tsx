import React, { FC, useMemo, useState, useEffect } from "react";
import EditModeTable from "./EditModeTable";
import UnsavedChangesModal from "./UnsavedChangesModal";
import useUnsavedChanges from "@/hooks/useUnsavedChanges";

// Define interface with added navigation block functions
interface SessionExerciseProps {
    phaseId: string;
    sessionId: string;
    exercises: any[];
    workouts: any[];
    editingExerciseId: string | null;
    onExerciseUpdate: (phaseId: string, sessionId: string, exercise: any) => void;
    onExerciseDelete: (phaseId: string, sessionId: string, exerciseId: string) => void;
    handleExerciseSave: () => Promise<void>;
    onEditExercise: (id: string | null) => void;
    onCancelEdit: () => void;
    savingState: boolean;
    onUnsavedChangesUpdate?: (hasChanges: boolean) => void;
}

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
    onUnsavedChangesUpdate,
}) => {
    const [selTargetArea, setSelTargetArea] = useState("");
    const [isDirty, setIsDirty] = useState(false);
    
    // Use the unsaved changes hook
    const {
        showModal,
        blockNavigation,
        continueEditing,
        discardChanges
    } = useUnsavedChanges(isDirty);

    // Notify parent component about unsaved changes
    useEffect(() => {
        if (onUnsavedChangesUpdate) {
            onUnsavedChangesUpdate(isDirty);
        }
    }, [isDirty, onUnsavedChangesUpdate]);

    // Handle dirty state change from EditModeTable
    const handleDirtyStateChange = (newDirtyState: boolean) => {
        setIsDirty(newDirtyState);
    };

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
        workout: any;
    }[] = (selectedTargetArea) => {
        return workouts.map((workout) => ({
            value: workout.id,
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
            {/* Unsaved Changes Modal */}
            <UnsavedChangesModal 
                isOpen={showModal}
                onContinue={continueEditing}
                onDiscard={discardChanges}
            />
            
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
                onDirtyStateChange={handleDirtyStateChange}
            />
        </div>
    );
};

export default SessionExerciseComponent;
