interface Field {
    name: string;
    label: string;
    type: string;
}

// Define the Client interface
interface Client {
    uid: string;
    name: string;
    email: string;
    phone: string;
    trainer_name?: string; // Optional property
    trainer_id?: string;
    imageUrl?: string;
}

interface PhaseRow {
    order: number;
    motion: string;
    specificDescription: string;
    repsMin: number;
    repsMax: number;
    setsMin: number;
    setsMax: number;
}
// Define the interface for a session exercise
interface SessionExercise {
    // Unique session exercise ID
    id: string;
    // Exercises associated with the session
    exercises: string;
    // Sessions associated with the exercise
    sessions: string;
    // Minimum reps for the exercise
    repsMin: number;
    // Maximum reps for the exercise
    repsMax: number;
    // Minimum sets for the exercise
    setsMin: number;
    // Maximum sets for the exercise
    setsMax: number;
    // Tempo of the exercise
    tempo?: string;
    // Time Under Tension (TUT) for the exercise
    TUT?: number;
    // Minimum rest time between sets
    restMin?: number;
    // Maximum rest time between sets
    restMax?: number;
    // Order of the exercise in the session
    exerciseOrder: number;
}

// Define the interface for a movement session
interface MovSession {
    // Unique session ID
    id: string;
    // Name of the session
    sessionName: string;
    // Order of the session in the sequence
    sessionOrder: number;
    // Phases associated with the session
    phases: string;
    // List of session exercises associated with the session, default is an empty list
    exercises: SessionExercise[];
}

// Define the interface for a phase
interface Phase {
    // Unique phase ID
    id: string;
    // Name of the phase
    phaseName: string;
    // Boolean indicating if the phase is active
    isActive: boolean;
    // List of movement sessions associated with the phase, default is an empty list
    sessions: MovSession[];
}

// Define the interface for a phase dropdown option
interface PhaseDropdownOption {
    value: string;
    label: string;
    isActive: boolean;
}

interface MovSessionDropdownOption {
    value: string;
    label: string;
}

interface ExSession {
    sessionName: string;
    exercises: number;
    time: string;
}

export type {
    Field,
    Client,
    PhaseRow,
    SessionExercise,
    MovSession,
    Phase,
    PhaseDropdownOption,
    MovSessionDropdownOption,
    ExSession,
};
