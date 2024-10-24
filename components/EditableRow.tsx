import React, { useState } from "react";
const EditableRow: React.FC<EditableRowProps> = ({
    rowData,
    onSave,
    isEditing,
    setIsEditing,
    allWorkouts,
}) => {
    // const [isEditing, setIsEditing] = useState(false);
    const [editedData, setEditedData] = useState<SessionExercise>(rowData);

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        console.log(name, value);
        setEditedData({ ...editedData, [name]: value });
    };

    const handleWorkoutSelection = (
        event: React.ChangeEvent<HTMLSelectElement>
    ) => {
        const selectedDescription = event.target.value;
        const selectedWorkout = allWorkouts.find(
            (workout) => workout.SpecificDescription === selectedDescription
        );
        if (selectedWorkout) {
            setEditedData({
                ...editedData,
                motion: selectedWorkout.Motion,
                specificDescription: selectedWorkout.SpecificDescription,
                repsMin: selectedWorkout.RecommendedRepsMin,
                repsMax: selectedWorkout.RecommendedRepsMax,
                setsMin: selectedWorkout.RecommendedSetsMin,
                setsMax: selectedWorkout.RecommendedSetsMax,
                tempo: selectedWorkout.Tempo,
                TUT: selectedWorkout.TUT,
                restMin: selectedWorkout.RecommendedRestMin,
                restMax: selectedWorkout.RecommendedRestMax,
                exercises: selectedWorkout.id,
            });
        }
    };

    const handleSave = () => {
        onSave(editedData);
        setIsEditing(false);
    };

    return (
        <tr>
            {isEditing ? (
                <>
                    <td className="w-1/8">
                        <input
                            type="text"
                            name="exerciseOrder"
                            value={editedData.exerciseOrder}
                            onChange={handleInputChange}
                            className="w-full text-black bg-white"
                        />
                    </td>
                    <td className="w-1/8">
                        <input
                            type="text"
                            name="motion"
                            value={editedData.motion}
                            onChange={handleInputChange}
                            className="w-full text-black bg-white"
                        />
                    </td>
                    <td className="w-1/8">
                        <select
                            name="specificDescription"
                            value={editedData.specificDescription}
                            onChange={handleWorkoutSelection}
                            className="w-full text-black bg-white"
                        >
                            {allWorkouts.map((workout) => (
                                <option
                                    key={workout.id}
                                    value={workout.SpecificDescription}
                                >
                                    {workout.SpecificDescription}
                                </option>
                            ))}
                        </select>
                    </td>
                    <td className="w-1/8">
                        <input
                            type="text"
                            name="repsMin"
                            value={editedData.repsMin}
                            onChange={handleInputChange}
                            className="w-full text-black bg-white"
                        />
                    </td>
                    <td className="w-1/8">
                        <input
                            type="text"
                            name="repsMax"
                            value={editedData.repsMax}
                            onChange={handleInputChange}
                            className="w-full text-black bg-white"
                        />
                    </td>
                    <td className="w-1/8">
                        <input
                            type="text"
                            name="setsMin"
                            value={editedData.setsMin}
                            onChange={handleInputChange}
                            className="w-full text-black bg-white"
                        />
                    </td>
                    <td className="w-1/8">
                        <input
                            type="text"
                            name="setsMax"
                            value={editedData.setsMax}
                            onChange={handleInputChange}
                            className="w-full text-black bg-white"
                        />
                    </td>
                    <td className="w-1/8">
                        <button
                            onClick={handleSave}
                            className="w-full text-black bg-white"
                        >
                            Save
                        </button>
                    </td>
                </>
            ) : (
                <>
                    <td className="w-1/8 text-black">
                        {rowData.exerciseOrder}
                    </td>
                    <td className="w-1/8 text-black">{rowData.motion}</td>
                    <td className="w-1/8 text-black">
                        {rowData.specificDescription}
                    </td>
                    <td className="w-1/8 text-black">{rowData.repsMin}</td>
                    <td className="w-1/8 text-black">{rowData.repsMax}</td>
                    <td className="w-1/8 text-black">{rowData.setsMin}</td>
                    <td className="w-1/8 text-black">{rowData.setsMax}</td>
                    <td className="w-1/8">
                        <button
                            onClick={() => setIsEditing(true)}
                            className="w-full text-black bg-white"
                        >
                            Edit
                        </button>
                    </td>
                </>
            )}
        </tr>
    );
};

export default EditableRow;
