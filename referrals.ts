import { pgTable, text, serial, timestamp, integer, boolean, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";
import { usersTable } from "./users";

export const referralStatusEnum = pgEnum("referral_status", [
  "PENDING",
  "COMPLETED",
  "EXPIRED",
]);

export const referralsTable = pgTable("referrals", {
  id: serial("id").primaryKey(),
  referrerUserId: integer("referrer_user_id").notNull().references(() => usersTable.id),
  referredUserId: integer("referred_user_id").references(() => usersTable.id),
  referralCode: text("referral_code").notNull(),
  status: referralStatusEnum("status").notNull().default("PENDING"),
  rewardGranted: boolean("reward_granted").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertReferralSchema = createInsertSchema(referralsTable).omit({
  id: true,
  createdAt: true,
});
export type InsertReferral = z.infer<typeof insertReferralSchema>;
export type Referral = typeof referralsTable.$inferSelect;
