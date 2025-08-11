'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useStreaks } from '@/lib/hooks/useStreaks'
import { User } from '@supabase/supabase-js'
import { RotateCcw, CheckCircle, Circle } from 'lucide-react'

interface StreaksPageProps {
  user: User
}

export function StreaksPage({ user }: StreaksPageProps) {
  const { streaks, loading, toggleStreak, isCompletedToday, resetStreak } = useStreaks(user)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8 pb-24">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className="text-3xl font-bold text-white mb-2">Manage Streaks</h2>
        <p className="text-gray-300">Track your progress and reset streaks if needed</p>
      </motion.div>

      <div className="space-y-4">
        {streaks.map((streak, index) => (
          <motion.div
            key={streak.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="backdrop-blur-lg bg-white/10 border-white/20">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <span className="text-3xl">{streak.icon}</span>
                    <div>
                      <h3 className="text-xl font-semibold text-white">{streak.name}</h3>
                      <div className="flex space-x-2 mt-1">
                        <Badge variant="outline" className="border-blue-400/50 text-blue-400">
                          Current: {streak.current_streak} days
                        </Badge>
                        <Badge variant="outline" className="border-green-400/50 text-green-400">
                          Best: {streak.longest_streak} days
                        </Badge>
                        <Badge variant="outline" className="border-yellow-400/50 text-yellow-400">
                          Total: {streak.total_completions}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Button
                      onClick={() => toggleStreak(streak.id)}
                      variant={isCompletedToday(streak.id) ? "default" : "outline"}
                      className={`${
                        isCompletedToday(streak.id)
                          ? 'bg-green-500 hover:bg-green-600 text-white'
                          : 'border-white/20 text-gray-300 hover:bg-white/10'
                      }`}
                    >
                      {isCompletedToday(streak.id) ? (
                        <CheckCircle className="w-4 h-4 mr-2" />
                      ) : (
                        <Circle className="w-4 h-4 mr-2" />
                      )}
                      {isCompletedToday(streak.id) ? 'Done' : 'Mark Done'}
                    </Button>
                    
                    <Button
                      onClick={() => resetStreak(streak.id)}
                      variant="outline"
                      size="sm"
                      className="border-red-400/50 text-red-400 hover:bg-red-400/10"
                    >
                      <RotateCcw className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}