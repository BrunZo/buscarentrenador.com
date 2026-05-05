-- Backfill existing trainers whose groups array was created when only
-- [Individual, Grupal] existed (length 2). Append `false` for the new
-- "Escuela" option so all rows match the new length-3 contract.
UPDATE "trainers"
SET "groups" = "groups" || ARRAY[false]::boolean[]
WHERE cardinality("groups") < 3;
