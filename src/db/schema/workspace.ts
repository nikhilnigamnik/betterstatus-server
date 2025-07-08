import {
  pgTable,
  uuid,
  text,
  boolean,
  timestamp,
  json,
} from "drizzle-orm/pg-core";
import { user } from "./user";
import { jobStatusEnum } from "../schema";
import { notificationTypeEnum, notificationChannelEnum } from "./enums";

export const workspace = pgTable("workspace", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  user_id: uuid("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  status: jobStatusEnum("status").notNull().default("active"),
  is_active: boolean("is_active").default(true).notNull(),
  description: text("description"),
  logo_url: text("logo_url"),
  website_url: text("website_url"),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().notNull(),
});

export const workspace_member = pgTable("workspace_member", {
  id: uuid("id").primaryKey().defaultRandom(),
  workspace_id: uuid("workspace_id")
    .notNull()
    .references(() => workspace.id, { onDelete: "cascade" }),
  user_id: uuid("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  role: text("role").default("member"), // admin, member
  invited_at: timestamp("invited_at").defaultNow().notNull(),
  accepted: boolean("accepted").default(false).notNull(),
});

export const workspace_notification = pgTable("workspace_notification", {
  id: uuid("id").primaryKey().defaultRandom(),
  workspace_id: uuid("workspace_id")
    .notNull()
    .references(() => workspace.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  type: notificationTypeEnum("type").notNull(),
  channel: notificationChannelEnum("channel").notNull(),
  config: json("config").notNull(), // { webhook_url, slack_channel, email_addresses, etc. }
  is_active: boolean("is_active").default(true),
  created_at: timestamp("created_at").defaultNow(),
  updated_at: timestamp("updated_at").defaultNow(),
});

export const notification_log = pgTable("notification_log", {
  id: uuid("id").primaryKey().defaultRandom(),
  workspace_id: uuid("workspace_id")
    .notNull()
    .references(() => workspace.id, { onDelete: "cascade" }),
  notification_id: uuid("notification_id")
    .references(() => workspace_notification.id, { onDelete: "cascade" })
    .notNull(),
  type: notificationTypeEnum("type").notNull(),
  channel: notificationChannelEnum("channel").notNull(),
  recipient: text("recipient"), // email, slack channel, webhook URL
  subject: text("subject"),
  message: text("message").notNull(),
  status: text("status").default("pending"), // pending, sent, failed
  error_message: text("error_message"),
  sent_at: timestamp("sent_at"),
  created_at: timestamp("created_at").defaultNow(),
});
