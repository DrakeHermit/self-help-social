"use server";

import { createClient } from "@/lib/supabase/server";

export async function signUp(name: string, email: string, password: string) {
  const supabase = await createClient();

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name }, 
    },
  });
  if (error) throw error;
}
