'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useStreaks } from '@/lib/hooks/useStreaks'
import { User } from '@supabase/supabase-js'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, parseISO } from 'date-fns'

interface CalendarPageProps {
  user: User
}

export function CalendarPage({ user }: CalendarPageProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const { streaks, completions, loading } = useStreaks(user)

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd })

  const getCompletionsForDate = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd')
    return completions.filter(completion => completion.date === dateStr)
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate)
    newDate.setMonth(newDate.getMonth() + (direction === 'next' ? 1 : -1))
    setCurrentDate(newDate)
  }

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
        <h2 className="text-3xl font-bold text-white mb-2">Calendar View</h2>
        <p className="text-gray-300">Track your completion history</p>
      </motion.div>

      <Card className="backdrop-blur-lg bg-white/10 border-white/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <Button
              onClick={() => navigateMonth('prev')}
              variant="ghost"
              size="sm"
              className="text-gray-300 hover:text-white hover:bg-white/10"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            
            <CardTitle className="text-xl text-white">
              {format(currentDate, 'MMMM yyyy')}
            </CardTitle>
            
            <Button
              onClick={() => navigateMonth('next')}
              variant="ghost"
              size="sm"
              className="text-gray-300 hover:text-white hover:bg-white/10"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-7 gap-2 mb-4">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div key={day} className="p-2 text-center text-sm font-medium text-gray-400">
                {day}
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-7 gap-2">
            {days.map((day) => {
              const dayCompletions = getCompletionsForDate(day)
              const completionRate = dayCompletions.length / streaks.length
              
              return (
                <motion.div
                  key={day.toISOString()}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  className={`
                    relative p-3 text-center rounded-lg cursor-pointer transition-all
                    ${isSameMonth(day, currentDate) ? 'text-white' : 'text-gray-500'}
                    ${isToday(day) ? 'ring-2 ring-blue-400' : ''}
                    hover:bg-white/10
                  `}
                >
                  <span className="text-sm">{format(day, 'd')}</span>
                  
                  {dayCompletions.length > 0 && (
                    <div className="flex justify-center space-x-1 mt-1">
                      {dayCompletions.slice(0, 3).map((completion, index) => {
                        const streak = streaks.find(s => s.id === completion.streak_id)
                        return (
                          <div
                            key={completion.id}
                            className="w-1.5 h-1.5 rounded-full"
                            style={{ backgroundColor: streak?.color || '#3b82f6' }}
                          />
                        )
                      })}
                      {dayCompletions.length > 3 && (
                        <span className="text-xs text-gray-400">+{dayCompletions.length - 3}</span>
                      )}
                    </div>
                  )}
                </motion.div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Legend */}
      <Card className="backdrop-blur-lg bg-white/10 border-white/20">
        <CardHeader>
          <CardTitle className="text-lg text-white">Legend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {streaks.map((streak) => (
              <div key={streak.id} className="flex items-center space-x-3">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: streak.color }}
                />
                <span className="text-sm text-gray-300">{streak.name}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}