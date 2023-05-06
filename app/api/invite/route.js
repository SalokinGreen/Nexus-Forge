import { NextResponse } from "next/server";
import { useSupabase } from "@/app/supabase-provider";
export async function POST(request) {
  const { supabase } = useSupabase();
  // get the request body
  const req = await request.json();
  const { user } = await supabase.auth.api.getUserByCookie(req);
  console.log(user);
  if (user) {
    const { data, error } = await supabase
      .from("invites")
      .insert([{ code: req.body.code }]);
    if (error) {
      return res.status(400).json({ error: error.message });
    }
    return res.status(200).json(data[0]);
  } else {
    return res.status(401).json({ error: "Unauthorized" });
  }

  return NextResponse.json(response.data.output);
}
