// supabaseClient.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://wurdxmrnpdfgvgkzystf.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind1cmR4bXJucGRmZ3Zna3p5c3RmIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODA2MzcwNDcsImV4cCI6MTk5NjIxMzA0N30.q_4k7QKuXgYQRcDxxNqx01C58HB9JLMNR_Y9pFGfhgU'

const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase

