"use server";

import { createSupabaseServerClient } from "@/lib/server";
import { redirect } from "next/navigation";

// Sign Up Action
import { createClient } from "@supabase/supabase-js";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { supabase } from "@/lib/supabase";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function handleSignUp(prevState, formData) {
  // Use regular server client for auth operations
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({
    cookies: () => cookieStore,
  });
  const email = formData.get("email");
  const password = formData.get("password");
  const confirmPassword = formData.get("confirmPassword");
  const name = formData.get("name");
  const phoneNumber = formData.get("phoneNumber");
  const location = formData.get("location");
  const birthday = formData.get("birthday");

  // Validate passwords match
  if (password !== confirmPassword) {
    return { error: "Passwords do not match" };
  }

  // Validate birthday format
  if (birthday && isNaN(Date.parse(birthday))) {
    return { error: "Invalid birthday format" };
  }

  // Perform sign-up with Supabase
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback`,
      data: { name, phone_number: phoneNumber, location, birthday },
    },
  });

  if (error) {
    console.error("Sign-up error:", error);
    return { error: error.message };
  }

  if (data.user) {
    // Insert teacher record using service role (bypasses RLS)
    const { error: insertError } = await supabaseAdmin.from("teacher").insert({
      id: data.user.id,
      email,
      name,
      phone_number: phoneNumber,
      location,
      birthday,
      created_at: new Date().toISOString(),
    });

    if (insertError) {
      console.error("Error creating teacher record:", insertError);
      return {
        error: `Failed to create teacher record: ${insertError.message}`,
      };
    }
  }

  // Redirect to a page informing the user to confirm their email
  return { redirect: "/auth?mode=confirm-email" };
}

// Sign In Action
// Example: Update handleSignIn
export async function handleSignIn(prevState, formData) {
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({
    cookies: () => cookieStore,
  });

  const email = formData.get("email");
  const password = formData.get("password");

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  console.log("Sign-in data:", data, "Error:", error);

  if (error) {
    console.error("Sign-in error:", error);
    return { error: error.message };
  }

  return { redirect: "/dashboard" };
}

// Update Profile Action
export async function handleUpdateProfile(prevState, formData) {
  const supabase = await createSupabaseServerClient();
  const name = formData.get("name");
  const phoneNumber = formData.get("phoneNumber");
  const location = formData.get("location");
  const birthday = formData.get("birthday");

  // Validate birthday format
  if (birthday && isNaN(Date.parse(birthday))) {
    return { error: "Invalid birthday format" };
  }

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return { error: "Not authenticated" };
  }

  // Update user metadata
  const { error: metadataError } = await supabase.auth.updateUser({
    data: { name, phone_number: phoneNumber, location, birthday },
  });

  if (metadataError) {
    console.error("Metadata update error:", metadataError);
    return { error: metadataError.message };
  }

  // Update teacher record
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
    console.error("Teacher update error:", teacherError);
    return { error: teacherError.message };
  }

  return { redirect: "/dashboard" };
}

// Sign Out Action
export async function handleSignOut() {
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({
    cookies: () => cookieStore,
  });
  await supabase.auth.signOut();
  return redirect("/");
}
