import { pgTable, uuid, text, boolean } from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password"),
  provider: text("provider").notNull().default("email"),
  role: text("role").notNull().default("user"),
  is_active: boolean("is_active").default(true).notNull(),
  is_verified: boolean("is_verified").default(false).notNull(),
  avatar_url: text("avatar_url"),
});
