import { pgTable, text, serial, timestamp, integer, boolean, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const userRoleEnum = pgEnum("user_role", ["CUSTOMER", "ADMIN"]);

export const loyaltyLevelEnum = pgEnum("loyalty_level", [
  "VERDE",
  "CALIENTE",
  "FUEGO",
  "LEYENDA",
]);

export const usersTable = pgTable("users", {
  id: serial("id").primaryKey(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull().unique(),
  normalizedEmail: text("normalized_email").notNull().unique(),
  phone: text("phone"),
  normalizedPhone: text("normalized_phone"),
  hashedPassword: text("hashed_password").notNull(),
  role: userRoleEnum("role").notNull().default("CUSTOMER"),
  pointsBalance: integer("points_balance").notNull().default(0),
  loyaltyLevel: loyaltyLevelEnum("loyalty_level").notNull().default("VERDE"),
  avatarUrl: text("avatar_url"),
  referralCode: text("referral_code").unique(),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertUserSchema = createInsertSchema(usersTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof usersTable.$inferSelect;
