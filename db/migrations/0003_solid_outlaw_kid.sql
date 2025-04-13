ALTER TABLE "BMCMeasurements" DROP CONSTRAINT "BMCMeasurements_user_id_Users_user_id_fk";
--> statement-breakpoint
ALTER TABLE "ExercisePlans" DROP CONSTRAINT "ExercisePlans_created_by_user_id_Users_user_id_fk";
--> statement-breakpoint
ALTER TABLE "ExercisePlans" DROP CONSTRAINT "ExercisePlans_assigned_to_user_id_Users_user_id_fk";
--> statement-breakpoint
ALTER TABLE "Exercises" DROP CONSTRAINT "Exercises_uploaded_by_user_id_Users_user_id_fk";
--> statement-breakpoint
ALTER TABLE "Goals" DROP CONSTRAINT "Goals_user_id_Users_user_id_fk";
--> statement-breakpoint
ALTER TABLE "UserRoles" DROP CONSTRAINT "UserRoles_user_id_Users_user_id_fk";
--> statement-breakpoint
ALTER TABLE "WorkoutSessionsLog" DROP CONSTRAINT "WorkoutSessionsLog_user_id_Users_user_id_fk";
--> statement-breakpoint
ALTER TABLE "BMCMeasurements" ALTER COLUMN "user_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "ExercisePlans" ALTER COLUMN "created_by_user_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "ExercisePlans" ALTER COLUMN "assigned_to_user_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "Exercises" ALTER COLUMN "uploaded_by_user_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "Goals" ALTER COLUMN "user_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "UserRoles" ALTER COLUMN "user_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "Users" ALTER COLUMN "user_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "WorkoutSessionsLog" ALTER COLUMN "user_id" SET DATA TYPE text;--> statement-breakpoint
ALTER TABLE "BMCMeasurements" ADD CONSTRAINT "BMCMeasurements_user_id_Users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."Users"("user_id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "ExercisePlans" ADD CONSTRAINT "ExercisePlans_created_by_user_id_Users_user_id_fk" FOREIGN KEY ("created_by_user_id") REFERENCES "public"."Users"("user_id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "ExercisePlans" ADD CONSTRAINT "ExercisePlans_assigned_to_user_id_Users_user_id_fk" FOREIGN KEY ("assigned_to_user_id") REFERENCES "public"."Users"("user_id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "Exercises" ADD CONSTRAINT "Exercises_uploaded_by_user_id_Users_user_id_fk" FOREIGN KEY ("uploaded_by_user_id") REFERENCES "public"."Users"("user_id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "Goals" ADD CONSTRAINT "Goals_user_id_Users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."Users"("user_id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "UserRoles" ADD CONSTRAINT "UserRoles_user_id_Users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."Users"("user_id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "WorkoutSessionsLog" ADD CONSTRAINT "WorkoutSessionsLog_user_id_Users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."Users"("user_id") ON DELETE cascade ON UPDATE cascade;