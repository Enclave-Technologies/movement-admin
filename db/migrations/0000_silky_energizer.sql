CREATE TYPE "public"."goal_status_enum" AS ENUM('achieved', 'in-progress');--> statement-breakpoint
CREATE TYPE "public"."goal_type_enum" AS ENUM('physique goal', 'lifestyle goal', 'skill goal', 'performance goal');--> statement-breakpoint
CREATE TABLE "BMCMeasurements" (
	"measurement_id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"user_id" uuid NOT NULL,
	"date" timestamp NOT NULL,
	"height" real,
	"weight" real,
	"chin" real,
	"cheek" real,
	"pec" real,
	"biceps" real,
	"triceps" real,
	"subscap" real,
	"midax" real,
	"supra" real,
	"upper_thigh" real,
	"ubmil" real,
	"knee" real,
	"calf" real,
	"quad" real,
	"ham" real DEFAULT 0,
	"bmi" real,
	"bf" real,
	"lm" real,
	"photo_path" text,
	CONSTRAINT "uniqueUserDate" UNIQUE("user_id","date")
);
--> statement-breakpoint
CREATE TABLE "ExercisePlanExercises" (
	"plan_exercise_id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"session_id" uuid NOT NULL,
	"exercise_id" uuid NOT NULL,
	"targetArea" text,
	"motion" text,
	"repsMin" integer,
	"repsMax" integer,
	"setsMin" integer,
	"setsMax" integer,
	"tempo" text,
	"TUT" integer,
	"restMin" integer,
	"restMax" integer,
	"exerciseOrder" integer,
	"setOrderMarker" text,
	"customizations" text,
	"notes" text DEFAULT ''
);
--> statement-breakpoint
CREATE TABLE "ExercisePlans" (
	"plan_id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"plan_name" text NOT NULL,
	"created_by_user_id" uuid NOT NULL,
	"created_date" timestamp DEFAULT now() NOT NULL,
	"assigned_to_user_id" uuid,
	"is_active" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE "Exercises" (
	"exercise_id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"exercise_name" text NOT NULL,
	"description" text,
	"uploaded_by_user_id" uuid NOT NULL,
	"upload_date" timestamp DEFAULT now() NOT NULL,
	"approved_by_admin" boolean,
	"videoUrl" text
);
--> statement-breakpoint
CREATE TABLE "Goals" (
	"goal_id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"user_id" uuid NOT NULL,
	"goal_description" text NOT NULL,
	"goal_status" "goal_status_enum" DEFAULT 'in-progress' NOT NULL,
	"goal_type" "goal_type_enum" NOT NULL,
	"deadline" timestamp,
	"coach_comments" text,
	"created_date" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Phases" (
	"phase_id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"plan_id" uuid NOT NULL,
	"phase_name" text NOT NULL,
	"order_number" integer NOT NULL,
	"is_active" boolean DEFAULT false,
	CONSTRAINT "uniquePlanOrder" UNIQUE("plan_id","order_number")
);
--> statement-breakpoint
CREATE TABLE "Roles" (
	"role_id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"role_name" text NOT NULL,
	CONSTRAINT "Roles_role_name_unique" UNIQUE("role_name")
);
--> statement-breakpoint
CREATE TABLE "Sessions" (
	"session_id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"phase_id" uuid NOT NULL,
	"session_name" text NOT NULL,
	"order_number" integer NOT NULL,
	CONSTRAINT "uniquePhaseOrder" UNIQUE("phase_id","order_number")
);
--> statement-breakpoint
CREATE TABLE "UserRoles" (
	"user_role_id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"user_id" uuid NOT NULL,
	"role_id" uuid NOT NULL,
	"approved_by_admin" boolean DEFAULT false,
	CONSTRAINT "uq_user_role" UNIQUE("user_id","role_id")
);
--> statement-breakpoint
CREATE TABLE "Users" (
	"user_id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"email" text NOT NULL,
	"registration_date" timestamp DEFAULT now() NOT NULL,
	"notes" text,
	CONSTRAINT "Users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "WorkoutSessionDetails" (
	"workout_detail_id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"workout_session_log_id" uuid NOT NULL,
	"exercise_name" text NOT NULL,
	"sets" integer,
	"reps" integer,
	"weight" real,
	"workout_volume" real,
	"coach_note" text,
	"entry_time" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "WorkoutSessionsLog" (
	"workout_session_log_id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"user_id" uuid NOT NULL,
	"session_name" text NOT NULL,
	"start_time" timestamp DEFAULT now() NOT NULL,
	"end_time" timestamp
);
--> statement-breakpoint
ALTER TABLE "BMCMeasurements" ADD CONSTRAINT "BMCMeasurements_user_id_Users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."Users"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ExercisePlanExercises" ADD CONSTRAINT "ExercisePlanExercises_session_id_Sessions_session_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."Sessions"("session_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ExercisePlanExercises" ADD CONSTRAINT "ExercisePlanExercises_exercise_id_Exercises_exercise_id_fk" FOREIGN KEY ("exercise_id") REFERENCES "public"."Exercises"("exercise_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ExercisePlans" ADD CONSTRAINT "ExercisePlans_created_by_user_id_Users_user_id_fk" FOREIGN KEY ("created_by_user_id") REFERENCES "public"."Users"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ExercisePlans" ADD CONSTRAINT "ExercisePlans_assigned_to_user_id_Users_user_id_fk" FOREIGN KEY ("assigned_to_user_id") REFERENCES "public"."Users"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Exercises" ADD CONSTRAINT "Exercises_uploaded_by_user_id_Users_user_id_fk" FOREIGN KEY ("uploaded_by_user_id") REFERENCES "public"."Users"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Goals" ADD CONSTRAINT "Goals_user_id_Users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."Users"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Phases" ADD CONSTRAINT "Phases_plan_id_ExercisePlans_plan_id_fk" FOREIGN KEY ("plan_id") REFERENCES "public"."ExercisePlans"("plan_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Sessions" ADD CONSTRAINT "Sessions_phase_id_Phases_phase_id_fk" FOREIGN KEY ("phase_id") REFERENCES "public"."Phases"("phase_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "UserRoles" ADD CONSTRAINT "UserRoles_user_id_Users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."Users"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "UserRoles" ADD CONSTRAINT "UserRoles_role_id_Roles_role_id_fk" FOREIGN KEY ("role_id") REFERENCES "public"."Roles"("role_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "WorkoutSessionDetails" ADD CONSTRAINT "WorkoutSessionDetails_workout_session_log_id_WorkoutSessionsLog_workout_session_log_id_fk" FOREIGN KEY ("workout_session_log_id") REFERENCES "public"."WorkoutSessionsLog"("workout_session_log_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "WorkoutSessionsLog" ADD CONSTRAINT "WorkoutSessionsLog_user_id_Users_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."Users"("user_id") ON DELETE no action ON UPDATE no action;