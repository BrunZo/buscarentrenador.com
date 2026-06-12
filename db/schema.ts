import crypto from "crypto";
import {
  pgTable,
  serial,
  varchar,
  text,
  boolean,
  timestamp,
  decimal,
  integer,
  index,
  primaryKey,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const users = pgTable(
  "users",
  {
    id: varchar("id", { length: 255 })
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    email: varchar("email", { length: 255 }).notNull().unique(),
    password_hash: varchar("password_hash", { length: 255 }),
    name: varchar("name", { length: 255 }).notNull(),
    surname: varchar("surname", { length: 255 }).notNull(),
    emailVerified: timestamp("email_verified"),
    image: text("image"),
    created_at: timestamp("created_at").defaultNow(),
    updated_at: timestamp("updated_at").defaultNow(),
  },
  (table) => [index("idx_users_email").on(table.email)],
);

export const trainers = pgTable(
  "trainers",
  {
    id: serial("id").primaryKey(),
    user_id: varchar("user_id", { length: 255 }).references(() => users.id, {
      onDelete: "cascade",
    }),
    city: varchar("city", { length: 255 }),
    province: varchar("province", { length: 255 }),
    description: text("description"),
    places: boolean("places").array(),
    groups: boolean("groups").array(),
    levels: boolean("levels").array(),
    hourly_rate: decimal("hourly_rate", { precision: 10, scale: 2 }),
    certifications: text("certifications").array(),
    is_visible: boolean("is_visible").default(true),
    soy_exo: boolean("soy_exo").default(false),
    examenes_oma: boolean("examenes_oma").default(false),
    created_at: timestamp("created_at").defaultNow(),
    updated_at: timestamp("updated_at").defaultNow(),
  },
  (table) => [index("idx_trainers_user_id").on(table.user_id)],
);

export const accounts = pgTable(
  "accounts",
  {
    userId: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: varchar("type", { length: 50 }).notNull(),
    provider: varchar("provider", { length: 50 }).notNull(),
    providerAccountId: varchar("provider_account_id", {
      length: 255,
    }).notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: varchar("token_type", { length: 50 }),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: varchar("session_state", { length: 255 }),
  },
  (table) => [
    primaryKey({ columns: [table.provider, table.providerAccountId] }),
    index("idx_accounts_user_id").on(table.userId),
  ],
);

export const sessions = pgTable(
  "sessions",
  {
    id: varchar("id", { length: 255 }).primaryKey(),
    user_id: varchar("user_id", { length: 255 }).references(() => users.id, {
      onDelete: "cascade",
    }),
    expires_at: timestamp("expires_at").notNull(),
    created_at: timestamp("created_at").defaultNow(),
  },
  (table) => [
    index("idx_sessions_user_id").on(table.user_id),
    index("idx_sessions_expires_at").on(table.expires_at),
  ],
);

export const verificationTokens = pgTable(
  "verification_tokens",
  {
    user_id: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    token: varchar("token", { length: 255 }).primaryKey(),
    expires: timestamp("expires").notNull(),
  },
  (table) => [
    index("idx_verification_tokens_user_id").on(table.user_id),
    index("idx_verification_tokens_token").on(table.token),
  ],
);

export const passwordResetTokens = pgTable(
  "password_reset_tokens",
  {
    user_id: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    token: varchar("token", { length: 255 }).primaryKey(),
    expires: timestamp("expires").notNull(),
  },
  (table) => [
    index("idx_password_reset_tokens_user_id").on(table.user_id),
    index("idx_password_reset_tokens_token").on(table.token),
  ],
);

export const usersRelations = relations(users, ({ one, many }) => ({
  trainer: one(trainers),
  sessions: many(sessions),
  accounts: many(accounts),
}));

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, {
    fields: [accounts.userId],
    references: [users.id],
  }),
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
