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
import Image from 'next/image'

export default function DIPracticePage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = React.use(params)
  const id = unwrappedParams.id

  const [question, setQuestion] = useState<Question | null>(null)
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState<'prep' | 'recording' | 'completed'>('prep')
  const [prepTime, setPrepTime] = useState(25) // DI uses 25s prep time
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
          router.push('/practice/di')
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

  // Ensure we have a valid image URL. If not (e.g. data error), fallback to a placeholder or show error.
  const imageUrl = question.image_url || question.content // Fallback to content if image_url is empty but content has url

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      
      {/* Header Info */}
      <div className="flex justify-between items-center mb-6">
        <Badge className="text-lg px-3 py-1 bg-blue-600 hover:bg-blue-700">Describe Image</Badge>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Status:</span>
          <span className={`font-bold ${status === 'prep' ? 'text-yellow-600' : status === 'recording' ? 'text-red-600' : 'text-green-600'}`}>
            {status === 'prep' ? 'Preparation (25s)' : status === 'recording' ? 'Recording (40s)' : 'Review'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left: Image Display */}
        <Card className="p-4 flex items-center justify-center bg-slate-50 min-h-[400px]">
          {imageUrl ? (
            <div className="relative w-full h-[400px]">
               <Image 
                 src={imageUrl} 
                 alt={question.title || "Describe this image"}
                 fill
                 className="object-contain"
                 priority
               />
            </div>
          ) : (
            <div className="text-gray-400">No Image Available</div>
          )}
        </Card>

        {/* Right: Controls & Timer */}
        <div className="flex flex-col space-y-6">
           <Card className="p-6">
              <h1 className="text-lg font-semibold mb-4 text-gray-800">{question.title}</h1>
              
              {status === 'prep' && (
                <div className="space-y-2 mb-8">
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Preparation Time</span>
                    <span>{prepTime}s</span>
                  </div>
                  <Progress value={(prepTime / 25) * 100} className="h-2" />
                </div>
              )}

              {/* Recording Area */}
              <div className="bg-white rounded-xl flex flex-col items-center">
                <AudioRecorder 
                  onRecordingComplete={handleRecordingComplete} 
                  isSubmitting={isSubmitting}
                />

                {/* Submit Actions */}
                {status === 'completed' && (
                  <div className="mt-8 flex justify-center gap-3 w-full">
                    <Button variant="outline" onClick={() => window.location.reload()} className="w-1/2">Retry</Button>
                    <Button onClick={handleSubmit} disabled={isSubmitting} className="w-1/2">
                      {isSubmitting ? 'Saving...' : 'Submit'}
                    </Button>
                  </div>
                )}
              </div>
           </Card>

           <Card className="p-4 bg-blue-50 border-blue-100 text-sm text-blue-800">
             <h3 className="font-bold mb-1">Tip:</h3>
             <p>Focus on the main trends, extremes (highest/lowest), and implications. Speak fluently for 40 seconds.</p>
           </Card>
        </div>
      </div>

    </div>
  )
}

