"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import Sidebar from "@/components/Sidebar";
import { defaultProfileURL } from "@/configs/constants";
const Page = () => {
    // Sample session data
    const sessions = [
        {
            id: 1,
            date: "Sep 2, 2024",
            session: "Phase 1",
            tut: "422",
            exercises: "14",
        },
        {
            id: 2,
            date: "Aug 31, 2024",
            session: "Phase 1",
            tut: "422",
            exercises: "16",
        },
        {
            id: 3,
            date: "Aug 30, 2024",
            session: "Phase 1",
            tut: "422",
            exercises: "12",
        },
        {
            id: 4,
            date: "Aug 29, 2024",
            session: "Phase 1",
            tut: "422",
            exercises: "16",
        },
        {
            id: 5,
            date: "Aug 27, 2024",
            session: "Phase 1",
            tut: "422",
            exercises: "12",
        },
    ];

    const handleViewSession = (session: any) => {
        console.log(
            `Viewing session on ${session.date}:\n\nTut:\n${session.tut}\n\nExercises:\n${session.exercises}`
        );
    };

    return (
        <div className="p-5">
            <header className="flex items-center mb-5">
                <div className="w-12 h-12 rounded-full overflow-hidden mr-2">
                    <Image
                        src={defaultProfileURL}
                        alt="Ronald Richards"
                        width={48} // Slightly larger to ensure no cropping issues
                        height={48} // Slightly larger to ensure no cropping issues
                        className="object-cover w-full h-full"
                    />
                </div>
                <h1 className="text-sm">
                    Ronald Richards {">"} Workout Tracking
                </h1>
            </header>
            <div>
                <h5 className="font-bold">Next Workout</h5>
            </div>
            <br />

            <div className="border rounded-lg p-2 mb-5 border-green-500">
                <div className="flex justify-between items-center bg-gray-50 p-2">
                    <ul className="text-left">
                        <li>PHASE 3</li>
                        <li>SESSION : UPPER BODY</li>
                    </ul>
                    <Link href="tracked-workouts/create-workout">
                        <button className="px-4 py-2 text-white rounded-2xl bg-green-500">
                            START WORKOUT
                        </button>
                    </Link>
                </div>
            </div>
            <section>
                <h3 className="font-bold mb-2">Workout History</h3>
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-green-500">
                            <th className="border p-2 text-white text-center">
                                Date
                            </th>
                            <th className="border p-2 text-white text-center">
                                Phase
                            </th>
                            <th className="border p-2 text-white text-center">
                                Tut
                            </th>
                            <th className="border p-2 text-white text-center">
                                #Exercises
                            </th>
                            <th className="border p-2 text-white text-center"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {sessions.map((session) => (
                            <tr key={session.id}>
                                <td className="border p-2 text-center">
                                    {session.date}
                                </td>
                                <td className="border p-2 text-center">
                                    {session.session}
                                </td>
                                <td className="border p-2 text-center">
                                    {session.tut}
                                </td>
                                <td className="border p-2 text-center">
                                    {session.exercises}
                                </td>
                                <td className="border p-2 text-center">
                                    <button
                                        onClick={() =>
                                            handleViewSession(session)
                                        }
                                        className="text-blue-500 underline"
                                    >
                                        View
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>
        </div>
    );
};

export default Page;
