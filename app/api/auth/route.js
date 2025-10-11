import { createSupabaseServerClient } from "@/lib/server"; //from "@/lib/server";
import { NextResponse } from "next/server";

export async function GET() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ isAuthenticated: false }, { status: 200 });
  }

  // Fetch teacher data from the teacher table
  const { data: teacher, error: teacherError } = await supabase
    .from("teacher")
    .select("name, phone_number, location, birthday, notes, is_active")
    .eq("id", user.id)
    .single();

  // Prepare user data, prioritizing teacher table data over auth metadata
  const userData = {
    id: user.id,
    email: user.email,
    user_metadata: {
      name: teacher?.name || user.user_metadata?.name || "",
      phone_number:
        teacher?.phone_number || user.user_metadata?.phone_number || "",
      location: teacher?.location || user.user_metadata?.location || "",
      birthday: teacher?.birthday || user.user_metadata?.birthday || "",
      notes: teacher?.notes || user.user_metadata?.notes || "",
      is_active: teacher?.is_active !== undefined ? teacher.is_active : true,
    },
  };

  if (teacherError) {
    console.error("Error fetching teacher data:", teacherError.message);
    return NextResponse.json(
      { isAuthenticated: true, user: userData },
      { status: 200 }
    );
  }

  return NextResponse.json(
    { isAuthenticated: true, user: userData },
    { status: 200 }
  );
}
