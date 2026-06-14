import {
  pgTable,
  pgEnum,
  serial,
  varchar,
  text,
  boolean,
  timestamp,
  decimal,
  integer,
  bigint,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

export const userRole = pgEnum("user_role", ["user", "admin"]);
export const trainerStatus = pgEnum("trainer_status", [
  "pending",
  "approved",
  "rejected",
]);

export const users = pgTable(
  "users",
  {
    id: varchar("id", { length: 255 }).primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    surname: varchar("surname", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    role: userRole("role").notNull().default("user"),
    emailVerified: boolean("email_verified").notNull().default(false),
    image: text("image"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [index("idx_users_email").on(table.email)],
);

export const sessions = pgTable(
  "sessions",
  {
    id: varchar("id", { length: 255 }).primaryKey(),
    expiresAt: timestamp("expires_at").notNull(),
    token: text("token").notNull().unique(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    userId: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [
    index("idx_sessions_user_id").on(table.userId),
    index("idx_sessions_token").on(table.token),
  ],
);

export const accounts = pgTable(
  "accounts",
  {
    id: varchar("id", { length: 255 }).primaryKey(),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    userId: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    idToken: text("id_token"),
    accessTokenExpiresAt: timestamp("access_token_expires_at"),
    refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [index("idx_accounts_user_id").on(table.userId)],
);

export const verifications = pgTable(
  "verifications",
  {
    id: varchar("id", { length: 255 }).primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expires_at").notNull(),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [index("idx_verifications_identifier").on(table.identifier)],
);

export const rateLimits = pgTable(
  "rate_limits",
  {
    id: varchar("id", { length: 255 }).primaryKey(),
    key: text("key"),
    count: integer("count"),
    lastRequest: bigint("last_request", { mode: "number" }),
  },
  (table) => [index("idx_rate_limits_key").on(table.key)],
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
    status: trainerStatus("status").notNull().default("pending"),
    soy_exo: boolean("soy_exo").default(false),
    examenes_oma: boolean("examenes_oma").default(false),
    created_at: timestamp("created_at").defaultNow(),
    updated_at: timestamp("updated_at").defaultNow(),
  },
  (table) => [index("idx_trainers_user_id").on(table.user_id)],
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
    fields: [sessions.userId],
    references: [users.id],
  }),
}));
