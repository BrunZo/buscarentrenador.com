CREATE TYPE "public"."user_role" AS ENUM('user', 'admin');
--> statement-breakpoint
CREATE TYPE "public"."trainer_status" AS ENUM('pending', 'approved', 'rejected');
--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "role" "user_role" DEFAULT 'user' NOT NULL;
--> statement-breakpoint
ALTER TABLE "trainers" ADD COLUMN "status" "trainer_status" DEFAULT 'pending' NOT NULL;
--> statement-breakpoint
-- Existing trainers predate moderation; treat them as already approved so
-- they don't disappear from search once the default 'pending' filter applies.
UPDATE "trainers" SET "status" = 'approved';
