CREATE TYPE "public"."gender_enum" AS ENUM('male', 'female', 'non-binary', 'prefer-not-to-say');--> statement-breakpoint
ALTER TABLE "Users" ADD COLUMN "phone" text;--> statement-breakpoint
ALTER TABLE "Users" ADD COLUMN "image_url" text;--> statement-breakpoint
ALTER TABLE "Users" ADD COLUMN "gender" "gender_enum";--> statement-breakpoint
ALTER TABLE "Users" ADD COLUMN "ideal_weight" real;--> statement-breakpoint
ALTER TABLE "Users" ADD COLUMN "dob" timestamp;