'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import type { Habit, Entry } from '@/types/database'

// Habit CRUD operations
export const createHabit = async (formData: FormData) => {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  const name = formData.get('name') as string
  const hasQuantity = formData.get('hasQuantity') === 'true'

  if (!name?.trim()) {
    throw new Error('Habit name is required')
  }

  const { data, error } = await supabase
    .from('habits')
    .insert({
      name: name.trim(),
      has_quantity: hasQuantity,
      user_id: user.id,
    })
    .select()
    .single()

  if (error) {
    throw new Error('Failed to create habit')
  }

  revalidatePath('/')
  return data
}

export const updateHabit = async (id: string, updates: Partial<Habit>) => {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  const { data, error } = await supabase
    .from('habits')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('user_id', user.id)
    .select()
    .single()

  if (error) {
    throw new Error('Failed to update habit')
  }

  revalidatePath('/')
  return data
}

export const deleteHabit = async (id: string) => {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  const { error } = await supabase
    .from('habits')
    .delete()
    .eq('id', id)
    .eq('user_id', user.id)

  if (error) {
    throw new Error('Failed to delete habit')
  }

  revalidatePath('/')
}

export const getHabits = async (): Promise<Habit[]> => {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return []
  }

  const { data, error } = await supabase
    .from('habits')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Failed to fetch habits:', error)
    return []
  }

  return data || []
}

// Entry operations
export const toggleEntry = async (formData: FormData) => {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  const habitId = formData.get('habitId') as string
  const date = formData.get('date') as string
  const value = parseInt(formData.get('value') as string) || 1

  if (!habitId || !date) {
    throw new Error('Habit ID and date are required')
  }

  // Check if entry already exists
  const { data: existingEntry } = await supabase
    .from('entries')
    .select('*')
    .eq('habit_id', habitId)
    .eq('date', date)
    .eq('user_id', user.id)
    .single()

  if (existingEntry) {
    // Update existing entry or delete if value is 0
    if (value === 0) {
      const { error } = await supabase
        .from('entries')
        .delete()
        .eq('id', existingEntry.id)

      if (error) {
        throw new Error('Failed to delete entry')
      }
    } else {
      const { error } = await supabase
        .from('entries')
        .update({ value })
        .eq('id', existingEntry.id)

      if (error) {
        throw new Error('Failed to update entry')
      }
    }
  } else if (value > 0) {
    // Create new entry
    const { error } = await supabase
      .from('entries')
      .insert({
        habit_id: habitId,
        date,
        value,
        user_id: user.id,
      })

    if (error) {
      throw new Error('Failed to create entry')
    }
  }

  revalidatePath('/')
}

export const getEntriesInRange = async (startDate: string, endDate: string): Promise<Entry[]> => {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return []
  }

  const { data, error } = await supabase
    .from('entries')
    .select('*')
    .eq('user_id', user.id)
    .gte('date', startDate)
    .lte('date', endDate)
    .order('date', { ascending: true })

  if (error) {
    console.error('Failed to fetch entries:', error)
    return []
  }

  return data || []
}

export const getHabitEntries = async (habitId: string, startDate: string, endDate: string): Promise<Entry[]> => {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return []
  }

  const { data, error } = await supabase
    .from('entries')
    .select('*')
    .eq('user_id', user.id)
    .eq('habit_id', habitId)
    .gte('date', startDate)
    .lte('date', endDate)
    .order('date', { ascending: true })

  if (error) {
    console.error('Failed to fetch habit entries:', error)
    return []
  }

  return data || []
}
