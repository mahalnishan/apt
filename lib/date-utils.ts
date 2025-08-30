// Date helpers for the Habitual app

export const getStartOfTodayUTC = (): Date => {
  const now = new Date()
  return new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()))
}

export const getLast52WeeksRange = (): { start: Date; end: Date } => {
  const today = getStartOfTodayUTC()
  const end = new Date(today)
  
  // Go back 364 days (52 weeks * 7 days - 1) to include today
  const start = new Date(today)
  start.setUTCDate(start.getUTCDate() - 364)
  
  return { start, end }
}

export const eachDayOfRange = (start: Date, end: Date): Date[] => {
  const days: Date[] = []
  const current = new Date(start)
  
  while (current <= end) {
    days.push(new Date(current))
    current.setUTCDate(current.getUTCDate() + 1)
  }
  
  return days
}

export const formatDateForDB = (date: Date): string => {
  return date.toISOString().split('T')[0]
}

export const getWeekdayIndex = (date: Date): number => {
  // Convert Sunday=0 to Monday=0 (0=Monday, 6=Sunday)
  const day = date.getUTCDay()
  return day === 0 ? 6 : day - 1
}

export const getWeekOfYear = (date: Date): number => {
  const start = new Date(Date.UTC(date.getUTCFullYear(), 0, 1))
  const diff = date.getTime() - start.getTime()
  return Math.floor(diff / (7 * 24 * 60 * 60 * 1000))
}

export const formatDateForDisplay = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

export const isToday = (date: Date): boolean => {
  const today = getStartOfTodayUTC()
  return formatDateForDB(date) === formatDateForDB(today)
}

export const parseDBDate = (dateString: string): Date => {
  return new Date(dateString + 'T00:00:00.000Z')
}
