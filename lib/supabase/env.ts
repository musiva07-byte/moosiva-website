function requireEnv(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

/**
 * Read lazily (called from inside createClient()), not at module-import
 * time. Several routes (e.g. /shop) are dynamically rendered but Next.js
 * still needs to *import* their module graph during `next build`'s page
 * data collection — an eager top-level throw here would fail the build
 * even though no request (and thus no real env var requirement) is
 * happening yet.
 */
export function getSupabaseUrl(): string {
  return requireEnv("NEXT_PUBLIC_SUPABASE_URL", process.env.NEXT_PUBLIC_SUPABASE_URL);
}

export function getSupabaseAnonKey(): string {
  return requireEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}
