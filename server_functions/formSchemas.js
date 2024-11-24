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
    trainerId: z.string()
});


export const LoginFormSchema = z.object({
    email: z.string().email("Invalid email address"), // Add email validation
    password: z.string().min(6, "Password must be at least 6 characters"),
});
