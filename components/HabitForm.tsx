'use client'

import { createHabit } from '@/app/actions'
import { useState } from 'react'

export const HabitForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true)
    try {
      await createHabit(formData)
    } catch (error) {
      console.error('Failed to create habit:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Habit Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          placeholder="e.g., Exercise, Read, Meditate"
          className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
          disabled={isSubmitting}
          tabIndex={0}
        />
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          id="hasQuantity"
          name="hasQuantity"
          value="true"
          className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 dark:border-gray-600 rounded"
          disabled={isSubmitting}
          tabIndex={0}
        />
        <label htmlFor="hasQuantity" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
          Track quantity (e.g., number of pushups, pages read)
        </label>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        aria-label="Add new habit"
        tabIndex={0}
      >
        {isSubmitting ? 'Adding...' : 'Add Habit'}
      </button>
    </form>
  )
}
