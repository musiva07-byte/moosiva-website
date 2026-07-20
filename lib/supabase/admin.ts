import { createClient } from "@supabase/supabase-js";

/**
 * Service-role client — server-only, bypasses RLS entirely. Only ever
 * import this from Server Actions/route handlers, never from a "use client"
 * file. SUPABASE_SERVICE_ROLE_KEY has no NEXT_PUBLIC_ prefix so Next.js
 * never inlines it into the browser bundle.
 *
 * Returns null when not configured (matches lib/supabase/env.ts's lazy,
 * non-throwing style) so callers degrade to a friendly error instead of
 * crashing — see lib/services/checkout.ts.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    return null;
  }

  return createClient(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
