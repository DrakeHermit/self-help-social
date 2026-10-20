"use server";

import { headers } from "next/headers";

import { createClient } from "@/lib/supabase/server";
import { parseInput, signUpSchema } from "@/lib/validation";

export async function signUp(name: string, email: string, password: string) {
  const input = parseInput(signUpSchema, { name, email, password });
  const origin = (await headers()).get("origin");
  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email: input.email,
    password: input.password,
    options: {
      data: { name: input.name },
      emailRedirectTo: origin ? `${origin}/profile` : undefined,
    },
  });
  if (error) throw error;
}
