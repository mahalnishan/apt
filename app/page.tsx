import { createClient } from '@/lib/supabase/server'
import { getHabits, getEntriesInRange } from '@/app/actions'
import { getLast52WeeksRange, formatDateForDB, getStartOfTodayUTC } from '@/lib/date-utils'
import { SignOutButton } from '@/components/SignOutButton'
import { HabitForm } from '@/components/HabitForm'
import { HabitList } from '@/components/HabitList'
import { TodayToggles } from '@/components/TodayToggles'
import { Dashboard } from '@/components/Dashboard'

export default async function Home() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return null // Middleware will redirect to login
  }

  // Fetch data
  const habits = await getHabits()
  const { start, end } = getLast52WeeksRange()
  const entries = await getEntriesInRange(formatDateForDB(start), formatDateForDB(end))
  
  // Get today's entries for quick toggle
  const today = formatDateForDB(getStartOfTodayUTC())
  const todayEntries = entries.filter(entry => entry.date === today)

  return (
    <div className="min-h-screen bg-white dark:bg-black">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                APT - Habit Tracker
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Track your habits with a beautiful HeatMap
              </p>
            </div>
            <SignOutButton 
              userEmail={user.email || undefined}
              userAvatar={user.user_metadata?.avatar_url || undefined}
            />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Today's Progress */}
          <TodayToggles habits={habits} todayEntries={todayEntries} />

          {/* Dashboard with Heatmap */}
          <Dashboard habits={habits} entries={entries} />

          {/* Habit Management */}
          <div className="grid gap-8 lg:grid-cols-2">
            {/* Add New Habit */}
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Add New Habit
              </h2>
              <HabitForm />
            </div>

            {/* Manage Existing Habits */}
            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
              <HabitList habits={habits} />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
