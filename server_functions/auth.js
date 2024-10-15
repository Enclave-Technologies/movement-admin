"use server";

// Import necessary modules and functions
import { cookies } from "next/headers";
import {
    createAdminClient,
    createSessionClient,
} from "@/configs/appwriteConfig";

import { AppwriteException, ID } from "node-appwrite";
import { redirect } from "next/navigation";
import { SESSION_COOKIE_NAME } from "@/configs/constants";
import {
    RegisterFormSchema,
    LoginFormSchema,
} from "@/server_functions/formSchemas";

export async function register(state, formData) {
    // 1. Validate fields
    const validatedResult = RegisterFormSchema.safeParse({
        username: formData.get("username"),
        email: formData.get("email"),
        password: formData.get("password"),
        confirmPassword: formData.get("confirm-password"),
    });
    if (!validatedResult.success) {
        // Handle validation errors
        const errors = validationResult.error.formErrors.fieldErrors;
        return { success: false, errors };
    }
    const { username, email, password } = validatedResult.data;

    // 2. Try creating with details
    const { account } = await createAdminClient();
    try {
        await account.create(ID.unique(), email, password, username);
    } catch (error) {
        if (
            error instanceof AppwriteException &&
            error.code === 409 &&
            error.type === "user_already_exists"
        ) {
            return {
                success: false,
                errors: { email: ["Email already exists, please login"] },
            };
        }
    }

    // 3. If successful in creating account, then login
    try {
        const session = await account.createEmailPasswordSession(
            email,
            password
        );
        cookies().set(SESSION_COOKIE_NAME, session.secret, {
            httpOnly: true,
            sameSite: "strict",
            secure: true,
            expires: new Date(session.expire),
            path: "/",
        });
    } catch (error) {
        console.error(error);
    }
    redirect("/");
}

export async function login(state, formData) {
    console.log("1. LOGIN", formData);
    // 1. Validate fields
    const validatedResult = LoginFormSchema.safeParse({
        email: formData.get("email"),
        password: formData.get("password"),
    });
    console.log("2. LOGIN", validatedResult);
    if (!validatedResult.success) {
        // Handle validation errors
        const errors = validatedResult.error.formErrors.fieldErrors;
        return { success: false, errors };
    }
    const { email, password } = validatedResult.data;
    console.log("3. LOGIN", email, password);
    // 2. Try logging in
    const { account } = await createAdminClient();
    try {
        const session = await account.createEmailPasswordSession(
            email,
            password
        );
        cookies().set(SESSION_COOKIE_NAME, session.secret, {
            httpOnly: true,
            sameSite: "strict",
            secure: true,
            expires: new Date(session.expire),
            path: "/",
        });

        console.log("4. LOGIN", session);
    } catch (error) {
        console.error(error);
        if (
            error instanceof AppwriteException &&
            error.code === 401 &&
            error.type === "user_invalid_credentials"
        ) {
            return {
                success: false,
                errors: {
                    email: [
                        "Invalid credentials. Please check the email and password.",
                    ],
                    password: [
                        "Invalid credentials. Please check the email and password.",
                    ],
                },
            };
        }
    }

    console.log("5. LOGIN redirecting");

    redirect("/");
}

export async function logout() {
    const sessionCookie = cookies().get(SESSION_COOKIE_NAME);
    try {
        const { account } = await createSessionClient(sessionCookie.value);
        await account.deleteSession("current");
    } catch (error) {
        console.log(error);
    }
    cookies().delete(SESSION_COOKIE_NAME);

    redirect("/login");
}

export async function getCurrentUser() {
    const sessionCookie = cookies().get(SESSION_COOKIE_NAME);
    if (sessionCookie) {
        try {
            const { account } = await createSessionClient(sessionCookie.value);
            return account.get();
        } catch (error) {
            console.log(error);
            cookies().delete(SESSION_COOKIE_NAME);
            return null;
        }
    }
    return null;
}
