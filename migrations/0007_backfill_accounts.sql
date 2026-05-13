INSERT INTO "accounts" ("user_id", "type", "provider", "provider_account_id")
SELECT "id", 'oauth', 'google', "google_id"
FROM "users"
WHERE "google_id" IS NOT NULL
ON CONFLICT ("provider", "provider_account_id") DO NOTHING;
--> statement-breakpoint
INSERT INTO "accounts" ("user_id", "type", "provider", "provider_account_id")
SELECT "id", 'credentials', 'credentials', "id"::text
FROM "users"
WHERE "auth_provider" = 'credentials'
ON CONFLICT ("provider", "provider_account_id") DO NOTHING;
