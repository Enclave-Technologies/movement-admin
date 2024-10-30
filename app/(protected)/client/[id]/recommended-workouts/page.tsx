"use client";
import React, { useState, useEffect } from "react";
import Breadcrumb from "@/components/Breadcrumb";
import { useUser } from "@/context/ClientContext";
import { useRouter } from "next/navigation";
import axios from "axios";
import BreadcrumbLoading from "@/components/BreadcrumbLoading";
import { set } from "zod";
import Link from "next/link";
import { IoChevronForwardOutline } from "react-icons/io5";
import CustomSelect from "@/components/CustomSelect";
import EditableRow from "@/components/EditableRow";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

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
    const [activeExerciseList, setActiveExerciseList] = useState<
        SessionExercise[]
    >([]);
    const [selectedPhaseId, setSelectedPhaseId] = useState<string | null>(null);
    const [selectedPhaseTitle, setSelectedPhaseTitle] = useState<string | null>(
        null
    );
    const [selectedSessionId, setSelectedSessionId] = useState<string | null>(
        null
    );
    const [allWorkouts, setAllWorkouts] = useState<WorkoutData[]>([]);
    const [phaseData, setPhaseData] = useState<Phase[]>([]);
    const [sessionList, setSessionList] = useState<MovSessionDropdownOption[]>(
        []
    );
    const [isEditing, setIsEditing] = useState(false);
    const [defaultSelectedOption, setDefaultSelectedOption] =
        useState<PhaseDropdownOption | null>(
            firstDropdownOptions.find((phase) => phase.isActive) ||
                firstDropdownOptions[0]
        );

    // Example useEffect to load data for dropdowns and table
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(
                    `${API_BASE_URL}/mvmt/v1/trainer/client?client_id=${params.id}`,
                    { withCredentials: true }
                );
                setUserData(response.data);
            } catch (error) {
                console.error("Error fetching user data:", error);
            }
        };

        const performOtherAsyncOperations = async () => {
            try {
                // const response = await axios.get(
                //     `${API_BASE_URL}/mvmt/v1/client/phases?client_id=${params.id}`,
                //     { withCredentials: true }
                // );
                // const allPhaseData = response.data;
                const allPhaseData = {
                    phases: [
                        {
                            id: "phase1",
                            phaseName: "Phase 1",
                            isActive: true,
                            sessions: [
                                {
                                    id: "upper1",
                                    sessionName: "Session 1: Upper Body",
                                    phases: "phase1",
                                    sessionOrder: 1,
                                    exercises: [
                                        {
                                            id: "sessEx1",
                                            exerciseOrder: 1,
                                            exercises: "ex1",
                                            motion: "UPPER BODY PUSH",
                                            specificDescription:
                                                "DUMBBELL FLAT BENCH PRESS",
                                            repsMax: 10,
                                            repsMin: 8,
                                            setsMax: 5,
                                            setsMin: 3,
                                            sessions: "upper1",
                                        },
                                        {
                                            id: "sessEx2",
                                            exerciseOrder: 2,
                                            exercises: "ex2",
                                            motion: "UPPER BODY PULL",
                                            specificDescription:
                                                "WIDE GRIP LAT PULL DOWN",
                                            repsMax: 10,
                                            repsMin: 8,
                                            setsMax: 5,
                                            setsMin: 3,
                                            sessions: "upper1",
                                        },
                                    ],
                                },
                                {
                                    id: "lower1",
                                    sessionName: "Session 2: Lower Body",
                                    phases: "phase1",
                                    sessionOrder: 1,
                                    exercises: [],
                                },
                            ],
                        },
                        {
                            id: "phase2",
                            phaseName: "Phase 2",
                            isActive: false,
                            sessions: [
                                {
                                    id: "upper2",
                                    sessionName: "Session 2.1: Upper Body",
                                    phases: "phase2",
                                    sessionOrder: 1,
                                    exercises: [],
                                },
                                {
                                    id: "lower2",
                                    sessionName: "Session 2.2: Lower Body",
                                    phases: "phase2",
                                    sessionOrder: 1,
                                    exercises: [
                                        {
                                            id: "sessEx1",
                                            exerciseOrder: 1,
                                            exercises: "ex1",
                                            motion: "UPPER BODY PUSH",
                                            specificDescription:
                                                "DUMBBELL FLAT BENCH PRESS",
                                            repsMax: 10,
                                            repsMin: 8,
                                            setsMax: 5,
                                            setsMin: 3,
                                            sessions: "lower2",
                                        },
                                        {
                                            id: "sessEx2",
                                            exerciseOrder: 2,
                                            exercises: "ex2",
                                            motion: "UPPER BODY PULL",
                                            specificDescription:
                                                "WIDE GRIP LAT PULL DOWN",
                                            repsMax: 10,
                                            repsMin: 8,
                                            setsMax: 5,
                                            setsMin: 3,
                                            sessions: "lower2",
                                        },
                                    ],
                                },
                            ],
                        },
                    ],
                };
                setPhaseData(allPhaseData.phases);

                let phaseDropdownData: PhaseDropdownOption[];
                let secondDropdownData: MovSessionDropdownOption[] = [];

                let exerciseListData: any[] = [];
                let activeExercises: any[] = [];

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
                    activeExercises = [];
                } else {
                    phaseDropdownData = mapPhasesToDropdownOptions(
                        allPhaseData.phases
                    );
                    const selectedPhase =
                        phaseDropdownData.find((phase) => phase.isActive) ||
                        phaseDropdownData[0];
                    setDefaultSelectedOption(selectedPhase);
                    setSelectedPhaseId(selectedPhase.value);
                    setSelectedPhaseTitle(selectedPhase.label);

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
                                phaseId: "",
                            },
                        ];
                        // Exercise list should also be empty
                        exerciseListData = [];
                        activeExercises = [];
                    } else {
                        // Map sessions to dropdown options
                        const allSessionsData = mapSessionsToDropdownOptions(
                            allPhaseData.phases
                        );
                        const filteredSessions = allSessionsData.filter(
                            (session) => session.phaseId === selectedPhase.value
                        );

                        // Check if filteredSessions is empty
                        if (filteredSessions.length === 0) {
                            secondDropdownData = [
                                {
                                    value: "no-sessions",
                                    label: "No Sessions, Please Add",
                                    phaseId: "",
                                },
                            ];
                        } else {
                            secondDropdownData = filteredSessions;
                        }

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
                            activeExercises = [];
                        } else {
                            // Map exercises to the exercise list
                            exerciseListData = mapExercisesToList(
                                allPhaseData.phases
                            );

                            // Check if secondDropdownData[0].value is "no-sessions"
                            if (
                                secondDropdownData[0] &&
                                secondDropdownData[0].value === "no-sessions"
                            ) {
                                activeExercises = [];
                            } else {
                                // Filter exercises from exerciseListData whose sessions === secondDropdownData[0].value
                                const filteredExercises =
                                    exerciseListData.filter(
                                        (exercise) =>
                                            exercise.sessions ===
                                            secondDropdownData[0].value
                                    );
                                activeExercises = filteredExercises;
                            }
                        }
                    }
                }

                setFirstDropdownOptions(phaseDropdownData);
                setSecondDropdownOptions(secondDropdownData);
                setExerciseList(exerciseListData);
                setActiveExerciseList(activeExercises);
            } catch (error) {
                console.error("Error in other async operations:", error);
            }
        };
        const getAllWorkouts = async () => {
            try {
                // TODO: DB CONNECTION
                const response = await axios.get(
                    `${API_BASE_URL}/mvmt/v1/trainer/workouts`,

                    { withCredentials: true }
                );
                const allExercises: WorkoutData[] = response.data;
                setAllWorkouts(allExercises);
            } catch (error) {
                console.log(error);
            }
        };
        setPageLoading(true);

        const fetchAllData = async () => {
            if (!userData) {
                await fetchData();
            }
            await performOtherAsyncOperations();
            await getAllWorkouts();
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
        // alert(selectedPhaseId);
        const selectedPhaseOption = firstDropdownOptions.find(
            (phase: PhaseDropdownOption) => phase.value === selectedPhaseId
        );
        setDefaultSelectedOption(selectedPhaseOption || null);
        const selectedPhase = phaseData.find(
            (phase: Phase) => phase.id === selectedPhaseId
        );

        if (!selectedPhase) {
            setSecondDropdownOptions([]);
            setActiveExerciseList([]);
            return;
        }
        setSelectedPhaseId(selectedPhase.id);
        setSelectedPhaseTitle(selectedPhase.phaseName);

        if (selectedPhase.sessions.length === 0) {
            setSecondDropdownOptions([
                {
                    value: "no-sessions",
                    label: "No Sessions, Please Add",
                    phaseId: "",
                },
            ]);
            setActiveExerciseList([]);
        } else {
            const sessionOptions = selectedPhase.sessions.map(
                (session: MovSession) => ({
                    value: session.id,
                    label: session.sessionName,
                    phaseId: selectedPhase.id,
                })
            );
            setSecondDropdownOptions(sessionOptions);

            // const exercises = selectedPhase.sessions.flatMap(
            //     (session: MovSession) => session.exercises
            // );
            const exercises = exerciseList.filter(
                (exer) => exer.sessions === sessionOptions[0].value
            );

            setActiveExerciseList(exercises);
        }
    };

    const handleSessionChange = (selectedSessionId: string) => {
        const exercises = exerciseList.filter(
            (exer) => exer.sessions === selectedSessionId
        );

        setActiveExerciseList(exercises);
    };

    const mapSessionsToDropdownOptions = (
        phases: Phase[]
    ): MovSessionDropdownOption[] => {
        return phases.flatMap((phase: Phase) =>
            phase.sessions.map((session: MovSession) => ({
                value: session.id,
                label: session.sessionName,
                phaseId: phase.id,
            }))
        );
    };

    const mapExercisesToList = (phases: Phase[]): SessionExercise[] => {
        return phases.flatMap((phase: Phase) =>
            phase.sessions.flatMap((session: MovSession) => session.exercises)
        );
    };

    const handleAddExercise = () => {
        const firstWorkout = allWorkouts[0];
        setActiveExerciseList([
            ...activeExerciseList,
            {
                exerciseOrder: activeExerciseList.length + 1,
                motion: firstWorkout.Motion,
                specificDescription: firstWorkout.SpecificDescription,
                repsMin: firstWorkout.RecommendedRepsMin,
                repsMax: firstWorkout.RecommendedRepsMax,
                setsMin: firstWorkout.RecommendedSetsMin,
                setsMax: firstWorkout.RecommendedSetsMax,
                exercises: firstWorkout.id,
                id: "",
                sessions: "",
                restMax: firstWorkout.RecommendedRestMax,
                restMin: firstWorkout.RecommendedRestMin,
                tempo: firstWorkout.Tempo,
                TUT: firstWorkout.TUT,
            },
        ]);
        setIsEditing(true);
    };

    const handleActivatePhase = (phaseId: string) => {
        console.log(phaseId);
    };

    return pageLoading ? (
        <div>
            <div className="ml-12">
                <BreadcrumbLoading />
            </div>
            <div className="flex items-center space-x-4">
                <div className="border rounded p-2 w-1/4 animate-pulse bg-gray-300">
                    <div className="h-4 bg-gray-400 rounded"></div>
                </div>
                <span className="text-gray-500">
                    <IoChevronForwardOutline className="text-lg" />
                </span>
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
                + Add Exercise
            </button>
        </div>
    ) : (
        <div>
            <div className="ml-12">
                <Breadcrumb
                    homeImage={userData?.imageUrl}
                    homeTitle={userData?.name}
                    customTexts={page_title}
                />
            </div>

            <div className="flex flex-col space-y-4 mt-2">
                <div className="flex items-center">
                    <div className="flex flex-col w-1/4">
                        <CustomSelect
                            options={firstDropdownOptions}
                            onChange={handlePhaseChange}
                            selectedOption={defaultSelectedOption}
                        />

                        {phaseData.length === 0 ? (
                            <div className="flex items-center justify-between space-x-2 mt-2">
                                <Link
                                    href={`/client/${id}/recommended-workouts/new-phase`}
                                    className="text-blue-500 hover:underline"
                                >
                                    Add
                                </Link>
                            </div>
                        ) : (
                            <div className="flex items-center justify-between space-x-2 mt-2">
                                <Link
                                    href={`/client/${id}/recommended-workouts/new-phase`}
                                    className="text-blue-500 hover:underline"
                                >
                                    Add
                                </Link>
                                <Link
                                    href="#"
                                    className="text-blue-500 hover:underline"
                                >
                                    Delete
                                </Link>
                            </div>
                        )}
                    </div>
                    <span className="text-gray-500 mx-4 self-start py-5">
                        <IoChevronForwardOutline className="text-lg" />
                    </span>{" "}
                    {/* margin added for spacing */}
                    <div className="flex flex-col w-1/4">
                        <select
                            className="border rounded p-2"
                            onChange={(e) =>
                                handleSessionChange(e.target.value)
                            }
                        >
                            {secondDropdownOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>

                        {phaseData.length === 0 ? (
                            <div className="h-8"></div>
                        ) : (
                            <div className="flex items-center justify-between space-x-2 mt-2">
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
                                    Add
                                </Link>
                                <Link
                                    href="#"
                                    className="text-blue-500 hover:underline"
                                >
                                    Delete
                                </Link>
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col ml-5">
                        {defaultSelectedOption &&
                            !defaultSelectedOption.isActive && (
                                <>
                                    <button
                                        className="bg-gold-500 text-white px-4 py-2 rounded hover:bg-green-500 mt-2"
                                        onClick={() =>
                                            handleActivatePhase(
                                                defaultSelectedOption.value
                                            )
                                        }
                                    >
                                        Activate Phase
                                    </button>
                                    <div className="h-10"></div>
                                </>
                            )}
                    </div>
                </div>
            </div>

            {/* Table Component */}
            {activeExerciseList.length === 0 ? (
                <p className="text-gray-600 w-full text-center">
                    No Exercises added to this session yet.
                    <br />
                    Click on <strong>+ Add Exercise</strong> to add a new
                    exercise.
                </p>
            ) : (
                <table className="w-full mt-4 border-collapse border border-gray-300">
                    <thead>
                        <tr>
                            <th className="bg-green-500 text-white border border-gray-300 p-2">
                                Order
                            </th>
                            <th className="bg-green-500 text-white border border-gray-300 p-2">
                                Motion
                            </th>
                            <th className="bg-green-500 text-white border border-gray-300 p-2">
                                Specific Description
                            </th>
                            <th className="bg-green-500 text-white border border-gray-300 p-2">
                                Reps Min
                            </th>
                            <th className="bg-green-500 text-white border border-gray-300 p-2">
                                Reps Max
                            </th>
                            <th className="bg-green-500 text-white border border-gray-300 p-2">
                                Sets Min
                            </th>
                            <th className="bg-green-500 text-white border border-gray-300 p-2">
                                Sets Max
                            </th>
                            <th className="bg-green-500 text-white border border-gray-300 p-2">
                                Action
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {activeExerciseList.map((exercise, index) => (
                            <EditableRow
                                key={index}
                                rowData={exercise}
                                onSave={(editedData) => {
                                    // Handle save logic
                                    const updatedExerciseList = [
                                        ...activeExerciseList,
                                    ];
                                    updatedExerciseList[index] = editedData;
                                    setActiveExerciseList(updatedExerciseList);
                                }}
                                isEditing={isEditing}
                                setIsEditing={setIsEditing}
                                allWorkouts={allWorkouts}
                            />
                        ))}
                    </tbody>
                </table>
            )}
            {/* Button Component */}
            <button
                onClick={handleAddExercise}
                className="w-full mt-4 p-2 border-2 rounded"
            >
                + Add Exercise
            </button>
        </div>
    );
};

export default Page;
