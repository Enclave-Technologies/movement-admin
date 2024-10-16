"use client";
import Breadcrumb from "@/components/Breadcrumb";
import { useUser } from "@/context/ClientContext";
import React, { useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

interface ExSession {
    sessionName: string;
    exercises: number;
    time: string;
}

const debounce = (func: Function, wait: number) => {
    let timeout: NodeJS.Timeout;
    return function (this: any, ...args: any[]) {
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
    };
};

const Page = ({ params }: { params: { id: string } }) => {
    const { userData } = useUser();
    const router = useRouter();
    const page_title = ["Training Program", "Untitled Phase"];
    const [phaseTitle, setPhaseTitle] = useState("Phase 1");
    const [phaseId, setPhaseId] = useState<string | null>(null);
    const [sessions, setSessions] = useState<ExSession[]>([]);
    // TODO: Remove the debounce and save on defocus
    const fetchPhaseId = useCallback(async () => {
        try {
            console.log(phaseId);
            const response = await axios.post(
                "http://127.0.0.1:8000/mvmt/v1/trainer/phase",
                {
                    title: phaseTitle,
                    currentId: phaseId,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    withCredentials: true, // Include cookies in the request
                }
            );

            const data = response.data;

            setPhaseId(data.phaseId);
        } catch (error) {
            console.error("Error fetching phaseId:", error);
        }
    }, [phaseTitle, phaseId]);

    // Use useMemo to ensure the debounce function is only created once
    const debouncedFetchPhaseId = useMemo(
        () => debounce(fetchPhaseId, 1000),
        [fetchPhaseId]
    ); // 1000ms = 1 second

    const handlePhaseTitleChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const newTitle = e.target.value;
            setPhaseTitle(newTitle);
            debouncedFetchPhaseId();
        },
        [debouncedFetchPhaseId]
    );

    const addSession = useCallback(async () => {
        if (!phaseId) {
            await fetchPhaseId();
        }
        // Navigate to the new session page with additional information
        router.push(
            `/client/${
                params.id
            }/recommended-workouts/new-phase/new-session?phaseTitle=${encodeURIComponent(
                phaseTitle
            )}&phaseId=${encodeURIComponent(phaseId || "")}`
        );
    }, [phaseId, fetchPhaseId, router, params.id, phaseTitle]);

    return (
        <div>
            <Breadcrumb
                homeImage={userData?.imageUrl}
                homeTitle={userData?.name}
                customTexts={page_title}
            />
            <h2 className="text-xl font-semibold mt-4">Phase Title</h2>
            <input
                type="text"
                value={phaseTitle}
                onChange={handlePhaseTitleChange}
                placeholder="Phase 1"
                className="mt-2 p-2 border border-gray-300 rounded-lg w-full"
            />
            <h3 className="text-lg font-semibold mt-4">Sessions</h3>
            <button
                onClick={addSession}
                className="mt-2 mb-4 items-center justify-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
                + Add Session
            </button>
            {sessions.length === 0 ? (
                <p className="text-gray-600">
                    No Exercises added to this session yet.
                    <br />
                    Click on + Add Session to add a new session.
                </p>
            ) : (
                <table className="min-w-full mt-4 border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="border border-gray-300 p-2 text-left">
                                Session
                            </th>
                            <th className="border border-gray-300 p-2 text-left">
                                # Exercises
                            </th>
                            <th className="border border-gray-300 p-2 text-left">
                                Session Time
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {sessions.map((session, index) => (
                            <tr key={index} className="hover:bg-gray-100">
                                <td className="border border-gray-300 p-2">
                                    {session.sessionName || "No Session Name"}
                                </td>
                                <td className="border border-gray-300 p-2">
                                    {session.exercises}
                                </td>
                                <td className="border border-gray-300 p-2">
                                    {session.time || "Not Set"}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            <button className="mt-4 px-4 py-2 items-center justify-center bg-green-700 text-gray-100 rounded-lg hover:bg-green-900 transition">
                Save
            </button>
        </div>
    );
};

export default Page;
