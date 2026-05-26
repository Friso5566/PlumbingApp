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
  /** Optional region preference for localized guidance (e.g., 'US', 'UK', 'EU', 'AU', 'CA', 'NZ', 'SG', 'IN', 'JP', 'CN', 'BR', 'MX') */
  region: varchar("region", { length: 64 }).default("universal"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Available regions for localized guidance
export const AVAILABLE_REGIONS = [
  { code: "universal", name: "Universal (No Regional Codes)" },
  { code: "US", name: "United States" },
  { code: "UK", name: "United Kingdom" },
  { code: "EU", name: "European Union" },
  { code: "AU", name: "Australia" },
  { code: "CA", name: "Canada" },
  { code: "NZ", name: "New Zealand" },
  { code: "SG", name: "Singapore" },
  { code: "IN", name: "India" },
  { code: "JP", name: "Japan" },
  { code: "CN", name: "China" },
  { code: "BR", name: "Brazil" },
  { code: "MX", name: "Mexico" },
  { code: "SA", name: "South Africa" },
  { code: "NG", name: "Nigeria" },
  { code: "KE", name: "Kenya" },
] as const;

export type RegionCode = typeof AVAILABLE_REGIONS[number]["code"];

/**
 * Plumbing queries and responses table
 * Stores conversation history with LLM responses
 */
export const plumbingQueries = mysqlTable("plumbing_queries", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().references(() => users.id),
  queryType: mysqlEnum("queryType", ["text", "image"]).notNull(),
  queryText: text("queryText"),
  imageUrl: varchar("imageUrl", { length: 512 }),
  response: text("response").notNull(),
  /** Region context used for this query (for reference/audit) */
  region: varchar("region", { length: 64 }).default("universal"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type PlumbingQuery = typeof plumbingQueries.$inferSelect;
export type InsertPlumbingQuery = typeof plumbingQueries.$inferInsert;
