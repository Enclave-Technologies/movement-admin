import {
    pgTable,
    text,
    integer,
    boolean,
    timestamp,
    pgEnum,
    real,
    uuid,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const genderEnum = pgEnum("gender_enum", ["male", "female", "other"]);

export const Persons = pgTable("persons", {
    // Core Identification
    id: uuid("id").primaryKey(),
    appwriteId: text("appwrite_id").unique(),
    authId: text("auth_id").unique(),

    // Roles
    isClient: boolean("is_client").default(false).notNull(),
    isTrainer: boolean("is_trainer").default(false).notNull(),
    isAdmin: boolean("is_admin").default(false).notNull(),

    // Common Details
    firstName: text("first_name"),
    lastName: text("last_name"),
    email: text("email").unique(),
    phone: text("phone").default(""),
    imageUrl: text("image_url").default(""),
    gender: genderEnum("gender"),
    dob: timestamp("dob"),

    // Client-Specific
    idealWeight: real("ideal_weight").default(0),
    coachNotes: text("coach_notes").default(""),
    trainerId: integer("trainer_id"),

    // Trainer-Specific
    jobTitle: text("job_title").default(
        "Personal Trainer | Body Transformation"
    ),

    // Timestamps
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type InsertPerson = typeof Persons.$inferInsert;
export type SelectPerson = typeof Persons.$inferSelect;

export const personsRelations = relations(Persons, ({ one, many }) => ({
    // Self-reference: a person can be a trainer for many clients
    trainer: one(Persons, {
        fields: [Persons.trainerId],
        references: [Persons.id],
        relationName: "trainer_clients",
    }),
    // Self-reference: a trainer can have many clients
    clients: many(Persons, {
        relationName: "trainer_clients",
    }),

    // Temporarily commented until other schemas are defined
    // goalsAssigned: many(Goal, { relationName: "trainer_assigned" }),
    // goalsReceived: many(Goal, { relationName: "client_assigned" }),
    // phases: many(Phase),
    // workoutRecords: many(WorkoutRecord),
    bodyMassComps: many(BodyMassComps, {
        relationName: "person_body_mass_comps",
    }),
    // clientProgress: one(ClientProgress),
}));

export const BodyMassComps = pgTable("body_mass_comps", {
    id: uuid("id").primaryKey(),
    appwriteId: text("appwrite_id").unique().notNull(),
    personId: uuid("person_id")
        .references(() => Persons.id)
        .notNull(),

    date: timestamp("date", { mode: "date" }),
    height: real("height"),
    weight: real("weight"),
    chin: real("chin"),
    cheek: real("cheek"),
    pec: real("pec"),
    biceps: real("biceps"),
    triceps: real("triceps"),
    subscap: real("subscap"),
    midax: real("midax"),
    supra: real("supra"),
    upperThigh: real("upper_thigh"),
    ubmil: real("ubmil"),
    knee: real("knee"),
    calf: real("calf"),
    quad: real("quad"),
    ham: real("ham").default(0),
    bmi: real("bmi"),
    bf: real("bf"), // Body Fat %
    mm: real("mm"), // Muscle Mass

    // Timestamps
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type InsertBodyMassComp = typeof BodyMassComps.$inferInsert;
export type SelectBodyMassComp = typeof BodyMassComps.$inferSelect;

export const bodyMassCompsRelations = relations(BodyMassComps, ({ one }) => ({
    person: one(Persons, {
        fields: [BodyMassComps.personId],
        references: [Persons.id],
        relationName: "person_body_mass_comps",
    }),
}));
