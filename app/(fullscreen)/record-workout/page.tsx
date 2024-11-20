"use client";
import React, { useState } from "react";

const Page = () => {
    const [openExercises, setOpenExercises] = useState([
        false,
        false,
        false,
        false,
        false,
    ]);
    const [exerciseData, setExerciseData] = useState({
        0: { sets: Array(3).fill({ reps: "", weight: "", notes: "" }) },
        1: {
            sets: [
                {
                    reps: "",
                    weight: "",
                    notes: "Insufficient Shoulder Rotation. Start with lower weight",
                },
                { reps: "", weight: "", notes: "Bar should be on Level 13" },
                { reps: "", weight: "", notes: "" },
            ],
        },
        2: { sets: Array(3).fill({ reps: "", weight: "", notes: "" }) },
        3: { sets: Array(3).fill({ reps: "", weight: "", notes: "" }) },
        4: {
            sets: [
                {
                    reps: "",
                    weight: "",
                    notes: "Insufficient Shoulder Rotation. Start with lower weight",
                },
                { reps: "", weight: "" },
                { reps: "", weight: "", notes: "" },
            ],
        },
    });

    const toggleAccordion = (index) => {
        setOpenExercises((prev) => {
            const newState = [...prev];
            newState[index] = !newState[index];
            return newState;
        });
    };

    return (
        // <div className="min-h-screen bg-gray-800 flex flex-col items-center">
        //     <div className="flex flex-col w-full max-w-4xl mx-auto p-6">
        //         <div className="flex items-center justify-between bg-gray-900 p-4 rounded-lg mb-4">
        //             <button className="text-white">X</button>
        //             <ul className="text-center text-white flex-grow">
        //                 <li className="font-bold text-lg">PHASE 1</li>
        //                 <li>SESSION 1: GIRONDA 8X8</li>
        //                 <li>CLOCK</li>
        //             </ul>
        //             <div>
        //                 <button className="border border-solid rounded-2xl w-24 text-white p-2 bg-blue-600 hover:bg-blue-500">
        //                     SAVE
        //                 </button>
        //             </div>
        //         </div>

        //         {[
        //             "1. WIDE GRIP LAT PULLDOWN",
        //             "2. BB SQUAT",
        //             "3. FLAT DB PRESS",
        //             "4. HIP THRUST MACHINE",
        //             "5. SEATED MACHINE ROW",
        //         ].map((exercise, index) => (
        //             <div key={index} className="mt-4">
        //                 <div
        //                     className="cursor-pointer text-white flex justify-between items-center p-2 bg-gray-700 rounded-lg hover:bg-gray-600"
        //                     onClick={() => toggleAccordion(index)}
        //                 >
        //                     <span>{exercise}: 8 sets of 12 Reps</span>
        //                     <span
        //                         className={`ml-2 transition-transform ${
        //                             openExercises[index] ? "rotate-180" : ""
        //                         }`}
        //                     >
        //                         ▼
        //                     </span>
        //                 </div>

        //                 {openExercises[index] && (
        //                     <div className="mt-2 bg-gray-900 p-4 rounded-lg">
        //                         <table className="font-sans text-white table-auto w-full border-separate border-spacing-0">
        //                             <thead>
        //                                 <tr>
        //                                     <th className="p-2 border-b border-gray-600">
        //                                         SET
        //                                     </th>
        //                                     <th className="p-2 border-b border-gray-600">
        //                                         REPS
        //                                     </th>
        //                                     <th className="p-2 border-b border-gray-600">
        //                                         WEIGHT
        //                                     </th>
        //                                     <th className="p-2 border-b border-gray-600">
        //                                         NOTES
        //                                     </th>
        //                                 </tr>
        //                             </thead>
        //                             <tbody>
        //                                 {exerciseData[index].sets.map(
        //                                     (set, setIndex) => (
        //                                         <tr
        //                                             key={setIndex}
        //                                             className="hover:bg-gray-800"
        //                                         >
        //                                             <td className="p-2 text-center border-b border-gray-600">
        //                                                 {setIndex + 1}
        //                                             </td>
        //                                             <td className="p-2 border-b border-gray-600">
        //                                                 <input
        //                                                     type="number"
        //                                                     value={set.reps}
        //                                                     onChange={(e) => {
        //                                                         const newValue =
        //                                                             e.target
        //                                                                 .value;
        //                                                         setExerciseData(
        //                                                             (prev) => {
        //                                                                 const newData =
        //                                                                     {
        //                                                                         ...prev,
        //                                                                     };
        //                                                                 newData[
        //                                                                     index
        //                                                                 ].sets[
        //                                                                     setIndex
        //                                                                 ].reps =
        //                                                                     newValue;
        //                                                                 return newData;
        //                                                             }
        //                                                         );
        //                                                     }}
        //                                                     className="w-full p-1 rounded-lg text-center bg-gray-800 text-white border border-gray-600"
        //                                                     placeholder="REPS"
        //                                                 />
        //                                             </td>
        //                                             <td className="p-2 border-b border-gray-600">
        //                                                 <input
        //                                                     type="number"
        //                                                     value={set.weight}
        //                                                     onChange={(e) => {
        //                                                         const newValue =
        //                                                             e.target
        //                                                                 .value;
        //                                                         setExerciseData(
        //                                                             (prev) => {
        //                                                                 const newData =
        //                                                                     {
        //                                                                         ...prev,
        //                                                                     };
        //                                                                 newData[
        //                                                                     index
        //                                                                 ].sets[
        //                                                                     setIndex
        //                                                                 ].weight =
        //                                                                     newValue;
        //                                                                 return newData;
        //                                                             }
        //                                                         );
        //                                                     }}
        //                                                     className="w-full p-1 rounded-lg text-center bg-gray-800 text-white border border-gray-600"
        //                                                     placeholder="WEIGHT"
        //                                                 />
        //                                             </td>
        //                                             <td className="p-2 border-b border-gray-600">
        //                                                 <span className="block text-center">
        //                                                     {set.notes}
        //                                                 </span>
        //                                             </td>
        //                                         </tr>
        //                                     )
        //                                 )}
        //                             </tbody>
        //                         </table>
        //                         <div className="flex justify-between mt-4">
        //                             <div className="flex gap-4">
        //                                 <button className="border border-solid rounded-2xl w-32 p-2 bg-green-500 hover:bg-green-400">
        //                                     Add Set
        //                                 </button>
        //                                 <button className="border border-solid rounded-2xl w-32 p-2 border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-white">
        //                                     Add Note
        //                                 </button>
        //                             </div>
        //                             {index < 4 && (
        //                                 <button className="border border-solid rounded-2xl w-20 p-2 border-white text-white hover:bg-white hover:text-gray-900">
        //                                     Confirm
        //                                 </button>
        //                             )}
        //                         </div>
        //                     </div>
        //                 )}
        //                 <div className="border-t border-gray-600 my-2"></div>
        //             </div>
        //         ))}
        //     </div>
        // </div>
        <div className="min-h-screen bg-green-800 flex flex-col items-center">
            <div className="flex flex-col w-full max-w-full mx-auto">
                <div className="flex items-center justify-between bg-green-500 px-8 py-4 rounded-lg mb-4">
                    <button className="text-white">X</button>
                    <ul className="text-center text-white flex-grow">
                        <li className="font-bold text-lg">PHASE 1</li>
                        <li>SESSION 1: GIRONDA 8X8</li>
                        <li>CLOCK</li>
                    </ul>
                    <div>
                        <button className="border border-solid rounded-2xl px-6 py-2 text-white bg-green-500 hover:bg-green-500">
                            SAVE
                        </button>
                    </div>
                </div>

                {[
                    "1. WIDE GRIP LAT PULLDOWN: 8 SETS OF 12 REPS",
                    "2. BB SQUAT: 8 SETS OF 12 REPS",
                    "3. FLAT DB PRESS: 8 SETS OF 12 REPS",
                    "4. HIP THRUST MACHINE: 8 SETS OF 12 REPS",
                    "5. SEATED MACHINE ROW: 8 SETS OF 12 REPS",
                ].map((exercise, index) => (
                    <div key={index} className="mt-1">
                        <div
                            className="cursor-pointer text-white flex justify-between 
                            items-center px-4 py-4 bg-gray-700/0 rounded-lg 
                            hover:bg-gray-600/0"
                            onClick={() => toggleAccordion(index)}
                        >
                            <span>{exercise}</span>
                            <span
                                className={`ml-2 transition-transform ${
                                    openExercises[index] ? "rotate-180" : ""
                                }`}
                            >
                                ▼
                            </span>
                        </div>

                        {openExercises[index] && (
                            <div className="mt-2 bg-gray-900 p-4 rounded-lg">
                                <table className="font-sans text-white table-auto w-full">
                                    <thead>
                                        <tr>
                                            <th className="p-2 border-b border-gray-600">
                                                SET
                                            </th>
                                            <th className="p-2 border-b border-gray-600">
                                                REPS
                                            </th>
                                            <th className="p-2 border-b border-gray-600">
                                                WEIGHT
                                            </th>
                                            <th className="p-2 border-b border-gray-600">
                                                NOTES
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {exerciseData[index].sets.map(
                                            (set, setIndex) => (
                                                <tr
                                                    key={setIndex}
                                                    className="hover:bg-gray-800"
                                                >
                                                    <td className="p-2 text-center border-b border-gray-600">
                                                        {setIndex + 1}
                                                    </td>
                                                    {/* ... existing code ... */}
                                                </tr>
                                            )
                                        )}
                                    </tbody>
                                </table>
                                <div className="flex justify-between mt-4">
                                    <div className="flex gap-4">
                                        <button
                                            className=" rounded-2xl px-16 py-2 bg-green-300 border hover:border-solid hover:border-green-300 
                                        hover:bg-green-800 hover:text-green-300 font-semibold"
                                        >
                                            Add Set
                                        </button>
                                        <button
                                            className="border border-solid rounded-2xl px-16 py-2 border-green-300 text-green-300 
                                        hover:bg-green-300 hover:text-green-800 font-semibold"
                                        >
                                            Add Note
                                        </button>
                                    </div>
                                    {index < 4 && (
                                        <button className="border border-solid rounded-2xl px-16 py-2 border-white text-white hover:bg-white hover:text-gray-900">
                                            Confirm
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}
                        <div className="border-t border-gray-600 my-2"></div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Page;
