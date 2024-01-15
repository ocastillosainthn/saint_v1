import { createClient } from '@supabase/supabase-js';

  const supabaseUrl = 'https://abcssyjuunupvreklpdt.supabase.co';
  const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY3NzeWp1dW51cHZyZWtscGR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDQ4NjYwODgsImV4cCI6MjAyMDQ0MjA4OH0.B0bl48XdkU5nkJHspPKKc96kLLFCkSMYejnSyGXeU-c';

  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  export default supabase;