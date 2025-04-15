CREATE TABLE "TrainerClients" (
	"relationship_id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"trainer_id" text NOT NULL,
	"client_id" text NOT NULL,
	"assigned_date" timestamp DEFAULT now() NOT NULL,
	"is_active" boolean DEFAULT true,
	"notes" text,
	CONSTRAINT "uq_trainer_client" UNIQUE("trainer_id","client_id")
);
--> statement-breakpoint
ALTER TABLE "TrainerClients" ADD CONSTRAINT "TrainerClients_trainer_id_Users_user_id_fk" FOREIGN KEY ("trainer_id") REFERENCES "public"."Users"("user_id") ON DELETE no action ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "TrainerClients" ADD CONSTRAINT "TrainerClients_client_id_Users_user_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."Users"("user_id") ON DELETE cascade ON UPDATE cascade;