import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

/*
 * Supabase frontend configuration.
 *
 * IMPORTANT:
 * - Use only the anon/public key here.
 * - Never paste the service-role key in frontend code.
 * - Replace these two values with your real Supabase project values.
 */
export const SUPABASE_URL = "https://mxfqetpkyyrsokxjuynm.supabase.co";
export const SUPABASE_ANON_KEY = "sb_publishable_ttGp8w1LAFPUAWZ-I2lTFw_Z8Ln-rFt";
export const SUPABASE_IMAGE_BUCKET = "hydronexis-images";

export function isSupabaseConfigured() {
  return /^https:\/\/.+\.supabase\.co$/i.test(SUPABASE_URL)
    && SUPABASE_ANON_KEY
    && SUPABASE_ANON_KEY !== "YOUR-SUPABASE-ANON-KEY";
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
