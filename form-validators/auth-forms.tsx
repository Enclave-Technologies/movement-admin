import { z } from "zod";

// Define a schema for the expected form data
export const LoginFormSchema = z.object({
    email: z.string().email("Invalid email format"),
    password: z.string().min(8, "Password must be at least 8 characters"),
});
