import { pgTable, pgSchema, uuid, text, timestamp, date, boolean } from 'drizzle-orm/pg-core';

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
});

export const habits = pgTable('habits', {
  id: uuid('id').primaryKey(),
  userId: uuid('user_id').references(() => profilesTable.id),
  name: text('name').notNull(),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const habitEntries = pgTable('habit_entries', {
  id: uuid('id').primaryKey(),
  habitId: uuid('habit_id').references(() => habits.id),
  date: date('date').notNull(),
  completed: boolean('completed').notNull().default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export type InsertProfile = typeof profilesTable.$inferInsert;
export type SelectProfile = typeof profilesTable.$inferSelect;
export type InsertHabit = typeof habits.$inferInsert;
export type SelectHabit = typeof habits.$inferSelect;
export type InsertHabitEntry = typeof habitEntries.$inferInsert;
export type SelectHabitEntry = typeof habitEntries.$inferSelect;