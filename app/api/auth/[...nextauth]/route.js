import { createClient } from "@/lib/server";
import NextAuth from "next-auth";

const handler = NextAuth({
  providers: [
    {
      id: "supabase",
      name: "Supabase",
      type: "oauth",
      wellKnown: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/.well-known/openid-configuration`,
      authorization: {
        params: {
          scope: "openid email profile",
        },
      },
      idToken: true,
      clientId: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      clientSecret: process.env.SUPABASE_SERVICE_ROLE_KEY,
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
        const supabase = createClient({ cookies: () => ({}) });
        const { data, error } = await supabase.auth.getSession();
        if (error) throw new Error("Session validation failed");
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
      const supabase = createClient({ cookies: () => ({}) });
      const { data, error } = await supabase.auth.getUser();
      if (error || !data.user) return false;
      return true; // Validate user server-side
    },
    async redirect({ url, baseUrl }) {
      return baseUrl;
    },
    async session({ session, token }) {
      const supabase = createClient({ cookies: () => ({}) });
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
