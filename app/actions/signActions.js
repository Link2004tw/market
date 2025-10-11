"use server";

import { createSupabaseServerClient } from "@/lib/server";
import { createClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import Buyer from "@models/buyer";
import Seller from "@/models/seller";

// Sign Up Action
export async function handleSignUp(prevState, formData) {
  const supabase = await createSupabaseServerClient();
  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  const email = formData.get("email");
  const password = formData.get("password");
  const confirmPassword = formData.get("confirmPassword");
  const username = formData.get("username");
  const phoneNumber = formData.get("phoneNumber");
  const userType = formData.get("userType"); // 'buyer' or 'seller'
  const address = formData.get("address"); // Buyer-specific
  const serviceArea = formData.get("serviceArea"); // Seller-specific
  const priority = formData.get("priority"); // Seller-specific

  // Validate inputs
  if (password !== confirmPassword) {
    return { error: "Passwords do not match" };
  }
  if (!["buyer", "seller"].includes(userType)) {
    return { error: "Invalid user type" };
  }
  if (!email || typeof email !== "string") {
    return { error: "Invalid email" };
  }
  if (!username || typeof username !== "string") {
    return { error: "Username is required" };
  }
  if (userType === "buyer" && !address) {
    return { error: "Address is required for buyers" };
  }

  // Perform sign-up with Supabase
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        username,
        phone_number: phoneNumber,
        user_type: userType,
        ...(userType === "buyer"
          ? { address }
          : { service_area: serviceArea, priority }),
      },
    },
  });

  if (error) {
    console.error("Sign-up error:", error);
    return { error: error.message };
  }

  if (data.user) {
    // Create class instance
    const userData = {
      uid: data.user.id,
      username,
      email,
      phoneNumber,
      funds: 0.0,
      ...(userType === "buyer" ? { address } : { serviceArea, priority }),
    };
    const userInstance =
      userType === "buyer" ? new Buyer(userData) : new Seller(userData);

    // Insert into users table
    const { error: userInsertError } = await supabaseAdmin
      .from("users")
      .insert({
        uid: userInstance.uid,
        email: userInstance.email,
        username: userInstance.username,
        phone_number: userInstance.phoneNumber,
        funds: userInstance.funds,
        created_at: new Date().toISOString(),
      });

    if (userInsertError) {
      console.error("Error creating user record:", userInsertError);
      return {
        error: `Failed to create user record: ${userInsertError.message}`,
      };
    }

    // Insert into buyers or sellers table
    const table = userType === "buyer" ? "buyers" : "sellers";
    const { error: roleInsertError } = await supabaseAdmin.from(table).insert({
      uid: userInstance.uid,
      ...(userType === "buyer"
        ? { address: userInstance.address }
        : {
            service_area: userInstance.serviceArea,
            priority: userInstance.priority,
          }),
    });

    if (roleInsertError) {
      console.error(`Error creating ${userType} record:`, roleInsertError);
      return {
        error: `Failed to create ${userType} record: ${roleInsertError.message}`,
      };
    }
  }

  return { redirect: "/auth?mode=confirm-email" };
}

// Sign In Action
export async function handleSignIn(prevState, formData) {
  const supabase = await createSupabaseServerClient();
  const email = formData.get("email");
  const password = formData.get("password");

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error("Sign-in error:", error);
    return { error: error.message };
  }

  return { redirect: "/dashboard" };
}

// Update Profile Action
export async function handleUpdateProfile(prevState, formData) {
  const supabase = await createSupabaseServerClient();
  const username = formData.get("username");
  const phoneNumber = formData.get("phoneNumber");
  const address = formData.get("address"); // Buyer-specific
  const serviceArea = formData.get("serviceArea"); // Seller-specific
  const priority = formData.get("priority"); // Seller-specific

  // Validate inputs
  if (!username || typeof username !== "string") {
    return { error: "Username is required" };
  }
  if (userType === "buyer" && !address) {
    return { error: "Address is required for buyers" };
  }

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user || !user.id) {
    console.error(
      "Authentication error:",
      authError?.message || "No user found"
    );
    return { error: "Not authenticated" };
  }

  // Get user type from auth metadata
  const userType = user.user_metadata.user_type;
  if (!["buyer", "seller"].includes(userType)) {
    console.error("Invalid user type:", userType);
    return { error: "Invalid user type" };
  }

  // Update user metadata
  const { error: metadataError } = await supabase.auth.updateUser({
    data: {
      username,
      phone_number: phoneNumber,
      user_type: userType,
      ...(userType === "buyer"
        ? { address }
        : { service_area: serviceArea, priority }),
    },
  });

  if (metadataError) {
    console.error("Metadata update error:", metadataError);
    return { error: metadataError.message };
  }

  // Fetch existing user data to preserve funds
  const { data: userData, error: userFetchError } = await supabase
    .from("users")
    .select("funds, username, phone_number")
    .eq("uid", user.id)
    .single();

  if (userFetchError) {
    console.error("Error fetching user data:", userFetchError);
    return { error: `Failed to fetch user data: ${userFetchError.message}` };
  }

  // Fetch existing role-specific data
  const table = userType === "buyer" ? "buyers" : "sellers";
  const { data: roleData, error: roleFetchError } = await supabase
    .from(table)
    .select("address, service_area, priority")
    .eq("uid", user.id)
    .single();

  if (roleFetchError) {
    console.error(`Error fetching ${userType} data:`, roleFetchError);
    return {
      error: `Failed to fetch ${userType} data: ${roleFetchError.message}`,
    };
  }

  // Create class instance
  const userInstanceData = {
    uid: user.id,
    username: username || userData.username,
    email: user.email,
    phoneNumber: phoneNumber || userData.phone_number,
    funds: userData.funds || 0.0,
    ...(userType === "buyer"
      ? { address: address || roleData.address }
      : {
          serviceArea: serviceArea || roleData.service_area,
          priority: priority || roleData.priority,
        }),
  };
  const userInstance =
    userType === "buyer"
      ? new Buyer(userInstanceData)
      : new Seller(userInstanceData);

  // Update users table
  const { error: userUpdateError } = await supabase
    .from("users")
    .update({
      username: userInstance.username,
      phone_number: userInstance.phoneNumber,
      updated_at: new Date().toISOString(),
    })
    .eq("uid", user.id);

  if (userUpdateError) {
    console.error("User update error:", userUpdateError);
    return { error: userUpdateError.message };
  }

  // Update buyers or sellers table
  const { error: roleUpdateError } = await supabase
    .from(table)
    .update({
      ...(userType === "buyer"
        ? { address: userInstance.address }
        : {
            service_area: userInstance.serviceArea,
            priority: userInstance.priority,
          }),
    })
    .eq("uid", user.id);

  if (roleUpdateError) {
    console.error(`${userType} update error:`, roleUpdateError);
    return { error: roleUpdateError.message };
  }

  return { redirect: "/dashboard" };
}

// Sign Out Action
export async function handleSignOut() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  return redirect("/");
}
