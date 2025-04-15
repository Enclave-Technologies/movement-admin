import { authenticated_or_login } from "@/actions/appwrite_actions";
import { LogoutButton } from "@/components/auth/logout-button";
import { checkGuestApproval } from "@/lib/auth-utils";
import { MOVEMENT_SESSION_NAME } from "@/lib/constants";
import { cookies } from "next/headers";
import React from "react";
import { redirect } from "next/navigation";
import { userRoleTable } from "@/actions/client_actions";

export default async function MyClients() {
    // Check if user is a Guest and not approved
    await checkGuestApproval();

    const session = (await cookies()).get(MOVEMENT_SESSION_NAME)?.value || null;

    const result = await authenticated_or_login(session);

    if (result && "error" in result) {
        console.error("Error in MyClients:", result.error);
        redirect("/login?error=user_fetch_error");
    }

    if (!result || (!("error" in result) && !result)) {
        redirect("/login");
    }

    const userRolesData = await userRoleTable();

    return (
        <div>
            MyClients - <br />
            <div className="rounded-md border">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    {Object.keys(userRolesData[0]).map((key) => (
                      <th key={key} className="p-4 text-left">{key}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {userRolesData.map((row, i) => (
                    <tr key={i} className="border-b">
                      {Object.values(row).map((value, j) => (
                        <td key={j} className="p-4">{String(value)}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <LogoutButton />
        </div>
    );
}
