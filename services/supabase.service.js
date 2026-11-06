const cfg = window.ZUNE_SUPABASE_CONFIG || {};
const sdk = window.supabase;
export const supabase = (sdk?.createClient && cfg.url && cfg.publishableKey)
  ? sdk.createClient(cfg.url, cfg.publishableKey, {auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}})
  : null;
export const isConnected = () => Boolean(supabase);
export function requireSupabase(){ if(!supabase) throw new Error("Supabase haijasanidiwa. Angalia config/supabase-config.js."); return supabase; }