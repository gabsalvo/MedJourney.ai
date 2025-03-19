import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const handler = NextAuth({
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),

        CredentialsProvider({
            name: "Email",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials) throw new Error("No credentials provided");

                const { email, password } = credentials;

                // 🔑 Authenticate using Supabase Auth
                const { data, error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });

                if (error || !data.user) {
                    throw new Error("Invalid credentials or email not confirmed.");
                }

                return {
                    id: data.user.id,
                    email: data.user.email,
                };
            },
        }),
    ],
    secret: process.env.NEXTAUTH_SECRET,
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async session({ session, token }) {
            session.user.id = token.sub as string;
            return session;
        },
    },
    pages: {
        signIn: "/login",
    },
});

// ✅ Correctly export API route handlers
export { handler as GET, handler as POST };