import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Coaching student enrollments table
 */
export const coachingEnrollments = mysqlTable("coaching_enrollments", {
  id: int("id").autoincrement().primaryKey(),
  studentName: varchar("studentName", { length: 255 }).notNull(),
  dob: varchar("dob", { length: 64 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  phone: varchar("phone", { length: 64 }).default(""),
  parentName: varchar("parentName", { length: 255 }).default(""),
  schoolCollege: varchar("schoolCollege", { length: 255 }).default(""),
  currentClass: varchar("currentClass", { length: 128 }).default(""),
  course: varchar("course", { length: 255 }).notNull(),
  batchTiming: varchar("batchTiming", { length: 128 }).default(""),
  experienceLevel: varchar("experienceLevel", { length: 128 }).default(""),
  referralSource: varchar("referralSource", { length: 255 }).default(""),
  additionalNotes: text("additionalNotes"),
  status: varchar("status", { length: 64 }).default("pending").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CoachingEnrollment = typeof coachingEnrollments.$inferSelect;
export type InsertCoachingEnrollment = typeof coachingEnrollments.$inferInsert;

/**
 * Contact & consultation form submissions table
 */
export const contactSubmissions = mysqlTable("contact_submissions", {
  id: int("id").autoincrement().primaryKey(),
  kind: varchar("kind", { length: 64 }).default("contact").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  company: varchar("company", { length: 255 }).default(""),
  title: varchar("title", { length: 255 }).default(""),
  country: varchar("country", { length: 128 }).default(""),
  phone: varchar("phone", { length: 64 }).default(""),
  service: varchar("service", { length: 255 }).default(""),
  platform: varchar("platform", { length: 255 }).default(""),
  description: text("description"),
  timeline: varchar("timeline", { length: 128 }).default(""),
  additional: text("additional"),
  status: varchar("status", { length: 64 }).default("new").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ContactSubmission = typeof contactSubmissions.$inferSelect;
export type InsertContactSubmission = typeof contactSubmissions.$inferInsert;