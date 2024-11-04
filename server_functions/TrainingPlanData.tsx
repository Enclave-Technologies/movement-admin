// hooks/useTrainingPlanData.ts
// "use client";
// import { useState, useEffect } from "react";
// import axios from "axios";

import axios from "axios";

const emptyPhase = { phases: [] };
const onlyPhase = {
    phases: [
        {
            id: "phase1",
            phaseName: "Phase cutting",
            isActive: false,
            sessions: [],
        },
    ],
};
const filledPhase = {
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
                            specificDescription: "DUMBBELL FLAT BENCH PRESS",
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
                            specificDescription: "WIDE GRIP LAT PULL DOWN",
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
                            specificDescription: "DUMBBELL FLAT BENCH PRESS",
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
                            specificDescription: "WIDE GRIP LAT PULL DOWN",
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

// // const returnedData = filledPhase;

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

// const useTrainingPlanData = (clientId: string, refetch: boolean) => {
//     const [phases, setPhases] = useState<Phase[]>([]);
//     const [sessions, setSessions] = useState<MovSession[]>([]);
//     const [exercises, setExercises] = useState<SessionExercise[]>([]);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 // const response = await axios.get(
//                 //     `${API_BASE_URL}/mvmt/v1/client/phases?client_id=${clientId}`,
//                 //     { withCredentials: true }
//                 // );
//                 // const allPhaseData = response.data;
//                 const allPhaseData = filledPhase;

//                 const phases = allPhaseData.phases;
//                 const sessions = phases.flatMap(
//                     (phase: Phase) => phase.sessions
//                 );
//                 const exercises = phases.flatMap((phase: Phase) =>
//                     phase.sessions.flatMap(
//                         (session: MovSession) => session.exercises
//                     )
//                 );

//                 setPhases(phases);
//                 setSessions(sessions);
//                 setExercises(exercises);
//                 setLoading(false);
//             } catch (error) {
//                 console.error("Error fetching data:", error);
//                 setLoading(false);
//             }
//         };

//         fetchData();
//     }, [clientId, refetch]);

//     return { phases, sessions, exercises, loading };
// };

// export default useTrainingPlanData;

const TrainingPlanData = async (clientId: string) => {
    // const response = await axios.get(
    //     `${API_BASE_URL}/mvmt/v1/client/phases?client_id=${clientId}`,
    //     { withCredentials: true }
    // );
    // const allPhaseData = response.data;
    const allPhaseData = filledPhase;

    return allPhaseData;
};

export default TrainingPlanData;
