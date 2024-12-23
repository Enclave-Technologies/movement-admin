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
  const removeTrailingZeros = (value) => {
    if (value === 0) {
      return 0;
    }
    for (let i = value.length - 1; i >= 0; i--) {
      if (value[i] === "0") {
        value = value.slice(i + 1, value.length);
      } else {
        break;
      }
    }
    return value;
  };

  // !TODO (Optional): Autosave workout every 45 seconds

  return (
    <div className="">
      {workoutRecords.map((exercise) => (
        <div
          key={exercise.id}
          className="flex flex-row items-center justify-center text-white border-b border-gray-400 my-1"
        >
          <div className="max-w-[920px] w-full py-4 flex flex-col gap-8">
            <div
              className="cursor-pointer text-white flex flex-col items-start justify-start 
                rounded-lg text-lg uppercase"
              onClick={() => toggleAccordion(exercise.id)}
            >
              <div className="w-full flex flex-row items-center justify-between">
                <h2 className="text-base">
                  {exercise.marker}. {exercise.shortName}
                </h2>
                <span
                  className={`transition-transform text-white ${
                    openExercises.includes(exercise.id) ? "" : "rotate-180"
                  }`}
                >
                  <FaChevronUp className="text-lg" />
                </span>
              </div>
              <p className="text-sm text-gray-400">{exercise.setRep}</p>
            </div>
            {openExercises.includes(exercise.id) && (
              <div
                className={`transition-all duration-300 pb-4 ${
                  openExercises.includes(exercise.id)
                    ? "max-h-screen"
                    : "max-h-0"
                }`}
              >
                <div className="bg-green-800 rounded-lg flex flex-row items-stretch">
                  {/* <pre>{JSON.stringify(exercise, null, 2)}</pre> */}
                  <div className="flex w-full flex-row flex-wrap items-start justify-between">
                    <div className="w-2/3 pr-4">
                      <table className="font-sans text-white table-auto w-full border-[1px] border-gray-400">
                        <thead>
                          <tr className="border-[1px] border-gray-400">
                            <th className="p-2 border-[1px] border-gray-400 text-sm">
                              SET
                            </th>
                            <th className="p-2 border-[1px] border-gray-400 text-sm">
                              REPS
                            </th>
                            <th className="p-2 border-[1px] border-gray-400 text-sm">
                              WEIGHT (KG)
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {exercise.sets.map((set, setIdx) => {
                            return (
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
                                    step={1}
                                    min={0}
                                    value={Number(set.reps || 0).toString()}
                                    onChange={(e) => {
                                      try {
                                        let reps = parseInt(e.target.value);
                                        handleSetChange(
                                          exercise.id,
                                          set.id,
                                          "reps",
                                          reps
                                        );
                                      } catch (e) {}
                                    }}
                                    className="w-full text-center bg-transparent rounded-3xl p-2 focus:outline-none"
                                  />
                                </td>
                                <td className="p-2 text-center border-[1px] border-gray-400">
                                  <input
                                    type="number"
                                    step={0.01}
                                    value={Number(set.weight || 0).toString()}
                                    onChange={(e) =>
                                      handleSetChange(
                                        exercise.id,
                                        set.id,
                                        "weight",
                                        e.target.value
                                      )
                                    }
                                    className="w-full text-center bg-transparent  rounded-3xl p-2  focus:outline-none"
                                  />
                                </td>
                                <td
                                  className="p-2 text-center border-[1px] border-gray-400 bg-red-500 hover:bg-red-700 text-white cursor-pointer"
                                  onClick={() => {
                                    handleRemoveSet(exercise.id, setIdx);
                                  }}
                                >
                                  <button>
                                    <BiTrash size={20} />
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                          <tr>
                            <td className="border-[1px] border-gray-400"></td>
                            <td className="" colSpan={3}>
                              <button
                                className="w-full"
                                onClick={() => handleAddSet(exercise.id)}
                              >
                                <div
                                  className="w-full px-16 py-2 text-white bg-green-500
                            hover:bg-green-900 hover:text-white font-semibold"
                                >
                                  Add Set
                                </div>
                              </button>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div className="h-full flex-1 flex flex-col justify-between gap-4">
                      <div className="flex flex-col">
                        <p className="text-sm text-gray-100">
                          {exercise.setsMax}
                        </p>
                        <p className="text-sm text-gray-100">
                          Tempo: {exercise.tempo}
                        </p>
                        <p className="text-sm text-gray-100">
                          Rest time: {exercise.rest} seconds
                        </p>
                      </div>
                      <textarea
                        placeholder="Notes"
                        value={exercise.notes}
                        onChange={(e) =>
                          handleExerciseNotesChange(exercise.id, e.target.value)
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
