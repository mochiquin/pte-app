'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Mic, Square, Play, RotateCcw, Upload } from 'lucide-react'

interface AudioRecorderProps {
  onRecordingComplete: (audioBlob: Blob) => void
  isSubmitting?: boolean
}

export function AudioRecorder({ onRecordingComplete, isSubmitting = false }: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const [audioURL, setAudioURL] = useState<string | null>(null)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const chunksRef = useRef<Blob[]>([])

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      if (audioURL) URL.revokeObjectURL(audioURL)
    }
  }, [audioURL])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaRecorderRef.current = new MediaRecorder(stream)
      chunksRef.current = []

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data)
        }
      }

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        const url = URL.createObjectURL(blob)
        setAudioURL(url)
        setAudioBlob(blob)
        onRecordingComplete(blob)
        
        // Stop all tracks
        stream.getTracks().forEach(track => track.stop())
      }

      mediaRecorderRef.current.start()
      setIsRecording(true)
      setRecordingTime(0)

      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1)
      }, 1000)

    } catch (err) {
      console.error('Error accessing microphone:', err)
      alert('Could not access microphone. Please allow permission.')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
  }

  const resetRecording = () => {
    setAudioURL(null)
    setAudioBlob(null)
    setRecordingTime(0)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="flex flex-col items-center space-y-4 w-full">
      {/* Visualizer Placeholder */}
      <div className="w-full h-24 bg-slate-100 rounded-lg flex items-center justify-center relative overflow-hidden">
        {isRecording ? (
          <div className="flex items-end gap-1 h-12">
            {[...Array(20)].map((_, i) => (
              <div 
                key={i} 
                className="w-1 bg-red-500 rounded-full animate-pulse"
                style={{ 
                  height: `${Math.random() * 100}%`,
                  animationDelay: `${i * 0.05}s` 
                }} 
              />
            ))}
          </div>
        ) : audioURL ? (
           <audio src={audioURL} controls className="w-full px-4" />
        ) : (
          <span className="text-slate-400 text-sm">Click mic to record</span>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center gap-4">
        {!isRecording && !audioURL && (
          <Button 
            size="lg" 
            className="rounded-full w-16 h-16 bg-red-500 hover:bg-red-600 shadow-lg transition-transform active:scale-95"
            onClick={startRecording}
            disabled={isSubmitting}
          >
            <Mic className="h-8 w-8 text-white" />
          </Button>
        )}

        {isRecording && (
          <div className="flex flex-col items-center gap-2">
            <span className="text-2xl font-mono font-bold text-red-500 animate-pulse">
              {formatTime(recordingTime)}
            </span>
            <Button 
              size="lg" 
              variant="outline"
              className="rounded-full w-16 h-16 border-2 border-slate-200 hover:bg-slate-50"
              onClick={stopRecording}
            >
              <Square className="h-6 w-6 fill-current" />
            </Button>
          </div>
        )}

        {!isRecording && audioURL && (
          <Button
            variant="ghost"
            size="icon"
            onClick={resetRecording}
            disabled={isSubmitting}
            className="text-slate-500 hover:text-red-500"
          >
            <RotateCcw className="h-6 w-6" />
          </Button>
        )}
      </div>
    </div>
  )
}

