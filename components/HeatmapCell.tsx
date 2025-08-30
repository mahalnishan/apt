'use client'

import { toggleEntry } from '@/app/actions'
import { useState } from 'react'

interface HeatmapCellData {
  date: string
  value: number
  intensity: number
  formattedDate: string
}

interface HeatmapCellProps {
  data: HeatmapCellData | null
  isClickable: boolean
  selectedHabitId?: string
}

export const HeatmapCell = ({ data, isClickable, selectedHabitId }: HeatmapCellProps) => {
  const [showTooltip, setShowTooltip] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  if (!data) {
    return <div className="w-3 h-3 rounded-sm bg-gray-100 dark:bg-gray-800" />
  }

  const getIntensityClass = (intensity: number) => {
    switch (intensity) {
      case 0:
        return 'bg-gray-100 dark:bg-gray-800'
      case 1:
        return 'bg-green-200 dark:bg-green-800'
      case 2:
        return 'bg-green-300 dark:bg-green-700'
      case 3:
        return 'bg-green-400 dark:bg-green-600'
      case 4:
        return 'bg-green-500 dark:bg-green-500'
      default:
        return 'bg-gray-100 dark:bg-gray-800'
    }
  }

  const handleClick = async () => {
    if (!isClickable || !selectedHabitId || isUpdating) return
    
    setIsUpdating(true)
    const formData = new FormData()
    formData.append('habitId', selectedHabitId)
    formData.append('date', data.date)
    formData.append('value', data.value > 0 ? '0' : '1')

    try {
      await toggleEntry(formData)
    } catch (error) {
      console.error('Failed to toggle entry:', error)
    } finally {
      setIsUpdating(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.key === 'Enter' || e.key === ' ') && isClickable) {
      e.preventDefault()
      handleClick()
    }
  }

  const tooltipContent = selectedHabitId
    ? `${data.formattedDate}: ${data.value > 0 ? `${data.value} completed` : 'No activity'}`
    : `${data.formattedDate}: ${data.value} habit${data.value !== 1 ? 's' : ''} completed`

  return (
    <div className="relative">
      <div
        className={`
          w-3 h-3 rounded-sm transition-all duration-200
          ${getIntensityClass(data.intensity)}
          ${isClickable ? 'cursor-pointer hover:ring-2 hover:ring-green-400 hover:ring-offset-1' : ''}
          ${isUpdating ? 'opacity-50' : ''}
        `}
        onClick={handleClick}
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        onFocus={() => setShowTooltip(true)}
        onBlur={() => setShowTooltip(false)}
        tabIndex={isClickable ? 0 : -1}
        onKeyDown={handleKeyDown}
        role={isClickable ? 'button' : 'presentation'}
        aria-label={isClickable ? `Toggle entry for ${data.formattedDate}` : tooltipContent}
      />
      
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-10">
          <div className="bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 text-xs rounded py-1 px-2 whitespace-nowrap">
            {tooltipContent}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900 dark:border-t-gray-100" />
          </div>
        </div>
      )}
    </div>
  )
}
