CREATE TYPE "public"."movement_type_enum" AS ENUM('bilateral', 'unilateral', 'compound', 'isolation');--> statement-breakpoint
ALTER TABLE "Exercises" ADD COLUMN "motion" text;--> statement-breakpoint
ALTER TABLE "Exercises" ADD COLUMN "targetArea" text;--> statement-breakpoint
ALTER TABLE "Exercises" ADD COLUMN "movement_type" "movement_type_enum";--> statement-breakpoint
ALTER TABLE "Exercises" ADD COLUMN "time_multiplier" real DEFAULT 1;