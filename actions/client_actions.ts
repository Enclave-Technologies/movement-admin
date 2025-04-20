"use server";

import {
    Roles,
    UserRoles,
    Users,
    TrainerClients,
    Exercises,
} from "@/db/schemas";
import { db } from "@/db/xata";
import { eq, and, desc, sql } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import "server-only";

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

/**
 * Returns all users (clients) managed by the given trainer appwrite_id.
 * @param trainerAppwriteId - The appwrite_id of the trainer
 * @returns Array of Users being managed by this trainer
 */
export async function getClientsManagedByUser(trainerAppwriteId: string) {
    console.log(`Fetching all clients for trainer: ${trainerAppwriteId}`);

    // First, get the trainer's name
    const trainerResult = await db
        .select({
            fullName: Users.fullName,
        })
        .from(Users)
        .where(eq(Users.userId, trainerAppwriteId))
        .limit(1);

    const trainerName = trainerResult[0]?.fullName || "Unknown Trainer";

    // Then get the clients
    const clients = await db
        .select({
            userId: Users.userId,
            fullName: Users.fullName,
            email: Users.email,
            registrationDate: Users.registrationDate,
            notes: Users.notes,
            phone: Users.phone,
            imageUrl: Users.imageUrl,
            gender: Users.gender,
            idealWeight: Users.idealWeight,
            dob: Users.dob,
            // Calculate age in JavaScript after fetching
            relationshipId: TrainerClients.relationshipId,
            assignedDate: TrainerClients.assignedDate,
        })
        .from(TrainerClients)
        .innerJoin(Users, eq(TrainerClients.clientId, Users.userId))
        .where(
            and(
                eq(TrainerClients.trainerId, trainerAppwriteId),
                eq(TrainerClients.isActive, true)
            )
        )
        .orderBy(desc(TrainerClients.assignedDate));

    // Add age and trainerName to each client
    const clientsWithAge = clients.map((client) => {
        // Calculate age from dob if available
        let age = null;
        if (client.dob) {
            const today = new Date();
            const birthDate = new Date(client.dob);
            age = today.getFullYear() - birthDate.getFullYear();
            const m = today.getMonth() - birthDate.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
        }

        return {
            ...client,
            age,
            trainerName,
        };
    });

    console.log("Found clients:", clientsWithAge.length);
    // console.log("Sample client data:", clientsWithAge[0] || "No clients found");
    return clientsWithAge;
}

/**
 * Returns paginated users (clients) managed by the given trainer appwrite_id.
 * @param trainerAppwriteId - The appwrite_id of the trainer
 * @param params - Object containing pagination, sorting, and filtering parameters
 *                 OR page number (0-based) for backward compatibility
 * @param pageSize - Number of items per page (used only if first param is a number)
 * @returns Object containing clients array and pagination info
 */
export async function getClientsManagedByUserPaginated(
    trainerAppwriteId: string,
    params: Record<string, unknown> | number = 0,
    pageSize: number = 10
) {
    // Handle both new params object and old separate parameters
    let page = 0;
    let size = pageSize;
    let filters: Record<string, unknown> = {};
    let sorting: Array<{ id: string; desc: boolean }> = [];
    let search: string | undefined;
    let parsedFilters: Array<{ id: string; value: unknown }> = [];

    // Ensure trainerAppwriteId is a string
    if (typeof trainerAppwriteId !== 'string') {
        console.error('Invalid trainerAppwriteId:', trainerAppwriteId);
        throw new Error('trainerAppwriteId must be a string');
    }

    console.log(
        `Received params for trainer ${trainerAppwriteId}:`,
        JSON.stringify(params, null, 2)
    );

    if (typeof params === "object") {
        // Extract pagination parameters from params
        page =
            typeof params.pageIndex === "number"
                ? params.pageIndex
                : typeof params.pageIndex === "string"
                ? parseInt(params.pageIndex, 10)
                : 0;

        size =
            typeof params.pageSize === "number"
                ? params.pageSize
                : typeof params.pageSize === "string"
                ? parseInt(params.pageSize, 10)
                : 10;

        // Extract sorting from params
        if (params.sorting && typeof params.sorting === "string") {
            try {
                sorting = JSON.parse(params.sorting as string);
            } catch (e) {
                console.error("Error parsing sorting parameter:", e);
            }
        }

        // Extract search from params
        search = typeof params.search === "string" ? params.search : undefined;

        // Extract filters from params
        if (params.filters && typeof params.filters === "string") {
            try {
                parsedFilters = JSON.parse(params.filters as string);
                console.log("Parsed filters:", parsedFilters);
            } catch (e) {
                console.error("Error parsing filters parameter:", e);
            }
        }

        // Keep all other params for potential filtering
        filters = { ...params };
        // Remove extracted pagination params to avoid duplication
        delete filters.pageIndex;
        delete filters.pageSize;
        delete filters.sorting;
        delete filters.search;
        delete filters.filters;
    } else {
        // Old style: separate parameters
        page = params;
    }

    console.log(
        `Fetching paginated clients for trainer: ${trainerAppwriteId}, page: ${page}, pageSize: ${size}`
    );
    if (sorting.length > 0) {
        console.log(`Sorting:`, sorting);
    }
    if (search) {
        console.log(`Search query:`, search);
    }
    if (Object.keys(filters).length > 0) {
        console.log(`Additional filters:`, filters);
    }

    const Trainer = alias(Users, "trainer");
    const Client = alias(Users, "client");

    // Build where conditions
    const baseConditions = [
        eq(TrainerClients.trainerId, trainerAppwriteId),
        eq(TrainerClients.isActive, true),
    ];

    // Define allowed filter columns
    const ALLOWED_FILTER_COLUMNS = new Set([
        "fullName", "email", "phone", "gender"
    ]);

    // Add filter conditions
    const filterConditions = parsedFilters
        .map((filter: { id: string; value: unknown }) => {
            const { id, value } = filter;
            
            // Skip filters for columns that are not in the allowed list
            if (!ALLOWED_FILTER_COLUMNS.has(id)) {
                console.warn(`Unsupported filter column: ${id}`);
                return undefined;
            }
            
            switch (id) {
                case "fullName":
                    return sql`${Client.fullName} ILIKE ${`%${String(value)}%`}`;
                case "email":
                    return sql`${Client.email} ILIKE ${`%${String(value)}%`}`;
                case "phone":
                    return sql`${Client.phone} ILIKE ${`%${String(value)}%`}`;
                case "gender":
                    // Handle gender as enum with specific allowed values
                    const genderValue = String(value).toUpperCase();
                    if (genderValue === "M" || genderValue === "MALE") {
                        return eq(Client.gender, "male");
                    } else if (
                        genderValue === "F" ||
                        genderValue === "FEMALE"
                    ) {
                        return eq(Client.gender, "female");
                    } else if (
                        genderValue === "NB" ||
                        genderValue === "NON-BINARY"
                    ) {
                        return eq(Client.gender, "non-binary");
                    } else {
                        return eq(Client.gender, "prefer-not-to-say");
                    }
                default:
                    console.warn(`Unsupported filter column: ${id}`);
                    return undefined;
            }
        })
        .filter(Boolean);

    // Add search condition if provided
    let searchCondition;
    if (search) {
        const searchLike = `%${search}%`;
        searchCondition = sql`(
            ${Client.fullName} ILIKE ${searchLike} OR
            ${Client.email} ILIKE ${searchLike} OR
            ${Client.phone} ILIKE ${searchLike}
        )`;
    }

    // Combine all conditions
    const whereConditions = [
        ...baseConditions,
        ...filterConditions,
        ...(searchCondition ? [searchCondition] : []),
    ];

    // Build order by
    let orderByColumns = [desc(TrainerClients.assignedDate)]; // Default sorting

    if (sorting.length > 0) {
        orderByColumns = sorting.map((sort) => {
            const { id, desc: isDesc } = sort;
            switch (id) {
                case "email":
                    return isDesc
                        ? desc(Client.email)
                        : sql`${Client.email} asc`;
                case "fullName":
                    return isDesc
                        ? desc(Client.fullName)
                        : sql`${Client.fullName} asc`;
                case "registrationDate":
                    return isDesc
                        ? desc(Client.registrationDate)
                        : sql`${Client.registrationDate} asc`;
                case "phone":
                    return isDesc
                        ? desc(Client.phone)
                        : sql`${Client.phone} asc`;
                case "gender":
                    return isDesc
                        ? desc(Client.gender)
                        : sql`${Client.gender} asc`;
                case "age":
                    // Age is calculated, so we sort by dob instead
                    return isDesc ? sql`${Client.dob} asc` : desc(Client.dob); // Reverse logic for age
                case "trainerName":
                    return isDesc
                        ? desc(Trainer.fullName)
                        : sql`${Trainer.fullName} asc`;
                default:
                    console.warn(`Unsupported sort column: ${id}`);
                    return desc(TrainerClients.assignedDate); // Default
            }
        });
    }

    // Fetch total count and paginated clients concurrently for faster response
    const [countResult, clientsWithTrainerName] = await Promise.all([
        db
            .select({ count: sql<number>`count(*)` })
            .from(TrainerClients)
            .innerJoin(Client, eq(Client.userId, TrainerClients.clientId))
            .innerJoin(Trainer, eq(Trainer.userId, TrainerClients.trainerId))
            .where(and(...whereConditions)),
        db
            .select({
                trainerName: Trainer.fullName,
                userId: Client.userId,
                fullName: Client.fullName,
                email: Client.email,
                registrationDate: Client.registrationDate,
                notes: Client.notes,
                phone: Client.phone,
                imageUrl: Client.imageUrl,
                gender: Client.gender,
                idealWeight: Client.idealWeight,
                dob: Client.dob,
                relationshipId: TrainerClients.relationshipId,
                assignedDate: TrainerClients.assignedDate,
            })
            .from(TrainerClients)
            .innerJoin(Trainer, eq(Trainer.userId, TrainerClients.trainerId)) // trainer join
            .innerJoin(Client, eq(Client.userId, TrainerClients.clientId)) // client join
            .where(and(...whereConditions))
            .orderBy(...orderByColumns)
            .limit(size)
            .offset(page * size),
    ]);

    const totalCount = Number(countResult[0]?.count || 0);

    // Map clients to add age calculated on server side
    const clientsWithAge = clientsWithTrainerName.map((client) => {
        let age = null;
        if (client.dob) {
            const today = new Date();
            const birthDate = new Date(client.dob);
            age = today.getFullYear() - birthDate.getFullYear();
            const m = today.getMonth() - birthDate.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
        }
        return { ...client, age };
    });

    console.log(
        `Found ${clientsWithAge.length} clients (page ${page} of ${Math.ceil(
            totalCount / size
        )}) for trainer: ${trainerAppwriteId}`
    );

    return {
        data: clientsWithAge,
        meta: {
            totalRowCount: totalCount,
            page,
            pageSize: size,
            totalPages: Math.ceil(totalCount / size),
            hasMore: (page + 1) * size < totalCount,
        },
    };
}

/**
 * Returns paginated list of all clients in the system.
 * @param params - Object containing pagination, sorting, and filtering parameters
 *                 OR page number (0-based) for backward compatibility
 * @param pageSize - Number of items per page (used only if first param is a number)
 * @returns Object containing clients array and pagination info
 */
export async function getAllClientsPaginated(
    params: Record<string, unknown> | number = 0,
    pageSize: number = 10
) {
    // Handle both new params object and old separate parameters
    let page = 0;
    let size = pageSize;
    let filters: Record<string, unknown> = {};
    let sorting: Array<{ id: string; desc: boolean }> = [];
    let search: string | undefined;
    let parsedFilters: Array<{ id: string; value: unknown }> = [];

    console.log(`Received params:`, JSON.stringify(params, null, 2));

    if (typeof params === "object") {
        // Extract pagination parameters from params
        page =
            typeof params.pageIndex === "number"
                ? params.pageIndex
                : typeof params.pageIndex === "string"
                ? parseInt(params.pageIndex, 10)
                : 0;

        size =
            typeof params.pageSize === "number"
                ? params.pageSize
                : typeof params.pageSize === "string"
                ? parseInt(params.pageSize, 10)
                : 10;

        // Extract sorting from params
        if (params.sorting && typeof params.sorting === "string") {
            try {
                sorting = JSON.parse(params.sorting as string);
            } catch (e) {
                console.error("Error parsing sorting parameter:", e);
            }
        }

        // Extract search from params
        search = typeof params.search === "string" ? params.search : undefined;

        // Extract filters from params
        if (params.filters && typeof params.filters === "string") {
            try {
                parsedFilters = JSON.parse(params.filters as string);
                console.log("Parsed filters:", parsedFilters);
            } catch (e) {
                console.error("Error parsing filters parameter:", e);
            }
        }

        // Keep all other params for potential filtering
        filters = { ...params };
        // Remove extracted pagination params to avoid duplication
        delete filters.pageIndex;
        delete filters.pageSize;
        delete filters.sorting;
        delete filters.search;
        delete filters.filters;
    } else {
        // Old style: separate parameters
        page = params;
    }

    console.log(`Fetching all clients, page: ${page}, pageSize: ${size}`);
    if (sorting.length > 0) {
        console.log(`Sorting:`, sorting);
    }
    if (search) {
        console.log(`Search query:`, search);
    }
    if (Object.keys(filters).length > 0) {
        console.log(`Additional filters:`, filters);
    }

    // return {
    //     data: [],
    //     meta: {
    //         totalRowCount: 0,
    //     },
    // }; // Temporary placeholder

    const Client = alias(Users, "client");
    const Trainer = alias(Users, "trainer");

    // Build where conditions
    const baseConditions = [
        eq(Roles.roleName, "Client"),
        eq(TrainerClients.isActive, true),
    ];

    // Define allowed filter columns
    const ALLOWED_FILTER_COLUMNS = new Set([
        "fullName", "email", "phone", "gender"
    ]);

    // Add filter conditions
    const filterConditions = parsedFilters
        .map((filter: { id: string; value: unknown }) => {
            const { id, value } = filter;
            
            // Skip filters for columns that are not in the allowed list
            if (!ALLOWED_FILTER_COLUMNS.has(id)) {
                console.warn(`Unsupported filter column: ${id}`);
                return undefined;
            }
            
            switch (id) {
                case "fullName":
                    return sql`${Client.fullName} ILIKE ${`%${String(value)}%`}`;
                case "email":
                    return sql`${Client.email} ILIKE ${`%${String(value)}%`}`;
                case "phone":
                    return sql`${Client.phone} ILIKE ${`%${String(value)}%`}`;
                case "gender":
                    // Handle gender as enum with specific allowed values
                    const genderValue = String(value).toUpperCase();
                    if (genderValue === "M" || genderValue === "MALE") {
                        return eq(Client.gender, "male");
                    } else if (
                        genderValue === "F" ||
                        genderValue === "FEMALE"
                    ) {
                        return eq(Client.gender, "female");
                    } else if (
                        genderValue === "NB" ||
                        genderValue === "NON-BINARY"
                    ) {
                        return eq(Client.gender, "non-binary");
                    } else {
                        return eq(Client.gender, "prefer-not-to-say");
                    }
                default:
                    console.warn(`Unsupported filter column: ${id}`);
                    return undefined;
            }
        })
        .filter(Boolean);

    // Add search condition if provided
    let searchCondition;
    if (search) {
        const searchLike = `%${search}%`;
        searchCondition = sql`(
            ${Client.fullName} ILIKE ${searchLike} OR
            ${Client.email} ILIKE ${searchLike} OR
            ${Client.phone} ILIKE ${searchLike} OR
            ${Trainer.fullName} ILIKE ${searchLike}
        )`;
    }

    // Combine all conditions
    const whereConditions = [
        ...baseConditions,
        ...filterConditions,
        ...(searchCondition ? [searchCondition] : []),
    ];

    // Build order by
    let orderByColumns = [desc(Client.registrationDate)]; // Default sorting

    if (sorting.length > 0) {
        orderByColumns = sorting.map((sort) => {
            const { id, desc: isDesc } = sort;
            switch (id) {
                case "email":
                    return isDesc
                        ? desc(Client.email)
                        : sql`${Client.email} asc`;
                case "fullName":
                    return isDesc
                        ? desc(Client.fullName)
                        : sql`${Client.fullName} asc`;
                case "registrationDate":
                    return isDesc
                        ? desc(Client.registrationDate)
                        : sql`${Client.registrationDate} asc`;
                case "phone":
                    return isDesc
                        ? desc(Client.phone)
                        : sql`${Client.phone} asc`;
                case "gender":
                    return isDesc
                        ? desc(Client.gender)
                        : sql`${Client.gender} asc`;
                case "age":
                    // Age is calculated, so we sort by dob instead
                    return isDesc ? sql`${Client.dob} asc` : desc(Client.dob); // Reverse logic for age
                case "trainerName":
                    return isDesc
                        ? desc(Trainer.fullName)
                        : sql`${Trainer.fullName} asc`;
                default:
                    console.warn(`Unsupported sort column: ${id}`);
                    return desc(Client.registrationDate); // Default
            }
        });
    }

    // Get total count of clients with role "client" who have an active trainer relationship
    const [countResult, clientsQuery] = await Promise.all([
        db
            .select({ count: sql<number>`count(*)` })
            .from(Client)
            .innerJoin(
                TrainerClients,
                and(
                    eq(Client.userId, TrainerClients.clientId),
                    eq(TrainerClients.isActive, true)
                )
            )
            .innerJoin(Trainer, eq(Trainer.userId, TrainerClients.trainerId))
            .innerJoin(UserRoles, eq(Client.userId, UserRoles.userId))
            .innerJoin(Roles, eq(UserRoles.roleId, Roles.roleId))
            .where(and(...whereConditions)),
        db
            .select({
                userId: Client.userId,
                fullName: Client.fullName,
                email: Client.email,
                registrationDate: Client.registrationDate,
                notes: Client.notes,
                phone: Client.phone,
                imageUrl: Client.imageUrl,
                gender: Client.gender,
                idealWeight: Client.idealWeight,
                dob: Client.dob,
                relationshipId: TrainerClients.relationshipId,
                assignedDate: TrainerClients.assignedDate,
                trainerId: Trainer.userId,
                trainerName: Trainer.fullName,
            })
            .from(TrainerClients)
            .innerJoin(Client, eq(Client.userId, TrainerClients.clientId))
            .innerJoin(Trainer, eq(Trainer.userId, TrainerClients.trainerId))
            .innerJoin(UserRoles, eq(Client.userId, UserRoles.userId))
            .innerJoin(Roles, eq(UserRoles.roleId, Roles.roleId))
            .where(and(...whereConditions))
            .orderBy(...orderByColumns)
            .limit(size)
            .offset(page * size),
    ]);

    const totalCount = Number(countResult[0]?.count || 0);
    console.log(`Total clients found: ${totalCount}`);

    // Add age calculation
    const clients = clientsQuery.map((client) => {
        let age: number | null = null;
        if (client.dob) {
            const today = new Date();
            const birthDate = new Date(client.dob);
            age = today.getFullYear() - birthDate.getFullYear();
            const m = today.getMonth() - birthDate.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
        }
        return { ...client, age };
    });

    console.log(
        `Found ${clients.length} clients (page ${page} of ${Math.ceil(
            totalCount / size
        )})`
    );

    return {
        data: clients,
        meta: {
            totalRowCount: totalCount,
            page,
            pageSize: size,
            totalPages: Math.ceil(totalCount / size),
            hasMore: (page + 1) * size < totalCount,
        },
    };
}

/**
 * Returns paginated list of all exercises in the system
 * @param params - Object containing pagination, sorting, and filtering parameters
 * @returns Object containing exercises array and pagination info
 */
export async function getAllExercises(params: Record<string, unknown> = {}) {
    // Extract pagination parameters from params
    const pageIndex =
        typeof params.pageIndex === "number"
            ? params.pageIndex
            : typeof params.pageIndex === "string"
            ? parseInt(params.pageIndex, 10)
            : 0;

    const pageSize =
        typeof params.pageSize === "number"
            ? params.pageSize
            : typeof params.pageSize === "string"
            ? parseInt(params.pageSize, 10)
            : 10;

    // Extract sorting from params
    let sorting: Array<{ id: string; desc: boolean }> = [];
    if (params.sorting && typeof params.sorting === "string") {
        try {
            sorting = JSON.parse(params.sorting as string);
        } catch (e) {
            console.error("Error parsing sorting parameter:", e);
        }
    }

    // Extract search from params
    const search =
        typeof params.search === "string" ? params.search : undefined;

    // Extract filters from params
    let columnFilters: Array<{ id: string; value: string }> = [];
    if (params.filters && typeof params.filters === "string") {
        try {
            columnFilters = JSON.parse(params.filters as string);
        } catch (e) {
            console.error("Error parsing filters parameter:", e);
        }
    }

    console.log(
        `Fetching all exercises, page: ${pageIndex}, pageSize: ${pageSize}, search: ${search}`
    );
    if (sorting.length > 0) {
        console.log(`Sorting:`, sorting);
    }
    if (columnFilters.length > 0) {
        console.log(`Filters:`, columnFilters);
    }

    const Exercise = alias(Exercises, "exercise");

    // Create a Promise.all to fetch count and data concurrently
    const [countResult, exercisesData] = await Promise.all([
        db.select({ count: sql<number>`count(*)` }).from(Exercise),

        db
            .select({
                exerciseId: Exercise.exerciseId,
                name: Exercise.exerciseName,
                description: Exercise.description,
                difficulty: Exercise.motion,
                muscleGroup: Exercise.targetArea,
                status: Exercise.approvedByAdmin,
                videoUrl: Exercise.videoUrl,
                createdAt: Exercise.uploadDate,
            })
            .from(Exercise)
            .orderBy(desc(Exercise.uploadDate))
            .limit(pageSize)
            .offset(pageIndex * pageSize),
    ]);

    // Calculate accurate pagination values
    const totalCount = Number(countResult[0]?.count || 0);

    console.log(
        `Found ${
            exercisesData.length
        } exercises (page ${pageIndex} of ${Math.ceil(totalCount / pageSize)})`
    );

    return {
        data: exercisesData,
        meta: {
            totalCount,
            page: pageIndex,
            pageSize,
            totalPages: Math.ceil(totalCount / pageSize),
            hasMore: (pageIndex + 1) * pageSize < totalCount,
            totalRowCount: totalCount,
        },
    };
}
