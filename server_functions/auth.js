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
    ClientFormSchema,
} from "@/server_functions/formSchemas";

export async function register(state, formData) {
    // 1. Validate fields
    const validatedResult = RegisterFormSchema.safeParse({
        firstName: formData.get("firstName"),
        lastName: formData.get("lastName"),
        phone: formData.get("phone"),
        email: formData.get("email"),
        jobTitle: formData.get("jobTitle"),
        role: formData.get("role"),
    });
    if (!validatedResult.success) {
        // Handle validation errors
        const errors = validatedResult.error.formErrors.fieldErrors;
        return { success: false, errors };
    }

    console.log(validatedResult.data);
    const { firstName, lastName, phone, email, jobTitle, role } =
        validatedResult.data;

    // 2. Try creating with details
    const { account, database, users, teams } = await createAdminClient();
    const uid = ID.unique();
    try {
        await account.create(
            uid,
            email,
            "password",
            `${firstName} ${lastName}`
        );
        // console.log("Create acc");
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

    // // 3. If successful in creating team association
    try {
        const teamList = await teams.list();
        for (const team of teamList.teams) {
            if (team.name.toLowerCase().includes(role)) {
                await teams.createMembership(team.$id, [], email, uid);
                // console.log("Team match");
            }
        }
        // console.log(teamList);
    } catch (error) {
        console.error(error);
        users.delete(uid);

        return {
            success: false,
            errors: { email: ["An error occurred. Please try again."] },
        };
    }

    // 4. If that is successful, create the trainer object
    try {
        await database.createDocument(
            process.env.NEXT_PUBLIC_DATABASE_ID,
            process.env.NEXT_PUBLIC_COLLECTION_TRAINERS,
            uid,
            {
                auth_id: uid,
                firstName: firstName,
                lastName: lastName,
                jobTitle: jobTitle,
                phone: phone,
            }
        );
    } catch (error) {
        console.log(error);
        users.delete(uid);
        return {
            success: false,
            errors: {
                email: [error.message],
            },
        };
    }

    // reset the form
    // Reset the form fields
    formData.set("firstName", "");
    formData.set("lastName", "");
    formData.set("phone", "");
    formData.set("email", "");
    formData.set("jobTitle", "");
    formData.set("role", "trainer");
    return {
        success: true,
        errors: {},
        message: `User ${firstName} added successfully!`,
    };
}

export async function registerClient(state, formData) {
    // 1. Validate fields
    const validatedResult = ClientFormSchema.safeParse({
        firstName: formData.get("firstName"),
        lastName: formData.get("lastName"),
        phone: formData.get("phone"),
        email: formData.get("email"),
        trainerId: formData.get("trainerId"),
    });
    if (!validatedResult.success) {
        // Handle validation errors
        const errors = validatedResult.error.formErrors.fieldErrors;
        return { success: false, errors };
    }

    console.log(validatedResult.data);
    const { firstName, lastName, phone, email, trainerId } =
        validatedResult.data;

    // 2. Try creating with details
    const { account, database, users, teams } = await createAdminClient();
    const uid = ID.unique();
    try {
        await account.create(
            uid,
            email,
            "password",
            `${firstName} ${lastName}`
        );
        // console.log("Create acc");
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

    // // 3. If successful in creating team association
    try {
        const teamList = await teams.list();
        for (const team of teamList.teams) {
            if (team.name.toLowerCase().includes("client")) {
                await teams.createMembership(team.$id, [], email, uid);
                // console.log("Team match");
            }
        }
        // console.log(teamList);
    } catch (error) {
        console.error(error);
        users.delete(uid);

        return {
            success: false,
            errors: { email: ["An error occurred. Please try again."] },
        };
    }

    // 4. If that is successful, create the trainer object
    try {
        await database.createDocument(
            process.env.NEXT_PUBLIC_DATABASE_ID,
            process.env.NEXT_PUBLIC_COLLECTION_USERS,
            uid,
            {
                auth_id: uid,
                firstName,
                lastName,
                email,
                phone,
                trainer_id: trainerId,
            }
        );
    } catch (error) {
        console.log(error);
        users.delete(uid);
        return {
            success: false,
            errors: {
                email: [error.message],
            },
        };
    }

    // reset the form
    // Reset the form fields
    formData.set("firstName", "");
    formData.set("lastName", "");
    formData.set("phone", "");
    formData.set("email", "");
    formData.set("jobTitle", "");
    formData.set("role", "trainer");
    return {
        success: true,
        errors: {},
        message: `User ${firstName} added successfully!`,
    };
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
            // role: "admin",
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
            // domain: "enclave.live",
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
            // domain: "enclave.live",
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
            // domain: "enclave.live",
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
        const {
            account,
            database,
            teams: sessTeam,
        } = await createSessionClient(sessionCookie.session);
        const accDetails = await account.get();
        const { teams } = await sessTeam.list();

        const fullDetails = await database.getDocument(
            process.env.NEXT_PUBLIC_DATABASE_ID,
            process.env.NEXT_PUBLIC_COLLECTION_TRAINERS,
            accDetails.$id
        );
        console.log(accDetails);
        console.log(teams[0]);
        console.log(fullDetails);

        const mergedObject = {
            ...accDetails,
            team: teams[0],
            ...fullDetails,
        };
        return mergedObject;
    } catch (error) {
        console.log(error);
        return null;
    }

    return null;
}

export async function resetPassword(state, formData) {
    try {
        const { account } = await createAdminClient();
        const email = formData.get("email");
        // TODO: Change the url
        const result = await account.createRecovery(
            email, // email
            "http://movement-admin.enclave.live/confirm-password" // url
        );

        console.log(result);
    } catch (error) {
        console.log(error);
        return null;
    }
}

export async function updatePassword(state, formData) {
    if (!cookies().has(SESSION_COOKIE_NAME)) {
        return null;
    }
    try {
        const { account } = await createAdminClient();
        const email = formData.get("email");
        // TODO: Change the url
        const result = await account.createRecovery(
            email, // email
            "http://127.0.0.1:3001/confirm-password" // url
        );

        console.log(result);
    } catch (error) {
        console.log(error);
        return null;
    }
}
