import React from "react";
import { BsTriangleFill } from "react-icons/bs";

const WorkoutRecordBody = ({
    workoutRecords,
    toggleAccordion,
    openExercises,
    handleSetChange,
    handleExerciseNotesChange,
    handleAddSet,
}) => {
    return (
        <div>
            {workoutRecords.map((exercise) => (
                <div
                    key={exercise.id}
                    className="text-white uppercase mt-1  border-b border-white my-2"
                >
                    <div
                        className="cursor-pointer text-white flex justify-between 
                items-center px-4 py-4 rounded-lg text-lg
                "
                        onClick={() => toggleAccordion(exercise.id)}
                    >
                        <span>
                            {exercise.marker}. {exercise.ShortDescription}
                        </span>
                        <span
                            className={`ml-2 transition-transform text-white ${
                                openExercises.includes(exercise.id)
                                    ? ""
                                    : "rotate-180"
                            }`}
                        >
                            <BsTriangleFill />
                        </span>
                    </div>

                    {openExercises.includes(exercise.id) && (
                        <div
                            className={`transition-all duration-300 ${
                                openExercises.includes(exercise.id)
                                    ? "max-h-screen"
                                    : "max-h-0"
                            }`}
                        >
                            <div className="mt-2 bg-green-800 p-4 rounded-lg">
                                {/* <pre>{JSON.stringify(exercise, null, 2)}</pre> */}
                                <div className="text-sm text-gray-200 pb-4">
                                    {exercise.setRep}
                                </div>
                                <div className="flex w-full">
                                    <div className="w-2/3 pr-4">
                                        <table className="font-sans text-white table-auto w-full">
                                            <thead>
                                                <tr>
                                                    <th className="p-2 ">
                                                        SET
                                                    </th>
                                                    <th className="p-2">
                                                        REPS
                                                    </th>
                                                    <th className="p-2">
                                                        WEIGHT (KG)
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {exercise.sets.map(
                                                    (set, setIdx) => (
                                                        <tr
                                                            key={set.id}
                                                            className=""
                                                        >
                                                            <td className="p-2 text-center">
                                                                {setIdx + 1}
                                                            </td>
                                                            <td className="p-2 text-center">
                                                                <input
                                                                    type="number"
                                                                    step="1"
                                                                    value={
                                                                        set.reps
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        handleSetChange(
                                                                            exercise.id,
                                                                            set.id,
                                                                            "reps",
                                                                            e
                                                                                .target
                                                                                .value
                                                                        )
                                                                    }
                                                                    className="w-full text-center bg-transparent border uppercase rounded-3xl p-2 border-gray-600 focus:outline-none"
                                                                />
                                                            </td>
                                                            <td className="p-2 text-center">
                                                                <input
                                                                    type="number"
                                                                    step="0.01"
                                                                    value={
                                                                        set.weight
                                                                    }
                                                                    onChange={(
                                                                        e
                                                                    ) =>
                                                                        handleSetChange(
                                                                            exercise.id,
                                                                            set.id,
                                                                            "weight",
                                                                            e
                                                                                .target
                                                                                .value
                                                                        )
                                                                    }
                                                                    className="w-full text-center uppercase bg-transparent border rounded-3xl p-2 border-gray-600 focus:outline-none"
                                                                />
                                                            </td>
                                                        </tr>
                                                    )
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="w-1/3 pl-4">
                                        <div className="flex flex-col h-full justify-between">
                                            <div className="mb-4">
                                                <label className="text-white">
                                                    Notes
                                                </label>
                                                <textarea
                                                    value={exercise.notes}
                                                    onChange={(e) =>
                                                        handleExerciseNotesChange(
                                                            exercise.id,
                                                            e.target.value
                                                        )
                                                    }
                                                    className="w-full h-full uppercase p-2 mt-2 bg-transparent border border-gray-600 focus:outline-none"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-between mt-4">
                                    <div className="flex gap-4">
                                        <button
                                            className="rounded-xl px-16 py-2 bg-green-300 text-green-800 border hover:border-solid hover:border-green-300 
                            hover:bg-green-800 hover:text-green-300 font-semibold"
                                            onClick={() =>
                                                handleAddSet(exercise.id)
                                            }
                                        >
                                            Add Set
                                        </button>
                                        {/* <button
                                        className="border border-solid rounded-xl px-16 py-2 border-green-300 text-green-300 
                            hover:bg-green-300 hover:text-green-800 font-semibold"
                                    >
                                        Add Note
                                    </button> */}
                                    </div>

                                    {/* <button className="border border-solid rounded-xl font-semibold px-16 py-2 border-white text-white hover:bg-white hover:text-gray-900">
                                        Confirm
                                    </button> */}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            ))}

            {/* <pre className="text-white">
                {JSON.stringify(workoutRecords, null, 2)}
            </pre> */}
        </div>
    );
};

export default WorkoutRecordBody;
