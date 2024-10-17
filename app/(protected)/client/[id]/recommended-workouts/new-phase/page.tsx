// "use client";
// import Breadcrumb from "@/components/Breadcrumb";
// import { useUser } from "@/context/ClientContext";
// import React, { useState, useEffect, useCallback, useMemo } from "react";
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
//     const [phaseTitle, setPhaseTitle] = useState("Phase 1");
//     const [debouncedTitle, setDebouncedTitle] = useState("");
//     const [phaseId, setPhaseId] = useState<string | null>(null);
//     const [sessions, setSessions] = useState<ExSession[]>([]);
//     const [unchangedInput, setUnchangedInput] = useState(true); // Flag to check the first load
//     const [isLoading, setIsLoading] = useState(false);

//     const fetchPhaseId = useCallback(async () => {
//         try {
//             console.log(phaseId);
//             const response = await axios.post(
//                 "http://127.0.0.1:8000/mvmt/v1/trainer/phase",
//                 {
//                     title: debouncedTitle,
//                     currentId: phaseId,
//                     // unchangedInput: unchangedInput,
//                 },
//                 {
//                     headers: {
//                         "Content-Type": "application/json",
//                     },
//                     withCredentials: true, // Include cookies in the request
//                 }
//             );

//             const data = response.data;

//             setPhaseId(data.phaseId);
//             return data.phaseId;
//         } catch (error) {
//             console.error("Error fetching phaseId:", error);
//         }
//     }, [debouncedTitle, phaseId]);

//     useEffect(() => {
//         const handler = setTimeout(() => {
//             setDebouncedTitle(phaseTitle);
//         }, 1000); // Adjust the debounce time as needed

//         return () => {
//             clearTimeout(handler);
//         };
//     }, [phaseTitle]);

//     useEffect(() => {
//         if (debouncedTitle && !unchangedInput) {
//             // Call your API here
//             const fetchData = async () => {
//                 console.log("Debounced value:", debouncedTitle);
//                 await fetchPhaseId();
//             };
//             fetchData();
//         }
//     }, [debouncedTitle, unchangedInput, fetchPhaseId]);

//     const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         setPhaseTitle(e.target.value);
//         setUnchangedInput(false);
//     };

//     const addSession = async () => {
//         try {
//             setIsLoading(true); // Set loading state to true

//             // Fetch the phase ID only if it's not already set
//             if (!phaseId) {
//                 const newPhaseId = await fetchPhaseId(); // Fetch the Phase ID
//                 if (!newPhaseId) {
//                     console.error("Failed to fetch Phase ID");
//                     return; // Handle failure if needed
//                 }
//                 // phaseId is updated in fetchPhaseId() therefore no need to set it directly here
//             }

//             // Navigate after confirming the phaseId is set
//             if (phaseId) {
//                 router.push(
//                     `/client/${
//                         params.id
//                     }/recommended-workouts/phases/${phaseId}?phaseTitle=${encodeURIComponent(
//                         phaseTitle
//                     )}&phaseId=${encodeURIComponent(phaseId || "")}`
//                 );
//             }
//         } catch (error) {
//             console.error("Error adding session:", error);
//         } finally {
//             setIsLoading(false); // Reset loading state
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
//                 value={phaseTitle}
//                 onChange={handleTitleChange}
//                 placeholder="Phase 1"
//                 className="mt-2 p-2 border border-gray-300 rounded-lg w-full"
//             />
//             <h3 className="text-lg font-semibold mt-4">Sessions</h3>
//             <button
//                 onClick={addSession}
//                 disabled={isLoading} // Disable button when loading
//                 className={`mt-2 mb-4 items-center justify-center px-4 py-2 rounded-lg transition ${
//                     isLoading
//                         ? "bg-gray-400"
//                         : "bg-green-600 text-white hover:bg-green-700"
//                 }`}
//             >
//                 {isLoading ? "Adding Session..." : "+ Add Session"}
//             </button>
//             {sessions.length === 0 ? (
//                 <p className="text-gray-600">
//                     No Exercises added to this session yet.
//                     <br />
//                     Click on + Add Session to add a new session.
//                 </p>
//             ) : (
//                 <table className="min-w-full mt-4 border-collapse border border-gray-300">
//                     <thead>
//                         <tr className="bg-gray-200">
//                             <th className="border border-gray-300 p-2 text-left">
//                                 Session
//                             </th>
//                             <th className="border border-gray-300 p-2 text-left">
//                                 # Exercises
//                             </th>
//                             <th className="border border-gray-300 p-2 text-left">
//                                 Session Time
//                             </th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {sessions.map((session, index) => (
//                             <tr key={index} className="hover:bg-gray-100">
//                                 <td className="border border-gray-300 p-2">
//                                     {session.sessionName || "No Session Name"}
//                                 </td>
//                                 <td className="border border-gray-300 p-2">
//                                     {session.exercises}
//                                 </td>
//                                 <td className="border border-gray-300 p-2">
//                                     {session.time || "Not Set"}
//                                 </td>
//                             </tr>
//                         ))}
//                     </tbody>
//                 </table>
//             )}
//             <button className="mt-4 px-4 py-2 items-center justify-center bg-green-700 text-gray-100 rounded-lg hover:bg-green-900 transition">
//                 Back
//             </button>
//         </div>
//     );
// };

// export default Page;

"use client";
import Breadcrumb from "@/components/Breadcrumb";
import { useUser } from "@/context/ClientContext";
import React, { useState, useEffect } from "react";
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
    const [sessions, setSessions] = useState<ExSession[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const fetchPhaseId = async (title: string) => {
        try {
            const response = await axios.post(
                "http://127.0.0.1:8000/mvmt/v1/trainer/phase",
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

    useEffect(() => {
        const handler = setTimeout(() => {
            if (!phase.unchangedInput) {
                fetchPhaseId(phase.title);
            }
        }, 1000);

        return () => clearTimeout(handler);
    }, [phase.title, phase.unchangedInput]);

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPhase((prev) => ({
            ...prev,
            title: e.target.value,
            unchangedInput: false,
        }));
    };

    const addSession = async () => {
        try {
            setIsLoading(true);
            if (!phase.id) {
                await fetchPhaseId(phase.title);
            }
            if (phase.id) {
                router.push(
                    `/client/${params.id}/recommended-workouts/phases/${
                        phase.id
                    }?phaseTitle=${encodeURIComponent(
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
                placeholder="Phase 1"
                className="mt-2 p-2 border border-gray-300 rounded-lg w-full"
            />
            <h3 className="text-lg font-semibold mt-4">Sessions</h3>
            <button
                onClick={addSession}
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
