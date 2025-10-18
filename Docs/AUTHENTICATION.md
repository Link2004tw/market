# Authentication for Marketplace Website

This document outlines the authentication setup for the Next.js marketplace website using Supabase for server-side admin access and session management, implemented in JavaScript.

## Overview

The authentication system uses Supabase for user authentication, including server-side admin access and session management. The setup includes middleware to handle session updates and a route handler for OTP verification. Below are the key components and their configurations.

## Components

### 1. Supabase Admin Client (`lib/supabaseAdmin.js`)

This file sets up a Supabase client with admin privileges for server-side operations.

```javascript
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
```

- **Purpose**: Provides a Supabase client with service role key for admin-level access.
- **Environment Variables**:
  - `NEXT_PUBLIC_SUPABASE_URL`: The Supabase project URL.
  - `SUPABASE_SERVICE_ROLE_KEY`: The service role key from Supabase dashboard (Settings > API).
- **Usage**: Use `supabaseAdmin` for server-side operations requiring elevated permissions, such as user management or restricted data access.

### 2. Middleware (`middleware.js`)

The middleware handles session updates for authenticated users across specified routes.

```javascript
import { updateSession } from "./lib/middleware";

export async function middleware(request) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
```

- **Purpose**: Ensures user sessions are refreshed and cookies are managed for authenticated routes.
- **Matcher**: Applies to all routes except static files, image optimization files, and the favicon.
- **Function**: Calls `updateSession` to refresh the auth token and manage cookies.

### 3. OTP Verification Route Handler (`app/api/auth/verify/route.js`)

This route handler verifies one-time passwords (OTPs) for authentication flows.

```javascript
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type");
  const next = searchParams.get("next") ?? "/";

  const redirectTo = request.nextUrl.clone();
  redirectTo.pathname = next;
  redirectTo.searchParams.delete("token_hash");
  redirectTo.searchParams.delete("type");

  if (token_hash && type) {
    const supabase = createClient();
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });
    if (!error) {
      redirectTo.searchParams.delete("next");
      return NextResponse.redirect(redirectTo);
    }
  }

  redirectTo.pathname = "/error";
  return NextResponse.redirect(redirectTo);
}
```

- **Purpose**: Handles OTP verification for email or phone-based authentication.
- **Query Parameters**:
  - `token_hash`: The OTP token.
  - `type`: The type of OTP (e.g., `email` or `sms`).
  - `next`: The path to redirect to after successful verification (defaults to `/`).
- **Flow**:
  1. Extracts query parameters from the request URL.
  2. Verifies the OTP using the Supabase client.
  3. Redirects to the `next` path on success or `/error` on failure.

### 4. Session Update Utility (`lib/middleware.js`)

This utility manages session cookies and refreshes the auth token.

```javascript
import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

export async function updateSession(request) {
  let supabaseResponse = NextResponse.next({ request });
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL env var");
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!key)
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY env var");

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) =>
          request.cookies.set(name, value)
        );
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  await supabase.auth.getUser();
  return supabaseResponse;
}
```

- **Purpose**: Manages cookies and refreshes the auth token for server-side session handling.
- **Environment Variables**:
  - `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL.
  - `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`: Public API key for Supabase.
- **Cookies**:
  - `getAll`: Retrieves all cookies from the request.
  - `setAll`: Sets cookies on both the request and response objects.
- **Auth Token**: Refreshes the user's auth token using `supabase.auth.getUser()`.

## Setup Instructions

1. **Install Dependencies**:  
   Ensure the required packages are installed:

   ```bash
   npm install @supabase/supabase-js @supabase/ssr
   ```

2. **Configure Environment Variables**:  
   Create a `.env.local` file in the root of your Next.js project with the following:

   ```
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-supabase-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
   ```

   - Obtain these values from the Supabase dashboard (Settings > API).

3. **File Structure**:  
   Ensure the following files are placed in the correct directories:

   - `lib/supabaseAdmin.js`: Server-side Supabase client.
   - `middleware.js`: Root-level middleware for session management.
   - `app/api/auth/verify/route.js`: Route handler for OTP verification.
   - `lib/middleware.js`: Session update utility.

4. **Supabase Dashboard**:

   - Enable authentication methods (e.g., email, phone) in the Supabase dashboard.
   - Ensure the service role key is securely stored and not exposed client-side.

## Usage

- **Admin Operations**: Use `supabaseAdmin` for server-side tasks like user management or restricted queries.
- **Session Management**: The middleware automatically refreshes sessions for protected routes.
- **OTP Verification**: Direct users to `/api/auth/verify?token_hash=<hash>&type=<type>&next=<path>` for OTP-based authentication flows.

## Security Considerations

- **Environment Variables**: Store sensitive keys (e.g., `SUPABASE_SERVICE_ROLE_KEY`) securely and avoid exposing them in client-side code.
- **Middleware Scope**: Adjust the `matcher` config to include or exclude specific routes as needed.
- **Error Handling**: Ensure the `/error` route provides clear instructions for users when OTP verification fails.

## Troubleshooting

- **Missing Environment Variables**: Check `.env.local` for correct Supabase URL and keys.
- **OTP Verification Fails**: Verify that the `type` and `token_hash` are correct and that the Supabase auth settings are properly configured.
- **Session Issues**: Ensure cookies are being set correctly and that `updateSession` is called for relevant routes.

For further assistance, refer to the [Supabase JavaScript documentation](https://supabase.com/docs/reference/javascript) or the [Next.js documentation](https://nextjs.org/docs).
