import React from "react";

const ActivityTracker = () => {
    const exercises = [
        {
            title: "Wide Grip Lat Pulldown",
            sets: "8 Sets of 12 Reps",
            notes: [],
        },
        {
            title: "BB Squat",
            sets: "8 Sets of 12 Reps",
            notes: [
                "Insufficient Shoulder Rotation. Start With Lower Weight",
                "Bar Should Be On Level 13",
            ],
        },
        {
            title: "Flat DB Press",
            sets: "8 Sets of 12 Reps",
            notes: [],
        },
        {
            title: "Hip Thrust Machine",
            sets: "8 Sets of 12 Reps",
            notes: [],
        },
        {
            title: "Seated Machine Row",
            sets: "8 Sets of 12 Reps",
            notes: [],
        },
    ];

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">
                Phase 1: Session 1 - Gironda 8x8
            </h1>
            <div className="space-y-4">
                {exercises.map((exercise, index) => (
                    <div
                        key={index}
                        className="bg-gray-800 text-white p-4 rounded-lg shadow-md"
                    >
                        <h2 className="text-xl font-semibold">
                            {exercise.title}
                        </h2>
                        <p className="text-gray-400">{exercise.sets}</p>
                        {exercise.notes.length > 0 && (
                            <div className="mt-2">
                                <p className="text-sm font-semibold">Notes:</p>
                                <ul className="list-disc list-inside text-gray-300">
                                    {exercise.notes.map((note, noteIndex) => (
                                        <li key={noteIndex}>{note}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ActivityTracker;
