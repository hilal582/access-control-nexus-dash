
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://ygbxbnnbykcxzcesjeob.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlnYnhibm5ieWtjeHpjZXNqZW9iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk0NjkzODEsImV4cCI6MjA2NTA0NTM4MX0.IyHipRfnQGbev4zgQpD0p-IPRQLy2E0EPRquw313pRI'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
