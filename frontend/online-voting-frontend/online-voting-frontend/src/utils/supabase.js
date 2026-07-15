import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://wdvuahkamwhwuwjvvdbs.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndkdnVhaGthbXdod3V3anZ2ZGJzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODMwODEwNzAsImV4cCI6MjA5ODY1NzA3MH0.zWxM9Sna6MKt4jcZMBSu8cvWAxTeP2KCwkp3ZMaZPvs'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
