import { pgEnum } from "drizzle-orm/pg-core";

export const authProviderEnum = pgEnum("auth_provider", [
  "email",
  "google",
  "github",
]);
export const endpointMethodEnum = pgEnum("endpoint_method", [
  "GET",
  "POST",
  "PUT",
  "PATCH",
  "DELETE",
]);
export const checkStatusEnum = pgEnum("check_status", [
  "success",
  "failure",
  "timeout",
  "error",
]);
export const incidentStatusEnum = pgEnum("incident_status", [
  "open",
  "investigating",
  "resolved",
]);
export const incidentSeverityEnum = pgEnum("incident_severity", [
  "low",
  "medium",
  "high",
  "critical",
]);
export const jobStatusEnum = pgEnum("job_status", [
  "pending",
  "running",
  "completed",
  "failed",
]);
export const userRoleEnum = pgEnum("user_role", ["user", "member", "admin"]);
