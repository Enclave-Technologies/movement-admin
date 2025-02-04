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
        // Handle validation errors
        const errors = validatedResult.error.formErrors.fieldErrors;
        return { success: false, errors };
    }

    const { firstName, lastName, phone, email, jobTitle, role, gender } =
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

    // 3. If successful in creating team association
    const teamList = await teams.list();
    try {
        for (const team of teamList.teams) {
            if (team.name.toLowerCase().includes(role)) {
                await teams.createMembership(team.$id, [], email, uid);
            }
        }
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
                email: email,
                gender: gender,
            }
        );

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
                gender: gender,
            }
        );
        // Include in clients team too
        for (const team in teamList.teams) {
            if (team.name.toLowerCase() === "clients") {
                await teams.createMembership(team.$id, [], email, uid);
            }
        }
    } catch (error) {
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

    return {
        success: true,
        errors: {},
        message: `Trainer ${firstName} added successfully to both trainer list and client list!`,
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
        gender: formData.get("gender"),
    });
    if (!validatedResult.success) {
        // Handle validation errors
        const errors = validatedResult.error.formErrors.fieldErrors;
        return { success: false, errors };
    }

    const { firstName, lastName, phone, email, trainerId, gender } =
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
    } catch (error) {
        if (
            error instanceof AppwriteException &&
            error.code === 409 &&
            error.type === "user_already_exists"
        ) {
            // Check if user is already a trainer, then just add them to the user list.
            // get user_doc from users table
            const user_doc = await database.listDocuments(
                process.env.NEXT_PUBLIC_DATABASE_ID,
                process.env.NEXT_PUBLIC_COLLECTION_USERS,
                [Query.equal("email", [email])]
            );

            // Get auth doc from auth table
            const auth_doc = await users.list([Query.equal("email", [email])]);

            // Get trainer doc from trainers table
            let trainer_doc = null;
            if (auth_doc.total === 1) {
                try {
                    trainer_doc = await database.getDocument(
                        process.env.NEXT_PUBLIC_DATABASE_ID,
                        process.env.NEXT_PUBLIC_COLLECTION_TRAINERS,
                        auth_doc.users[0].$id
                    );
                } catch (error) {
                    trainer_doc = null;
                }
            }

            // Now check, if trainer_doc and user_doc.total === 0
            // If yes, create user doc, send success
            // else raise email is registered error
            if (trainer_doc && user_doc.total === 0) {
                await database.createDocument(
                    process.env.NEXT_PUBLIC_DATABASE_ID,
                    process.env.NEXT_PUBLIC_COLLECTION_USERS,
                    trainer_doc.$id,
                    {
                        auth_id: trainer_doc.$id,
                        firstName,
                        lastName,
                        email,
                        phone,
                        trainer_id: trainerId,
                        trainers: trainerId,
                        imageUrl: null,
                        gender: gender,
                    }
                );

                const teamList = await teams.list();
                for (const team of teamList.teams) {
                    if (team.name.toLowerCase().includes("client")) {
                        await teams.createMembership(team.$id, [], email, uid);
                    }
                }
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
    }

    // 3. If successful in creating team association
    try {
        const teamList = await teams.list();
        for (const team of teamList.teams) {
            if (team.name.toLowerCase().includes("client")) {
                await teams.createMembership(team.$id, [], email, uid);
            }
        }
    } catch (error) {
        console.error(error);
        users.delete(uid);

        return {
            success: false,
            errors: { email: ["An error occurred. Please try again."] },
        };
    }

    // 4. If that is successful, create the client object
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
                trainers: trainerId,
                gender: gender,
            }
        );
    } catch (error) {
        users.delete(uid);
        return {
            success: false,
            errors: {
                email: [error.message],
            },
        };
    }

    return {
        success: true,
        errors: {},
        message: `User ${firstName} added successfully!`,
    };
}

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
        const teamAssociations = team.teams.map((team) => team.name);

        let hasAdminsOrTrainers = false;
        for (const team of teamAssociations) {
            if (team === "Admins" || team === "Trainers") {
                hasAdminsOrTrainers = true;
                break;
            }
        }

        if (team.total === 0 || !hasAdminsOrTrainers) {
            await sessAccount.deleteSession("current");
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

        const acc = await sessAccount.get();

        const sessionData = {
            session: session.secret,
            $id: acc.$id,
            email: acc.email,
            name: acc.name,
            team: teamAssociations,
            // team.teams[0].name,
        };

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

        // Delete the session cookie with correct attributes
        (await cookies()).delete({
            name: SESSION_COOKIE_NAME,
            httpOnly: true,
            sameSite: "None",
            secure: true,
            path: "/",
            // domain: "enclave.live",
        });

        const cookie_recheck = cookies()?.get(SESSION_COOKIE_NAME)?.value;

        // Redirect to the login page
        redirect("/login");
    } catch (error) {
        // Handle errors by deleting the session cookie and redirecting
        cookies().delete({
            name: SESSION_COOKIE_NAME,
            httpOnly: true,
            sameSite: "None",
            secure: true,
            path: "/",
            // domain: "enclave.live",
        });

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
