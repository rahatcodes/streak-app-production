'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useStreaks } from '@/lib/hooks/useStreaks'
import { User } from '@supabase/supabase-js'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Trophy, Target, Calendar, TrendingUp } from 'lucide-react'

interface StatsPageProps {
  user: User
}

export function StatsPage({ user }: StatsPageProps) {
  const { streaks, completions, loading } = useStreaks(user)

  const totalCompletions = streaks.reduce((acc, streak) => acc + streak.total_completions, 0)
  const totalCurrentStreaks = streaks.reduce((acc, streak) => acc + streak.current_streak, 0)
  const longestStreak = Math.max(...streaks.map(s => s.longest_streak), 0)
  const averageStreak = streaks.length > 0 ? totalCurrentStreaks / streaks.length : 0

  const chartData = streaks.map(streak => ({
    name: streak.name.split(' ').map(word => word.charAt(0)).join(''),
    current: streak.current_streak,
    longest: streak.longest_streak,
    total: streak.total_completions,
    color: streak.color,
  }))

  const stats = [
    {
      title: 'Total Completions',
      value: totalCompletions,
      icon: Trophy,
      color: 'from-yellow-400 to-orange-500',
      bgColor: 'bg-yellow-400/10',
    },
    {
      title: 'Active Streaks',
      value: totalCurrentStreaks,
      icon: Target,
      color: 'from-blue-400 to-blue-600',
      bgColor: 'bg-blue-400/10',
    },
    {
      title: 'Longest Streak',
      value: longestStreak,
      icon: TrendingUp,
      color: 'from-green-400 to-green-600',
      bgColor: 'bg-green-400/10',
    },
    {
      title: 'Average Streak',
      value: Math.round(averageStreak),
      icon: Calendar,
      color: 'from-purple-400 to-purple-600',
      bgColor: 'bg-purple-400/10',
    },
  ]

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
        <h2 className="text-3xl font-bold text-white mb-2">Statistics</h2>
        <p className="text-gray-300">Your progress at a glance</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className={`backdrop-blur-lg bg-white/10 border-white/20 ${stat.bgColor}`}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Icon className="w-5 h-5 text-gray-400" />
                    <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${stat.color}`} />
                  </div>
                  <div className="text-2xl font-bold text-white mb-1">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-300">
                    {stat.title}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Card className="backdrop-blur-lg bg-white/10 border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Current vs Longest Streaks</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fill: '#9ca3af', fontSize: 12 }}
                  />
                  <YAxis 
                    tick={{ fill: '#9ca3af', fontSize: 12 }}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'rgba(30, 41, 59, 0.9)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      borderRadius: '8px',
                      color: 'white',
                    }}
                  />
                  <Bar dataKey="current" fill="#3b82f6" name="Current" radius={4} />
                  <Bar dataKey="longest" fill="#10b981" name="Longest" radius={4} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Card className="backdrop-blur-lg bg-white/10 border-white/20">
            <CardHeader>
              <CardTitle className="text-white">Total Completions</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fill: '#9ca3af', fontSize: 12 }}
                  />
                  <YAxis 
                    tick={{ fill: '#9ca3af', fontSize: 12 }}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: 'rgba(30, 41, 59, 0.9)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      borderRadius: '8px',
                      color: 'white',
                    }}
                  />
                  <Bar 
                    dataKey="total" 
                    fill="#f59e0b" 
                    name="Total Completions" 
                    radius={4} 
                  />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Detailed Breakdown */}
      <Card className="backdrop-blur-lg bg-white/10 border-white/20">
        <CardHeader>
          <CardTitle className="text-white">Detailed Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {streaks.map((streak, index) => (
              <motion.div
                key={streak.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4 rounded-lg bg-white/5"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{streak.icon}</span>
                  <div>
                    <h4 className="font-medium text-white">{streak.name}</h4>
                    <p className="text-sm text-gray-400">
                      Success rate: {streak.total_completions > 0 
                        ? Math.round((streak.current_streak / streak.total_completions) * 100) 
                        : 0}%
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold text-white">
                    {streak.current_streak} days
                  </div>
                  <div className="text-sm text-gray-400">
                    Best: {streak.longest_streak}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}