import { createBrowserClient } from "@supabase/ssr";

const public_key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
if (!public_key) {
  throw new Error("Missing env var NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY");
}
export function createClient() {
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
  );

  return supabase;
}
