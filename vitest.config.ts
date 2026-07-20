import path from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    include: ["**/*.test.ts", "**/*.test.tsx"],
    exclude: ["node_modules", ".next"],
    env: {
      // Placeholders only, so importing lib/supabase/env.ts doesn't throw at
      // module-load time. Tests that touch Supabase mock the client itself
      // (@/lib/supabase/server) rather than making real network calls.
      NEXT_PUBLIC_SUPABASE_URL: "https://test.supabase.co",
      NEXT_PUBLIC_SUPABASE_ANON_KEY: "test-anon-key",
      NEXT_PUBLIC_WHATSAPP_NUMBER: "97312345678",
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
});
