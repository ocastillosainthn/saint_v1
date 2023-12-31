// supabaseClient.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://phnpalffthkimmhufuuq.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBobnBhbGZmdGhraW1taHVmdXVxIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzM0MDg3MzgsImV4cCI6MTk4ODk4NDczOH0.7Kr1nJddHT87KJU0MabsgeZcIb4wal5-KabW5_Y4J0k'

const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase

