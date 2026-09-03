import { desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  CoachingEnrollment,
  ContactSubmission,
  InsertCoachingEnrollment,
  InsertContactSubmission,
  InsertUser,
  InsertWorkshopEnrollment,
  WorkshopEnrollment,
  coachingEnrollments,
  contactSubmissions,
  users,
  workshopEnrollments,
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

/**
 * Save a new coaching enrollment to the database
 */
export async function saveCoachingEnrollment(enrollment: InsertCoachingEnrollment): Promise<void> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot save coaching enrollment: database not connected");
    return;
  }

  try {
    await db.insert(coachingEnrollments).values(enrollment);
  } catch (error) {
    console.error("[Database] Failed to save coaching enrollment:", error);
    throw error;
  }
}

/**
 * Save a new workshop / seminar enrollment to the database
 */
export async function saveWorkshopEnrollment(enrollment: InsertWorkshopEnrollment): Promise<void> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot save workshop enrollment: database not connected");
    return;
  }

  try {
    await db.insert(workshopEnrollments).values(enrollment);
  } catch (error) {
    console.error("[Database] Failed to save workshop enrollment:", error);
    throw error;
  }
}

/**
 * Save a new contact / consultation submission to the database
 */
export async function saveContactSubmission(submission: InsertContactSubmission): Promise<void> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot save contact submission: database not connected");
    return;
  }

  try {
    await db.insert(contactSubmissions).values(submission);
  } catch (error) {
    console.error("[Database] Failed to save contact submission:", error);
    throw error;
  }
}

/**
 * Fetch recent coaching enrollments
 */
export async function getCoachingEnrollments(limit = 100): Promise<CoachingEnrollment[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(coachingEnrollments).orderBy(desc(coachingEnrollments.createdAt)).limit(limit);
}

/**
 * Fetch recent workshop / seminar enrollments
 */
export async function getWorkshopEnrollments(limit = 100): Promise<WorkshopEnrollment[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(workshopEnrollments).orderBy(desc(workshopEnrollments.createdAt)).limit(limit);
}

/**
 * Fetch recent contact submissions
 */
export async function getContactSubmissions(limit = 100): Promise<ContactSubmission[]> {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(contactSubmissions).orderBy(desc(contactSubmissions.createdAt)).limit(limit);
}

