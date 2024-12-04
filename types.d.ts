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
  emailVerification: boolean;
  phoneVerification: boolean;
  $createdAt: string;
  $updatedAt: string;
  accessedAt: string;
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
  exerciseDescription?: string | null;
  exerciseMotion: string;
  exerciseShortDescription?: string | null;
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
  phase: Phase;
  workouts: WorkoutData[];
  onPhaseNameChange: (phaseId: string, newPhaseName: string) => void;
  handleCopyPhase: (phaseId: string) => void;
  onPhaseDelete: (phaseId: string) => void;
  onActivatePhase: (phaseId: string, phaseState: boolean) => void;
  onAddSession: (phaseId: string, newSession: MovementSession) => void;
  activePhaseId: string | null;
  onSessionDelete;
  onSessionNameChange;
  editingExerciseId;
  onExerciseAdd;
  onExerciseUpdate;
  onExerciseDelete;
  onExerciseOrderChange;
  onEditExercise;
  onCancelEdit;
}

interface SessionProps {
  index: number;
  phaseId: string;
  session: MovementSession;
  workouts: WorkoutData[];
  onSessionNameChange: (sessionId: string, sessionName: str) => void;
  onSessionDelete: (sessionId: string) => void;

  editingExerciseId;
  onExerciseAdd;
  onExerciseUpdate;
  onExerciseDelete;
  onExerciseOrderChange;
  onEditExercise;
  onCancelEdit;
}

interface SessionExerciseProps {
  phaseId: string;
  sessionId: string;
  exercises: Exercise[];
  workouts: WorkoutData[];
  onExerciseAdd: (phaseId: string, sessionId: string) => void;
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
  onEditExercise: (exerciseId: string) => void;
  onCancelEdit: () => void;
}

interface DataResponse {
  phases: Phase[];
}

interface EditableTableProps {
  phaseId: string;
  sessionId: string;
  workoutOptions: { value: string; label: string; workout: WorkoutData }[];
  exercises: Exercise[];
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
