export interface Habit {
  id: string
  name: string
  has_quantity: boolean
  user_id: string
  created_at: string
  updated_at: string
}

export interface Entry {
  id: string
  habit_id: string
  date: string
  value: number // 1 for boolean habits, actual count for quantity habits
  user_id: string
  created_at: string
}

export interface HeatmapData {
  date: string
  value: number
  habits: { [habitId: string]: number }
}

export interface DashboardData {
  habits: Habit[]
  entries: Entry[]
  heatmapData: HeatmapData[]
}
