import {
  boolean,
  index,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";
import { user } from "./user";
import { endpoint, monitor } from "./monitor";

export const status_page = pgTable(
  "status_page",
  {
    id: uuid("id").primaryKey().defaultRandom().notNull(),

    user_id: uuid("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),

    name: varchar("name", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 100 }).notNull().unique(),
    description: text("description"),
    logo_url: text("logo_url"),
    custom_domain: varchar("custom_domain", { length: 255 }),

    is_public: boolean("is_public").notNull().default(true),
    is_password_protected: boolean("is_password_protected")
      .notNull()
      .default(false),
    password: varchar("password", { length: 255 }),

    created_at: timestamp("created_at").notNull().defaultNow(),
    updated_at: timestamp("updated_at").notNull().defaultNow(),
  },
  (table) => [
    index("status_page_user_id_idx").on(table.user_id),
    index("status_page_slug_idx").on(table.slug),
    index("status_page_custom_domain_idx").on(table.custom_domain),
    index("status_page_is_public_idx").on(table.is_public),
  ]
);

export const status_page_monitor = pgTable(
  "status_page_monitor",
  {
    id: uuid("id").primaryKey().defaultRandom().notNull(),

    status_page_id: uuid("status_page_id")
      .notNull()
      .references(() => status_page.id, { onDelete: "cascade" }),

    monitor_id: uuid("monitor_id")
      .notNull()
      .references(() => monitor.id, { onDelete: "cascade" }),

    display_order: integer("display_order").notNull().default(0),
    created_at: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [
    index("spm_status_page_id_idx").on(table.status_page_id),
    index("spm_monitor_id_idx").on(table.monitor_id),
    index("spm_status_page_order_idx").on(
      table.status_page_id,
      table.display_order
    ),
  ]
);

export const status_page_endpoint = pgTable(
  "status_page_endpoint",
  {
    id: uuid("id").primaryKey().defaultRandom().notNull(),

    status_page_id: uuid("status_page_id")
      .notNull()
      .references(() => status_page.id, { onDelete: "cascade" }),

    endpoint_id: uuid("endpoint_id")
      .notNull()
      .references(() => endpoint.id, { onDelete: "cascade" }),

    display_order: integer("display_order").notNull().default(0),
    created_at: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [
    index("spe_status_page_id_idx").on(table.status_page_id),
    index("spe_endpoint_id_idx").on(table.endpoint_id),
    index("spe_status_page_order_idx").on(
      table.status_page_id,
      table.display_order
    ),
  ]
);
