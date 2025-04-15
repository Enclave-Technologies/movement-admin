"use server";
import { createAdminClient, createSessionClient } from "@/appwrite/config";
import {
    LoginFormSchema,
    RegisterFormSchema,
} from "@/form-validators/auth-forms";
import { MOVEMENT_SESSION_NAME } from "@/lib/constants";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AppwriteException, ID } from "node-appwrite";
import { db } from "@/db/xata";
import "server-only";
import {
    InsertUser,
    InsertUserRole,
    Roles,
    UserRoles,
    Users,
} from "@/db/schemas";
import { eq } from "drizzle-orm";

export async function get_user_account() {
    const { account } = await createAdminClient();
    const user = await account.get();
    return user;
}

export async function login(previousState: string, formData: unknown) {
    console.log("[LOGIN] Starting login process");

    // 1. Validate if the input is FormData
    if (!(formData instanceof FormData)) {
        console.error("[LOGIN] Invalid input: Expected FormData");
        throw new Error("Invalid input: Expected FormData");
    }

    // 2. Convert FormData to a plain object for Zod validation
    const formDataObj = Object.fromEntries(formData.entries());
    console.log("[LOGIN] Form data converted to object:", formDataObj);

    // 3. Validate using Zod (throws if invalid)
    const result = LoginFormSchema.safeParse(formDataObj);
    if (!result.success) {
        console.error("[LOGIN] Validation failed:", result.error.message);
        return `Validation failed: ${result.error.message}`;
    }

    // 4. Proceed with validated data
    const { email, password } = result.data;
    console.log("[LOGIN] Validated data - email:", email);

    console.log("[LOGIN] Creating admin client");
    const { account } = await createAdminClient();

    let session;

    try {
        console.log("[LOGIN] Attempting to create email/password session");
        session = await account.createEmailPasswordSession(email, password);
        console.log("[LOGIN] Session created successfully:", session);

        const cookieOptions = {
            httpOnly: true,
            sameSite: "strict" as const,
            secure: process.env.NODE_ENV === "production",
            expires: new Date(session.expire),
            path: "/",
        };
        console.log(
            "[LOGIN] Setting session cookie with options:",
            cookieOptions
        );
        (await cookies()).set(
            MOVEMENT_SESSION_NAME,
            session.secret,
            cookieOptions
        );
        console.log("[LOGIN] Session cookie set successfully");
    } catch (error) {
        console.error("[LOGIN] Error during session creation:", error);

        // Handle specific error cases
        if (error instanceof AppwriteException) {
            console.error(
                `[LOGIN] Appwrite error - code: ${error.code}, message: ${error.message}`
            );
            if (error.code === 401) {
                return "Invalid email or password";
            } else if (error.code === 429) {
                return "Too many login attempts. Please try again later.";
            }
        }

        return "Invalid credentials";
    }

    console.log("[LOGIN] Getting user account details");
    let redirectPath = "/awaiting-approval"; // Default path
    
    try {
        const { account: clientAccount } = await createSessionClient(
            session.secret
        );
        const user = await clientAccount.get();

        console.log("[LOGIN] Fetching user role information >>", user.$id);
        const userRoleData = await db
            .select({
                roleName: Roles.roleName,
                approvedByAdmin: UserRoles.approvedByAdmin,
            })
            .from(UserRoles)
            .innerJoin(Roles, eq(UserRoles.roleId, Roles.roleId))
            .where(eq(UserRoles.userId, user.$id));

        console.log("[LOGIN] User role data:", userRoleData);

        if (userRoleData.length > 0) {
            console.log("[LOGIN] User roles:", userRoleData);

            // Check if user has only Client role
            const isOnlyClient = userRoleData.length === 1 && 
                               userRoleData[0].roleName === "Client";
            if (isOnlyClient) {
                const logoutRedirect = await logout();
                redirectPath = `${logoutRedirect}?error=only_coach_allowed`;
            } else {
                // Check if any role is Guest and not approved
                const isGuestNotApproved = userRoleData.some(
                    role => role.roleName === "Guest" && !role.approvedByAdmin
                );

                if (!isGuestNotApproved) {
                    redirectPath = "/my-clients";
                }
            }
        } else {
            console.log("[LOGIN] No role data found for user");
        }
    } catch (error) {
        console.error("[LOGIN] Error fetching user role:", error);
    }

    console.log(`[LOGIN] Redirecting to ${redirectPath}`);
    redirect(redirectPath);
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
    }
    return "/login";
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
        // Compile all error messages into a single string
        const errorMessage = result.error.issues
            .map((issue) => {
                // const field = issue.path.length > 0 ? `${issue.path[0]}: ` : "";
                return `- ${issue.message}`;
            })
            .join("\n"); // Separate errors by newlines (or use ", " for inline)

        return `Validation failed:\n${errorMessage}`;
    }

    // 4. Proceed with validated data
    const { email, password, fullName } = result.data;
    const { appwrite_user } = await createAdminClient();
    const user_id = ID.unique();

    try {
        await appwrite_user.create(
            user_id, // userId
            email, // email
            // "", // phone (optional)
            undefined,
            password, // password
            fullName // name (optional)
        );
    } catch (error) {
        console.log(error);
        if (error instanceof AppwriteException) {
            if (error.code === 409) {
                return "Email already exists";
            }
        }
        return "Error creating user";
    }

    // 5. create team affiliation
    const guestTeam = await db
        .select({ id: Roles.roleId })
        .from(Roles)
        .where(eq(Roles.roleName, "Guest"));
    const newUserRole: InsertUserRole = {
        roleId: guestTeam[0].id,
        userId: user_id,
        approvedByAdmin: false,
    };
    const newPerson: InsertUser = {
        fullName: fullName,
        appwrite_id: user_id,
        userId: user_id,
        email: email,
        registrationDate: new Date(),
    };
    try {
        await db.transaction(async (tx) => {
            // Insert user/person
            await tx.insert(Users).values(newPerson);
            // Insert user role
            await tx.insert(UserRoles).values(newUserRole);
        });
    } catch (error) {
        console.error("Transaction failed:", error);

        await appwrite_user.delete(user_id); // Clean up by deleting the user

        // You can add more specific error handling here if needed
        return error instanceof Error
            ? error.message
            : "Unknown error occurred";
    }

    return "success";
}
