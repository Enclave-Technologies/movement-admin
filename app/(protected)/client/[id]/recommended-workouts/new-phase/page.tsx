"use client";
import Breadcrumb from "@/components/Breadcrumb";
import { useUser } from "@/context/ClientContext";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

const Page = ({ params }: { params: { id: string } }) => {
    const { userData, setUserData } = useUser();
    const router = useRouter();
    const page_title = ["Training Program", "Untitled Phase"];
    const [phase, setPhase] = useState({
        title: "Phase 1",
        id: null as string | null,
        unchangedInput: true,
    });
    const [pageLoading, setPageLoading] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        let isMounted = true;

        const fetchData = async () => {
            try {
                const response = await axios.get(
                    `http://127.0.0.1:8000/mvmt/v1/trainer/client?client_id=${params.id}`,
                    { withCredentials: true }
                );
                if (isMounted) {
                    setUserData(response.data);
                    setPageLoading(false); // Set loading to false after data is fetched
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
                if (isMounted) {
                    setPageLoading(false); // Set loading to false in case of error
                }
            }
        };

        setPageLoading(true); // Set loading to true before fetching data

        if (!userData) {
            fetchData();
        } else {
            setPageLoading(false); // Set loading to false if userData is already available
        }

        return () => {
            isMounted = false; // Cleanup function to prevent state updates on unmounted components
        };
    }, [params.id, setUserData, userData]);

    const fetchPhaseId = async (title: string) => {
        try {
            const response = await axios.post(
                "http://127.0.0.1:8000/mvmt/v1/client/phase",
                { title, currentId: phase.id, userId: params.id },
                {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true,
                }
            );
            setPhase((prev) => ({ ...prev, id: response.data.phaseId }));
            return response.data.phaseId;
        } catch (error) {
            console.error("Error fetching phaseId:", error);
        }
    };

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPhase((prev) => ({
            ...prev,
            title: e.target.value,
            unchangedInput: false,
        }));
    };

    const handleTitleBlur = () => {
        if (!phase.unchangedInput) {
            fetchPhaseId(phase.title);
        }
    };

    const addSession = async () => {
        try {
            setIsLoading(true);
            if (!phase.id) {
                const phaseId = await fetchPhaseId(phase.title);
                console.log(phaseId);

                router.push(
                    `/client/${
                        params.id
                    }/recommended-workouts/${phaseId}/new-session?phaseTitle=${encodeURIComponent(
                        phase.title
                    )}&phaseId=${encodeURIComponent(phaseId)}`
                );
            }
        } catch (error) {
            console.error("Error adding session:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return pageLoading ? (
        <div>Loading...</div>
    ) : (
        <div>
            <Breadcrumb
                homeImage={userData?.imageUrl}
                homeTitle={userData?.name}
                customTexts={page_title}
            />
            <h2 className="text-xl font-semibold mt-4">Phase Title</h2>
            <input
                type="text"
                value={phase.title}
                onChange={handleTitleChange}
                // onBlur={handleTitleBlur}
                placeholder="Phase 1"
                className="mt-2 p-2 border border-gray-300 rounded-lg w-full"
            />
            <h3 className="text-lg font-semibold mt-4">Sessions</h3>
            <button
                onClick={async () => {
                    await addSession();
                }}
                type="submit"
                disabled={isLoading}
                className={`mt-2 mb-4 items-center justify-center px-4 py-2 rounded-lg transition ${
                    isLoading
                        ? "bg-gray-400"
                        : "bg-green-500 text-white hover:bg-green-900"
                }`}
            >
                {isLoading ? "Adding Session..." : "+ Add Session"}
            </button>
            <p className="text-gray-600">
                No Exercises added to this session yet.
                <br />
                Click on + Add Session to add a new session.
            </p>
            <button className="mt-4 px-4 py-2 items-center justify-center bg-green-500 text-gray-100 rounded-lg hover:bg-green-900 transition">
                Back
            </button>
        </div>
    );
};

export default Page;
