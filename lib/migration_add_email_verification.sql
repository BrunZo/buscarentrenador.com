-- Migration: Add email verification columns to users table
-- Run this if you have an existing database

-- Add new columns
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS verification_token VARCHAR(255),
ADD COLUMN IF NOT EXISTS verification_token_expires TIMESTAMP;

-- Create index for verification_token
CREATE INDEX IF NOT EXISTS idx_users_verification_token ON users(verification_token);

-- Optional: Set existing users as verified (if you want to grandfather them in)
-- UPDATE users SET email_verified = TRUE WHERE email_verified IS NULL OR email_verified = FALSE;
