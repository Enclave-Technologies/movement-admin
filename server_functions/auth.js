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
    console.log(`[login] Attempting login for user: ${email}`); // Removed log

    try {
        // 2. Try logging in
        // console.log("[login] Creating admin client..."); // Removed log
        const { account } = await createAdminClient();
        // console.log("[login] Calling createEmailPasswordSession..."); // Removed log
        const session = await account.createEmailPasswordSession(
            email,
            password
        );
        // Appwrite SDK automatically handles setting the session cookie upon successful session creation.
        // We still need to verify the user belongs to the correct team.

        // console.log("[login] Session created successfully:", session.$id); // Removed log

        // Team check logic removed from here. Middleware handles redirection.
        // Protected routes will verify session validity via getCurrentUser on load.
        // If specific team checks are needed post-login, they should occur
        // in middleware or on the target page after redirect.

        // Manually set the session cookie as required by the Node SDK
        console.log("[login] Preparing session data for cookie...");
        // We need user details for the cookie, but can't use createSessionClient yet.
        // Let's use the admin client temporarily ONLY to get user details for the cookie.
        // This is not ideal, but necessary if the cookie needs user details beyond the secret.
        // Alternatively, simplify the cookie to ONLY store the secret.
        // Sticking with the current cookie structure for compatibility with Python backend:
        const { users: adminUsers } = await createAdminClient(); // Use admin client to find user ID
        const userList = await adminUsers.list([Query.equal("email", [email])]);
        if (userList.total === 0) {
            // Keep this error log
            console.error(
                `[login] Could not find user ${email} right after creating session. This should not happen.`
            );
            // Delete the session we just created as something is wrong
            const { account: tempAccount } = await createSessionClient(); // Create client with the new (but not yet set in headers) secret
            tempAccount.client.setSession(session.secret); // Manually set session for deletion
            await tempAccount.deleteSession("current");
            throw new Error("User inconsistency after session creation.");
        }
        const user = userList.users[0];
        const userMemberships = await adminUsers.listMemberships(user.$id);
        const teamNames = userMemberships.memberships.map((m) => m.teamName);

        // Check teams using admin client results BEFORE setting cookie
        if (
            !teamNames.some((name) => name === "Admins" || name === "Trainers")
        ) {
            // Keep this warning
            console.warn(
                `[login] User ${email} not in required teams (Admins/Trainers) based on admin check. Aborting login.`
            );
            // Delete the session we just created
            const { account: tempAccount } = await createSessionClient(); // Create client
            tempAccount.client.setSession(session.secret); // Manually set session for deletion
            await tempAccount.deleteSession("current");
            throw new Error("Invalid credentials");
        }
        // console.log("[login] User team check passed (admin check)."); // Removed log

        // console.log("[login] Account details fetched via admin:", user.$id); // Removed log
        const sessionData = {
            session: session.secret, // The crucial part for auth
            $id: user.$id,
            email: user.email,
            name: user.name,
            team: teamNames, // Store team names from admin check
        };

        const isDevelopment = process.env.NODE_ENV === "development";
        const cookieOptions = {
            httpOnly: true,
            sameSite: isDevelopment ? "Lax" : "None", // Use Lax for dev, None for prod
            secure: !isDevelopment, // Secure should be false in dev (HTTP), true in prod (HTTPS)
            expires: new Date(session.expire),
            path: "/",
            // Set domain only in production for cross-subdomain compatibility if needed
            domain: isDevelopment
                ? undefined
                : process.env.COOKIE_DOMAIN || undefined, // Use an env var for domain
        };
        // console.log("[login] Cookie options:", cookieOptions); // Removed log

        cookies().set(
            SESSION_COOKIE_NAME,
            JSON.stringify(sessionData),
            cookieOptions
        );
        // console.log("[login] Session cookie set successfully."); // Removed log
    } catch (error) {
        // Keep this error log
        console.error("[login] Login failed:", error);
        // Ensure consistent error message for invalid credentials/permissions
        if (
            error.message === "Invalid credentials" ||
            (error instanceof AppwriteException &&
                (error.code === 401 || error.code === 403))
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
        // Create a session client from the cookies managed by Appwrite SDK
        const { account } = await createSessionClient(); // Assumes createSessionClient can read SDK cookies
        await account.deleteSession("current");
        // Appwrite SDK should handle cookie deletion on successful session deletion.
    } catch (error) {
        // Keep this error log
        console.error("Logout error:", error);
    } finally {
        // Manually delete the session cookie regardless of SDK success/failure
        const isDevelopment = process.env.NODE_ENV === "development";
        // Ensure domain calculation EXACTLY matches the login function
        const domain = isDevelopment
            ? undefined
            : process.env.COOKIE_DOMAIN || undefined;
        const secure = !isDevelopment;

        // console.log(`[logout] Attempting to delete cookie ${SESSION_COOKIE_NAME} with options:`, { path: "/", domain, secure }); // Removed log

        cookies().delete(SESSION_COOKIE_NAME, {
            path: "/",
            domain: domain,
            secure: secure,
            httpOnly: true, // Also good practice to include httpOnly if it was set
            sameSite: isDevelopment ? "Lax" : "None", // Match sameSite used during set
        });
        // console.log(`[logout] Cookie delete call executed for ${SESSION_COOKIE_NAME}.`); // Removed log

        // Redirect to login page after attempting logout and deleting cookie
        redirect("/login");
    }
}

export async function registerCoach(state, formData) {
    let processedDateOfBirth;
    if (formData.get("dateOfBirth")) {
        // Try converting the value to a Date object
        const dob = new Date(formData.get("dateOfBirth"));

        if (!isNaN(dob.getTime())) {
            // Check if it's a valid date
            processedDateOfBirth = dob;
        } else {
            console.error(`Invalid dateOfBirth: ${dateOfBirthString}`);
            processedDateOfBirth = undefined; // or handle as needed
        }
    } else {
        processedDateOfBirth = undefined; // Optional field handling
    }
    // 1. Validate fields
    const validatedResult = RegisterFormSchema.safeParse({
        firstName: formData.get("firstName"),
        lastName: formData.get("lastName"),
        phone: formData.get("phone"),
        email: formData.get("email"),
        jobTitle: formData.get("jobTitle"),
        role: formData.get("role"),
        gender: formData.get("gender"),
        dob: processedDateOfBirth,
    });

    if (!validatedResult.success) {
        return {
            success: false,
            errors: validatedResult.error.formErrors.fieldErrors,
        };
    }

    const { firstName, lastName, phone, email, jobTitle, role, gender, dob } =
        validatedResult.data;
    const { account, database, users, teams } = await createAdminClient();

    try {
        // Check if user already exists in auth table
        const existingUser = await checkExistingUser(users, email);

        if (existingUser) {
            // User exists, check their team memberships
            const userTeams = await getUserTeams(users, existingUser.$id);

            // console.log("Is only client? ", isOnlyClientMember(userTeams));

            if (isOnlyClientMember(userTeams)) {
                // User is only a client, add them as a trainer
                await addExistingUserAsTrainer(
                    database,
                    teams,
                    existingUser,
                    firstName,
                    lastName,
                    jobTitle,
                    phone,
                    gender,
                    role,
                    dob
                );
                return {
                    success: true,
                    errors: {},
                    message: `Existing user ${firstName} added successfully as a trainer!`,
                };
            } else {
                // User is already a staff member or admin
                return {
                    success: false,
                    errors: {
                        email: [
                            "User is already registered as staff or admin.",
                        ],
                    },
                };
            }
        } else {
            // New user, proceed with full registration
            const uid = ID.unique();
            await createNewTrainer(
                account,
                database,
                teams,
                uid,
                firstName,
                lastName,
                email,
                phone,
                jobTitle,
                gender,
                role,
                dob
            );
            return {
                success: true,
                errors: {},
                message: `Trainer ${firstName} added successfully!`,
            };
        }
    } catch (error) {
        console.error(error);
        return {
            success: false,
            errors: { email: [error.message] },
        };
    }
}

export async function registerClient(state, formData) {
    let processedIdealWeight;
    let processedDateOfBirth;

    if (formData.get("idealWeight")) {
        // Try converting the value to a number
        const weightNumber = Number(formData.get("idealWeight"));

        if (!isNaN(weightNumber)) {
            processedIdealWeight = weightNumber;
        } else {
            console.error(`Invalid idealWeight: ${idealWeight}`);
            processedIdealWeight = undefined; // or handle as needed
        }
    } else {
        processedIdealWeight = undefined; // Optional field handling
    }
    if (formData.get("dateOfBirth")) {
        // Try converting the value to a Date object
        const dob = new Date(formData.get("dateOfBirth"));

        if (!isNaN(dob.getTime())) {
            // Check if it's a valid date
            processedDateOfBirth = dob;
        } else {
            console.error(`Invalid dateOfBirth: ${dateOfBirthString}`);
            processedDateOfBirth = undefined; // or handle as needed
        }
    } else {
        processedDateOfBirth = undefined; // Optional field handling
    }

    const validatedResult = ClientFormSchema.safeParse({
        firstName: formData.get("firstName"),
        lastName: formData.get("lastName"),
        phone: formData.get("phone"),
        email: formData.get("email"),
        trainerId: formData.get("trainerId"),
        gender: formData.get("gender"),
        idealWeight: processedIdealWeight,
        dob: processedDateOfBirth,
    });

    if (!validatedResult.success) {
        return {
            success: false,
            errors: validatedResult.error.formErrors.fieldErrors,
        };
    }

    const {
        firstName,
        lastName,
        phone,
        email,
        trainerId,
        gender,
        idealWeight,
        dob,
    } = validatedResult.data;
    const { account, database, users, teams } = await createAdminClient();

    try {
        // Check if user already exists in auth table
        const existingUser = await checkExistingUser(users, email);

        if (existingUser) {
            // User exists, check their team memberships
            const userTeams = await getUserTeams(users, existingUser.$id);

            if (isOnlyCoachMember(userTeams)) {
                // User is only a coach, add them as a client

                await addExistingUserAsClient(
                    database,
                    teams,
                    existingUser,
                    firstName,
                    lastName,
                    phone,
                    trainerId,
                    gender,
                    idealWeight,
                    dob
                );
                return {
                    success: true,
                    errors: {},
                    message: `Existing coach ${firstName} added successfully as a client!`,
                };
            } else if (userTeams.includes("clients")) {
                // User is already a client
                return {
                    success: false,
                    errors: {
                        email: ["User is already registered as a client."],
                    },
                };
            }
        }

        // New user or coach being added as client, proceed with full registration
        const uid = existingUser ? existingUser.$id : ID.unique();
        await createNewClient(
            account,
            database,
            teams,
            uid,
            firstName,
            lastName,
            email,
            phone,
            trainerId,
            gender,
            idealWeight,
            existingUser,
            dob
        );

        return {
            success: true,
            errors: {},
            message: `Client ${firstName} added successfully!`,
        };
    } catch (error) {
        console.error(error);
        return {
            success: false,
            errors: { email: [error.message] },
        };
    }
}

async function checkExistingUser(users, email) {
    const existingUsers = await users.list([Query.equal("email", [email])]);
    return existingUsers.total > 0 ? existingUsers.users[0] : null;
}

async function getUserTeams(users, userId) {
    const memberships = await users.listMemberships(userId);

    if (memberships.total > 0) {
        return memberships.memberships.map((membership) => membership.teamName);
    }
    return [];
}

function isOnlyClientMember(userTeams) {
    // Assuming 'clients' is the teamName of the clients team
    return userTeams.length === 1 && userTeams[0].toLowerCase() === "clients";
}

function isOnlyCoachMember(userTeams) {
    // Check if 'clients' is not in the userTeams array
    return !userTeams.some((team) => team.toLowerCase() === "clients");
}

async function addExistingUserAsTrainer(
    database,
    teams,
    user,
    firstName,
    lastName,
    jobTitle,
    phone,
    gender,

    role,
    dob
) {
    // Add user to trainers collection
    await createTrainerDocument(
        database,
        user.$id,
        firstName,
        lastName,
        jobTitle,
        phone,
        user.email,
        gender,
        dob
    );

    // Add user to appropriate team based on role
    await createTeamAssociation(teams, user.email, user.$id, role);
}

async function addExistingUserAsClient(
    database,
    teams,
    user,
    firstName,
    lastName,
    phone,
    trainerId,
    gender,
    idealWeight,
    dob
) {
    // Add user to users collection
    await createUserDocument(
        database,
        user.$id,
        firstName,
        lastName,
        user.email,
        phone,
        trainerId,
        gender,
        idealWeight,
        dob
    );

    // Add user to clients team
    await createClientTeamAssociation(teams, user.email, user.$id);
}

async function createNewTrainer(
    account,
    database,
    teams,
    uid,
    firstName,
    lastName,
    email,
    phone,
    jobTitle,
    gender,
    role,
    dob
) {
    // Create user account
    await createUserAccount(account, uid, email, `${firstName} ${lastName}`);

    // Create team associations
    await createTeamAssociation(teams, email, uid, role);
    await createClientTeamAssociation(teams, email, uid);

    // Create trainer and user documents
    await Promise.all([
        createTrainerDocument(
            database,
            uid,
            firstName,
            lastName,
            jobTitle,
            phone,
            email,
            gender,
            dob
        ),
        createUserDocument(
            database,
            uid,
            firstName,
            lastName,
            email,
            phone,
            uid,
            gender,
            0,
            dob
        ),
    ]);
}

async function createNewClient(
    account,
    database,
    teams,
    uid,
    firstName,
    lastName,
    email,
    phone,
    trainerId,
    gender,
    idealWeight,
    existingUser,
    dob
) {
    if (!existingUser) {
        // Create user account if it doesn't exist
        await createUserAccount(
            account,
            uid,
            email,
            `${firstName} ${lastName}`
        );
    }

    // Create client team association
    await createClientTeamAssociation(teams, email, uid);

    // Create user document
    await createUserDocument(
        database,
        uid,
        firstName,
        lastName,
        email,
        phone,
        trainerId,
        gender,
        idealWeight,
        dob
    );
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
            throw new Error("User already exists!");
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
    gender,
    dob
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
            dob,
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
    trainerId,
    gender,
    idealWeight,
    dob
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
            trainer_id: trainerId,
            trainers: trainerId,
            imageUrl: null,
            gender,
            idealWeight,
            dob,
        }
    );
}

async function createClientTeamAssociation(teams, email, uid) {
    // const teamList = await teams.list();
    // for (const team of teamList.teams) {
    //     if (team.name.toLowerCase() === "clients") {
    //         await teams.createMembership(team.$id, [], email, uid);
    //     }
    // }
    await createTeamAssociation(teams, email, uid, "clients");
}

export async function getCurrentUser() {
    // console.log("[getCurrentUser] Attempting to get current user..."); // Removed log
    try {
        // Create a session client. createSessionClient reads the cookie internally.
        // console.log("[getCurrentUser] Creating session client..."); // Removed log
        const { account } = await createSessionClient(); // Call without arguments
        // console.log("[getCurrentUser] Calling account.get()..."); // Removed log
        const user = await account.get();
        // console.log("[getCurrentUser] User found:", user.$id); // Removed log
        return user;
    } catch (error) {
        // console.log("[getCurrentUser] Failed to get user."); // Removed log
        // If account.get() fails (e.g., invalid session), return null.
        // AppwriteException typically means no valid session.
        if (error instanceof AppwriteException) {
            // Keep detailed error log for AppwriteExceptions
            // Log more details from the AppwriteException
            console.log(
                `[getCurrentUser] AppwriteException: Code: ${error.code}, Type: ${error.type}, Message: ${error.message}`
            );
        } else {
            // Keep detailed error log for unexpected errors
            console.error("[getCurrentUser] Unexpected error:", error);
        }
        return null;
    }
}

export async function fetchUserDetails() {
    // No need to check cookies().has() here, createSessionClient handles it
    try {
        // createSessionClient now reads the cookie internally
        // console.log("[fetchUserDetails] Creating session client..."); // Removed log
        const {
            account,
            database,
            teams: sessTeam,
        } = await createSessionClient(); // Call without arguments
        // console.log("[fetchUserDetails] Verifying session with account.get()..."); // Removed log
        // Check if account.get() succeeds (verifies session)
        const accDetails = await account.get();
        // console.log("[fetchUserDetails] Session verified for user:", accDetails.$id); // Removed log

        // If account.get() succeeded, proceed to fetch other details
        const { teams } = await sessTeam.list();

        const fullDetails = await database.getDocument(
            process.env.NEXT_PUBLIC_DATABASE_ID,
            process.env.NEXT_PUBLIC_COLLECTION_USERS, // Fetch from USERS collection now
            accDetails.$id
        );

        const teamAssociations = teams.map((team) => team.name); // Keep team info

        const mergedObject = {
            ...accDetails,
            team: teamAssociations,
            ...fullDetails,
        };
        // console.log("[fetchUserDetails] Successfully fetched user details for:", accDetails.$id); // Removed log
        return mergedObject;
    } catch (error) {
        // Keep this error log
        console.error(
            "[fetchUserDetails] Failed to fetch user details:",
            error
        );
        if (error instanceof AppwriteException) {
            // Keep this specific log
            console.log(
                "[fetchUserDetails] AppwriteException: Likely invalid/expired session. Code:",
                error.code,
                "Type:",
                error.type
            );
        }
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
        shortName: "", // formData.get("shortName"),
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

        // This function relies on being called within a request context where
        // createSessionClient() can successfully read the session cookie set previously.
        // console.log("[addWorkout] Attempting to add workout..."); // Removed log
        const { database, account } = await createSessionClient(); // Corrected: No arguments

        // Verify session is still valid before proceeding
        try {
            await account.get(); // Throws error if session is invalid
            // console.log("[addWorkout] Session verified."); // Removed log
        } catch (sessionError) {
            // Keep this error log
            console.error("[addWorkout] Invalid session:", sessionError);
            // Handle invalid session, maybe return an error state
            return {
                success: false,
                errors: { motion: ["Invalid session. Please log in again."] },
            };
        }

        const uid = ID.unique();

        const hierarchyDoc = await database.listDocuments(
            process.env.NEXT_PUBLIC_DATABASE_ID,
            process.env.NEXT_PUBLIC_COLLECTION_EXERCISE_HIERARCHY,
            [
                Query.equal("targetArea", targetArea),
                Query.equal("motion", Motion),
            ]
        );

        const hierarchyId = hierarchyDoc.documents.$id;

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
                exerciseHierarchy: hierarchyId,
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
