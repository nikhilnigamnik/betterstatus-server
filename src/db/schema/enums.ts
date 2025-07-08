import { pgEnum } from "drizzle-orm/pg-core";

export const monitorTypeEnum = pgEnum("monitor_type", ["website", "api"]);
export const httpMethodEnum = pgEnum("http_method", [
  "GET",
  "POST",
  "PUT",
  "DELETE",
  "PATCH",
]);
export const statusEnum = pgEnum("status", [
  "active",
  "paused",
  "failed",
  "completed",
]);

export const incidentStatusEnum = pgEnum("incident_status", [
  "investigating",
  "resolved",
  "monitoring",
]);

export const retentionPeriodEnum = pgEnum("retention_period", [
  "7_days",
  "30_days",
  "90_days",
  "180_days",
  "365_days",
  "never",
]);

export const notificationTypeEnum = pgEnum("notification_type", [
  "monitor_down",
  "monitor_up",
  "job_failed",
  "job_success",
  "incident_created",
  "incident_resolved",
]);

export const notificationChannelEnum = pgEnum("notification_channel", [
  "email",
  "slack",
  "webhook",
  "sms",
]);
