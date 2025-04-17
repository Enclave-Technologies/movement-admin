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
  console.log("Sample client data:", clientsWithAge[0] || "No clients found");
  return clientsWithAge;
}

/**
 * Returns paginated users (clients) managed by the given trainer appwrite_id.
 * @param trainerAppwriteId - The appwrite_id of the trainer
 * @param page - The page number (0-based)
 * @param pageSize - Number of items per page
 * @returns Object containing clients array and total count
 */
export async function getClientsManagedByUserPaginated(
  trainerAppwriteId: string,
  page: number = 0,
  pageSize: number = 10
) {
  console.log(
    `Fetching paginated clients for trainer: ${trainerAppwriteId}, page: ${page}, pageSize: ${pageSize}`
  );

  const Trainer = alias(Users, "trainer");
  const Client = alias(Users, "client");

  // Fetch total count and paginated clients concurrently for faster response
  const [countResult, clientsWithTrainerName] = await Promise.all([
    db
      .select({ count: sql<number>`count(*)` })
      .from(TrainerClients)
      .where(
        and(
          eq(TrainerClients.trainerId, trainerAppwriteId),
          eq(TrainerClients.isActive, true)
        )
      ),
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
      .where(
        and(
          eq(Trainer.userId, trainerAppwriteId), // filter for trainer
          eq(TrainerClients.isActive, true)
        )
      )
      .orderBy(desc(TrainerClients.assignedDate))
      .limit(pageSize)
      .offset(page * pageSize),
  ]);

  const totalCount = Number(countResult[0]?.count || 0);

  // Map clients to add age calculated on server side (can optimize further by caching if needed)
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
      totalCount / pageSize
    )}) for trainer: ${trainerAppwriteId}`
  );
  console.log("Sample client data:", clientsWithAge[0] || "No clients found");

  return {
    data: clientsWithAge,
    meta: {
      totalRowCount: totalCount,
      page,
      pageSize,
      totalPages: Math.ceil(totalCount / pageSize),
      hasMore: (page + 1) * pageSize < totalCount,
    },
  };
}

/**
 * Returns paginated list of all clients in the system.
 * @param page - The page number (0-based)
 * @param pageSize - Number of items per page
 * @returns Object containing clients array and pagination info
 */
export async function getAllClientsPaginated(
  page: number = 0,
  pageSize: number = 10
) {
  console.log(`Fetching all clients, page: ${page}, pageSize: ${pageSize}`);

  const Client = alias(Users, "client");
  const Trainer = alias(Users, "trainer");

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
      .where(eq(Roles.roleName, "Client")),
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
      .where(
        and(eq(Roles.roleName, "Client"), eq(TrainerClients.isActive, true))
      )
      .orderBy(desc(Client.registrationDate))
      .limit(pageSize)
      .offset(page * pageSize),
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
      totalCount / pageSize
    )})`
  );

  return {
    data: clients,
    meta: {
      totalRowCount: totalCount,
      page,
      pageSize,
      totalPages: Math.ceil(totalCount / pageSize),
      hasMore: (page + 1) * pageSize < totalCount,
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

  const search = typeof params.search === "string" ? params.search : undefined;

  console.log(
    `Fetching all exercises, page: ${pageIndex}, pageSize: ${pageSize}, search: ${search}`
  );

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
    `Found ${exercisesData.length} exercises (page ${pageIndex} of ${Math.ceil(
      totalCount / pageSize
    )})`
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
