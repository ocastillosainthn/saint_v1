import { createClient } from '@supabase/supabase-js'
import { useRuntimeConfig } from '#app'

export default () => {
    
    const supabaseUrl = 'https://wurdxmrnpdfgvgkzystf.supabase.co'
    const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind1cmR4bXJucGRmZ3Zna3p5c3RmIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODA2MzcwNDcsImV4cCI6MTk5NjIxMzA0N30.q_4k7QKuXgYQRcDxxNqx01C58HB9JLMNR_Y9pFGfhgU'

  console.log("Supabase URL:", supabaseUrl);
  console.log("Supabase Anon Key:", supabaseAnonKey); // Solo para depuración

  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  return supabase;
}
