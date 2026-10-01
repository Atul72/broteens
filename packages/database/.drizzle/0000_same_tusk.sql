CREATE TYPE "public"."auth_provider" AS ENUM('password', 'google');--> statement-breakpoint
CREATE TYPE "public"."auth_token_type" AS ENUM('access', 'refresh', 'password_reset');--> statement-breakpoint
CREATE TYPE "public"."crawl_status" AS ENUM('queued', 'running', 'completed', 'failed', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."page_status" AS ENUM('pending', 'completed', 'failed', 'skipped');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('superadmin', 'admin', 'user', 'moderator');--> statement-breakpoint
CREATE TYPE "public"."user_status" AS ENUM('active', 'inactive', 'banned', 'deleted');--> statement-breakpoint
CREATE TABLE "auth_accounts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"provider" "auth_provider" NOT NULL,
	"provider_account_id" varchar(255) NOT NULL,
	"provider_email" varchar(320),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "auth_tokens" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"type" "auth_token_type" NOT NULL,
	"token_hash" varchar(64) NOT NULL,
	"session_id" uuid NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"revoked_at" timestamp with time zone,
	"last_used_at" timestamp with time zone,
	"ip_address" varchar(64),
	"user_agent" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "crawl_jobs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"seed_url" text NOT NULL,
	"status" "crawl_status" DEFAULT 'queued' NOT NULL,
	"configuration" jsonb NOT NULL,
	"discovered_count" integer DEFAULT 0 NOT NULL,
	"processed_count" integer DEFAULT 0 NOT NULL,
	"successful_count" integer DEFAULT 0 NOT NULL,
	"failed_count" integer DEFAULT 0 NOT NULL,
	"error_message" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"started_at" timestamp with time zone,
	"completed_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "crawl_links" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"crawl_job_id" uuid NOT NULL,
	"source_page_id" uuid NOT NULL,
	"target_url" text NOT NULL,
	"normalized_target_url" text NOT NULL,
	"anchor_text" text,
	"is_internal" boolean NOT NULL,
	"was_followed" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "crawl_pages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"crawl_job_id" uuid NOT NULL,
	"url" text NOT NULL,
	"normalized_url" text NOT NULL,
	"parent_url" text,
	"depth" integer NOT NULL,
	"status" "page_status" DEFAULT 'pending' NOT NULL,
	"status_code" integer,
	"content_type" text,
	"title" text,
	"description" text,
	"author" text,
	"language" text,
	"markdown" text,
	"text_content" text,
	"content_hash" text,
	"rendering_method" text,
	"response_time_ms" integer,
	"error_message" text,
	"fetched_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(320) NOT NULL,
	"password_hash" text,
	"full_name" varchar(200) NOT NULL,
	"avatar_url" text,
	"role" "user_role" DEFAULT 'user' NOT NULL,
	"status" "user_status" DEFAULT 'active' NOT NULL,
	"email_verified_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "auth_accounts" ADD CONSTRAINT "auth_accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "auth_tokens" ADD CONSTRAINT "auth_tokens_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "crawl_links" ADD CONSTRAINT "crawl_links_crawl_job_id_crawl_jobs_id_fk" FOREIGN KEY ("crawl_job_id") REFERENCES "public"."crawl_jobs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "crawl_links" ADD CONSTRAINT "crawl_links_source_page_id_crawl_pages_id_fk" FOREIGN KEY ("source_page_id") REFERENCES "public"."crawl_pages"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "crawl_pages" ADD CONSTRAINT "crawl_pages_crawl_job_id_crawl_jobs_id_fk" FOREIGN KEY ("crawl_job_id") REFERENCES "public"."crawl_jobs"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "auth_accounts_provider_account_uq" ON "auth_accounts" USING btree ("provider","provider_account_id");--> statement-breakpoint
CREATE INDEX "auth_accounts_user_idx" ON "auth_accounts" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX "auth_tokens_hash_uq" ON "auth_tokens" USING btree ("token_hash");--> statement-breakpoint
CREATE INDEX "auth_tokens_user_idx" ON "auth_tokens" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "auth_tokens_session_idx" ON "auth_tokens" USING btree ("session_id");--> statement-breakpoint
CREATE INDEX "auth_tokens_expiry_idx" ON "auth_tokens" USING btree ("expires_at");--> statement-breakpoint
CREATE INDEX "crawl_jobs_status_idx" ON "crawl_jobs" USING btree ("status");--> statement-breakpoint
CREATE UNIQUE INDEX "crawl_links_source_target_uq" ON "crawl_links" USING btree ("source_page_id","normalized_target_url");--> statement-breakpoint
CREATE INDEX "crawl_links_job_idx" ON "crawl_links" USING btree ("crawl_job_id");--> statement-breakpoint
CREATE UNIQUE INDEX "crawl_pages_job_url_uq" ON "crawl_pages" USING btree ("crawl_job_id","normalized_url");--> statement-breakpoint
CREATE INDEX "crawl_pages_job_idx" ON "crawl_pages" USING btree ("crawl_job_id");--> statement-breakpoint
CREATE UNIQUE INDEX "users_email_uq" ON "users" USING btree ("email");