CREATE TABLE "app_modules" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"module" varchar(255) NOT NULL,
	"user_type" "user_type" DEFAULT 'external' NOT NULL,
	"description" text,
	"index" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "user_privileges" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"module_id" uuid NOT NULL,
	"description" varchar(255),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"deleted_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "user_privileges" ADD CONSTRAINT "user_privileges_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_privileges" ADD CONSTRAINT "user_privileges_module_id_app_modules_id_fk" FOREIGN KEY ("module_id") REFERENCES "public"."app_modules"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "app_modules_module_user_type_uq" ON "app_modules" USING btree ("module","user_type");--> statement-breakpoint
CREATE INDEX "app_modules_user_type_idx" ON "app_modules" USING btree ("user_type");--> statement-breakpoint
CREATE UNIQUE INDEX "user_privileges_user_module_uq" ON "user_privileges" USING btree ("user_id","module_id");--> statement-breakpoint
CREATE INDEX "user_privileges_user_id_idx" ON "user_privileges" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "user_privileges_module_id_idx" ON "user_privileges" USING btree ("module_id");