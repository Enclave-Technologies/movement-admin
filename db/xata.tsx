import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import {
    BMCMeasurements,
    ExercisePlanExercises,
    ExercisePlans,
    Exercises,
    Goals,
    Phases,
    Roles,
    Sessions,
    UserRoles,
    Users,
    WorkoutSessionDetails,
    WorkoutSessionsLog,
} from "./schemas";

// Create a function to get the database connection
// This way, the connection is only created when needed, not at import time
export function getDb() {
    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        max: 20,
    });

    return drizzle(pool, {
        schema: {
            Roles,
            UserRoles,
            Users,
            Goals,
            ExercisePlans,
            Exercises,
            Phases,
            Sessions,
            ExercisePlanExercises,
            WorkoutSessionDetails,
            WorkoutSessionsLog,
            BMCMeasurements,
        },
    });
}

// Create a type for the database instance
type DbType = ReturnType<typeof getDb>;

// Export the db instance for convenience, but only create it when used
export const db =
    process.env.NODE_ENV === "production"
        ? getDb()
        : (null as unknown as DbType); // This will be replaced with the actual db instance in production
