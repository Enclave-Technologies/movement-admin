"use client";
import Breadcrumb from "@/components/Breadcrumb";
import { useUser } from "@/context/ClientContext";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

interface ExSession {
    sessionName: string;
    exercises: number;
    time: string;
}

const Page = ({ params }: { params: { id: string } }) => {
    const { userData } = useUser();
    const router = useRouter();
    const page_title = ["Training Program", "Untitled Phase"];
    const [phase, setPhase] = useState({
        title: "Phase 1",
        id: null as string | null,
        unchangedInput: true,
    });
    // const [sessions, setSessions] = useState<ExSession[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchPhaseId = async (title: string) => {
        try {
            const response = await axios.post(
                "http://127.0.0.1:8000/mvmt/v1/client/phase",
                { title, currentId: phase.id },
                {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true,
                }
            );
            setPhase((prev) => ({ ...prev, id: response.data.phaseId }));
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
                await fetchPhaseId(phase.title);
            }
            if (phase.id) {
                router.push(
                    `/client/${params.id}/recommended-workouts/${
                        phase.id
                    }/new-session?phaseTitle=${encodeURIComponent(
                        phase.title
                    )}&phaseId=${encodeURIComponent(phase.id)}`
                );
            }
        } catch (error) {
            console.error("Error adding session:", error);
        } finally {
            setIsLoading(false);
        }
    };

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
                        : "bg-green-600 text-white hover:bg-green-700"
                }`}
            >
                {isLoading ? "Adding Session..." : "+ Add Session"}
            </button>
            <p className="text-gray-600">
                No Exercises added to this session yet.
                <br />
                Click on + Add Session to add a new session.
            </p>
            <button className="mt-4 px-4 py-2 items-center justify-center bg-green-700 text-gray-100 rounded-lg hover:bg-green-900 transition">
                Back
            </button>
        </div>
    );
};

export default Page;

// "use client";
// import Breadcrumb from "@/components/Breadcrumb";
// import { useUser } from "@/context/ClientContext";
// import React, { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import axios from "axios";

// interface ExSession {
//     sessionName: string;
//     exercises: number;
//     time: string;
// }

// const Page = ({ params }: { params: { id: string } }) => {
//     const { userData } = useUser();
//     const router = useRouter();
//     const page_title = ["Training Program", "Untitled Phase"];
//     const [phase, setPhase] = useState({
//         title: "Phase 1",
//         id: null as string | null,
//         unchangedInput: true,
//     });
//     const [sessions, setSessions] = useState<ExSession[]>([]);
//     const [isLoading, setIsLoading] = useState(false);

//     const fetchPhaseId = async (title: string) => {
//         try {
//             const response = await axios.post(
//                 "http://127.0.0.1:8000/mvmt/v1/trainer/phase",
//                 { title, currentId: phase.id },
//                 {
//                     headers: { "Content-Type": "application/json" },
//                     withCredentials: true,
//                 }
//             );
//             setPhase((prev) => ({ ...prev, id: response.data.phaseId }));
//         } catch (error) {
//             console.error("Error fetching phaseId:", error);
//         }
//     };

//     useEffect(() => {
//         const handler = setTimeout(() => {
//             if (!phase.unchangedInput) {
//                 fetchPhaseId(phase.title);
//             }
//         }, 1000);

//         return () => clearTimeout(handler);
//     }, [phase.title, phase.unchangedInput]);

//     const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         setPhase((prev) => ({
//             ...prev,
//             title: e.target.value,
//             unchangedInput: false,
//         }));
//     };

//     const addSession = async () => {
//         try {
//             setIsLoading(true);
//             if (!phase.id) {
//                 await fetchPhaseId(phase.title);
//             }
//             if (phase.id) {
//                 router.push(
//                     `/client/${params.id}/recommended-workouts/phases/${
//                         phase.id
//                     }?phaseTitle=${encodeURIComponent(
//                         phase.title
//                     )}&phaseId=${encodeURIComponent(phase.id)}`
//                 );
//             }
//         } catch (error) {
//             console.error("Error adding session:", error);
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     return (
//         <div>
//             <Breadcrumb
//                 homeImage={userData?.imageUrl}
//                 homeTitle={userData?.name}
//                 customTexts={page_title}
//             />
//             <h2 className="text-xl font-semibold mt-4">Phase Title</h2>
//             <input
//                 type="text"
//                 value={phase.title}
//                 onChange={handleTitleChange}
//                 placeholder="Phase 1"
//                 className="mt-2 p-2 border border-gray-300 rounded-lg w-full"
//             />
//             <h3 className="text-lg font-semibold mt-4">Sessions</h3>
//             <button
//                 onClick={addSession}
//                 disabled={isLoading}
//                 className={`mt-2 mb-4 items-center justify-center px-4 py-2 rounded-lg transition ${
//                     isLoading
//                         ? "bg-gray-400"
//                         : "bg-green-600 text-white hover:bg-green-700"
//                 }`}
//             >
//                 {isLoading ? "Adding Session..." : "+ Add Session"}
//             </button>
//             <p className="text-gray-600">
//                 No Exercises added to this session yet.
//                 <br />
//                 Click on + Add Session to add a new session.
//             </p>
//             <button className="mt-4 px-4 py-2 items-center justify-center bg-green-700 text-gray-100 rounded-lg hover:bg-green-900 transition">
//                 Back
//             </button>
//         </div>
//     );
// };

// export default Page;
