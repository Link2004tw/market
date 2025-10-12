// lib/supabaseAdmin.ts (create this for server-side admin access)
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // From Supabase dashboard > Settings > API

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
