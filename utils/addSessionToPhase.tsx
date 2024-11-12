import { ID } from "appwrite";

export const addSessionToPhase = ({
    selectedPhase,
    phases,
    setPhases,
}: {
    selectedPhase: Phase;
    phases: Phase[];
    setPhases: React.Dispatch<React.SetStateAction<Phase[]>>;
}) => {
    const newSession = {
        id: ID.unique(),
        sessionName: "New Session",
        sessionOrder:
            phases.find((phase) => phase.id === selectedPhase.id)?.sessions
                .length || 0,
        phases: selectedPhase.id,
        exercises: [],
    };
    alert(`Adding session: ${JSON.stringify(newSession)}`);
    // setPhaseData((prevPhases) =>
    //     prevPhases.map((phase) =>
    //         phase.id === selectedPhase.value
    //             ? { ...phase, sessions: [...phase.sessions, newSession] }
    //             : phase
    //     )
    // );

    const updatedPhases = phases.map((phase) => {
        if (phase.id === selectedPhase.id) {
            return {
                ...phase,
                sessions: [...phase.sessions, newSession],
            };
        }
        return phase;
    });

    setPhases(updatedPhases);
};
