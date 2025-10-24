"use server";

import { createClient } from "@/lib/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

// create a function to verify the user
async function verifyUser() {}
export async function addProduct(formData) {
  const supabase = await createClient();
  //check how to authorize the user
  // check the validity of the product item
  // insert the product into the database
}

export async function deleteProduct(pid) {
  //
}

export async function updateProduct(formData) {
  //
}
