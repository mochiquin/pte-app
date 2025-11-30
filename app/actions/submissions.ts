'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { Submission, Question } from '@/types'

export async function submitPractice(formData: FormData) {
  const supabase = await createClient()

  // 1. Check Auth
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    return { error: 'Unauthorized' }
  }

  const questionId = formData.get('questionId') as string
  const audioFile = formData.get('audio') as File
  const transcript = formData.get('transcript') as string | null 

  if (!questionId || !audioFile) {
    return { error: 'Missing required fields' }
  }

  // 2. Upload Audio to Storage
  const filename = `${user.id}/${Date.now()}-${audioFile.name}`
  const { data: storageData, error: storageError } = await supabase.storage
    .from('practice_audio')
    .upload(filename, audioFile, {
      cacheControl: '3600',
      upsert: false
    })

  if (storageError) {
    console.error('Upload error:', storageError)
    return { error: 'Failed to upload audio' }
  }

  // 3. Get Public URL
  const { data: { publicUrl } } = supabase.storage
    .from('practice_audio')
    .getPublicUrl(filename)

  // 4. Insert into Submissions table
  const { error: dbError } = await supabase
    .from('submissions')
    .insert({
      user_id: user.id,
      question_id: questionId,
      audio_url: publicUrl,
      transcript: transcript || null,
      score: null 
    })

  if (dbError) {
    console.error('Database error:', dbError)
    return { error: 'Failed to save submission' }
  }

  revalidatePath('/dashboard')
  return { success: true }
}

export async function getSubmission(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  const { data, error } = await supabase
    .from('submissions')
    .select('*, questions(*)')
    .eq('id', id)
    .single()

  if (error || !data) {
    return null
  }

  // Check ownership (security)
  if (data.user_id !== user.id) {
    return null
  }

  return data as (Submission & { questions: Question })
}
