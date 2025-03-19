import { NextResponse } from "next/server";

export async function GET() {
    return NextResponse.json({
        SUPABASE_URL: process.env.SUPABASE_URL ? "Loaded ✅" : "Missing ❌",
        SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY ? "Loaded ✅" : "Missing ❌",
        NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? "Loaded ✅" : "Missing ❌",
    });
}