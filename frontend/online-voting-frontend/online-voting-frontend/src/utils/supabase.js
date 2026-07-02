import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://lzjiwaudiuqwntkhuxcn.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx6aml3YXVkaXVxd250a2h1eGNuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI5Njk5NTYsImV4cCI6MjA5ODU0NTk1Nn0.FqdBBYwuNTITMXQoAIGfREelQN0etwEyWyhgRKa3_Ws'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
