export const supabaseConfig = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL,
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  cookieOptions: {
    name: "sb-auth-token", // Name for Supabase auth cookies
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  },
};

// Validate configuration
if (!supabaseConfig.url || !supabaseConfig.anonKey) {
  throw new Error("Missing Supabase URL or Anon Key in environment variables");
}
