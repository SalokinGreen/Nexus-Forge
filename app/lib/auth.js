import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export async function signInWithEmail(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
}

export async function signUpWithEmail(email, password) {
  const { user, error } = await supabase.auth.signUp({ email, password });
  return { user, error };
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  return error ? { error } : { success: true };
  // await supabase.auth.signOut();
}

export async function getSession() {
  const { data, error } = await supabase.auth.getSession();
  console.log("session:", data);
  return { data };
}

export async function getUser() {
  const data = await supabase.auth.getUser();
  const user = data.data.user;
  console.log("data:", data);
  console.log("user:", user);

  if (user) {
    console.log("give data");
    return user;
  }
  return null;
}
