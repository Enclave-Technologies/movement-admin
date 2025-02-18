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

interface WorkoutData {
    id: string;
    $collectionId: string;
    approved: boolean;
    fullName: string;
    motion: string;
    targetArea: string;
    shortName: string;
    videoUrl: string;
}

interface EditableRowProps {
    rowData: SessionExercise;
    onSave: (editedData: SessionExercise) => void;
    isEditing: boolean;
    setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
    allWorkouts: WorkoutData[];
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

interface TrainerSettings {
    $id: string;
    auth_id: string;
    firstName: string;
    lastName: string;
    imageURL: string | null;
    jobTitle: string;
    email: string;
    phone: string;
    gender: string;
    emailVerification: boolean;
    phoneVerification: boolean;
    $createdAt: string;
    $updatedAt: string;
    accessedAt: string;
}

interface TrainerData {
    auth_id: string;
    firstName: string;
    lastName: string;
    imageURL: string;
    jobTitle: string;
    phone: string;
    email: string;
    gender: string;
    $id: string;
    $createdAt: string;
    $updatedAt: string;
    $permissions: string[];
    $databaseId: string;
    $collectionId: string;
    teamNames: string[];
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

interface Exercise {
    id: string; // $id
    exerciseId: string;
    fullName?: string | null;
    motion: string;
    targetArea?: string | null;
    exerciseVideo?: string | null;
    repsMin: number;
    repsMax: number;
    setsMin: number;
    setsMax: number;
    tempo?: string | null;
    TUT?: number | null;
    restMin: number;
    restMax: number;
    exerciseOrder: number;
    setOrderMarker?: string | null;
    bias?: string | null;
    lenShort?: string | null;
    impliment?: string | null;
    grip?: string | null;
    angle?: string | null;
    support?: string | null;
    xtraInstructions?: string | null;
}

interface MovementSession {
    sessionId: string; // $id
    sessionName: string;
    sessionOrder: number;
    sessionTime?: string | null;
    exercises: Exercise[];
}

interface Phase {
    phaseId: string; // $id
    phaseName: string;
    isActive: boolean;
    sessions: MovementSession[];
}

interface PhaseProps {
    setClientPhases: any;
    phase: Phase;
    workouts: WorkoutData[];
    onPhaseNameChange: (
        phaseId: string,
        newPhaseName: string
    ) => Promise<boolean>;
    handleCopyPhase: (phaseId: string) => void;
    onPhaseDelete: (phaseId: string) => void;
    onActivatePhase: (phaseId: string, phaseState: boolean) => void;
    onAddSession: (phaseId: string, newSession: MovementSession) => void;
    handleExerciseSave: () => void;
    activePhaseId: string | null;
    onSessionDelete;
    onSessionNameChange;
    editingExerciseId;
    handleAddExercise;
    onExerciseUpdate;
    onExerciseDelete;
    onExerciseOrderChange;
    onEditExercise;
    onCancelEdit;
    client_id;
    nextSession;
    progressId;
    setShowToast;
    setToastMessage;
    setToastType;
    savingState: boolean;
    handleSessionOrderChange;
}

interface SessionProps {
    index: number;
    phaseId: string;
    session: MovementSession;
    workouts: WorkoutData[];
    onSessionNameChange: (sessionId: string, sessionName: str) => any;
    onSessionDelete: (sessionId: string) => void;
    handleExerciseSave: () => void;
    editingExerciseId;
    handleAddExercise;
    onExerciseUpdate;
    onExerciseDelete;
    onExerciseOrderChange;
    onEditExercise;
    onCancelEdit;
    client_id;
    nextSession;
    progressId;
    handleCopySession;
    setShowToast;
    setToastMessage;
    setToastType;
    savingState;
    isPhaseActive;
}

interface SessionExerciseProps {
    phaseId: string;
    sessionId: string;
    exercises: Exercise[];
    workouts: WorkoutData[];
    handleAddExercise: (phaseId: string, sessionId: string) => void;
    onExerciseUpdate: (
        phaseId: string,
        sessionId: string,
        updatedExercise: Exercise
    ) => void;
    editingExerciseId: string | null;
    onExerciseDelete: (
        phaseId: string,
        sessionId: string,
        exerciseId: string
    ) => void;
    onExerciseOrderChange: (
        phaseId: string,
        sessionId: string,
        updatedExercises: Exercise[]
    ) => void;
    handleExerciseSave: () => void;
    onEditExercise: (exerciseId: string) => void;
    onCancelEdit: () => void;
    savingState: boolean;
}

interface DataResponse {
    phases: Phase[];
}

interface EditableTableProps {
    phaseId: string;
    sessionId: string;
    targetAreas: { value: string; label: string }[];
    setSelTargetArea: React.Dispatch<React.SetStateAction<string>>;
    workoutOptions: { value: string; label: string; workout: WorkoutData }[];
    exercises: Exercise[];
    handleExerciseSave: () => void;
    editingExerciseId: string | null;
    onCancelEdit: () => void;
    onEditExercise: (exerciseId: string) => void;
    onExerciseUpdate: (
        phaseId: string,
        sessionId: string,
        updatedExercise: any
    ) => void;
    onExerciseDelete: (
        phaseId: string,
        sessionId: string,
        exerciseId: string
    ) => void;
    savingState: boolean;
}

interface AddClientFormProps {
    action: (event: FormData) => void;
    state: any;
    allTrainers: any;
}

interface AddFormProps {
    action: (event: FormData) => void;
    state: any;
}

interface CountsDocument {
    $collectionId: string;
    $createdAt: string;
    $databaseId: string;
    $id: string;
    $permissions: any[];
    $updatedAt: string;
    exercises_count: number;
    trainers_count: number;
    users_count: number;
}

interface ScrollTableSkeletonProps {
    columnCount: number;
    rowCount: number;
}

type UserTemplate = {
    uid: string;
    name: string;
    email: string;
    phone?: string;
    trainer_id?: string;
    trainer_name?: string;
    imageUrl?: string;
    gender?: string;
};

type ExerciseTemplate = {
    id: string;
    targetArea: string;
    fullName: string;
    shortName: string;
    videoUrl: string;
    approved: boolean;
    motion: string;
};

type Person = {
    id: number;
    firstName: string;
    lastName: string;
    age: number;
    visits: number;
    progress: number;
    status: "relationship" | "complicated" | "single";
    createdAt: Date;
};

type ApiResponse = {
    data: any[];
    meta: {
        totalRowCount: number;
    };
};

interface CoachTemplate {
    // Unique user ID (uid)
    uid: string;
    // User's full name
    name: string;
    // User's email address
    email: string;
    // Optional phone number for the user
    phone?: string;
    // Optional URL for the user's profile image
    imageUrl?: string;
    jobTitle?: string;
    gender?: string;
    role: string;
}

interface BatchConfirmationDialogProps {
    title: string;
    confirmOp: () => void;
    cancelOp: () => void;
    loadingState?: boolean;
}
interface DeleteConfirmationDialogProps {
    title: string;
    confirmDelete: () => void;
    cancelDelete: () => void;
    isLoading?: boolean;
}

interface BMCRecord {
    $id: string; // Unique identifier for the record
    DATE: string; // Date of the record in 'YYYY-MM-DD' format
    HEIGHT: number; // Height in centimeters
    WEIGHT: number; // Weight in kilograms
    CHIN: number; // Measurement for chin
    CHEEK: number; // Measurement for cheek
    PEC: number; // Measurement for pectoral
    BICEPS: number; // Measurement for biceps
    TRICEPS: number; // Measurement for triceps
    SUBSCAP: number; // Measurement for subscapularis
    MIDAX: number; // Measurement for midaxillary
    SUPRA: number; // Measurement for supraspinatus
    "UPPER-THIGH": number; // Measurement for upper thigh
    UBMIL: number; // Measurement for umbilicus
    KNEE: number; // Measurement for knee
    CALF: number; // Measurement for calf
    QUAD: number; // Measurement for quadriceps
    BMI: number; // Body Mass Index, computed field
}
