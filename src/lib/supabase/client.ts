import { createClient } from "@supabase/supabase-js";
import AsyncStorage from "@react-native-async-storage/async-storage";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

/**
 * Not called from any screen yet — the app runs entirely on local
 * Zustand + AsyncStorage today (see docs/ARCHITECTURE.md). This is the
 * integration point for the next phase: cloud sync, auth, guilds, and
 * leaderboards, backed by the schema in docs/DATABASE_SCHEMA.sql.
 * Returns null until EXPO_PUBLIC_SUPABASE_URL / _ANON_KEY are set so
 * nothing crashes at import time in the meantime.
 */
export const supabase =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          storage: AsyncStorage,
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: false,
        },
      })
    : null;
