import { createSupabaseServerClient } from "@/lib/server"; //from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request) {
  const supabase = await createSupabaseServerClient();
  const formData = await request.formData();
  const name = formData.get("name");
  const phoneNumber = formData.get("phoneNumber");
  const location = formData.get("location");
  const birthday = formData.get("birthday");

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { error: metadataError } = await supabase.auth.updateUser({
    data: { name, phone_number: phoneNumber, location, birthday },
  });

  if (metadataError) {
    return NextResponse.json({ error: metadataError.message }, { status: 400 });
  }

  const { error: teacherError } = await supabase
    .from("teacher")
    .update({
      name,
      phone_number: phoneNumber,
      location,
      birthday,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (teacherError) {
    return NextResponse.json({ error: teacherError.message }, { status: 400 });
  }

  return NextResponse.json({ redirect: "/dashboard" }, { status: 200 });
}
