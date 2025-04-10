import { Client, Account, Databases, Users, Teams } from "node-appwrite";
import { cookies } from "next/headers"; // Import cookies
import { SESSION_COOKIE_NAME } from "./constants"; // Import cookie name

const createAdminClient = async () => {
    const adminClient = new Client();

    if (!process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT) {
        throw new Error(
            "Environment variable NEXT_PUBLIC_APPWRITE_ENDPOINT is not defined"
        );
    }

    if (!process.env.NEXT_PUBLIC_PROJECT_ID) {
        throw new Error(
            "Environment variable NEXT_PUBLIC_PROJECT_ID is not defined"
        );
    }

    if (!process.env.NEXT_PUBLIC_APPWRITE_AUTH_API) {
        throw new Error(
            "Environment variable NEXT_PUBLIC_APPWRITE_AUTH_API is not defined"
        );
    }

    adminClient
        .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
        .setProject(process.env.NEXT_PUBLIC_PROJECT_ID) // Your project ID
        .setKey(process.env.NEXT_PUBLIC_APPWRITE_AUTH_API);
    return {
        get account() {
            return new Account(adminClient);
        },
        get database() {
            return new Databases(adminClient);
        },
        get users() {
            return new Users(adminClient);
        },
        get teams() {
            return new Teams(adminClient);
        },
    };
};

// Updated createSessionClient to read cookie directly
const createSessionClient = async () => {
    const client = new Client()
        .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!) // Added non-null assertion
        .setProject(process.env.NEXT_PUBLIC_PROJECT_ID!); // Added non-null assertion

    // Check for environment variables (optional but good practice)
    if (
        !process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT ||
        !process.env.NEXT_PUBLIC_PROJECT_ID
    ) {
        throw new Error(
            "Appwrite endpoint or project ID environment variables are not set."
         );
     }

    // console.log("[createSessionClient] Attempting to create session client..."); // Removed log
     try {
         const sessionCookie = cookies().get(SESSION_COOKIE_NAME);

         if (!sessionCookie || !sessionCookie.value) {
             // No session cookie found, client remains unauthenticated
            // console.log("[createSessionClient] No session cookie found."); // Removed log
             // Depending on use case, you might throw an error or just return the unauthenticated client
             // throw new Error("No session cookie found");
         } else {
            // console.log("[createSessionClient] Session cookie found. Attempting to parse and set session."); // Removed log
             // Attempt to parse the cookie value if it's stored as JSON
             try {
                 const sessionData = JSON.parse(sessionCookie.value);
                 // Assuming the actual session secret is stored in a 'session' property
                 if (sessionData && sessionData.session) {
                     client.setSession(sessionData.session);
                    // console.log("[createSessionClient] Session set successfully from parsed cookie JSON."); // Removed log
                 } else {
                     // Keep this warning as it indicates a potential issue
                     console.warn(
                         "[createSessionClient] Session cookie found but structure is unexpected or missing 'session' property. Cookie value:",
                        sessionCookie.value
                    );
                    // Handle cases where the cookie exists but doesn't contain the expected structure
                }
            } catch (parseError) {
                // If parsing fails, maybe the cookie value itself is the session? (Less likely based on original code)
                 // Keep this warning
                 console.warn(
                     "[createSessionClient] Failed to parse session cookie JSON, attempting to use raw value.",
                     parseError
                 );
                 try {
                     client.setSession(sessionCookie.value); // Fallback: try using the raw value
                    // console.log("[createSessionClient] Session set successfully using raw cookie value."); // Removed log
                 } catch (setSessionError) {
                     // Keep this error log
                     console.error(
                         "[createSessionClient] Failed to set session using raw cookie value:",
                        setSessionError
                    );
                }
            }
        }
    } catch (error) {
         // Handle potential errors from cookies() itself, though unlikely in standard usage
         // Keep this error log
         console.error(
             "[createSessionClient] Error accessing or processing session cookie:",
             error
         );
        // Decide how to handle this - throw or return unauthenticated client
        // throw new Error("Failed to access session cookie");
    }

    return {
        get account() {
            return new Account(client); // Use the potentially authenticated client
        },
        get database() {
            return new Databases(client); // Use the potentially authenticated client
        },
        get users() {
            return new Users(client); // Use the potentially authenticated client
        },
        get teams() {
            return new Teams(client); // Use the potentially authenticated client
        },
    };
};

export { createAdminClient, createSessionClient };
