# Signup Server Action Documentation

## Overview

The `signup` server action is an asynchronous function designed for a Next.js marketplace website to handle user registration. It processes user signup data, authenticates the user using Supabase Auth, and inserts user and buyer information into the `User` and `Buyer` tables using an admin-level Supabase client. The function enforces admin-only database insertions to comply with Row Level Security (RLS) policies and redirects the user upon success or failure.

## Function Signature

```typescript
export async function signup(formData: FormData): Promise<void>;
```

## Parameters

- **`formData: FormData`**
  - A `FormData` object containing the user's signup information.
  - Expected fields:
    - `email`: The user's email address (string, required).
    - `password`: The user's password (string, required).
    - `username`: The user's chosen username (string, required).
    - `phoneNumber`: The user's phone number (string, optional).
    - `profileImage`: URL or path to the user's profile image (string, optional).
    - `street`: The buyer's street address (string, optional).
    - `province`: The buyer's province (string, optional).
    - `governorate`: The buyer's governorate (string, optional).

## Returns

- **`Promise<void>`**
  - Resolves without a return value upon successful signup, redirecting to the root path (`/`).
  - Throws an error or redirects to `/error` if validation, authentication, or database operations fail.

## Dependencies

- **Supabase Client**:
  - `@supabase/supabase-js`: Provides the `createClient` function to initialize Supabase clients.
  - Regular client for authentication (`supabase`).
  - Admin client (`supabaseAdmin`) for database insertions, using the service role key.
- **Next.js**:
  - `redirect`: Redirects the user to another page (e.g., `/` or `/error`).
  - `revalidatePath`: Revalidates the cache for a specific path.
- **Environment Variables**:
  - `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL.
  - `SUPABASE_SERVICE_ROLE_KEY`: Service role key for admin client.

## Workflow

1. **Initialize Supabase Clients**:

   - Creates a regular Supabase client (`supabase`) using `createClient` for authentication.
   - Creates an admin Supabase client (`supabaseAdmin`) using `createClient` with `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` for database operations.

2. **Extract and Validate Form Data**:

   - Retrieves fields (`email`, `password`, `username`, `phoneNumber`, `profileImage`, `street`, `province`, `governorate`) from `formData`, trimming strings and setting optional fields to `null` if not provided.
   - Validates required fields (`email`, `password`, `username`) are present.
   - Checks email format using a regex (`/^[^\s@]+@[^\s@]+\.[^\s@]+$/`).
   - Ensures password is at least 6 characters.
   - Validates username length (3-255 characters, per `User` table schema).
   - Validates phone number format if provided (7-20 digits, allowing a leading `+`).

3. **Authenticate User**:

   - Calls `supabase.auth.signUp` with `email` and `password` to create a new user in Supabase Auth.
   - Extracts the authenticated user's ID (`userId`) from the response.

4. **Handle Authentication Errors**:

   - If authentication fails (`authError`), throws an error with the error message.
   - If no user ID is returned, throws an error indicating user creation failure.

5. **Insert into `User` Table**:

   - Uses `supabaseAdmin` to insert a record into the `User` table with:
     - `uID`: Auth user ID.
     - `username`, `email`, `phoneNumber`, `profileImage`: From form data.
     - `lastLogin`: Set to `'b'` (default per schema).
   - Throws an error if the insertion fails (`userError`).

6. **Insert into `Buyer` Table**:

   - Uses `supabaseAdmin` to insert a record into the `Buyer` table with:
     - `uID`: Auth user ID.
     - `street`, `province`, `governorate`: From form data (or `null` if not provided).
   - Throws an error if the insertion fails (`buyerError`).

7. **Revalidate Cache and Redirect**:

   - Calls `revalidatePath("/", "layout")` to invalidate the cache for the root layout.
   - Redirects to the root path (`/`) upon successful signup.

## Error Handling

- **Validation Errors**:
  - Throws errors for missing required fields, invalid email format, short passwords, invalid username length, or invalid phone number format.
- **Authentication Failure**:
  - Throws an error with the message from `supabase.auth.signUp` if authentication fails.
- **Missing User ID**:
  - Throws an error if no user ID is returned after authentication.
- **Database Insertion Errors**:
  - Throws errors for failures in inserting into `User` or `Buyer` tables, including the specific error message from Supabase.

## Assumptions

- The `createClient` function is defined and initializes a Supabase client correctly.
- Environment variables `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are set.
- The `User` table has columns: `uID` (UUID, references `auth.users(id)`), `username` (VARCHAR(255)), `email` (VARCHAR(255), unique), `phoneNumber` (VARCHAR(20)), `profileImage` (VARCHAR(255)), `lastLogin` (enum `'b'`, `'s'`, default `'b'`).
- The `Buyer` table has columns: `uID` (UUID, references `User.uID`), `street` (VARCHAR(255)), `province` (VARCHAR(100)), `governorate` (VARCHAR(100)).
- RLS is enabled on `User` and `Buyer` tables, restricting insertions to admin users (via `supabaseAdmin`).
- The form includes required fields (`email`, `password`, `username`) and optional fields (`phoneNumber`, `profileImage`, `street`, `province`, `governorate`).

## Usage Example

```javascript
// In a Next.js server action or API route
import { signup } from "./actions";

export async function POST(request) {
  const formData = await request.formData();
  try {
    await signup(formData);
    return new Response(JSON.stringify({ message: "Signup successful" }), {
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 400,
    });
  }
}
```

## Notes

- **Security**:
  - The `SUPABASE_SERVICE_ROLE_KEY` must be kept secure and only used in server-side code to prevent unauthorized access.
  - RLS policies should restrict non-admin insertions:
    ```sql
    ALTER TABLE "User" ENABLE ROW LEVEL SECURITY;
    CREATE POLICY "Only admins can insert users" ON "User"
      FOR INSERT TO authenticated WITH CHECK (false);

    ALTER TABLE "Buyer" ENABLE ROW LEVEL SECURITY;
    CREATE POLICY "Only admins can insert buyers" ON "Buyer"
      FOR INSERT TO authenticated WITH CHECK (false);
    ```
- **Optional Fields**: Fields like `phoneNumber`, `profileImage`, `street`, `province`, and `governorate` are optional and stored as `null` if not provided.
- **Profile Image**: If `profileImage` is a file upload, handle it via Supabase Storage and store the URL in the `User` table.
- **Atomicity**: The sequential insertions into `User` and `Buyer` tables are not atomic. Consider using a Supabase RPC function for transactional consistency.

## Improvements

- **Transactional Consistency**:
  - Implement a Supabase RPC function to insert into `User` and `Buyer` tables atomically:
    ```sql
    CREATE OR REPLACE FUNCTION signup_user_and_buyer(
      user_id UUID, user_email TEXT, user_username TEXT, user_phone_number TEXT,
      user_profile_image TEXT, buyer_street TEXT, buyer_province TEXT, buyer_governorate TEXT
    ) RETURNS VOID AS $$
    BEGIN
      INSERT INTO "User" (uID, username, email, phoneNumber, profileImage, lastLogin)
      VALUES (user_id, user_username, user_email, user_phone_number, user_profile_image, 'b');
      INSERT INTO "Buyer" (uID, street, province, governorate)
      VALUES (user_id, buyer_street, buyer_province, buyer_governorate);
    END;
    $$ LANGUAGE plpgsql;
    ```
  - Call with `supabaseAdmin.rpc('signup_user_and_buyer', {...})`.
- **Enhanced Validation**:
  - Add validation for `profileImage` (e.g., URL format or file type if uploaded).
  - Validate `street`, `province`, and `governorate` lengths per schema constraints.
- **Error Redirects**:
  - Redirect to `/error?message={error.message}` for specific error feedback instead of throwing errors.
- **Logging**:
  - Add structured logging for debugging and monitoring, avoiding `throw` in production for user-facing errors.
- **Return Value**:
  - Consider returning a JSON string with user data for consistency with the `login` action, instead of redirecting.
