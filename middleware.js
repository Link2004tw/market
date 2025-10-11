
   import { NextResponse } from "next/server";
   import { createMiddlewareClient } from "@supabase/ssr";

   export async function middleware(req) {
     const { cookies } = req;
     const supabase = createMiddlewareClient({ cookies });
     await supabase.auth.getSession();
     return NextResponse.next();
   }

   export const config = {
     matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
   };
  