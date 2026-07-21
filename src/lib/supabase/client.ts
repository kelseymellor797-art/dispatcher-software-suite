"use client";

import { createBrowserClient } from "@supabase/ssr";
import { getRequiredSupabaseConfig } from "@/lib/env";

export function createSupabaseBrowserClient() {
  const { url, publishableKey } = getRequiredSupabaseConfig();
  return createBrowserClient(url, publishableKey);
}
