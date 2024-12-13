import React from "react";
import { BiTrash } from "react-icons/bi";
import { BsTriangleFill } from "react-icons/bs";
import { FaChevronUp } from "react-icons/fa";

const WorkoutRecordBody = ({
    workoutRecords,
    toggleAccordion,
    openExercises,
    handleSetChange,
    handleExerciseNotesChange,
    handleAddSet,
    handleRemoveSet,
}) => {
    return (
        <div className="">
            {workoutRecords.map((exercise) => (
                <div
                    key={exercise.id}
                    className="flex flex-row items-center justify-center text-white uppercase mt-1  border-b border-gray-400 my-2"
                >
                    <div className="max-w-[920px] w-full pb-4">
                        <div
                            className="cursor-pointer text-white flex justify-between 
                items-start p-2 rounded-lg text-lg 
                "
                            onClick={() => toggleAccordion(exercise.id)}
                        >
                            <div className="flex flex-col items-start justify-start">
                                <span>
                                    {exercise.marker}. {exercise.shortName}
                                </span>
                                <div className="text-gray-400">
                                    {exercise.setRep}
                                </div>
                                <div className="text-gray-400">
                                    {exercise.bias} {exercise.lenShort}{" "}
                                    {exercise.impliment} {exercise.grip}{" "}
                                    {exercise.angle} {exercise.support}{" "}
                                    {exercise.tempo}
                                </div>
                            </div>
                            <span
                                className={`transition-transform text-white my-2 ${
                                    openExercises.includes(exercise.id)
                                        ? ""
                                        : "rotate-180"
                                }`}
                            >
                                <FaChevronUp className="text-lg" />
                            </span>
                        </div>

                        {openExercises.includes(exercise.id) && (
                            <div
                                className={`transition-all duration-300 py-8 ${
                                    openExercises.includes(exercise.id)
                                        ? "max-h-screen"
                                        : "max-h-0"
                                }`}
                            >
                                <div className="bg-green-800 rounded-lg">
                                    {/* <pre>{JSON.stringify(exercise, null, 2)}</pre> */}
                                    <div className="flex w-full flex-row flex-wrap items-start justify-between">
                                        <div className="w-2/3 pr-4">
                                            <table className="font-sans text-white table-auto w-full border-[1px] border-gray-400">
                                                <thead>
                                                    <tr className="border-[1px] border-gray-400">
                                                        <th className="p-2 border-[1px] border-gray-400">
                                                            SET
                                                        </th>
                                                        <th className="p-2 border-[1px] border-gray-400">
                                                            REPS
                                                        </th>
                                                        <th className="p-2 border-[1px] border-gray-400">
                                                            WEIGHT (KG)
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {exercise.sets.map(
                                                        (set, setIdx) => (
                                                            <tr
                                                                key={set.id}
                                                                className="border-[1px] border-gray-400"
                                                            >
                                                                <td className="p-2 text-center border-[1px] border-gray-400">
                                                                    {setIdx + 1}
                                                                </td>
                                                                <td className="p-2 text-center border-[1px] border-gray-400">
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
                                                                        className="w-full text-center bg-transparent uppercase rounded-3xl p-2 focus:outline-none"
                                                                    />
                                                                </td>
                                                                <td className="p-2 text-center border-[1px] border-gray-400">
                                                                    <input
                                                                        type="number"
                                                                        step="0.01"
                                                                        value={
                                                                            set.weight ||
                                                                            0
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
                                                                        className="w-full text-center uppercase bg-transparent  rounded-3xl p-2  focus:outline-none"
                                                                    />
                                                                </td>
                                                                <td
                                                                    className="p-2 text-center border-[1px] border-gray-400 bg-red-700 text-white cursor-pointer"
                                                                    onClick={() => {
                                                                        handleRemoveSet(
                                                                            exercise.id,
                                                                            setIdx
                                                                        );
                                                                    }}
                                                                >
                                                                    <button>
                                                                        <BiTrash
                                                                            size={
                                                                                20
                                                                            }
                                                                        />
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        )
                                                    )}
                                                    <tr>
                                                        <td className="border-[1px] border-gray-400"></td>
                                                        <td
                                                            className=""
                                                            colSpan={3}
                                                        >
                                                            <button
                                                                className="w-full"
                                                                onClick={() =>
                                                                    handleAddSet(
                                                                        exercise.id
                                                                    )
                                                                }
                                                            >
                                                                <div
                                                                    className="w-full px-16 py-2 text-white
                            hover:bg-green-300 hover:text-black font-semibold"
                                                                >
                                                                    Add Set
                                                                </div>
                                                            </button>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                        <div className="h-full flex-1">
                                            <textarea
                                                placeholder="Notes"
                                                value={exercise.notes}
                                                onChange={(e) =>
                                                    handleExerciseNotesChange(
                                                        exercise.id,
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full h-full p-2 bg-transparent border border-gray-400 focus:outline-none bg-black"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            ))}

            {/* <pre className="text-white">
                {JSON.stringify(workoutRecords, null, 2)}
            </pre> */}
        </div>
    );
};

export default WorkoutRecordBody;
