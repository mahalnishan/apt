'use client'

import { HeatmapCell } from './HeatmapCell'
import { HeatmapLegend } from './HeatmapLegend'
import type { Habit, Entry } from '@/types/database'
import { 
  getLast52WeeksRange, 
  eachDayOfRange, 
  formatDateForDB, 
  getWeekdayIndex,
  formatDateForDisplay 
} from '@/lib/date-utils'
import { useMemo } from 'react'

interface HeatmapProps {
  habits: Habit[]
  entries: Entry[]
  selectedHabitId?: string
}

interface HeatmapData {
  date: string
  value: number
  intensity: number
  formattedDate: string
  dayOfWeek: number
  weekIndex: number
}

export const Heatmap = ({ habits, entries, selectedHabitId }: HeatmapProps) => {
  const heatmapData = useMemo(() => {
    const { start, end } = getLast52WeeksRange()
    const days = eachDayOfRange(start, end)
    
    // Create a map of date -> entries for quick lookup
    const entriesMap = new Map<string, Entry[]>()
    entries.forEach(entry => {
      const date = entry.date
      if (!entriesMap.has(date)) {
        entriesMap.set(date, [])
      }
      entriesMap.get(date)!.push(entry)
    })

    // Calculate max values for intensity normalization
    const maxValues = new Map<string, number>()
    if (selectedHabitId) {
      // For single habit, find max value for that habit
      const habitEntries = entries.filter(e => e.habit_id === selectedHabitId)
      if (habitEntries.length > 0) {
        maxValues.set(selectedHabitId, Math.max(...habitEntries.map(e => e.value)))
      }
    } else {
      // For all habits view, find max value per habit
      habits.forEach(habit => {
        const habitEntries = entries.filter(e => e.habit_id === habit.id)
        if (habitEntries.length > 0) {
          maxValues.set(habit.id, Math.max(...habitEntries.map(e => e.value)))
        }
      })
    }

    return days.map((day, index) => {
      const dateStr = formatDateForDB(day)
      const dayEntries = entriesMap.get(dateStr) || []
      
      let value = 0
      let intensity = 0

      if (selectedHabitId) {
        // Single habit view
        const habitEntry = dayEntries.find(e => e.habit_id === selectedHabitId)
        if (habitEntry) {
          value = habitEntry.value
          const maxValue = maxValues.get(selectedHabitId) || 1
          intensity = Math.min(Math.ceil((value / maxValue) * 4), 4)
        }
      } else {
        // All habits view - count unique habits completed
        const uniqueHabits = new Set(dayEntries.map(e => e.habit_id))
        value = uniqueHabits.size
        
        if (value > 0) {
          // Intensity based on percentage of habits completed
          const completionRate = value / Math.max(habits.length, 1)
          intensity = Math.min(Math.ceil(completionRate * 4), 4)
        }
      }

      return {
        date: dateStr,
        value,
        intensity,
        formattedDate: formatDateForDisplay(day),
        dayOfWeek: getWeekdayIndex(day),
        weekIndex: Math.floor(index / 7)
      }
    })
  }, [habits, entries, selectedHabitId])

  // Group data by weeks for grid layout
  const weekData = useMemo(() => {
    const weeks: HeatmapData[][] = Array.from({ length: 53 }, () => Array(7).fill(null))
    
    heatmapData.forEach(data => {
      if (data.weekIndex < 53) {
        weeks[data.weekIndex][data.dayOfWeek] = data
      }
    })
    
    return weeks
  }, [heatmapData])

  const monthLabels = useMemo(() => {
    const labels: { week: number; label: string }[] = []
    const { start } = getLast52WeeksRange()
    
    for (let i = 0; i < 53; i++) {
      const weekStart = new Date(start)
      weekStart.setUTCDate(weekStart.getUTCDate() + i * 7)
      
      if (weekStart.getUTCDate() <= 7) {
        labels.push({
          week: i,
          label: weekStart.toLocaleDateString('en-US', { month: 'short' })
        })
      }
    }
    
    return labels
  }, [])

  const dayLabels = ['Mon', 'Wed', 'Fri']
  const displayIndices = [0, 2, 4] // Monday, Wednesday, Friday

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          {selectedHabitId 
            ? `${habits.find(h => h.id === selectedHabitId)?.name} Activity`
            : 'All Habits Activity'
          }
        </h2>
        <HeatmapLegend />
      </div>
      
      <div className="relative">
        {/* Month labels */}
        <div className="flex mb-2">
          <div className="w-8"></div>
          <div className="flex-1 flex">
            {monthLabels.map(({ week, label }) => (
              <div
                key={week}
                className="text-xs text-gray-500 dark:text-gray-400"
                style={{ 
                  marginLeft: `${week * (100 / 53)}%`,
                  position: 'absolute',
                  transform: 'translateX(-50%)'
                }}
              >
                {label}
              </div>
            ))}
          </div>
        </div>

        <div className="flex">
          {/* Day labels */}
          <div className="flex flex-col justify-between w-8 pr-2">
            {displayIndices.map(index => (
              <div
                key={index}
                className="text-xs text-gray-500 dark:text-gray-400 h-3 flex items-center"
                style={{ marginBottom: index < displayIndices.length - 1 ? '2px' : '0' }}
              >
                {dayLabels[displayIndices.indexOf(index)]}
              </div>
            ))}
          </div>

          {/* Heatmap grid */}
          <div className="flex-1 grid grid-cols-53 gap-1">
            {weekData.map((week, weekIndex) => (
              <div key={weekIndex} className="space-y-1">
                {week.map((day, dayIndex) => (
                  <HeatmapCell
                    key={`${weekIndex}-${dayIndex}`}
                    data={day}
                    isClickable={!!selectedHabitId}
                    selectedHabitId={selectedHabitId}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
