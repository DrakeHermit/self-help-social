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

// Scoped client — runs a callback with RLS enforced for a specific user.
export async function withRLS<T>(
  claims: { sub: string; role?: string },
  callback: (tx: Parameters<Parameters<typeof db.transaction>[0]>[0]) => Promise<T>
): Promise<T> {
  return db.transaction(async (tx) => {
    try {
      await tx.execute(sql`
        select set_config('request.jwt.claims', ${JSON.stringify(claims)}, true);
        select set_config('request.jwt.claim.sub', ${claims.sub}, true);
        set local role ${sql.raw(claims.role ?? "authenticated")};
      `);
      return await callback(tx);
    } finally {
      await tx.execute(sql`
        select set_config('request.jwt.claims', NULL, true);
        select set_config('request.jwt.claim.sub', NULL, true);
        reset role;
      `);
    }
  });
}