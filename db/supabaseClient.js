import { createClient } from '@supabase/supabase-js'
import { useRuntimeConfig } from '#app'

export default () => {
    
    const config = useRuntimeConfig()
    const supabaseUrl = config.public.supabaseUrl
    const supabaseAnonKey = config.public.supabaseAnonKey

  console.log("Supabase URL:", supabaseUrl);
  console.log("Supabase Anon Key:", supabaseAnonKey); // Solo para depuración

  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  return supabase;
}
