import { createClient } from "@/lib/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { NextResponse } from "next/server";

export default async function GET() {
  const { searchParams } = new URL(request.url);

  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { data: u, error: uError } = await supabaseAdmin
    .from("User")
    .select(`*`)
    .eq("uid", user.id);
  console.log(u);
  return NextResponse.json({ data: u });
}
