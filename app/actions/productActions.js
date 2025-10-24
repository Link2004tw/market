"use server";

import { createClient } from "@/lib/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export async function addProduct(formData) {
  const supabase = await createClient();
}

export async function deleteProduct(pid) {}

export async function updateProduct(formData) {}
