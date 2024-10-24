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

// export async function register(state, formData) {
//     // 1. Validate fields
//     const validatedResult = RegisterFormSchema.safeParse({
//         username: formData.get("username"),
//         email: formData.get("email"),
//         password: formData.get("password"),
//         confirmPassword: formData.get("confirm-password"),
//     });
//     if (!validatedResult.success) {
//         // Handle validation errors
//         const errors = validatedResult.error.formErrors.fieldErrors;
//         return { success: false, errors };
//     }
//     const { username, email, password } = validatedResult.data;

//     // 2. Try creating with details
//     const { account } = await createAdminClient();
//     try {
//         await account.create(ID.unique(), email, password, username);
//     } catch (error) {
//         if (
//             error instanceof AppwriteException &&
//             error.code === 409 &&
//             error.type === "user_already_exists"
//         ) {
//             return {
//                 success: false,
//                 errors: { email: ["Email already exists, please login"] },
//             };
//         }
//     }

//     // 3. If successful in creating account, then login
//     try {
//         const session = await account.createEmailPasswordSession(
//             email,
//             password
//         );
//         cookies().set(SESSION_COOKIE_NAME, session.secret, {
//             httpOnly: true,
//             sameSite: "None",
//             secure: true,
//             expires: new Date(session.expire),
//             path: "/",
//             domain: "enclave.live",
//         });
//     } catch (error) {
//         console.error(error);
//         return {
//             success: false,
//             errors: { email: ["An error occurred. Please try again."] },
//         };
//     }
//     redirect("/");
// }


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

        // Retrieve and log the cookie
        // const cookie = cookies().get(SESSION_COOKIE_NAME);
        // console.log("Cookie set:", cookie);

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
        // Handle other errors
        return {
            success: false,
            errors: {
                email: [
                    "An unexpected error occurred. Please try again later.",
                ],
                password: [
                    "An unexpected error occurred. Please try again later.",
                ],
            },
        };
    }

    redirect("/");
}

export async function logout() {
    try {
        const sessionCookie = JSON.parse(
            cookies().get(SESSION_COOKIE_NAME)?.value
        );
        if (sessionCookie) {
            const { account } = await createSessionClient(
                sessionCookie.session
            );
            await account.deleteSession("current");
        }

        // Delete the session cookie with correct attributes
        (await cookies()).delete({
            name: SESSION_COOKIE_NAME,
            httpOnly: true,
            sameSite: "None",
            secure: true,
            path: "/",
            domain: "enclave.live",
        });

        console.log(`Cookie ${SESSION_COOKIE_NAME} deleted`);

        (await cookies()).getAll().map((cookie) => console.log(cookie));

        // Redirect to the login page
        redirect("/login");
    } catch (error) {
        console.log(error);

        // Handle errors by deleting the session cookie and redirecting
        cookies().delete({
            name: SESSION_COOKIE_NAME,
            httpOnly: true,
            sameSite: "None",
            secure: true,
            path: "/",
            domain: "enclave.live",
        });

        console.log(`Cookie ${SESSION_COOKIE_NAME} deleted after error`);

        redirect("/login");
    }
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

export async function fetchUserDetails() {
    if (!cookies().has(SESSION_COOKIE_NAME)) {
        return null;
    }
    try {
        const sessionCookie = JSON.parse(
            cookies().get(SESSION_COOKIE_NAME).value
        );
        const { account, database } = await createSessionClient(
            sessionCookie.session
        );
        const accDetails = await account.get();

        const fullDetails = await database.getDocument(
            process.env.NEXT_PUBLIC_DATABASE_ID,
            process.env.NEXT_PUBLIC_COLLECTION_TRAINERS,
            accDetails.$id
        );
        console.log(fullDetails);
        return fullDetails;
    } catch (error) {
        console.log(error);
        return null;
    }

    return null;
}
