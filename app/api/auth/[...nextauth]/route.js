import NextAuth from "next-auth";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const handler = NextAuth({
  providers: [
    {
      id: "supabase",
      name: "Supabase",
      type: "oauth",
      wellKnown: `${supabaseUrl}/.well-known/openid-configuration`,
      authorization: {
        params: {
          scope: "openid email profile",
        },
      },
      idToken: true,
      clientId: supabaseKey,
      clientSecret: serviceRoleKey,
      checks: ["pkce", "state"],
      async profile(profile) {
        return {
          id: profile.sub,
          email: profile.email,
          name: profile.name,
          image: profile.picture,
        };
      },
      async jwt({ token, account }) {
        if (account) {
          token.access_token = account.access_token;
        }
        return token;
      },
      async session({ session, token }) {
        const cookieStore = cookies();
        const supabase = createServerClient(supabaseUrl, supabaseKey, {
          cookies: {
            getAll() {
              return cookieStore.getAll() || [];
            },
            setAll(cookiesToSet) {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            },
          },
        });
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;
        return {
          ...session,
          access_token: token.access_token,
          ...data.session,
        };
      },
    },
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      return true;
    },
    async redirect({ url, baseUrl }) {
      return baseUrl;
    },
    async session({ session, token }) {
      const cookieStore = cookies();
      const supabase = createServerClient(supabaseUrl, supabaseKey, {
        cookies: {
          getAll() {
            return cookieStore.getAll() || [];
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          },
        },
      });
      const { data } = await supabase.auth.getUser();
      if (data.user) session.user = { ...session.user, ...data.user };
      return session;
    },
    async jwt({ token, user, account }) {
      if (account) {
        token.access_token = account.access_token;
      }
      return token;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
