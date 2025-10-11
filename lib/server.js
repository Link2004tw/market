import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { supabaseConfig } from "./supabaseConfig";
export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createClient(supabaseConfig.url, supabaseConfig.anonKey, {
    auth: {
      persistSession: true,
      storage: {
        async getItem(key) {
          const cookie = cookieStore.get(key);
          return cookie ? cookie.value : null;
        },
        async setItem(key, value) {
          cookieStore.set({
            name: key,
            value,
            ...supabaseConfig.cookieOptions,
          });
        },
        async removeItem(key) {
          cookieStore.delete(key);
        },
      },
    },
  });
}
