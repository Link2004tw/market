// pages/api/admin-signup.ts (or app/api/admin-signup/route.ts for App Router)
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
export async function POST(req) {
  const { email, password } = await req.json();

  // Create admin user with role in app_metadata
  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true, // Auto-confirm for testing
    user_metadata: { role: "admin" }, // Assign admin role
  });

  if (error)
    return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ user: data.user });
}
