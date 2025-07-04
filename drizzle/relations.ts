import { relations } from "drizzle-orm/relations";
import { users, jobs, jobLogs } from "./schema";

export const jobsRelations = relations(jobs, ({one, many}) => ({
	user: one(users, {
		fields: [jobs.userId],
		references: [users.id]
	}),
	jobLogs: many(jobLogs),
}));

export const usersRelations = relations(users, ({many}) => ({
	jobs: many(jobs),
}));

export const jobLogsRelations = relations(jobLogs, ({one}) => ({
	job: one(jobs, {
		fields: [jobLogs.jobId],
		references: [jobs.id]
	}),
}));