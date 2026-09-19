import type { DataAdapter } from "./adapter";
import { createLocalAdapter } from "./local";

export type { DataAdapter, TableName, TableRecordMap } from "./adapter";
export * from "./types";

/**
 * Resolves the data adapter for the current environment.
 *
 * - With VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY set, the site runs against
 *   Supabase (the client is loaded lazily so demo mode stays lightweight).
 * - Without keys, it runs in demo mode with the bundled fictional content
 *   persisted in the browser, so every page and the admin dashboard work.
 */
export async function resolveAdapter(): Promise<DataAdapter> {
  const url = import.meta.env.VITE_SUPABASE_URL?.trim();
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();

  if (url && key) {
    try {
      const { createSupabaseAdapter } = await import("./supabase");
      return createSupabaseAdapter(url, key);
    } catch (error) {
      console.warn("[DentaCare] Supabase unavailable, using demo storage instead.", error);
    }
  }

  return createLocalAdapter();
}
