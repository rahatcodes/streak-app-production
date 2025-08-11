'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Streak } from '@/lib/supabase'
import { CheckCircle, Circle } from 'lucide-react'

interface StreakCardProps {
  streak: Streak
  isCompletedToday: boolean
  onToggle: () => void
}

export function StreakCard({ streak, isCompletedToday, onToggle }: StreakCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card 
        className={`backdrop-blur-lg bg-white/10 border-white/20 shadow-lg cursor-pointer transition-all duration-200 ${
          isCompletedToday 
            ? 'ring-2 ring-green-400/50 bg-green-400/20' 
            : 'hover:bg-white/15'
        }`}
        onClick={onToggle}
      >
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">{streak.icon}</span>
              <div>
                <h3 className="font-semibold text-white">{streak.name}</h3>
                <Badge 
                  variant="outline" 
                  className="border-white/20 text-gray-300"
                  style={{ borderColor: streak.color }}
                >
                  {streak.current_streak} day{streak.current_streak !== 1 ? 's' : ''}
                </Badge>
              </div>
            </div>
            <motion.div
              animate={{ 
                scale: isCompletedToday ? 1.1 : 1,
                rotate: isCompletedToday ? 360 : 0 
              }}
              transition={{ duration: 0.3 }}
            >
              {isCompletedToday ? (
                <CheckCircle className="w-8 h-8 text-green-400" />
              ) : (
                <Circle className="w-8 h-8 text-gray-400" />
              )}
            </motion.div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-300">
            <div>
              <p className="text-gray-400">Longest Streak</p>
              <p className="font-semibold text-white">{streak.longest_streak} days</p>
            </div>
            <div>
              <p className="text-gray-400">Total</p>
              <p className="font-semibold text-white">{streak.total_completions}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}