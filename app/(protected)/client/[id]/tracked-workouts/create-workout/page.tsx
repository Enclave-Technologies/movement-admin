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
        <div className="min-h-screen bg-gray-800 flex flex-col items-center">
            <div className="flex flex-col w-full max-w-4xl mx-auto p-6">
                <div className="flex items-center justify-between bg-gray-900 p-4 rounded-lg">
                    {/* <button className="text-white">X</button> */}
                    <ul className="text-center text-white">
                        <li className="font-bold text-lg">PHASE 1</li>
                        <li>SESSION 1: GIRONDA 8X8</li>
                    </ul>
                    <div>
                        <button className="border border-solid rounded-2xl w-20 text-white p-1 bg-blue-600 hover:bg-blue-500">
                            SAVE
                        </button>
                    </div>
                </div>

                {/* Exercise List */}
                {[
                    "1.WIDE GRIP LAT PULLDOWN",
                    "2.BB SQUAT",
                    "3.FLAT DB PRESS",
                    "4.HIP THRUST MACHINE",
                    "5.SEATED MACHINE ROW",
                ].map((exercise, index) => (
                    <div key={index}>
                        <div
                            className="mt-4 cursor-pointer text-white flex justify-between items-center p-2 bg-gray-700 rounded-lg hover:bg-gray-600"
                            onClick={() => toggleAccordion(index)}
                        >
                            <span>{exercise}: 8 sets of 12 Reps</span>
                            <span
                                className={`ml-2 transition-transform ${
                                    openExercises[index] ? "rotate-180" : ""
                                }`}
                            >
                                ▼
                            </span>
                        </div>

                        {/* Display table for relevant exercises */}
                        {openExercises[index] && (
                            <div className="ml-5 mt-2 bg-gray-900 p-4 rounded-lg">
                                <table className="font-sans text-white table-auto border-separate border-spacing-2 w-full">
                                    <thead>
                                        <tr>
                                            <th className="p-2">SET</th>
                                            <th className="p-2">REPS</th>
                                            <th className="p-2">WEIGHT</th>
                                            <th className="p-2">NOTES</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {exerciseData[index].sets.map(
                                            (set, setIndex) => (
                                                <tr key={setIndex}>
                                                    <td className="p-2">
                                                        {setIndex + 1}
                                                    </td>
                                                    <td className="p-2">
                                                        <input
                                                            type="number"
                                                            value={set.reps}
                                                            onChange={(e) => {
                                                                const newValue =
                                                                    e.target
                                                                        .value;
                                                                setExerciseData(
                                                                    (prev) => {
                                                                        const newData =
                                                                            {
                                                                                ...prev,
                                                                            };
                                                                        newData[
                                                                            index
                                                                        ].sets[
                                                                            setIndex
                                                                        ].reps =
                                                                            newValue;
                                                                        return newData;
                                                                    }
                                                                );
                                                            }}
                                                            className="w-full p-2 rounded-lg text-center bg-gray-800 text-white border border-gray-600"
                                                            placeholder="REPS"
                                                        />
                                                    </td>
                                                    <td className="p-2">
                                                        <input
                                                            type="number"
                                                            value={set.weight}
                                                            onChange={(e) => {
                                                                const newValue =
                                                                    e.target
                                                                        .value;
                                                                setExerciseData(
                                                                    (prev) => {
                                                                        const newData =
                                                                            {
                                                                                ...prev,
                                                                            };
                                                                        newData[
                                                                            index
                                                                        ].sets[
                                                                            setIndex
                                                                        ].weight =
                                                                            newValue;
                                                                        return newData;
                                                                    }
                                                                );
                                                            }}
                                                            className="w-full p-2 rounded-lg text-center bg-gray-800 text-white border border-gray-600"
                                                            placeholder="WEIGHT"
                                                        />
                                                    </td>
                                                    <td className="p-2">
                                                        <span className="block mt-1">
                                                            {set.notes}
                                                        </span>
                                                    </td>
                                                </tr>
                                            )
                                        )}
                                    </tbody>
                                </table>
                                <div className="flex justify-center mt-4">
                                    <ul className="flex items-center gap-6">
                                        <li>
                                            <button className="border border-solid rounded-2xl w-36 p-2 bg-green-500 hover:bg-green-400">
                                                Add set
                                            </button>
                                        </li>
                                        <li>
                                            <button className="border border-solid rounded-2xl w-32 p-2 border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-white">
                                                Add note
                                            </button>
                                        </li>
                                        {index < 4 && (
                                            <li>
                                                <button className="border border-solid rounded-2xl w-20 p-2 border-white text-white hover:bg-white hover:text-gray-900">
                                                    CONFIRM
                                                </button>
                                            </li>
                                        )}
                                    </ul>
                                </div>
                            </div>
                        )}
                        <div className="line border-t border-gray-600 my-2"></div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Page;
