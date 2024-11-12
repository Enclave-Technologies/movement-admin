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
    motion: string;
    specificDescription: string;
}

interface WorkoutData {
    id: string;
    Motion: string;
    SpecificDescription: string;
    RecommendedRepsMin: number;
    RecommendedRepsMax: number;
    RecommendedSetsMin: number;
    RecommendedSetsMax: number;
    Tempo: string;
    TUT: number;
    RecommendedRestMin: number;
    RecommendedRestMax: number;
    ShortDescription: string;
    videoURL: string;
    approved: boolean;
}

interface EditableRowProps {
    rowData: SessionExercise;
    onSave: (editedData: SessionExercise) => void;
    isEditing: boolean;
    setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
    allWorkouts: WorkoutData[];
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

interface CustomSelectProps {
    options: PhaseDropdownOption[];
    onChange: (value: string) => void;
    selectedOption: PhaseDropdownOption;
}
interface MovSessionDropdownOption {
    value: string;
    label: string;
    phaseId: string;
}

interface ExSession {
    sessionName: string;
    exercises: number;
    time: string;
}

interface AddExerciseModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: any) => void; // Adjust the type of 'data' as needed
}

interface TrainerDetails {
    auth_id: string;
    firstName: string;
    lastName: string;
    imageURL: string | null;
    jobTitle: string;
    $id: string;
    $createdAt: string;
    $updatedAt: string;
    $permissions: string[];
    $databaseId: string;
    $collectionId: string;
}

interface trainerSidebarInfo {
    name: string;
    image: string;
    description: string;
}

interface CustomSelectProps {
    options: PhaseDropdownOption[]; //{ value: string; label: string; isActive: boolean }[];
    onChange: (value: string) => void;
    selectedOption: PhaseDropdownOption; //{ value: string; label: string; isActive: boolean } | null;
}

interface SessionRendererProps {
    selectedPhase: Phase;
    phases: Phase[];
    setPhases: (phases: Phase[]) => void;
}

interface GoalTileProps {
    goal: {
        id: string;
        description: string;
        completed: boolean;
    };
    onUpdateGoal: (id: string, completed: boolean) => Promise<void>;
    isEditMode: boolean;
    onEdit: () => void;
    onDelete: () => void;
}
