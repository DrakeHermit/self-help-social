import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { sql } from "drizzle-orm";

const connectionString = process.env.DATABASE_URL!;

const globalForDb = globalThis as unknown as {
  sql: ReturnType<typeof postgres> | undefined;
};

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

// Bypasses RLS — table owner connection. Only for trusted admin/background work.
export const db = drizzle({ client });

export type RLSTransaction = Parameters<
  Parameters<typeof db.transaction>[0]
>[0];

const RLS_ROLES = ["authenticated", "anon"] as const;
type RLSRole = (typeof RLS_ROLES)[number];

// Scoped client — runs a callback with RLS enforced for a specific user.
// `set_config(..., true)` and `set local role` are transaction-scoped, so
// they are discarded automatically when the transaction ends.
export async function withRLS<T>(
  claims: { sub: string; role?: RLSRole },
  callback: (tx: RLSTransaction) => Promise<T>,
): Promise<T> {
  const role = claims.role ?? "authenticated";
  if (!RLS_ROLES.includes(role)) {
    throw new Error(`Unsupported RLS role: ${role}`);
  }

  return db.transaction(async (tx) => {
    await tx.execute(
      sql`select set_config('request.jwt.claims', ${JSON.stringify({ ...claims, role })}, true)`,
    );
    await tx.execute(
      sql`select set_config('request.jwt.claim.sub', ${claims.sub}, true)`,
    );
    await tx.execute(sql`select set_config('role', ${role}, true)`);
    return callback(tx);
  });
}
