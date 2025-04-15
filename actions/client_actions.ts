import { Roles, UserRoles, Users } from "@/db/schemas";
import { db } from "@/db/xata";
import { eq } from "drizzle-orm";

export async function userRoleTable() {
    const userRoleData = await db
        .select({
            userId: Users.userId,
            roleName: Roles.roleName,
            approvedByAdmin: UserRoles.approvedByAdmin,
            userName: Users.fullName, // Include Users.name in the output
        })
        .from(UserRoles)
        .innerJoin(Roles, eq(UserRoles.roleId, Roles.roleId))
        .innerJoin(Users, eq(UserRoles.userId, Users.userId)); // Join the Users table
    return userRoleData;
}
