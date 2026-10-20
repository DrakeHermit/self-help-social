"use server";

import { createClient } from "@/lib/supabase/server";
import { loginSchema, parseInput } from "@/lib/validation";

export async function login(email: string, password: string) {
  const input = parseInput(loginSchema, { email, password });
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword(input);
  if (error) throw error;
}
