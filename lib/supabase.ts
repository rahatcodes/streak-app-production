import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

export type Streak = {
  id: string
  user_id: string
  name: string
  color: string
  icon: string
  current_streak: number
  longest_streak: number
  total_completions: number
  created_at: string
}

export type Completion = {
  id: string
  streak_id: string
  user_id: string
  date: string
  created_at: string
}

export type User = {
  id: string
  email: string
}