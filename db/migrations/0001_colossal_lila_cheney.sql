ALTER TABLE "Users" ADD COLUMN "appwrite_id" text NOT NULL;--> statement-breakpoint
ALTER TABLE "Users" ADD CONSTRAINT "Users_appwrite_id_unique" UNIQUE("appwrite_id");