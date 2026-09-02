import "server-only";
import { createClient } from "@supabase/supabase-js";

// This client uses the Supabase SERVICE ROLE key and must only ever be
// imported from server-side code (Server Components / Server Actions).
// It is never bundled for the browser because of the "server-only" import
// above, which makes the build fail if a client component ever imports it.
const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  throw new Error(
    "Faltan las variables de entorno SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY"
  );
}

export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false },
});
