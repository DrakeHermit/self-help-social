# Self Help Social

A quiet habit journal. Create a habit, write a short note each day, and watch
your streaks and activity heatmap grow.

## Stack

- [Next.js](https://nextjs.org) (App Router, server actions)
- [Supabase](https://supabase.com) for auth and Postgres
- [Drizzle ORM](https://orm.drizzle.team) for schema and queries
- [Tailwind CSS](https://tailwindcss.com) and [shadcn/ui](https://ui.shadcn.com)
- [Zod](https://zod.dev) for validating server action input

## Running locally

1. Create a Supabase project and copy its keys.

2. Create `.env.local`:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
   DATABASE_URL=
   ```

   `DATABASE_URL` is the Postgres connection string from the Supabase dashboard.

3. Push the schema to your database:

   ```bash
   npx drizzle-kit push
   ```

4. Install and start the dev server:

   ```bash
   npm install
   npm run dev
   ```

## Data access and row level security

Every table has row level security enabled. User-scoped queries run through
`withRLS` in `lib/db/index.ts`, which sets the signed-in user's claims and
switches to the `authenticated` role for the duration of a transaction. The
bare `db` export connects as the table owner and bypasses RLS, so it should
only be used for trusted admin work.

Policies are defined next to the tables in `lib/db/schema.ts`.
