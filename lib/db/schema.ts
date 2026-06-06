import { pgTable, uuid, text, timestamp } from 'drizzle-orm/pg-core';

export const profilesTable = pgTable('profiles', {
  id: uuid('id').primaryKey(), 
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export type InsertProfile = typeof profilesTable.$inferInsert;
export type SelectProfile = typeof profilesTable.$inferSelect;
