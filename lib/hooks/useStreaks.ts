'use client'

import { useState, useEffect } from 'react'
import { supabase, Streak, Completion } from '@/lib/supabase'
import { User } from '@supabase/supabase-js'
import { format, isToday } from 'date-fns'

export function useStreaks(user: User | null) {
  const [streaks, setStreaks] = useState<Streak[]>([])
  const [completions, setCompletions] = useState<Completion[]>([])
  const [loading, setLoading] = useState(true)

  const defaultStreaks = [
    { name: 'Daily Prayer', color: '#10b981', icon: '🙏' },
    { name: 'Duolingo', color: '#3b82f6', icon: '🦜' },
    { name: 'CP Streak', color: '#f59e0b', icon: '💻' },
    { name: 'GitHub Streak', color: '#8b5cf6', icon: '📊' },
    { name: 'Reading Books', color: '#ef4444', icon: '📚' },
  ]

  useEffect(() => {
    if (user) {
      initializeStreaks()
      fetchStreaks()
      fetchCompletions()
    }
  }, [user])

  const initializeStreaks = async () => {
    if (!user) return

    // Check if user already has streaks
    const { data: existingStreaks } = await supabase
      .from('streaks')
      .select('*')
      .eq('user_id', user.id)

    if (existingStreaks && existingStreaks.length === 0) {
      // Create default streaks for new user
      const streaksToInsert = defaultStreaks.map(streak => ({
        user_id: user.id,
        name: streak.name,
        color: streak.color,
        icon: streak.icon,
        current_streak: 0,
        longest_streak: 0,
        total_completions: 0,
      }))

      await supabase.from('streaks').insert(streaksToInsert)
    }
  }

  const fetchStreaks = async () => {
    if (!user) return

    const { data, error } = await supabase
      .from('streaks')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: true })

    if (data && !error) {
      setStreaks(data)
    }
    setLoading(false)
  }

  const fetchCompletions = async () => {
    if (!user) return

    const { data, error } = await supabase
      .from('completions')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false })

    if (data && !error) {
      setCompletions(data)
    }
  }

  const toggleStreak = async (streakId: string) => {
    if (!user) return

    const today = format(new Date(), 'yyyy-MM-dd')
    
    // Check if already completed today
    const existingCompletion = completions.find(
      c => c.streak_id === streakId && c.date === today
    )

    if (existingCompletion) {
      // Remove completion
      await supabase
        .from('completions')
        .delete()
        .eq('id', existingCompletion.id)

      // Update streak
      const streak = streaks.find(s => s.id === streakId)
      if (streak) {
        const newCurrentStreak = Math.max(0, streak.current_streak - 1)
        await supabase
          .from('streaks')
          .update({
            current_streak: newCurrentStreak,
            total_completions: Math.max(0, streak.total_completions - 1),
          })
          .eq('id', streakId)
      }
    } else {
      // Add completion
      await supabase
        .from('completions')
        .insert({
          streak_id: streakId,
          user_id: user.id,
          date: today,
        })

      // Update streak
      const streak = streaks.find(s => s.id === streakId)
      if (streak) {
        const newCurrentStreak = streak.current_streak + 1
        const newLongestStreak = Math.max(streak.longest_streak, newCurrentStreak)
        
        await supabase
          .from('streaks')
          .update({
            current_streak: newCurrentStreak,
            longest_streak: newLongestStreak,
            total_completions: streak.total_completions + 1,
          })
          .eq('id', streakId)
      }
    }

    // Refresh data
    fetchStreaks()
    fetchCompletions()
  }

  const isCompletedToday = (streakId: string) => {
    const today = format(new Date(), 'yyyy-MM-dd')
    return completions.some(c => c.streak_id === streakId && c.date === today)
  }

  const resetStreak = async (streakId: string) => {
    await supabase
      .from('streaks')
      .update({ current_streak: 0 })
      .eq('id', streakId)

    fetchStreaks()
  }

  return {
    streaks,
    completions,
    loading,
    toggleStreak,
    isCompletedToday,
    resetStreak,
  }
}