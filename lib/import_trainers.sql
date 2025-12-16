-- Import trainers from CSV staging generated from 'Copy of Entrenadores OMA.xlsx'
-- Temp password for ALL imported users (bcrypt hash of "Cambiar123!").
-- IMPORTANT: make your app force a password reset, or change hashes later.
-- Hash: $2b$10$.i7cq1R/NQRWw1uoBTgWiODzuHHhzbeldsLGoT/vlNc/1bt07QcNq

BEGIN;

-- Ensure unique constraint on trainers.user_id exists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'trainers_user_id_unique'
  ) THEN
    ALTER TABLE trainers ADD CONSTRAINT trainers_user_id_unique UNIQUE (user_id);
  END IF;
END$$;

-- 1) Insert users (skip if email already exists)
-- Handle null/empty surnames by using empty string as default
INSERT INTO users (email, password_hash, name, surname, created_at, updated_at)
SELECT
  email,
  '$2b$10$.i7cq1R/NQRWw1uoBTgWiODzuHHhzbeldsLGoT/vlNc/1bt07QcNq'::varchar,
  COALESCE(NULLIF(TRIM(name), ''), '') as name,
  COALESCE(NULLIF(TRIM(surname), ''), '') as surname,
  created_at,
  updated_at
FROM tmp_trainer_import
WHERE email IS NOT NULL AND email <> ''
ON CONFLICT (email) DO NOTHING;

-- 2) Insert trainers (skip if user_id already has a trainer record)
INSERT INTO trainers (user_id, city, province, description, places, groups, levels, hourly_rate, certifications, created_at, updated_at)
SELECT
  u.id as user_id,
  t.city,
  t.province,
  NULL::TEXT as description,
  t.places_lit::BOOLEAN[] as places,
  t.groups_lit::BOOLEAN[] as groups,
  t.levels_lit::BOOLEAN[] as levels,
  NULL::decimal(10,2) as hourly_rate,
  NULL::text[] as certifications,
  t.created_at,
  t.updated_at
FROM tmp_trainer_import t
JOIN users u ON u.email = t.email
ON CONFLICT (user_id) DO NOTHING;

COMMIT;
