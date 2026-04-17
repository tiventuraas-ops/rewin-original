import { pgTable, text, serial, timestamp, integer, boolean, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const rewardCategoryEnum = pgEnum("reward_category", [
  "BOISSON",
  "PLAT",
  "DESSERT",
  "EXPERIENCE",
  "MERCH",
  "REDUCTION",
]);

export const rewardsTable = pgTable("rewards", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  shortDescription: text("short_description"),
  imageUrl: text("image_url"),
  pointsCost: integer("points_cost").notNull(),
  category: rewardCategoryEnum("category").notNull(),
  stock: integer("stock"),
  isActive: boolean("is_active").notNull().default(true),
  isFeatured: boolean("is_featured").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});

export const insertRewardSchema = createInsertSchema(rewardsTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertReward = z.infer<typeof insertRewardSchema>;
export type Reward = typeof rewardsTable.$inferSelect;
