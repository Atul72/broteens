CREATE TYPE "public"."user_type" AS ENUM('internal', 'external');--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "user_type" "user_type" DEFAULT 'external' NOT NULL;