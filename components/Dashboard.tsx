'use client'

import { useState } from 'react'
import { Heatmap } from './Heatmap'
import { HabitSelector } from './HabitSelector'
import type { Habit, Entry } from '@/types/database'

interface DashboardProps {
  habits: Habit[]
  entries: Entry[]
}

export const Dashboard = ({ habits, entries }: DashboardProps) => {
  const [selectedHabitId, setSelectedHabitId] = useState<string | undefined>()

  return (
    <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-6">
      <div className="space-y-6">
        {/* Habit Selector */}
        {habits.length > 0 && (
          <div className="max-w-xs">
            <HabitSelector
              habits={habits}
              selectedHabitId={selectedHabitId}
              onSelectionChange={setSelectedHabitId}
            />
          </div>
        )}

        {/* Heatmap */}
        {habits.length > 0 ? (
          <Heatmap
            habits={habits}
            entries={entries}
            selectedHabitId={selectedHabitId}
          />
        ) : (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                No habits yet
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Create your first habit to start tracking your progress with a beautiful heatmap visualization.
              </p>
              <div className="flex justify-center">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                  <div className="grid grid-cols-7 gap-1">
                    {Array.from({ length: 35 }, (_, i) => (
                      <div
                        key={i}
                        className={`w-3 h-3 rounded-sm ${
                          Math.random() > 0.7
                            ? 'bg-green-400 dark:bg-green-600'
                            : Math.random() > 0.5
                            ? 'bg-green-200 dark:bg-green-800'
                            : 'bg-gray-100 dark:bg-gray-800'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                    Preview: Your habit heatmap
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
