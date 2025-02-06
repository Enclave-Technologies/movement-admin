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
    exerciseSchema,
} from "@/server_functions/formSchemas";
import { Query } from "appwrite";
import "server-only";

export async function login(state, formData) {
    // 1. Validate fields
    const validatedResult = LoginFormSchema.safeParse({
        email: formData.get("email"),
        password: formData.get("password"),
    });

    if (!validatedResult.success) {
        // Handle validation errors
        const errors = validatedResult.error.formErrors.fieldErrors;
        return { success: false, errors };
    }
    const { email, password } = validatedResult.data;

    try {
        // 2. Try logging in
        const { account } = await createAdminClient();
        const session = await account.createEmailPasswordSession(
            email,
            password
        );

        const { account: sessAccount, teams: sessTeam } =
            await createSessionClient(session.secret);
        const teamAssociations = (await sessTeam.list()).teams.map(
            (team) => team.name
        );

        if (
            !teamAssociations.some(
                (team) => team === "Admins" || team === "Trainers"
            )
        ) {
            throw new Error("Invalid credentials");
        }

        const acc = await sessAccount.get();
        const sessionData = {
            session: session.secret,
            $id: acc.$id,
            email: acc.email,
            name: acc.name,
            team: teamAssociations,
        };

        cookies().set(SESSION_COOKIE_NAME, JSON.stringify(sessionData), {
            httpOnly: true,
            sameSite: "None",
            secure: true,
            expires: new Date(session.expire),
            path: "/",
        });
    } catch (error) {
        console.error(error);
        if (error.message === "Invalid credentials") {
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

    redirect("/my-clients");
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
    } catch (error) {
        // Ignore errors when deleting the session
    } finally {
        // Delete the session cookie regardless of the outcome
        const cookieOptions = {
            name: SESSION_COOKIE_NAME,
            httpOnly: true,
            sameSite: "None",
            secure: true,
            path: "/",
            // domain: "enclave.live",
        };

        cookies().delete(cookieOptions);
        redirect("/login");
    }
}

export async function register(state, formData) {
    // 1. Validate fields
    const validatedResult = RegisterFormSchema.safeParse({
        firstName: formData.get("firstName"),
        lastName: formData.get("lastName"),
        phone: formData.get("phone"),
        email: formData.get("email"),
        jobTitle: formData.get("jobTitle"),
        role: formData.get("role"),
        gender: formData.get("gender"),
    });

    if (!validatedResult.success) {
        return {
            success: false,
            errors: validatedResult.error.formErrors.fieldErrors,
        };
    }

    const { firstName, lastName, phone, email, jobTitle, role, gender } =
        validatedResult.data;
    const { account, database, users, teams } = await createAdminClient();
    const uid = ID.unique();

    try {
        // 2. Create user account
        await createUserAccount(
            account,
            uid,
            email,
            `${firstName} ${lastName}`
        );

        // 3. Create team association
        await createTeamAssociation(teams, email, uid, role);

        // 4. Create trainer and user documents
        await Promise.all([
            createTrainerDocument(
                database,
                uid,
                firstName,
                lastName,
                jobTitle,
                phone,
                email,
                gender
            ),
            createUserDocument(
                database,
                uid,
                firstName,
                lastName,
                email,
                phone,
                gender
            ),
            createClientTeamAssociation(teams, email, uid),
        ]);
    } catch (error) {
        await handleRegistrationError(users, uid, error);
        return {
            success: false,
            errors: { email: [error.message] },
        };
    }

    return {
        success: true,
        errors: {},
        message: `Trainer ${firstName} added successfully to both trainer list and client list!`,
    };
}

async function createUserAccount(account, uid, email, name) {
    try {
        await account.create(uid, email, "password", name);
    } catch (error) {
        if (
            error instanceof AppwriteException &&
            error.code === 409 &&
            error.type === "user_already_exists"
        ) {
            throw new Error("Email already exists, please login");
        }
        throw error;
    }
}

async function createTeamAssociation(teams, email, uid, role) {
    const teamList = await teams.list();
    for (const team of teamList.teams) {
        if (team.name.toLowerCase().includes(role)) {
            await teams.createMembership(team.$id, [], email, uid);
        }
    }
}

async function createTrainerDocument(
    database,
    uid,
    firstName,
    lastName,
    jobTitle,
    phone,
    email,
    gender
) {
    await database.createDocument(
        process.env.NEXT_PUBLIC_DATABASE_ID,
        process.env.NEXT_PUBLIC_COLLECTION_TRAINERS,
        uid,
        {
            auth_id: uid,
            firstName,
            lastName,
            jobTitle,
            phone,
            email,
            gender,
        }
    );
}

async function createUserDocument(
    database,
    uid,
    firstName,
    lastName,
    email,
    phone,
    gender
) {
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
            trainer_id: uid,
            trainers: uid,
            imageUrl: null,
            gender,
        }
    );
}

async function createClientTeamAssociation(teams, email, uid) {
    const teamList = await teams.list();
    for (const team of teamList.teams) {
        if (team.name.toLowerCase() === "clients") {
            await teams.createMembership(team.$id, [], email, uid);
        }
    }
}

async function handleRegistrationError(users, uid, error) {
    console.error(error);
    await users.delete(uid);
}

export async function registerClient(state, formData) {
    const validatedResult = ClientFormSchema.safeParse({
        firstName: formData.get("firstName"),
        lastName: formData.get("lastName"),
        phone: formData.get("phone"),
        email: formData.get("email"),
        trainerId: formData.get("trainerId"),
        gender: formData.get("gender"),
    });

    if (!validatedResult.success) {
        return {
            success: false,
            errors: validatedResult.error.formErrors.fieldErrors,
        };
    }

    const { firstName, lastName, phone, email, trainerId, gender } =
        validatedResult.data;
    const { account, database, users, teams } = await createAdminClient();
    const uid = ID.unique();

    try {
        // 1. Create user account or handle existing user
        const userExists = await handleExistingUser(
            account,
            database,
            users,
            uid,
            email,
            firstName,
            lastName,
            trainerId,
            gender
        );
        if (userExists) {
            return userExists;
        }

        // 2. Create team association
        await createClientTeamAssociation(teams, email, uid);

        // 3. Create user document
        await createUserDocument(
            database,
            uid,
            firstName,
            lastName,
            email,
            phone,
            trainerId,
            gender
        );
    } catch (error) {
        await handleRegistrationError(users, uid, error);
        return {
            success: false,
            errors: { email: [error.message] },
        };
    }

    return {
        success: true,
        errors: {},
        message: `User ${firstName} added successfully!`,
    };
}

async function handleExistingUser(
    account,
    database,
    users,
    uid,
    email,
    firstName,
    lastName,
    trainerId,
    gender
) {
    try {
        await account.create(
            uid,
            email,
            "password",
            `${firstName} ${lastName}`
        );
    } catch (error) {
        if (
            error instanceof AppwriteException &&
            error.code === 409 &&
            error.type === "user_already_exists"
        ) {
            const userDoc = await database.listDocuments(
                process.env.NEXT_PUBLIC_DATABASE_ID,
                process.env.NEXT_PUBLIC_COLLECTION_USERS,
                [Query.equal("email", [email])]
            );

            const authDoc = await users.list([Query.equal("email", [email])]);

            if (authDoc.total === 1 && userDoc.total === 0) {
                const trainerId = authDoc.users[0].$id;
                await database.createDocument(
                    process.env.NEXT_PUBLIC_DATABASE_ID,
                    process.env.NEXT_PUBLIC_COLLECTION_USERS,
                    trainerId,
                    {
                        auth_id: trainerId,
                        firstName,
                        lastName,
                        email,
                        phone,
                        trainer_id: trainerId,
                        trainers: trainerId,
                        imageUrl: null,
                        gender,
                    }
                );

                await createClientTeamAssociation(teams, email, trainerId);

                return {
                    success: true,
                    errors: {},
                    message: `User ${firstName} added successfully!`,
                };
            }

            return {
                success: false,
                errors: { email: ["Email already exists, please login"] },
            };
        }
        throw error;
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

        const teamAssociations = teams.map((team) => team.name);

        const mergedObject = {
            ...accDetails,
            team: teamAssociations,
            ...fullDetails,
        };
        return mergedObject;
    } catch (error) {
        console.error(error);
        return null;
    }
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
    } catch (error) {
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
    } catch (error) {
        return null;
    }
}

export async function addWorkout(state, formData) {
    for (const [key, value] of formData.entries()) {
    }

    // 1. Validate fields
    const validatedResult = exerciseSchema.safeParse({
        Motion: formData.get("Motion"),
        targetArea: formData.get("targetArea"),
        fullName: formData.get("fullName"),
        shortName: formData.get("shortName"),
        authorization: formData.get("authorization"),
    });

    if (!validatedResult.success) {
        // Handle validation errors
        const errors = validatedResult.error.formErrors.fieldErrors;
        return { success: false, errors };
    }

    const { Motion, targetArea, fullName, shortName, authorization } =
        validatedResult.data;

    // // 2. Try creating with details
    try {
        const cookie = JSON.parse(cookies().get(SESSION_COOKIE_NAME)?.value);

        const { database } = await createSessionClient(cookie?.session);

        const uid = ID.unique();

        const createdDoc = await database.createDocument(
            process.env.NEXT_PUBLIC_DATABASE_ID,
            process.env.NEXT_PUBLIC_COLLECTION_EXERCISES,
            uid,
            {
                motion: Motion,
                targetArea,
                fullName,
                shortName,
                approved: authorization.includes("Admins"),
            }
        );
    } catch (error) {
        // Log the error
        console.error("Error in addWorkout function:", error);

        // Handle different types of errors
        if (error instanceof AppwriteException) {
            return {
                success: false,
                errors: {
                    motion: [
                        `An error occurred while creating the exercise: ${error.response.message}`,
                    ],
                },
            };
        } else if (error instanceof TypeError) {
            return {
                success: false,
                errors: {
                    motion: ["Invalid data format. Please check your input."],
                },
            };
        } else if (error instanceof RangeError) {
            return {
                success: false,
                errors: {
                    motion: [
                        "One or more values are out of the acceptable range.",
                    ],
                },
            };
        } else {
            return {
                success: false,
                errors: {
                    motion: [
                        "An unexpected error occurred. Please try again later.",
                    ],
                },
            };
        }
    }

    return {
        success: true,
        errors: {},
        message: `Exercise ${formData.get("fullName")} added successfully!`,
    };
}
