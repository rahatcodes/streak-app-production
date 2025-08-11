'use client'

import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/lib/hooks/useAuth'
import { useStreaks } from '@/lib/hooks/useStreaks'
import { User } from '@supabase/supabase-js'
import { Download, Upload, User as UserIcon, Database, Shield } from 'lucide-react'

interface SettingsPageProps {
  user: User
}

export function SettingsPage({ user }: SettingsPageProps) {
  const { signOut } = useAuth()
  const { streaks, completions } = useStreaks(user)

  const exportData = () => {
    const data = {
      streaks,
      completions,
      exportDate: new Date().toISOString(),
    }
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `streak-tracker-backup-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <div className="space-y-8 pb-24">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <h2 className="text-3xl font-bold text-white mb-2">Settings</h2>
        <p className="text-gray-300">Manage your account and data</p>
      </motion.div>

      {/* Account Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="backdrop-blur-lg bg-white/10 border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center text-white">
              <UserIcon className="w-5 h-5 mr-2" />
              Account Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-400">Email</label>
                <p className="text-white">{user.email}</p>
              </div>
              <div>
                <label className="text-sm text-gray-400">Member Since</label>
                <p className="text-white">
                  {new Date(user.created_at || '').toLocaleDateString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Data Management */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="backdrop-blur-lg bg-white/10 border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center text-white">
              <Database className="w-5 h-5 mr-2" />
              Data Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-300">
              <div>
                <p className="text-gray-400">Total Streaks</p>
                <p className="text-white font-semibold">{streaks.length}</p>
              </div>
              <div>
                <p className="text-gray-400">Total Completions</p>
                <p className="text-white font-semibold">{completions.length}</p>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <Button
                onClick={exportData}
                variant="outline"
                className="flex-1 border-white/20 text-gray-300 hover:bg-white/10"
              >
                <Download className="w-4 h-4 mr-2" />
                Export Data
              </Button>
              <Button
                variant="outline"
                className="flex-1 border-white/20 text-gray-300 hover:bg-white/10"
                disabled
              >
                <Upload className="w-4 h-4 mr-2" />
                Import Data
              </Button>
            </div>
            
            <p className="text-xs text-gray-400">
              Export your data as a JSON file for backup or transfer to another device.
              Import functionality coming soon.
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Security */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="backdrop-blur-lg bg-white/10 border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center text-white">
              <Shield className="w-5 h-5 mr-2" />
              Security
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-gray-300 text-sm">
                Your data is securely stored and synced across your devices using Supabase.
                All connections are encrypted and your privacy is protected.
              </p>
              
              <Button
                onClick={handleSignOut}
                variant="destructive"
                className="w-full bg-red-600 hover:bg-red-700"
              >
                Sign Out
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* App Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="backdrop-blur-lg bg-white/10 border-white/20">
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <h3 className="font-semibold text-white">Streak Tracker</h3>
              <p className="text-sm text-gray-400">Version 1.4.0</p>
              <p className="text-xs text-gray-500">
                Built with coffee ☕ on the top of Next.js.
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}