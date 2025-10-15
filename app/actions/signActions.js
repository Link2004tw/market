"use server";

import { createClient } from "@/lib/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import User from "@/models/user";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function login(formData) {
  const supabase = await createClient();
  //const supabaseAdmin = await crea
  const cr = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const { error, data } = await supabase.auth.signInWithPassword(cr);
  console.log(data);

  if (error) {
    redirect("/error");
  }
  const authUID = data.user?.id;
  if (!authUID) {
    console.error("No user ID found in session");
    redirect("/error?message=No user ID found");
  }
  //load his data from the database
  const { data: userData, error: userError } = await supabaseAdmin
    .from("User")
    .select("uID, username, email, phoneNumber, profileImage, lastLogin")
    .eq("uID", authUID)
    .single();
  const user = new User(
    userData.uID,
    userData.username,
    userData.email,
    userData.phoneNumber,
    userData.profileImage,
    userData.lastLogin
  );
  revalidatePath("/", "layout");
  //redirect("/");
  return user.toJSON();
}

export async function signup(formData) {
  const supabase = await createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const cr = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const { error, data } = await supabase.auth.signUp(cr);

  console.log(data);

  if (error) {
    redirect("/error");
  }
  //register their data in the database

  revalidatePath("/", "layout");
  redirect("/");
}

export async function logout() {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();
  if (error) {
    redirect("/error");
  }

  revalidatePath("/", "layout");
  redirect("/");
}

export async function changeUserType(newType) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/error");
  }
  // change the user last login to the newType either b or s;
}
