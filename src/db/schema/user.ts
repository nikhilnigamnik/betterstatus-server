import {
  pgTable,
  varchar,
  text,
  boolean,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { authProviderEnum, userRoleEnum } from "./enums";

export const user = pgTable("user", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),

  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }),

  name: varchar("name", { length: 100 }),
  avatar_url: text("avatar_url"),

  auth_provider: authProviderEnum("auth_provider").notNull().default("email"),

  provider_id: varchar("provider_id", { length: 255 }),

  is_active: boolean("is_active").notNull().default(true),

  email_verified_at: timestamp("email_verified_at"),
  last_login_at: timestamp("last_login_at"),

  role: userRoleEnum("role").notNull().default("user"),

  created_at: timestamp("created_at").notNull().defaultNow(),
  updated_at: timestamp("updated_at").notNull().defaultNow(),
});
