export const SESSION_COOKIE_NAME = "movement-session";
export const defaultProfileURL =
    "https://cloud.appwrite.io/v1/storage/buckets/670e9315002c28a700c7/files/default-profile-webp/view?project=66cf3c92001fdce0f67d&project=66cf3c92001fdce0f67d&mode=admin";
export const goalTypes = [
    { name: "Physique Goal", value: "physique" },
    { name: "Performance Goal", value: "performance" },
    { name: "Skill Goal", value: "skill" },
    { name: "Lifestyle Goal", value: "lifestyle" },
];
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
export const LIMIT = 50;
export const exerciseHierarchy = [
    { Core: ["core"] },
    { "Lower Body Pull": ["hamstrings"] },
    {
        "Lower Body Push": [
            "gluteal",
            "quadriceps",
            "rectus femoris",
            "adductors",
        ],
    },
    { Metcon: ["metabolic conditioning"] },
    {
        "Upper Body Pull": [
            "biceps-brachii",
            "back-latissimus-dorsi",
            "back-upper",
            "back-lower",
        ],
    },
    { "Upper Body Push": ["chest", "triceps-brachii", "shoulders deltoids"] },
];
export const getDescriptionFromMotion = (motion: string) => {
    switch (motion) {
        case "Core":
            return "Strengthening the core muscles";
        case "Lower Body Pull":
            return "Exercises that target the lower body pulling muscles";
        case "Lower Body Push":
            return "Exercises that target the lower body pushing muscles";
        case "Metcon":
            return "Metabolic conditioning exercises";
        case "Upper Body Pull":
            return "Exercises that target the upper body pulling muscles";
        case "Upper Body Push":
            return "Exercises that target the upper body pushing muscles";
        default:
            return "";
    }
};
export const BMC_COLUMNS = [
    "DATE",
    "HEIGHT",
    "WEIGHT",
    "CHIN",
    "CHEEK",
    "PEC",
    "BICEPS",
    "TRICEPS",
    "SUBSCAP",
    "MIDAX",
    "SUPRA",
    "UPPER-THIGH",
    "UBMIL",
    "KNEE",
    "CALF",
    "QUAD",
];
export const DEFAULT_WORKOUT_VALUES = {
    repsMin: 8,
    repsMax: 12,
    setsMin: 3,
    setsMax: 5,
    tempo: "3 0 1 0",
    TUT: 48,
    restMin: 45,
    restMax: 60,
};
