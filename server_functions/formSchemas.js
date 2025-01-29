import { z } from "zod";

// Define a schema for the register form data
export const RegisterFormSchema = z.object({
    firstName: z.string().min(2, "First Name must be at least 2 letters"),
    lastName: z.string().min(2, "Last Name must be at least 2 letters"),
    phone: z.string().max(20, "Phone should be less than 20 letters"),
    email: z.string().email("Invalid email address"),
    jobTitle: z.string().min(2, "Job Title must be at least 2 letters"),
    role: z.enum(["admin", "trainer"]),
    gender: z.enum(["m", "f"]),
});

// Define a schema for the register form data
export const ClientFormSchema = z.object({
    firstName: z.string().min(2, "First Name must be at least 2 letters"),
    lastName: z.string().min(2, "Last Name must be at least 2 letters"),
    phone: z.string().max(20, "Phone should be less than 20 letters"),
    email: z.string().email("Invalid email address"),
    trainerId: z.string().min(2, "Trainer ID cannot be empty"),
    gender: z.enum(["m", "f"]),
});

export const LoginFormSchema = z.object({
    email: z.string().email("Invalid email address"), // Add email validation
    password: z.string().min(6, "Password must be at least 6 characters"),
});

export const exerciseSchema = z.object({
    Motion: z.string().min(1, "Motion is required"),
    targetArea: z.string().min(1, "Target Area is required"),
    fullName: z.string().min(1, "Full name is required"),
    shortName: z
        .string()
        .min(1, "Shortend name is required")
        .max(50, "Cannot be more than 50 letters"),
    authorization: z.string(),
});
// .refine((data) => data.recommendedRepsMax >= data.recommendedRepsMin, {
//     message:
//         "Recommended Reps Max must be greater than Recommended Reps Min",
//     path: ["recommendedRepsMax"],
// })
// .refine((data) => data.recommendedSetsMax >= data.recommendedSetsMin, {
//     message:
//         "Recommended Sets Max must be greater than or equal to Recommended Sets Min",
//     path: ["recommendedSetsMax"],
// })
// .refine((data) => data.recommendedRestMax >= data.recommendedRestMin, {
//     message:
//         "Recommended Rest Max must be greater than or equal to Recommended Rest Min",
//     path: ["recommendedRestMax"],
// });
