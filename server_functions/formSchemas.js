import { z } from "zod";

// Define a schema for the register form data
export const RegisterFormSchema = z.object({
    firstName: z.string().min(2, "First Name must be at least 2 letters"),
    lastName: z.string().min(2, "Last Name must be at least 2 letters"),
    phone: z.string().max(20, "Phone should be less than 20 letters"),
    email: z.string().email("Invalid email address"),
    jobTitle: z.string().min(2, "Job Title must be at least 2 letters"),
    role: z.enum(["admin", "trainer"]),
});

// Define a schema for the register form data
export const ClientFormSchema = z.object({
    firstName: z.string().min(2, "First Name must be at least 2 letters"),
    lastName: z.string().min(2, "Last Name must be at least 2 letters"),
    phone: z.string().max(20, "Phone should be less than 20 letters"),
    email: z.string().email("Invalid email address"),
    trainerId: z.string(),
});

export const LoginFormSchema = z.object({
    email: z.string().email("Invalid email address"), // Add email validation
    password: z.string().min(6, "Password must be at least 6 characters"),
});

export const exerciseSchema = z
    .object({
        motion: z.string().min(1, "Motion is required"),
        specificDescription: z
            .string()
            .min(1, "Specific Description is required"),
        recommendedRepsMin: z
            .number()
            .int()
            .positive("Recommended Reps Min must be a positive integer"),
        recommendedRepsMax: z
            .number()
            .int()
            .positive("Recommended Reps Max must be a positive integer"),
        recommendedSetsMin: z
            .number()
            .int()
            .positive("Recommended Sets Min must be a positive integer"),
        recommendedSetsMax: z
            .number()
            .int()
            .positive("Recommended Sets Max must be a positive integer"),
        tempo: z.string().min(1, "Tempo is required"),
        tut: z.number().int().positive("TUT must be a positive integer"),
        recommendedRestMin: z
            .number()
            .int()
            .positive("Recommended Rest Min must be a positive integer"),
        recommendedRestMax: z
            .number()
            .int()
            .positive("Recommended Rest Max must be a positive integer"),
        shortDescription: z.string().min(1, "Short Description is required"),
    })
    .refine((data) => data.recommendedRepsMax >= data.recommendedRepsMin, {
        message:
            "Recommended Reps Max must be greater than Recommended Reps Min",
        path: ["recommendedRepsMax"],
    })
    .refine((data) => data.recommendedSetsMax >= data.recommendedSetsMin, {
        message:
            "Recommended Sets Max must be greater than or equal to Recommended Sets Min",
        path: ["recommendedSetsMax"],
    })
    .refine((data) => data.recommendedRestMax >= data.recommendedRestMin, {
        message:
            "Recommended Rest Max must be greater than or equal to Recommended Rest Min",
        path: ["recommendedRestMax"],
    });
