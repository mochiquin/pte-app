'use client'

import React, { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { AudioRecorder } from '@/components/practice/AudioRecorder'
import { submitPractice } from '@/app/actions/submissions'
import { getQuestion } from '@/app/actions/questions'
import { useRouter } from 'next/navigation'
import { Question } from '@/types'

export default function RAPracticePage({ params }: { params: Promise<{ id: string }> }) {
  // Params is now a Promise in Next.js 15
  const unwrappedParams = React.use(params)
  const id = unwrappedParams.id

  const [question, setQuestion] = useState<Question | null>(null)
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState<'prep' | 'recording' | 'completed'>('prep')
  const [prepTime, setPrepTime] = useState(40)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  
  const router = useRouter()

  // Fetch question data
  useEffect(() => {
    async function loadQuestion() {
      try {
        const data = await getQuestion(id)
        if (data) {
          setQuestion(data)
        } else {
          alert('Question not found')
          router.push('/practice')
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadQuestion()
  }, [id, router])

  // Preparation Timer
  useEffect(() => {
    if (!question || loading) return

    let interval: NodeJS.Timeout
    if (status === 'prep' && prepTime > 0) {
      interval = setInterval(() => {
        setPrepTime((prev) => prev - 1)
      }, 1000)
    } else if (prepTime === 0 && status === 'prep') {
      setStatus('recording')
    }
    return () => clearInterval(interval)
  }, [prepTime, status, question, loading])

  const handleRecordingComplete = (blob: Blob) => {
    setAudioBlob(blob)
    setStatus('completed')
  }

  const handleSubmit = async () => {
    if (!audioBlob || !question) return
    
    setIsSubmitting(true)
    const formData = new FormData()
    formData.append('questionId', question.id)
    formData.append('audio', audioBlob, 'recording.webm')
    
    const result = await submitPractice(formData)
    
    if (result.error) {
      alert(`Error: ${result.error}`)
    } else {
      alert('Practice saved successfully!')
      router.push('/dashboard')
    }
    setIsSubmitting(false)
  }

  if (loading) {
    return <div className="flex justify-center py-20">Loading question...</div>
  }

  if (!question) return null

  return (
    <div className="container max-w-2xl mx-auto py-12 px-4">
      
      {/* Header Info */}
      <div className="flex justify-between items-center mb-6">
        <Badge variant="outline" className="text-lg px-3 py-1">{question.type}</Badge>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Status:</span>
          <span className={`font-bold ${status === 'prep' ? 'text-yellow-600' : status === 'recording' ? 'text-red-600' : 'text-green-600'}`}>
            {status === 'prep' ? 'Preparation' : status === 'recording' ? 'Recording' : 'Review'}
          </span>
        </div>
      </div>

      {/* Question Card */}
      <Card className="p-8 mb-8 shadow-md">
        <h1 className="text-xl font-semibold mb-6 text-gray-800">{question.title}</h1>
        
        <p className="text-2xl leading-relaxed font-serif text-gray-900 mb-8">
          {question.content}
        </p>

        {status === 'prep' && (
           <div className="space-y-2">
             <div className="flex justify-between text-sm text-gray-500">
               <span>Preparation Time</span>
               <span>{prepTime}s</span>
             </div>
             <Progress value={(prepTime / 40) * 100} className="h-2" />
           </div>
        )}
      </Card>

      {/* Recording Area */}
      <div className="bg-white p-6 rounded-xl border shadow-sm">
        <AudioRecorder 
          onRecordingComplete={handleRecordingComplete} 
          isSubmitting={isSubmitting}
        />

        {/* Submit Actions */}
        {status === 'completed' && (
          <div className="mt-6 flex justify-end gap-3">
            <Button variant="outline" onClick={() => window.location.reload()}>Retry</Button>
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Submit Practice'}
            </Button>
          </div>
        )}
      </div>

    </div>
  )
}
