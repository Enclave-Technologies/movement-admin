"use server";
import { createSessionClient } from "@/appwrite/config";
import { Roles, UserRoles, Users } from "@/db/schemas";
import { db } from "@/db/xata";
import { defaultProfileURL, MOVEMENT_SESSION_NAME } from "@/lib/constants";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
// import { redirect } from "next/navigation";
import "server-only";

export async function get_logged_in_user() {
    const session = (await cookies()).get(MOVEMENT_SESSION_NAME)?.value || null;
    if (session) {
        let user;
        try {
            let account;
            try {
                const sessionClient = await createSessionClient(session);
                account = sessionClient.account;
            } catch (err) {
                console.error("Error creating session client:", err);
                // throw err;
                return null;
            }

            try {
                user = await account.get();
            } catch (err) {
                console.error("Error getting account data:", err);
                // If we get an AppwriteException about missing scope, it means the user isn't properly authenticated
                // or doesn't have the right permissions
                return null;
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
            // (await cookies()).delete(MOVEMENT_SESSION_NAME);
            // redirect("/login?error=session_expired");
            return null;
        }

        // Get user data with role information
        const db_user = await db
            .select({
                id: Users.userId,
                name: Users.fullName,
                email: Users.email,
                avatar: Users.imageUrl,
            })
            .from(Users)
            .where(eq(Users.userId, user.$id));

        // Get user role information
        const userRoleData = await db
            .select({
                roleId: UserRoles.roleId,
                roleName: Roles.roleName,
                approvedByAdmin: UserRoles.approvedByAdmin,
            })
            .from(UserRoles)
            .innerJoin(Roles, eq(UserRoles.roleId, Roles.roleId))
            .where(eq(UserRoles.userId, user.$id));

        const modified_user = db_user.map((user) => ({
            ...user,
            email: user.email || "No email provided", // Provide a default value if email is missing
            avatar: user.avatar || defaultProfileURL, // Use a placeholder or dummy URL
            role: userRoleData.length > 0 ? userRoleData[0].roleName : null,
            approvedByAdmin:
                userRoleData.length > 0
                    ? userRoleData[0].approvedByAdmin
                    : false,
        }));

        return modified_user[0];
    } else {
        // redirect("/login");
        return null;
    }
}
