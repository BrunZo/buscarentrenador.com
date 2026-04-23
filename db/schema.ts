import { pgTable, serial, varchar, text, boolean, timestamp, decimal, integer, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Users table
export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  password_hash: varchar('password_hash', { length: 255 }).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  surname: varchar('surname', { length: 255 }).notNull(),
  email_verified: boolean('email_verified').default(false),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
}, (table) => [
  index('idx_users_email').on(table.email),
]);

// Trainers table
export const trainers = pgTable('trainers', {
  id: serial('id').primaryKey(),
  user_id: integer('user_id').references(() => users.id, { onDelete: 'cascade' }),
  city: varchar('city', { length: 255 }),
  province: varchar('province', { length: 255 }),
  description: text('description'),
  places: boolean('places').array(),
  groups: boolean('groups').array(),
  levels: boolean('levels').array(),
  hourly_rate: decimal('hourly_rate', { precision: 10, scale: 2 }),
  certifications: text('certifications').array(),
  is_visible: boolean('is_visible').default(true),
  soy_exo: boolean('soy_exo').default(false),
  examenes_oma: boolean('examenes_oma').default(false),
  created_at: timestamp('created_at').defaultNow(),
  updated_at: timestamp('updated_at').defaultNow(),
}, (table) => [
  index('idx_trainers_user_id').on(table.user_id),
]);

export const sessions = pgTable('sessions', {
  id: varchar('id', { length: 255 }).primaryKey(),
  user_id: integer('user_id').references(() => users.id, { onDelete: 'cascade' }),
  expires_at: timestamp('expires_at').notNull(),
  created_at: timestamp('created_at').defaultNow(),
}, (table) => [
  index('idx_sessions_user_id').on(table.user_id),
  index('idx_sessions_expires_at').on(table.expires_at),
]);

// Verification tokens for email verification
export const verificationTokens = pgTable('verification_tokens', {
  user_id: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  token: varchar('token', { length: 255 }).primaryKey(),
  expires: timestamp('expires').notNull(),
}, (table) => [
  index('idx_verification_tokens_user_id').on(table.user_id),
  index('idx_verification_tokens_token').on(table.token),
]);

// Password reset tokens
export const passwordResetTokens = pgTable('password_reset_tokens', {
  user_id: integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  token: varchar('token', { length: 255 }).primaryKey(),
  expires: timestamp('expires').notNull(),
}, (table) => [
  index('idx_password_reset_tokens_user_id').on(table.user_id),
  index('idx_password_reset_tokens_token').on(table.token),
]);

// Relations
export const usersRelations = relations(users, ({ one, many }) => ({
  trainer: one(trainers),
  sessions: many(sessions),
}));

export const trainersRelations = relations(trainers, ({ one }) => ({
  user: one(users, {
    fields: [trainers.user_id],
    references: [users.id],
  }),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.user_id],
    references: [users.id],
  }),
}));
