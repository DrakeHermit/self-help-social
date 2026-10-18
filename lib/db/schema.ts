import { pgTable, pgSchema, uuid, text, timestamp, date, boolean, pgPolicy, index } from 'drizzle-orm/pg-core';
import { authenticatedRole } from "drizzle-orm/supabase";
import { sql } from "drizzle-orm";

const authSchema = pgSchema('auth');

export const authUsers = authSchema.table('users', {
  id: uuid('id').primaryKey(),
});

export const profilesTable = pgTable('profiles', {
  id: uuid('id')
    .primaryKey()
    .references(() => authUsers.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
},
(table) => [
  pgPolicy("users can view their own profile", {
    for: "select",
    to: authenticatedRole,
    using: sql`auth.uid() = ${table.id}`,
  }),
  pgPolicy("users can insert their own profile", {
    for: "insert",
    to: authenticatedRole,
    withCheck: sql`auth.uid() = ${table.id}`,
  }),
  pgPolicy("users can update their own profile", {
    for: "update",
    to: authenticatedRole,
    using: sql`auth.uid() = ${table.id}`,
    withCheck: sql`auth.uid() = ${table.id}`,
  }),
])

export const habits = pgTable('habits', {
  id: uuid('id').primaryKey(),
  userId: uuid('user_id')
    .notNull()
    .references(() => profilesTable.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(), 
},
(table) => [
  index('habits_user_id_idx').on(table.userId),
  pgPolicy("users can view their own habits", {
    for: "select",
    to: authenticatedRole,
    using: sql`auth.uid() = ${table.userId}`,
  }),
  pgPolicy("users can insert their own habits", {
    for: "insert",
    to: authenticatedRole,
    withCheck: sql`auth.uid() = ${table.userId}`,
  }),
  pgPolicy("users can update their own habits", {
    for: "update",
    to: authenticatedRole,
    using: sql`auth.uid() = ${table.userId}`,
    withCheck: sql`auth.uid() = ${table.userId}`,
  }),
  pgPolicy("users can delete their own habits", {
    for: "delete",
    to: authenticatedRole,
    using: sql`auth.uid() = ${table.userId}`,
  }),
])

export const habitEntries = pgTable('habit_entries', {
  id: uuid('id').primaryKey(),
  habitId: uuid('habit_id')
    .notNull()
    .references(() => habits.id, { onDelete: 'cascade' }),
  date: date('date').notNull(),
  completed: boolean('completed').notNull().default(false),
  note: text('note'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
},
(table) => [
  index('habit_entries_habit_id_date_idx').on(table.habitId, table.date),
  pgPolicy("users can view their own habit entries", {
    for: "select",
    to: authenticatedRole,
    using: sql`exists (select 1 from ${habits} where ${habits.id} = ${table.habitId} and ${habits.userId} = auth.uid())`,
  }),
  pgPolicy("users can insert their own habit entries", {
    for: "insert",
    to: authenticatedRole,
    withCheck: sql`exists (select 1 from ${habits} where ${habits.id} = ${table.habitId} and ${habits.userId} = auth.uid())`,
  }),
  pgPolicy("users can update their own habit entries", {
    for: "update",
    to: authenticatedRole,
    using: sql`exists (select 1 from ${habits} where ${habits.id} = ${table.habitId} and ${habits.userId} = auth.uid())`,
    withCheck: sql`exists (select 1 from ${habits} where ${habits.id} = ${table.habitId} and ${habits.userId} = auth.uid())`,
  }),
  pgPolicy("users can delete their own habit entries", {
    for: "delete",
    to: authenticatedRole,
    using: sql`exists (select 1 from ${habits} where ${habits.id} = ${table.habitId} and ${habits.userId} = auth.uid())`,
  }),
])

export type InsertProfile = typeof profilesTable.$inferInsert;
export type SelectProfile = typeof profilesTable.$inferSelect;
export type InsertHabit = typeof habits.$inferInsert;
export type SelectHabit = typeof habits.$inferSelect;
export type InsertHabitEntry = typeof habitEntries.$inferInsert;
export type SelectHabitEntry = typeof habitEntries.$inferSelect;