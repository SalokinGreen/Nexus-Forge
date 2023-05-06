import { NextResponse } from "next/server";
import { useSupabase } from "@/app/supabase-provider";
export async function POST(request) {
  const { supabase } = useSupabase();
  // get the request body
  const req = await request.json();
  const { email, password, inviteCode } = req;

  // Validate the invite code
  const { data: inviteData, error: inviteError } = await supabase
    .from("invites")
    .select("*")
    .eq("code", inviteCode)
    .eq("is_used", false)
    .single();

  if (inviteError || !inviteData) {
    return res.status(400).json({ error: "Invalid or used invitation code" });
  }

  // Create a new user
  const { user, session, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  // Update the invite to mark it as used
  await supabase
    .from("invites")
    .update({ is_used: true })
    .eq("code", inviteCode);

  // Create a cookie for the session
  res.setHeader("Set-Cookie", [supabase.auth.api.createSessionCookie(session)]);

  return res.status(200).json({ user });

  return NextResponse.json(response.data.output);
}
