"use server";

import { createClient } from "@/lib/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import User from "@/models/user";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { v2 as cloudinary } from "cloudinary";
// Initialize Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

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
    .select("uid, username, email, phonenumber, profileimage, lastlogin")
    .eq("uid", authUID)
    .single();
  if (userData) {
    const user = new User(
      userData.uid,
      userData.username,
      userData.email,
      userData.phonenumber,
      userData.profileimage,
      userData.lastlogin
    );
    revalidatePath("/", "layout");
    return user.toJSON();
  } else {
    console.error("Failed to fetch user data:", userError);
  }
  revalidatePath("/", "layout");

  //redirect("/");
}

export async function signup(formData) {
  // Initialize regular Supabase client for auth
  const supabase = await createClient();

  // Extract and validate form data
  const data = {
    email: formData.get("email")?.toString().trim(),
    password: formData.get("password")?.toString(),
    username: formData.get("username")?.toString().trim(),
    phoneNumber: formData.get("phoneNumber")?.toString().trim() || null,
    profileImage: formData.get("profileImage")?.toString().trim() || null,
    street: formData.get("street")?.toString().trim() || null,
    province: formData.get("province")?.toString().trim() || null,
    governorate: formData.get("governorate")?.toString().trim() || null,
  };

  // Basic validation for required fields
  if (!data.email || !data.password || !data.username) {
    throw new Error("Email, password, and username are required");
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    throw new Error("Invalid email format");
  }

  // Validate password length (minimum 6 characters)
  if (data.password.length < 6) {
    throw new Error("Password must be at least 6 characters long");
  }

  // Validate username length (example: 3-255 characters)
  if (data.username.length < 3 || data.username.length > 255) {
    throw new Error("Username must be between 3 and 255 characters");
  }

  // Validate phoneNumber format if provided (example: simple check for digits and length)
  if (data.phoneNumber && !/^\+?\d{7,20}$/.test(data.phoneNumber)) {
    throw new Error("Invalid phone number format");
  }

  // Sign up the user with Supabase Auth using the regular client
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
  });

  if (authError) {
    throw new Error(authError.message);
  }

  // Ensure we have a user ID from the auth response
  const userId = authData?.user?.id;
  if (!userId) {
    throw new Error("User creation failed: No user ID returned");
  }
  // store it in the cloud first
  // get the url store the url
  // Insert into User table using supabaseAdmin

  let imageUrl = null;

  // Upload image to Cloudinary if provided (for Moments)
  if (image && image.size > 0) {
    const fileBuffer = Buffer.from(await image.arrayBuffer());
    const uploadResult = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: `products/${userId}`,
            resource_type: "image",
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        )
        .end(fileBuffer);
    });
    imageUrl = uploadResult.secure_url;
  }
  const { error: userError } = await supabaseAdmin.from("User").insert({
    uID: userId,
    username: data.username,
    email: data.email,
    phoneNumber: data.phoneNumber,
    profileImage: imageUrl,
    lastLogin: "b", // Default as per schema
  });

  if (userError) {
    throw new Error(`Failed to save user data: ${userError.message}`);
  }

  // Insert into Buyer table using supabaseAdmin
  const { error: buyerError } = await supabaseAdmin.from("Buyer").insert({
    uID: userId,
    street: data.street,
    province: data.province,
    governorate: data.governorate,
  });

  if (buyerError) {
    throw new Error(`Failed to save buyer data: ${buyerError.message}`);
  }

  // Revalidate and redirect
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
