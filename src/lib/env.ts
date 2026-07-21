import { z } from "zod";

const emptyToUndefined = (value: unknown) => (value === "" ? undefined : value);

const publicEnvSchema = z.object({
  NEXT_PUBLIC_DEMO_MODE: z.enum(["true", "false"]).default("true"),
  NEXT_PUBLIC_SUPABASE_URL: z.preprocess(emptyToUndefined, z.string().url().optional()),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.preprocess(emptyToUndefined, z.string().min(1).optional()),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.preprocess(emptyToUndefined, z.string().min(1).optional())
});

export type PublicRuntimeEnv = {
  demoMode: boolean;
  supabaseConfigured: boolean;
  supabaseUrl?: string;
  supabasePublishableKey?: string;
};

type EnvSource = Record<string, string | undefined>;

export function getPublicRuntimeEnv(source: EnvSource = process.env): PublicRuntimeEnv {
  const parsed = publicEnvSchema.parse(source);
  const supabasePublishableKey = parsed.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? parsed.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const supabaseConfigured = Boolean(parsed.NEXT_PUBLIC_SUPABASE_URL && supabasePublishableKey);
  const demoMode = parsed.NEXT_PUBLIC_DEMO_MODE !== "false";

  if (!demoMode && !supabaseConfigured) {
    throw new Error(
      "Supabase is required when NEXT_PUBLIC_DEMO_MODE=false. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY."
    );
  }

  return {
    demoMode,
    supabaseConfigured,
    supabaseUrl: parsed.NEXT_PUBLIC_SUPABASE_URL,
    supabasePublishableKey
  };
}

export function getRequiredSupabaseConfig(source: EnvSource = process.env) {
  const env = getPublicRuntimeEnv(source);

  if (!env.supabaseConfigured || !env.supabaseUrl || !env.supabasePublishableKey) {
    throw new Error("Supabase is not configured. Add Supabase environment variables or keep NEXT_PUBLIC_DEMO_MODE=true.");
  }

  return {
    url: env.supabaseUrl,
    publishableKey: env.supabasePublishableKey
  };
}
