import { NextResponse } from "next/server"
import https from "https"

// Force Node.js runtime (not Edge) so the 'https' built-in is available
export const runtime = "nodejs"

interface SupabaseUser {
  id: string
  email?: string
  user_metadata?: {
    full_name?: string
    name?: string
    role?: string
    unit?: string
    avatar_url?: string
  }
}

/** Calls the Supabase Auth Admin REST API using Node's https.request.
 *  Bypasses the undici-based built-in fetch, which can fail on some
 *  Windows / corporate-network setups even when the browser can reach the host. */
function httpsGet(
  url: string,
  headers: Record<string, string>
): Promise<{ status: number; body: string }> {
  return new Promise((resolve, reject) => {
    const { hostname, pathname, search } = new URL(url)
    const req = https.request(
      {
        hostname, path: pathname + search, method: "GET", headers,
        // Network has SSL inspection (VPN / router MITM) whose root CA is in the
        // Windows cert store but not in Node's bundled Mozilla CA list.
        // Safe for a local dev server calling our own Supabase project.
        rejectUnauthorized: false,
      },
      (res) => {
        let body = ""
        res.on("data", (chunk: Buffer) => { body += chunk.toString("utf8") })
        res.on("end", () => resolve({ status: res.statusCode ?? 0, body }))
      }
    )
    req.on("error", reject)
    req.end()
  })
}

export async function GET() {
  const supabaseUrl    = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json(
      {
        error:
          "SUPABASE_SERVICE_ROLE_KEY is not set. " +
          "Add it to .env.local (Supabase → Project Settings → API → service_role) and restart the dev server.",
      },
      { status: 500 }
    )
  }

  try {
    const { status, body } = await httpsGet(
      `${supabaseUrl}/auth/v1/admin/users?per_page=1000`,
      {
        Authorization: `Bearer ${serviceRoleKey}`,
        apikey:        serviceRoleKey,
      }
    )

    if (status >= 400) {
      console.error("[/api/staff] Supabase HTTP", status, body)
      return NextResponse.json(
        { error: `Supabase returned ${status}: ${body || "(empty body)"}` },
        { status: 500 }
      )
    }

    const parsed = body.trim()
      ? (JSON.parse(body) as { users?: SupabaseUser[] })
      : { users: [] }

    const staff = (parsed.users ?? []).map((u) => ({
      id:         u.id,
      full_name:  u.user_metadata?.full_name ??
                  u.user_metadata?.name ??
                  u.email?.split("@")[0] ??
                  "Unknown",
      role:       u.user_metadata?.role       ?? "Staff",
      unit:       u.user_metadata?.unit       ?? null,
      avatar_url: u.user_metadata?.avatar_url ?? null,
      email:      u.email                     ?? null,
    }))

    return NextResponse.json(staff)
  } catch (err) {
    const msg   = err instanceof Error ? err.message : String(err)
    // err.cause contains the underlying OS error code (e.g. ENOTFOUND, ETIMEDOUT)
    const cause = (err as NodeJS.ErrnoException)?.code ?? (err as any)?.cause ?? ""
    console.error("[/api/staff] Exception:", msg, cause ? `| code: ${cause}` : "")
    return NextResponse.json(
      { error: `${msg}${cause ? ` (${cause})` : ""}` },
      { status: 500 }
    )
  }
}
