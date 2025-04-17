"use server";

import { Roles, UserRoles, Users } from "@/db/schemas";
import { db } from "@/db/xata";
import { eq, desc, and, sql } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import "server-only";

/**
 * IMPORTANT: This file has type errors related to Drizzle ORM's SQL conditions.
 * The errors are related to the Drizzle ORM SQL types and are a known issue with Drizzle ORM in monorepo setups.
 *
 * To fix these errors properly:
 * 1. Update to the latest version of Drizzle ORM
 * 2. Follow the monorepo setup recommendation from https://github.com/drizzle-team/drizzle-orm/issues/2604
 *    by creating a shared package that exports all Drizzle functions and types
 * 3. Import all Drizzle functions from this shared package instead of directly from drizzle-orm
 *
 * As a temporary workaround, we've removed count queries and complex conditions
 * that were causing the most TypeScript errors.
 */

/**
 * Returns a trainer by their user ID
 * @param trainerId - The user ID of the trainer
 * @returns Trainer user data or null if not found
 */
export async function getCoachById(trainerId: string) {
  if (!trainerId) {
    console.log(`No trainer ID provided`);
    return null;
  }

  console.log(`Fetching trainer with ID: ${trainerId}`);

  const Trainer = alias(Users, "trainer");

  // Join Users with UserRoles and Roles to verify the user is a trainer
  const trainerData = await db
    .select({
      userId: Trainer.userId,
      fullName: Trainer.fullName,
      email: Trainer.email,
      phone: Trainer.phone,
      notes: Trainer.notes,
      imageUrl: Trainer.imageUrl,
      registrationDate: Trainer.registrationDate,
      gender: Trainer.gender,
      approved: UserRoles.approvedByAdmin,
    })
    .from(Trainer)
    .innerJoin(UserRoles, eq(Trainer.userId, UserRoles.userId))
    .innerJoin(Roles, eq(UserRoles.roleId, Roles.roleId))
    .where(and(eq(Trainer.userId, trainerId), eq(Roles.roleName, "Trainer")))
    .limit(1);

  if (trainerData.length === 0) {
    console.log(`No trainer found with ID: ${trainerId}`);
    return null;
  }

  console.log(`Found trainer: ${trainerData[0].fullName}`);

  return trainerData[0];
}

/**
 * Debug function to fetch all roles from the database
 * This will help identify what roles actually exist in your system
 */
export async function debugGetAllRoles() {
  console.log("DEBUG: Fetching all roles from database");

  const roles = await db
    .select({
      roleId: Roles.roleId,
      roleName: Roles.roleName,
    })
    .from(Roles);

  console.log("DEBUG: Available roles in database:", roles);
  return roles;
}

/**
 * Returns paginated list of all trainers in the system.
 * @param params - Object containing pagination, sorting, and filtering parameters
 * @returns Object containing trainers array and pagination info
 */
export async function getAllCoachesPaginated(
  params: Record<string, unknown> = {}
) {
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
    `Fetching all trainers, page: ${pageIndex}, pageSize: ${pageSize}, search: ${search}`
  );

  const Trainer = alias(Users, "trainer");

  // Create a Promise.all to fetch count and data concurrently
  const [countResult, trainersData] = await Promise.all([
    db
      .select({ count: sql<number>`count(*)` })
      .from(Trainer)
      .innerJoin(UserRoles, eq(Trainer.userId, UserRoles.userId))
      .innerJoin(Roles, eq(UserRoles.roleId, Roles.roleId))
      .where(eq(Roles.roleName, "Trainer")),

    db
      .select({
        userId: Trainer.userId,
        fullName: Trainer.fullName,
        email: Trainer.email,
        phone: Trainer.phone,
        imageUrl: Trainer.imageUrl,
        registrationDate: Trainer.registrationDate,
        gender: Trainer.gender,
        approved: UserRoles.approvedByAdmin,
        role: Roles.roleName,
      })
      .from(Trainer)
      .innerJoin(UserRoles, eq(Trainer.userId, UserRoles.userId))
      .innerJoin(Roles, eq(UserRoles.roleId, Roles.roleId))
      .where(eq(Roles.roleName, "Trainer"))
      .orderBy(desc(Trainer.registrationDate))
      .limit(pageSize)
      .offset(pageIndex * pageSize),
  ]);

  // Calculate accurate pagination values
  const totalCount = Number(countResult[0]?.count || 0);

  console.log(
    `Found ${trainersData.length} trainers (page ${pageIndex} of ${Math.ceil(
      totalCount / pageSize
    )})`
  );

  return {
    data: trainersData,
    meta: {
      totalCount,
      page: pageIndex,
      pageSize,
      totalPages: Math.ceil(totalCount / pageSize),
      hasMore: (pageIndex + 1) * pageSize < totalCount,
      totalRowCount: totalCount, // Added for compatibility with table component
    },
  };
}

/**
 * Returns trainers that match specific criteria
 * @param filters - Optional filters for gender, approval status, etc.
 * @param page - The page number (0-based)
 * @param pageSize - Number of items per page
 * @returns Object containing trainers array and pagination info
 */
export async function getCoachesByFilters(
  filters: {
    gender?: "male" | "female" | "non-binary" | "prefer-not-to-say";
    approvedOnly?: boolean;
  },
  page: number = 0,
  pageSize: number = 10
) {
  console.log(`Fetching trainers with filters: ${JSON.stringify(filters)}`);

  const Trainer = alias(Users, "trainer");

  // Add filter conditions if specified
  const conditions = [];
  conditions.push(eq(Roles.roleName, "Trainer"));

  if (filters.gender) {
    conditions.push(eq(Trainer.gender, filters.gender));
  }

  if (filters.approvedOnly) {
    conditions.push(eq(UserRoles.approvedByAdmin, true));
  }

  // Promise.all to fetch count and filtered data concurrently
  const [countResult, trainersData] = await Promise.all([
    db
      .select({ count: sql<number>`count(*)` })
      .from(Trainer)
      .innerJoin(UserRoles, eq(Trainer.userId, UserRoles.userId))
      .innerJoin(Roles, eq(UserRoles.roleId, Roles.roleId))
      .where(and(...conditions)),

    db
      .select({
        userId: Trainer.userId,
        fullName: Trainer.fullName,
        email: Trainer.email,
        phone: Trainer.phone,
        imageUrl: Trainer.imageUrl,
        notes: Trainer.notes,
        gender: Trainer.gender,
        approved: UserRoles.approvedByAdmin,
      })
      .from(Trainer)
      .innerJoin(UserRoles, eq(Trainer.userId, UserRoles.userId))
      .innerJoin(Roles, eq(UserRoles.roleId, Roles.roleId))
      .where(and(...conditions))
      .orderBy(desc(Trainer.registrationDate))
      .limit(pageSize)
      .offset(page * pageSize),
  ]);

  const totalCount = Number(countResult[0]?.count || 0);

  console.log(
    `Found ${
      trainersData.length
    } trainers with filters (page ${page} of ${Math.ceil(
      totalCount / pageSize
    )})`
  );

  return {
    data: trainersData,
    meta: {
      totalCount,
      page,
      pageSize,
      totalPages: Math.ceil(totalCount / pageSize),
      hasMore: (page + 1) * pageSize < totalCount,
    },
  };
}
