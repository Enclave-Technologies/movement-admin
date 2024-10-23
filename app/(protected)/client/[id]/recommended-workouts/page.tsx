"use client";
import React, { useState, useEffect } from "react";
import Breadcrumb from "@/components/Breadcrumb";
import { useUser } from "@/context/ClientContext";
import { useRouter } from "next/navigation";
import axios from "axios";
import BreadcrumbLoading from "@/components/BreadcrumbLoading";
import { set } from "zod";
import Link from "next/link";

const Page = ({ params }: { params: { id: string } }) => {
    const router = useRouter();
    const { userData, setUserData } = useUser();
    const page_title = ["Training Program"];
    const id = params.id;
    const [pageLoading, setPageLoading] = useState(true);

    const [firstDropdownOptions, setFirstDropdownOptions] = useState<
        PhaseDropdownOption[]
    >([]);
    const [secondDropdownOptions, setSecondDropdownOptions] = useState<
        MovSessionDropdownOption[]
    >([]);
    const [exerciseList, setExerciseList] = useState<SessionExercise[]>([]);
    const [selectedPhaseId, setSelectedPhaseId] = useState<string | null>(null);
    const [selectedPhaseTitle, setSelectedPhaseTitle] = useState<string | null>(
        null
    );
    const [phaseData, setPhaseData] = useState<Phase[]>([]);

    // Example useEffect to load data for dropdowns and table
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(
                    `http://127.0.0.1:8000/mvmt/v1/trainer/client?client_id=${params.id}`,
                    { withCredentials: true }
                );
                setUserData(response.data);
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        const performOtherAsyncOperations = async () => {
            try {
                const response = await axios.get(
                    `http://127.0.0.1:8000/mvmt/v1/client/phases?client_id=${params.id}`,
                    { withCredentials: true }
                );
                const allPhaseData = response.data;
                setPhaseData(allPhaseData.phases);

                let phaseDropdownData: PhaseDropdownOption[];
                let secondDropdownData: MovSessionDropdownOption[] = [];

                let exerciseListData: any[] = [];

                if (allPhaseData.phases.length === 0) {
                    // If no phases are available, show "No Phases" option
                    phaseDropdownData = [
                        {
                            value: "no-phases",
                            label: "No Phases, Please Add",
                            isActive: false,
                        },
                    ];
                    // Since no phases exist, second dropdown should be empty
                    secondDropdownData = [];
                    // Exercise list should also be empty
                    exerciseListData = [];
                } else {
                    // Otherwise, map the phases to dropdown options
                    // phaseDropdownData = phaseData.phases.map(
                    //     (phase: Phase) => ({
                    //         value: phase.id,
                    //         label: phase.phaseName,
                    //         isActive: phase.isActive,
                    //     })
                    // );
                    phaseDropdownData = mapPhasesToDropdownOptions(
                        allPhaseData.phases
                    );

                    setSelectedPhaseId(phaseDropdownData[0].value);
                    setSelectedPhaseTitle(phaseDropdownData[0].label);
                    // setFirstDropdownOptions(phaseOptions);
                    // Check if any sessions exist within the phases
                    const hasSessions = allPhaseData.phases.some(
                        (phase: Phase) => phase.sessions.length > 0
                    );

                    if (!hasSessions) {
                        // If no sessions exist, show "No Sessions" option in the second dropdown
                        secondDropdownData = [
                            {
                                value: "no-sessions",
                                label: "No Sessions, Please Add",
                            },
                        ];
                        // Exercise list should also be empty
                        exerciseListData = [];
                    } else {
                        // Map sessions to dropdown options
                        secondDropdownData = mapSessionsToDropdownOptions(
                            allPhaseData.phases
                        );
                        // phaseData.phases.flatMap(
                        //     (phase: Phase) =>
                        //         phase.sessions.map((session: MovSession) => ({
                        //             value: session.id,
                        //             label: session.sessionName,
                        //             // isActive: true, // Assuming sessions are always active
                        //         }))
                        // );
                        // Check if any exercises exist within the sessions
                        const hasExercises = allPhaseData.phases.some(
                            (phase: Phase) =>
                                phase.sessions.some(
                                    (session: MovSession) =>
                                        session.exercises.length > 0
                                )
                        );

                        if (!hasExercises) {
                            // If no exercises exist, exercise list should be empty
                            exerciseListData = [];
                        } else {
                            // Map exercises to the exercise list
                            exerciseListData = mapExercisesToList(
                                allPhaseData.phases
                            );

                            // phaseData.phases.flatMap(
                            //     (phase: Phase) =>
                            //         phase.sessions.flatMap(
                            //             (session: MovSession) =>
                            //                 session.exercises
                            //         )
                            // );
                        }
                    }
                }

                setFirstDropdownOptions(phaseDropdownData);
                setSecondDropdownOptions(secondDropdownData);
                setExerciseList(exerciseListData);
            } catch (error) {
                console.error("Error in other async operations:", error);
            }
        };

        setPageLoading(true);

        const fetchAllData = async () => {
            if (!userData) {
                await fetchData();
            }
            await performOtherAsyncOperations();
            setPageLoading(false);
        };

        fetchAllData();
    }, [params.id, setUserData, userData]);

    const mapPhasesToDropdownOptions = (
        phases: Phase[]
    ): PhaseDropdownOption[] => {
        return phases.map((phase: Phase) => ({
            value: phase.id,
            label: phase.phaseName,
            isActive: phase.isActive,
        }));
    };

    const handlePhaseChange = (selectedPhaseId: string) => {
        const selectedPhase = phaseData.find(
            (phase: Phase) => phase.id === selectedPhaseId
        );

        if (!selectedPhase) {
            setSecondDropdownOptions([]);
            setExerciseList([]);
            return;
        }
        setSelectedPhaseId(selectedPhase.id);
        setSelectedPhaseTitle(selectedPhase.phaseName);

        // console.log(">>>", selectedPhase.id, selectedPhase.phaseName);

        if (selectedPhase.sessions.length === 0) {
            setSecondDropdownOptions([
                {
                    value: "no-sessions",
                    label: "No Sessions, Please Add",
                },
            ]);
            setExerciseList([]);
        } else {
            const sessionOptions = selectedPhase.sessions.map(
                (session: MovSession) => ({
                    value: session.id,
                    label: session.sessionName,
                })
            );
            setSecondDropdownOptions(sessionOptions);

            const exercises = selectedPhase.sessions.flatMap(
                (session: MovSession) => session.exercises
            );
            setExerciseList(exercises);
        }
    };

    const mapSessionsToDropdownOptions = (
        phases: Phase[]
    ): MovSessionDropdownOption[] => {
        return phases.flatMap((phase: Phase) =>
            phase.sessions.map((session: MovSession) => ({
                value: session.id,
                label: session.sessionName,
            }))
        );
    };

    const mapExercisesToList = (phases: Phase[]): SessionExercise[] => {
        return phases.flatMap((phase: Phase) =>
            phase.sessions.flatMap((session: MovSession) => session.exercises)
        );
    };

    const handleAddPhase = () => {
        router.push(`/client/${id}/recommended-workouts/new-phase`);
    };

    return pageLoading ? (
        <div>
            <BreadcrumbLoading />
            <div className="flex items-center space-x-4">
                <div className="border rounded p-2 w-1/4 animate-pulse bg-gray-300">
                    <div className="h-4 bg-gray-400 rounded"></div>
                </div>
                <span className="text-gray-500">&gt;</span>
                <div className="border rounded p-2 w-1/4 animate-pulse bg-gray-300">
                    <div className="h-4 bg-gray-400 rounded"></div>
                </div>
            </div>

            <div className="mt-4">
                <div className="w-full h-64 border-collapse border border-gray-300 animate-pulse bg-gray-200">
                    <div className="h-full bg-gray-300"></div>
                </div>
            </div>

            <button
                className="w-full mt-4 p-2 border-2 rounded animate-pulse bg-gray-300"
                disabled
            >
                + Add Session
            </button>
        </div>
    ) : (
        <div>
            <Breadcrumb
                homeImage={userData?.imageUrl}
                homeTitle={userData?.name}
                customTexts={page_title}
            />

            <div className="flex flex-col space-y-4">
                <div className="flex items-center">
                    <div className="flex flex-col w-1/4">
                        <select
                            className="border rounded p-2"
                            onChange={(e) => handlePhaseChange(e.target.value)}
                        >
                            {firstDropdownOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        <div className="flex items-center justify-center mt-2">
                            {phaseData.length === 0 ? (
                                <Link
                                    href="#"
                                    className="text-blue-500 hover:underline"
                                >
                                    + Add Phase
                                </Link>
                            ) : (
                                <Link
                                    href="#"
                                    className="text-blue-500 hover:underline"
                                >
                                    Edit Phase
                                </Link>
                            )}
                        </div>
                    </div>
                    <span className="text-gray-500 mx-4 self-start py-2">
                        &gt;
                    </span>{" "}
                    {/* margin added for spacing */}
                    <div className="flex flex-col w-1/4">
                        <select className="border rounded p-2">
                            {secondDropdownOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        <div className="flex items-center justify-center space-x-2 mt-2">
                            <Link
                                href={
                                    selectedPhaseId
                                        ? `/client/${
                                              params.id
                                          }/recommended-workouts/${selectedPhaseId}/new-session?phaseTitle=${encodeURIComponent(
                                              selectedPhaseTitle || ""
                                          )}&phaseId=${encodeURIComponent(
                                              selectedPhaseId
                                          )}`
                                        : "#"
                                }
                                className="text-blue-500 hover:underline"
                            >
                                Add Session
                            </Link>
                            <Link
                                href="#"
                                className="text-blue-500 hover:underline"
                            >
                                Edit Session
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Table Component */}
            {exerciseList.length === 0 ? (
                <p className="text-gray-600">
                    No Exercises added to this session yet.
                    <br />
                    Click on + Add Session to add a new session.
                </p>
            ) : (
                <table className="w-full mt-4 border-collapse border border-gray-300">
                    <thead>
                        <tr>
                            <th className="border border-gray-300 p-2">
                                Order
                            </th>
                            <th className="border border-gray-300 p-2">
                                Motion
                            </th>
                            <th className="border border-gray-300 p-2">
                                Specific Description
                            </th>
                            <th className="border border-gray-300 p-2">
                                Reps Min
                            </th>
                            <th className="border border-gray-300 p-2">
                                Reps Max
                            </th>
                            <th className="border border-gray-300 p-2">
                                Sets Min
                            </th>
                            <th className="border border-gray-300 p-2">
                                Sets Max
                            </th>
                            <th className="border border-gray-300 p-2">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {exerciseList.map((row, index) => (
                            <tr key={index}>
                                <td className="border border-gray-300 p-2">
                                    {row.exerciseOrder}
                                </td>
                                <td className="border border-gray-300 p-2">
                                    {row.motion}
                                </td>
                                <td className="border border-gray-300 p-2">
                                    {row.specificDescription}
                                </td>
                                <td className="border border-gray-300 p-2">
                                    {row.repsMin}
                                </td>
                                <td className="border border-gray-300 p-2">
                                    {row.repsMax}
                                </td>
                                <td className="border border-gray-300 p-2">
                                    {row.setsMin}
                                </td>
                                <td className="border border-gray-300 p-2">
                                    {row.setsMax}
                                </td>
                                <td className="border border-gray-300 p-2">
                                    {/* {row.column3} */}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            {/* Button Component */}
            <button
                onClick={handleAddPhase}
                className="w-full mt-4 p-2 border-2 rounded"
            >
                + Add Session
            </button>
            <button
                onClick={handleAddPhase}
                className="w-full mt-4 p-2 border-2 rounded"
            >
                + Add Phase
            </button>
        </div>
    );
};

export default Page;
