-- Migrate auth tables from NextAuth (+ custom token tables) to Better Auth.
-- Hand-written: the auto-generated diff was produced against a stale snapshot
-- and would not have preserved existing data.

-- users: email_verified timestamp -> boolean, enforce audit timestamps
ALTER TABLE "users" ALTER COLUMN "email_verified" TYPE boolean USING ("email_verified" IS NOT NULL);--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "email_verified" SET DEFAULT false;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "email_verified" SET NOT NULL;--> statement-breakpoint
UPDATE "users" SET "created_at" = now() WHERE "created_at" IS NULL;--> statement-breakpoint
UPDATE "users" SET "updated_at" = now() WHERE "updated_at" IS NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "created_at" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "updated_at" SET NOT NULL;--> statement-breakpoint

-- accounts: rebuild in Better Auth shape, carrying over OAuth rows
ALTER TABLE "accounts" RENAME TO "accounts_old";--> statement-breakpoint
CREATE TABLE "accounts" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" varchar(255) NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
DROP INDEX IF EXISTS "idx_accounts_user_id";--> statement-breakpoint
CREATE INDEX "idx_accounts_user_id" ON "accounts" USING btree ("user_id");--> statement-breakpoint
INSERT INTO "accounts" ("id", "account_id", "provider_id", "user_id", "access_token", "refresh_token", "id_token", "access_token_expires_at", "scope")
SELECT gen_random_uuid()::text, "provider_account_id", "provider", "user_id", "access_token", "refresh_token", "id_token", to_timestamp("expires_at"), "scope"
FROM "accounts_old";--> statement-breakpoint

-- credential passwords move from users into accounts (providerId 'credential')
INSERT INTO "accounts" ("id", "account_id", "provider_id", "user_id", "password")
SELECT gen_random_uuid()::text, "id", 'credential', "id", "password_hash"
FROM "users" WHERE "password_hash" IS NOT NULL;--> statement-breakpoint
DROP TABLE "accounts_old";--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN "password_hash";--> statement-breakpoint

-- sessions: previous table was unused (JWT strategy); rebuild for DB sessions
DROP TABLE "sessions";--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" varchar(255) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "sessions_token_unique" UNIQUE("token")
);--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_sessions_user_id" ON "sessions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "idx_sessions_token" ON "sessions" USING btree ("token");--> statement-breakpoint

-- custom token tables are replaced by Better Auth's verifications table;
-- in-flight verification/reset links are intentionally invalidated
DROP TABLE "verification_tokens";--> statement-breakpoint
DROP TABLE "password_reset_tokens";--> statement-breakpoint
CREATE TABLE "verifications" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);--> statement-breakpoint
CREATE INDEX "idx_verifications_identifier" ON "verifications" USING btree ("identifier");--> statement-breakpoint

-- storage for Better Auth's database-backed rate limiter
CREATE TABLE "rate_limits" (
	"id" varchar(255) PRIMARY KEY NOT NULL,
	"key" text,
	"count" integer,
	"last_request" bigint
);--> statement-breakpoint
CREATE INDEX "idx_rate_limits_key" ON "rate_limits" USING btree ("key");
