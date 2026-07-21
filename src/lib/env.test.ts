import { describe, expect, it } from "vitest";
import { getPublicRuntimeEnv, getRequiredSupabaseConfig } from "./env";

describe("runtime environment validation", () => {
  it("allows demo mode without Supabase credentials", () => {
    const env = getPublicRuntimeEnv({
      NEXT_PUBLIC_DEMO_MODE: "true",
      NEXT_PUBLIC_SUPABASE_URL: "",
      NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: ""
    });

    expect(env.demoMode).toBe(true);
    expect(env.supabaseConfigured).toBe(false);
  });

  it("detects a configured Supabase project", () => {
    const env = getPublicRuntimeEnv({
      NEXT_PUBLIC_DEMO_MODE: "false",
      NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
      NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "sb_publishable_test"
    });

    expect(env.demoMode).toBe(false);
    expect(env.supabaseConfigured).toBe(true);
    expect(env.supabaseUrl).toBe("https://example.supabase.co");
  });

  it("supports the legacy anon key variable as a fallback", () => {
    const config = getRequiredSupabaseConfig({
      NEXT_PUBLIC_DEMO_MODE: "false",
      NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
      NEXT_PUBLIC_SUPABASE_ANON_KEY: "anon-test-key"
    });

    expect(config.publishableKey).toBe("anon-test-key");
  });

  it("rejects production mode without Supabase credentials", () => {
    expect(() =>
      getPublicRuntimeEnv({
        NEXT_PUBLIC_DEMO_MODE: "false",
        NEXT_PUBLIC_SUPABASE_URL: "",
        NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: ""
      })
    ).toThrow("Supabase is required");
  });

  it("rejects an invalid Supabase URL", () => {
    expect(() =>
      getPublicRuntimeEnv({
        NEXT_PUBLIC_DEMO_MODE: "true",
        NEXT_PUBLIC_SUPABASE_URL: "not-a-url",
        NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: "sb_publishable_test"
      })
    ).toThrow();
  });
});
