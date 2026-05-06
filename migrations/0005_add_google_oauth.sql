ALTER TABLE "users" ALTER COLUMN "password_hash" DROP NOT NULL;
ALTER TABLE "users" ADD COLUMN "auth_provider" varchar(20) DEFAULT 'credentials' NOT NULL;
ALTER TABLE "users" ADD COLUMN "google_id" varchar(255);
CREATE UNIQUE INDEX "idx_users_google_id" ON "users" ("google_id");