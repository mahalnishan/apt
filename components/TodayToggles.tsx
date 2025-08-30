'use client'

import { toggleEntry } from '@/app/actions'
import type { Habit, Entry } from '@/types/database'
import { formatDateForDB, getStartOfTodayUTC } from '@/lib/date-utils'
import { useState } from 'react'

interface TodayTogglesProps {
  habits: Habit[]
  todayEntries: Entry[]
}

export const TodayToggles = ({ habits, todayEntries }: TodayTogglesProps) => {
  const [quantityInputs, setQuantityInputs] = useState<{ [habitId: string]: string }>({})
  const today = formatDateForDB(getStartOfTodayUTC())

  const getTodayEntry = (habitId: string) => {
    return todayEntries.find(entry => entry.habit_id === habitId && entry.date === today)
  }

  const handleToggle = async (habit: Habit) => {
    const existingEntry = getTodayEntry(habit.id)
    const formData = new FormData()
    
    formData.append('habitId', habit.id)
    formData.append('date', today)
    
    if (habit.has_quantity) {
      const inputValue = quantityInputs[habit.id]
      const value = inputValue ? parseInt(inputValue) : (existingEntry ? 0 : 1)
      formData.append('value', value.toString())
      
      // Clear input after successful toggle
      if (value > 0) {
        setQuantityInputs(prev => ({ ...prev, [habit.id]: '' }))
      }
    } else {
      // Boolean habit - toggle between 0 and 1
      const value = existingEntry ? 0 : 1
      formData.append('value', value.toString())
    }

    try {
      await toggleEntry(formData)
    } catch (error) {
      console.error('Failed to toggle entry:', error)
    }
  }

  const handleQuantityChange = (habitId: string, value: string) => {
    // Only allow positive integers
    if (value === '' || (/^\d+$/.test(value) && parseInt(value) > 0)) {
      setQuantityInputs(prev => ({ ...prev, [habitId]: value }))
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      action()
    }
  }

  const handleQuantityKeyDown = (e: React.KeyboardEvent, habit: Habit) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleToggle(habit)
    }
  }

  if (habits.length === 0) {
    return null
  }

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Today's Progress</h2>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {habits.map((habit) => {
          const todayEntry = getTodayEntry(habit.id)
          const isCompleted = !!todayEntry
          const currentValue = todayEntry?.value || 0

          return (
            <div
              key={habit.id}
              className={`p-3 border rounded-lg transition-colors ${
                isCompleted
                  ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                  : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {habit.name}
                  </h3>
                  {isCompleted && (
                    <p className="text-xs text-green-600 dark:text-green-400">
                      {habit.has_quantity ? `${currentValue} completed` : 'Completed ✓'}
                    </p>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  {habit.has_quantity && (
                    <input
                      type="number"
                      min="1"
                      value={quantityInputs[habit.id] || ''}
                      onChange={(e) => handleQuantityChange(habit.id, e.target.value)}
                      onKeyDown={(e) => handleQuantityKeyDown(e, habit)}
                      placeholder="1"
                      className="w-16 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                      tabIndex={0}
                    />
                  )}
                  
                  <button
                    type="button"
                    onClick={() => handleToggle(habit)}
                    className={`px-3 py-1.5 text-sm font-medium rounded transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${
                      isCompleted
                        ? 'bg-green-600 text-white hover:bg-green-700'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                    }`}
                    tabIndex={0}
                    onKeyDown={(e) => handleKeyDown(e, () => handleToggle(habit))}
                    aria-label={
                      habit.has_quantity
                        ? `Add ${habit.name} entry`
                        : isCompleted
                        ? `Mark ${habit.name} as incomplete`
                        : `Mark ${habit.name} as complete`
                    }
                  >
                    {habit.has_quantity ? 'Add' : isCompleted ? 'Done' : 'Mark'}
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
