'use server'

import { createClient } from '@/lib/supabase/server'
import { Question, QuestionType } from '@/types'

export async function getQuestions(type?: QuestionType): Promise<Question[]> {
  const supabase = await createClient()

  let query = supabase
    .from('questions')
    .select('*')
    .order('created_at', { ascending: false })

  if (type) {
    query = query.eq('type', type)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching questions:', error)
    throw new Error('Failed to fetch questions')
  }

  return data as Question[]
}

export async function getQuestion(id: string): Promise<Question | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('questions')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching question:', error)
    return null
  }

  return data as Question
}

