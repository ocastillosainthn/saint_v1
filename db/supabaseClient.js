import { createClient } from '@supabase/supabase-js';

  const supabaseUrl = 'https://ciibnnxvxsaqfcdsgrkf.supabase.co';
  const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNpaWJubnh2eHNhcWZjZHNncmtmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDU5Nzc3MjAsImV4cCI6MjAyMTU1MzcyMH0.D1ZvFaTmTM7KM0jGdiVmBzzQ8W8rwnxqR2dtNon-xMA';

  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  export default supabase;