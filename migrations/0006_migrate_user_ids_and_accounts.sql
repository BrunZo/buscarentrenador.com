ALTER TABLE "trainers" DROP CONSTRAINT IF EXISTS "trainers_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "sessions" DROP CONSTRAINT IF EXISTS "sessions_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "verification_tokens" DROP CONSTRAINT IF EXISTS "verification_tokens_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "password_reset_tokens" DROP CONSTRAINT IF EXISTS "password_reset_tokens_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "id" DROP DEFAULT;
--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "id" TYPE varchar(255) USING "id"::text;
--> statement-breakpoint
ALTER TABLE "trainers" ALTER COLUMN "user_id" TYPE varchar(255) USING "user_id"::text;
--> statement-breakpoint
ALTER TABLE "sessions" ALTER COLUMN "user_id" TYPE varchar(255) USING "user_id"::text;
--> statement-breakpoint
ALTER TABLE "verification_tokens" ALTER COLUMN "user_id" TYPE varchar(255) USING "user_id"::text;
--> statement-breakpoint
ALTER TABLE "password_reset_tokens" ALTER COLUMN "user_id" TYPE varchar(255) USING "user_id"::text;
--> statement-breakpoint
DROP SEQUENCE IF EXISTS users_id_seq;
--> statement-breakpoint
ALTER TABLE "trainers" ADD CONSTRAINT "trainers_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "verification_tokens" ADD CONSTRAINT "verification_tokens_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
ALTER TABLE "password_reset_tokens" ADD CONSTRAINT "password_reset_tokens_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
CREATE TABLE "accounts" (
  "user_id" varchar(255) NOT NULL,
  "type" varchar(50) NOT NULL,
  "provider" varchar(50) NOT NULL,
  "provider_account_id" varchar(255) NOT NULL,
  "refresh_token" text,
  "access_token" text,
  "expires_at" integer,
  "token_type" varchar(50),
  "scope" text,
  "id_token" text,
  "session_state" varchar(255),
  CONSTRAINT "accounts_provider_provider_account_id_pk" PRIMARY KEY("provider","provider_account_id")
);
--> statement-breakpoint
ALTER TABLE "accounts" ADD CONSTRAINT "accounts_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
--> statement-breakpoint
CREATE INDEX "idx_accounts_user_id" ON "accounts" USING btree ("user_id");
--> statement-breakpoint
INSERT INTO "accounts" ("user_id", "type", "provider", "provider_account_id")
SELECT "id", 'oauth', 'google', "google_id"
FROM "users"
WHERE "google_id" IS NOT NULL
ON CONFLICT ("provider", "provider_account_id") DO NOTHING;
--> statement-breakpoint
INSERT INTO "accounts" ("user_id", "type", "provider", "provider_account_id")
SELECT "id", 'credentials', 'credentials', "id"
FROM "users"
WHERE "auth_provider" = 'credentials'
ON CONFLICT ("provider", "provider_account_id") DO NOTHING;
--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "email_verified" DROP DEFAULT;
--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "email_verified" TYPE timestamp USING (CASE WHEN "email_verified" = true THEN "created_at" ELSE NULL END);
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "image" text;
--> statement-breakpoint
DROP INDEX IF EXISTS "idx_users_google_id";
--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN IF EXISTS "google_id";
--> statement-breakpoint
ALTER TABLE "users" DROP COLUMN IF EXISTS "auth_provider";
