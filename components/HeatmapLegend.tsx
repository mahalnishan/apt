export const HeatmapLegend = () => {
  const intensityLevels = [
    { level: 0, class: 'bg-gray-100 dark:bg-gray-800', label: 'No activity' },
    { level: 1, class: 'bg-green-200 dark:bg-green-800', label: 'Low activity' },
    { level: 2, class: 'bg-green-300 dark:bg-green-700', label: 'Moderate activity' },
    { level: 3, class: 'bg-green-400 dark:bg-green-600', label: 'High activity' },
    { level: 4, class: 'bg-green-500 dark:bg-green-500', label: 'Very high activity' },
  ]

  return (
    <div className="flex items-center space-x-2">
      <span className="text-xs text-gray-500 dark:text-gray-400">Less</span>
      <div className="flex space-x-1">
        {intensityLevels.map(({ level, class: bgClass, label }) => (
          <div
            key={level}
            className={`w-3 h-3 rounded-sm ${bgClass}`}
            title={label}
            aria-label={label}
          />
        ))}
      </div>
      <span className="text-xs text-gray-500 dark:text-gray-400">More</span>
    </div>
  )
}
