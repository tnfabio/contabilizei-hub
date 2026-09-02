import { createBrowserClient } from "@supabase/ssr";

const rawUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

const supabaseUrl = rawUrl ? rawUrl.replace(/\/rest\/v1\/?$/, "") : "";
const supabaseAnonKey = anonKey || "";

export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);
