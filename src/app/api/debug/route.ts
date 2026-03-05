import { NextResponse } from "next/server";

export const runtime = "edge";

export async function GET() {
    try {
        const debugData = {
            timestamp: new Date().toISOString(),
            env: {
                NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL ? "Defined (Starts with: " + process.env.NEXT_PUBLIC_SUPABASE_URL.substring(0, 10) + "...)" : "Undefined",
                NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "Defined (Length: " + process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.length + ")" : "Undefined",
                NODE_ENV: process.env.NODE_ENV,
            },
            headers: {
                // Obfuscated or safe headers
                host: "available",
            }
        };

        return NextResponse.json(debugData);
    } catch (error: any) {
        return NextResponse.json({
            error: "Debug route failed",
            message: error.message,
            stack: error.stack
        }, { status: 500 });
    }
}
