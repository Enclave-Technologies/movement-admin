import { Client, Account, Databases, Users, Teams } from "node-appwrite";

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
    };
};

const createSessionClient = async (session: any) => {
    const sessionClient = new Client();

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

    sessionClient
        .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT)
        .setProject(process.env.NEXT_PUBLIC_PROJECT_ID);

    if (session) {
        sessionClient.setSession(session);
    }

    return {
        get account() {
            return new Account(sessionClient);
        },
        get database() {
            return new Databases(sessionClient);
        },
        get users() {
            return new Users(sessionClient);
        },
        get teams() {
            return new Teams(sessionClient);
        },
    };
};

export { createAdminClient, createSessionClient };
