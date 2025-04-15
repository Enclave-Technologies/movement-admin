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

    console.log("[LOGIN] Attempted on email:", email);

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

        // Handle specific error cases
        if (error instanceof AppwriteException) {
            if (error.code === 401) {
                return "Invalid email or password";
            } else if (error.code === 429) {
                return "Too many login attempts. Please try again later.";
            }
        }

        return "Invalid credentials";
    }

    // Get user role to determine where to redirect
    try {
        const user = await account.get();

        // Get user role information
        const userRoleData = await db
            .select({
                roleName: Roles.roleName,
                approvedByAdmin: UserRoles.approvedByAdmin,
            })
            .from(UserRoles)
            .innerJoin(Roles, eq(UserRoles.roleId, Roles.roleId))
            .where(eq(UserRoles.userId, user.$id));

        if (userRoleData.length > 0) {
            const { roleName, approvedByAdmin } = userRoleData[0];

            if (roleName === "Guest" && !approvedByAdmin) {
                redirect("/awaiting-approval");
            } else {
                redirect("/my-clients");
            }
        }
    } catch (error) {
        console.error("Error fetching user role:", error);
    }

    // Default redirect if role check fails
    redirect("/awaiting-approval");
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
