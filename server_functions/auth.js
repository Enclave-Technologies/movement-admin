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
        const errors = validatedResult.error.formErrors.fieldErrors;
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
            sameSite: "None",
            secure: true,
            expires: new Date(session.expire),
            path: "/",
            domain: "enclave.live",
        });
    } catch (error) {
        console.error(error);
        return {
            success: false,
            errors: { email: ["An error occurred. Please try again."] },
        };
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
    console.log("3. LOGGING IN", email);
    // 2. Try logging in
    const { account } = await createAdminClient();
    try {
        const session = await account.createEmailPasswordSession(
            email,
            password
        );

        const { account: sessAccount, teams: sessTeam } =
            await createSessionClient(session.secret);
        const team = await sessTeam.list();
        if (team.total === 0 || team.teams[0].name === "Clients") {
            await sessAccount.deleteSession("current");
            return {
                success: false,
                errors: {
                    email: ["Please use the client App to login."],
                    password: [
                        "Invalid credentials. Please check the email and password.",
                    ],
                },
            };
        }
        const acc = await sessAccount.get();
        console.log("================");
        const sessionData = {
            session: session.secret,
            $id: acc.$id,
            role: "admin",
            email: acc.email,
            name: acc.name,
            team: team.teams[0].name,
        };

        console.log("================");

        cookies().set(SESSION_COOKIE_NAME, JSON.stringify(sessionData), {
            httpOnly: true,
            sameSite: "None",
            secure: true,
            expires: new Date(session.expire),
            path: "/",
            domain: "enclave.live",
        });

        console.log("4. LOGIN");
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
    try {
        const sessionCookie = JSON.parse(
            cookies().get(SESSION_COOKIE_NAME).value
        );
        const { account } = await createSessionClient(sessionCookie.session);
        await account.deleteSession("current");
    } catch (error) {
        console.log(error);
    }
    cookies().delete(SESSION_COOKIE_NAME);

    redirect("/login");
}

export async function getCurrentUser() {
    if (!cookies().has(SESSION_COOKIE_NAME)) {
        return null;
    }
    try {
        const sessionCookie = JSON.parse(
            cookies().get(SESSION_COOKIE_NAME).value
        );
        const { account } = await createSessionClient(sessionCookie.session);
        return account.get();
    } catch (error) {
        console.log(error);
        return null;
    }

    return null;
}
