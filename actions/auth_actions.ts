"use server";
import { createAdminClient } from "@/appwrite/config";
import { LoginFormSchema } from "@/form-validators/auth-forms";
import { MOVEMENT_SESSION_NAME } from "@/lib/constants";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import "server-only";

export async function get_user_account() {
    const { account } = await createAdminClient();
    const user = await account.get();
    return user;
}

export async function login(formData: unknown) {
    // 1. Validate if the input is FormData
    if (!(formData instanceof FormData)) {
        throw new Error("Invalid input: Expected FormData");
    }

    // 2. Convert FormData to a plain object for Zod validation
    const formDataObj = Object.fromEntries(formData.entries());

    // 3. Validate using Zod (throws if invalid)
    const result = LoginFormSchema.safeParse(formDataObj);
    if (!result.success) {
        throw new Error(`Validation failed: ${result.error.message}`);
    }

    // 4. Proceed with validated data
    const { email, password } = result.data;
    const { account } = await createAdminClient();

    try {
        const session = await account.createEmailPasswordSession(
            email,
            password
        );

        (await cookies()).set(MOVEMENT_SESSION_NAME, session.secret, {
            httpOnly: true,
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production",
            expires: new Date(session.expire),
            path: "/",
        });
    } catch (error) {
        console.error("Error logging in:", error);
        // throw error; // Re-throw for upstream handling
        // redirect("/login");
    }

    redirect("/my-clients");
}
