"use server";
import { createAdminClient, createSessionClient } from "@/appwrite/config";
import {
    LoginFormSchema,
    RegisterFormSchema,
} from "@/form-validators/auth-forms";
import { MOVEMENT_SESSION_NAME } from "@/lib/constants";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ID } from "node-appwrite";
import "server-only";

export async function get_user_account() {
    const { account } = await createAdminClient();
    const user = await account.get();
    return user;
}

export async function login(previousState: string, formData: unknown) {
    // 1. Validate if the input is FormData
    if (!(formData instanceof FormData)) {
        throw new Error("Invalid input: Expected FormData");
    }

    // 2. Convert FormData to a plain object for Zod validation
    const formDataObj = Object.fromEntries(formData.entries());

    // 3. Validate using Zod (throws if invalid)
    const result = LoginFormSchema.safeParse(formDataObj);
    if (!result.success) {
        // throw new Error(`Validation failed: ${result.error.message}`);
        return `Validation failed: ${result.error.message}`;
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
        return "Invalid credentials";
    }

    redirect("/my-clients");
}

export async function logout() {
    const session = (await cookies()).get(MOVEMENT_SESSION_NAME);
    if (session) {
        const { account } = await createSessionClient(session.value);
        try {
            await account.deleteSession("current");
        } catch (error) {
            console.error("Error logging out:", error);
        }
        (await cookies()).delete(MOVEMENT_SESSION_NAME);
        redirect("/login");
    } else {
        redirect("/login");
    }
}

export async function register(previousState: string, formData: unknown) {
    // 1. Validate if the input is FormData
    if (!(formData instanceof FormData)) {
        throw new Error("Invalid input: Expected FormData");
    }
    // 2. Convert FormData to a plain object for Zod validation
    const formDataObj = Object.fromEntries(formData.entries());

    // 3. Validate using Zod (throws if invalid)
    const result = RegisterFormSchema.safeParse(formDataObj);
    if (!result.success) {
        return `Validation failed: ${result.error.message}`;
    }

    // 4. Proceed with validated data
    const { email, password, fullName } = result.data;
    const { account } = await createAdminClient();
    const user_id = ID.unique();
    const newUser = await account.create(
        user_id, // userId
        email, // email
        password, // password
        fullName // name (optional)
    );

    // 5. create team affiliation

    // 6. Create Person object in DB
}
