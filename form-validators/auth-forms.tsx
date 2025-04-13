import { z } from "zod";

// Define a schema for the expected form data
export const LoginFormSchema = z.object({
    email: z.string().email("Invalid email format"),
    password: z.string().min(8, "Password must be at least 8 characters"),
});

export const RegisterFormSchema = z
    .object({
        email: z.string().email("Invalid email format"),
        fullName: z.string().min(1, "Full name is required"),
        password: z.string().min(8, "Password must be at least 8 characters"),
        confirmPassword: z.string().min(8, "Confirm password is required"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Passwords do not match",
    });
