'use client'

import { deleteHabit, updateHabit } from '@/app/actions'
import type { Habit } from '@/types/database'
import { useState } from 'react'

interface HabitListProps {
  habits: Habit[]
}

export const HabitList = ({ habits }: HabitListProps) => {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')

  const handleEdit = (habit: Habit) => {
    setEditingId(habit.id)
    setEditName(habit.name)
  }

  const handleSave = async (id: string) => {
    if (editName.trim()) {
      try {
        await updateHabit(id, { name: editName.trim() })
        setEditingId(null)
        setEditName('')
      } catch (error) {
        console.error('Failed to update habit:', error)
      }
    }
  }

  const handleCancel = () => {
    setEditingId(null)
    setEditName('')
  }

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this habit? All associated data will be lost.')) {
      try {
        await deleteHabit(id)
      } catch (error) {
        console.error('Failed to delete habit:', error)
      }
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent, action: () => void) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      action()
    }
  }

  if (habits.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 dark:text-gray-400">No habits yet. Create your first habit above!</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Your Habits</h2>
      <div className="space-y-2">
        {habits.map((habit) => (
          <div
            key={habit.id}
            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
          >
            <div className="flex-1 flex items-center space-x-3">
              {editingId === habit.id ? (
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="flex-1 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSave(habit.id)
                    } else if (e.key === 'Escape') {
                      handleCancel()
                    }
                  }}
                  autoFocus
                />
              ) : (
                <>
                  <span className="text-gray-900 dark:text-white font-medium">{habit.name}</span>
                  {habit.has_quantity && (
                    <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                      Quantity
                    </span>
                  )}
                </>
              )}
            </div>

            <div className="flex items-center space-x-2">
              {editingId === habit.id ? (
                <>
                  <button
                    type="button"
                    onClick={() => handleSave(habit.id)}
                    className="text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-green-500 rounded px-1"
                    tabIndex={0}
                    onKeyDown={(e) => handleKeyDown(e, () => handleSave(habit.id))}
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-gray-500 rounded px-1"
                    tabIndex={0}
                    onKeyDown={(e) => handleKeyDown(e, handleCancel)}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => handleEdit(habit)}
                    className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1"
                    tabIndex={0}
                    onKeyDown={(e) => handleKeyDown(e, () => handleEdit(habit))}
                    aria-label={`Edit ${habit.name}`}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(habit.id)}
                    className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-500 rounded px-1"
                    tabIndex={0}
                    onKeyDown={(e) => handleKeyDown(e, () => handleDelete(habit.id))}
                    aria-label={`Delete ${habit.name}`}
                  >
                    Delete
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
