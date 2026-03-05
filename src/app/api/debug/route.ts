export const runtime = "edge";

export async function GET(request: Request) {
    try {
        const url = new URL(request.url);
        const mode = url.searchParams.get("mode") || "standard";

        // Diagnostic info
        const info = {
            status: "running",
            mode,
            runtime: "edge",
            timestamp: new Date().toISOString(),
            env_access_test: mode === "keys" ? Object.keys(process.env).filter(k => k.startsWith("NEXT_PUBLIC_")) : "skipped",
            variables: {
                url: process.env.NEXT_PUBLIC_SUPABASE_URL ? "defined" : "undefined",
                anon_key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "defined" : "undefined",
            }
        };

        return new Response(JSON.stringify(info, null, 2), {
            status: 200,
            headers: { "Content-Type": "application/json" }
        });
    } catch (err: any) {
        return new Response(JSON.stringify({
            status: "error",
            message: err.message,
            stack: err.stack,
            hint: "Check Cloudflare log explorer for more details."
        }, null, 2), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}
