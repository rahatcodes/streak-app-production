'use client'

import { motion } from 'framer-motion'
import { StreakCard } from '@/components/StreakCard'
import { useStreaks } from '@/lib/hooks/useStreaks'
import { User } from '@supabase/supabase-js'
import { Flame, Trophy } from 'lucide-react'

interface HomePageProps {
  user: User
}

export function HomePage({ user }: HomePageProps) {
  const { streaks, loading, toggleStreak, isCompletedToday } = useStreaks(user)

  const completedToday = streaks.filter(streak => isCompletedToday(streak.id)).length
  const totalStreakDays = streaks.reduce((acc, streak) => acc + streak.current_streak, 0)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8 pb-24">
      {/* Header Stats */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <h2 className="text-3xl font-bold text-white">Today's Progress</h2>
        <div className="flex justify-center space-x-8">
          <div className="flex items-center space-x-2">
            <Flame className="w-5 h-5 text-orange-400" />
            <span className="text-gray-300">
              <span className="text-white font-semibold">{completedToday}</span>/{streaks.length} completed
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <Trophy className="w-5 h-5 text-yellow-400" />
            <span className="text-gray-300">
              <span className="text-white font-semibold">{totalStreakDays}</span> total days
            </span>
          </div>
        </div>
      </motion.div>

      {/* Progress Bar */}
      <motion.div
        initial={{ opacity: 0, scaleX: 0 }}
        animate={{ opacity: 1, scaleX: 1 }}
        className="w-full max-w-md mx-auto"
      >
        <div className="bg-white/10 rounded-full h-3 backdrop-blur-lg">
          <div 
            className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${(completedToday / streaks.length) * 100}%` }}
          />
        </div>
        <p className="text-center text-gray-300 text-sm mt-2">
          {Math.round((completedToday / streaks.length) * 100)}% complete
        </p>
      </motion.div>

      {/* Streak Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {streaks.map((streak, index) => (
          <motion.div
            key={streak.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <StreakCard
              streak={streak}
              isCompletedToday={isCompletedToday(streak.id)}
              onToggle={() => toggleStreak(streak.id)}
            />
          </motion.div>
        ))}
      </div>
    </div>
  )
}