'use client'

import type { Habit } from '@/types/database'

interface HabitSelectorProps {
  habits: Habit[]
  selectedHabitId?: string
  onSelectionChange: (habitId?: string) => void
}

export const HabitSelector = ({ habits, selectedHabitId, onSelectionChange }: HabitSelectorProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    onSelectionChange(value === 'all' ? undefined : value)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      // Let the default select behavior handle this
      return
    }
  }

  return (
    <div className="space-y-2">
      <label htmlFor="habit-selector" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
        View Activity
      </label>
      <select
        id="habit-selector"
        value={selectedHabitId || 'all'}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
        tabIndex={0}
        aria-label="Select habit to view"
      >
        <option value="all">All Habits</option>
        {habits.map((habit) => (
          <option key={habit.id} value={habit.id}>
            {habit.name}
            {habit.has_quantity && ' (Quantity)'}
          </option>
        ))}
      </select>
      
      {selectedHabitId && (
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Click on any day in the heatmap to toggle completion for{' '}
          <span className="font-medium">
            {habits.find(h => h.id === selectedHabitId)?.name}
          </span>
        </p>
      )}
    </div>
  )
}
