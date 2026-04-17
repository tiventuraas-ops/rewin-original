import { pgTable, text, serial, timestamp, integer, pgEnum, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./users";
import { missionsTable } from "./missions";

export const submissionStatusEnum = pgEnum("submission_status", [
  "PENDING",
  "APPROVED",
  "REJECTED",
]);

export const submissionsTable = pgTable("mission_submissions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => usersTable.id),
  missionId: integer("mission_id").notNull().references(() => missionsTable.id),
  imageUrl: text("image_url"),
  comment: text("comment"),
  status: submissionStatusEnum("status").notNull().default("PENDING"),
  reviewComment: text("review_comment"),
  reviewedByAdminId: integer("reviewed_by_admin_id").references(() => usersTable.id),
  submittedAt: timestamp("submitted_at", { withTimezone: true }).notNull().defaultNow(),
  reviewedAt: timestamp("reviewed_at", { withTimezone: true }),
  pointsGranted: boolean("points_granted").notNull().default(false),
});

export const insertSubmissionSchema = createInsertSchema(submissionsTable).omit({
  id: true,
  submittedAt: true,
});
export type InsertSubmission = z.infer<typeof insertSubmissionSchema>;
export type Submission = typeof submissionsTable.$inferSelect;
