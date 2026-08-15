"use server";

import { headers } from "next/headers";

import { createClient } from "@/lib/supabase/server";

export async function signUp(name: string, email: string, password: string) {
  const origin = (await headers()).get("origin");
  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name },
      emailRedirectTo: origin ? `${origin}/profile` : undefined,
    },
  });
  if (error) throw error;
}
