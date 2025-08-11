'use client'

import { useState } from 'react'
import { AuthForm } from '@/components/AuthForm'
import { Layout } from '@/components/Layout'
import { HomePage } from '@/components/pages/HomePage'
import { StreaksPage } from '@/components/pages/StreaksPage'
import { CalendarPage } from '@/components/pages/CalendarPage'
import { StatsPage } from '@/components/pages/StatsPage'
import { SettingsPage } from '@/components/pages/SettingsPage'
import { useAuth } from '@/lib/hooks/useAuth'

export default function Home() {
  const [activeTab, setActiveTab] = useState('home')
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-700">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
      </div>
    )
  }

  if (!user) {
    return <AuthForm />
  }

  const renderActivePage = () => {
    switch (activeTab) {
      case 'home':
        return <HomePage user={user} />
      case 'streaks':
        return <StreaksPage user={user} />
      case 'calendar':
        return <CalendarPage user={user} />
      case 'stats':
        return <StatsPage user={user} />
      case 'settings':
        return <SettingsPage user={user} />
      default:
        return <HomePage user={user} />
    }
  }

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderActivePage()}
    </Layout>
  )
}