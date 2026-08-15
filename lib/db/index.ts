import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

const connectionString = process.env.DATABASE_URL!;

const globalForDb = globalThis as unknown as {
  sql: ReturnType<typeof postgres> | undefined;
};

// Reuse one client across Fast Refresh. `postgres()` opens a pool (default
// max 10), and the session-mode pooler only allows 15 clients total — a few
// reloads used to exhaust it before any query could run.
const client =
  globalForDb.sql ??
  postgres(connectionString, {
    max: 1,
    idle_timeout: 20,
    connect_timeout: 10,
    prepare: false,
  });

if (process.env.NODE_ENV !== "production") {
  globalForDb.sql = client;
}

export const db = drizzle({ client });
