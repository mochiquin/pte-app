import { getSubmission } from '@/app/actions/submissions'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Calendar, Download } from 'lucide-react'
import { redirect } from 'next/navigation'

export default async function SubmissionDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = await params
  const submission = await getSubmission(unwrappedParams.id)

  if (!submission) {
    redirect('/dashboard')
  }

  const question = submission.questions

  return (
    <div className="container max-w-3xl mx-auto py-12 px-4">
      
      <div className="mb-6">
        <Link href="/dashboard" className="text-sm text-gray-500 hover:text-gray-900 flex items-center gap-1 mb-4">
          <ArrowLeft className="h-4 w-4" /> Back to Dashboard
        </Link>
        <div className="flex justify-between items-start">
          <div>
             <h1 className="text-2xl font-bold mb-2">Practice Result</h1>
             <div className="flex items-center gap-2 text-sm text-gray-500">
               <Calendar className="h-4 w-4" />
               {new Date(submission.created_at).toLocaleString()}
             </div>
          </div>
          <Badge className="text-lg px-3 py-1">{question.type}</Badge>
        </div>
      </div>

      <div className="grid gap-6">
        {/* Question Content */}
        <Card className="p-6">
          <h2 className="font-semibold text-gray-700 mb-4 border-b pb-2">Original Question: {question.title}</h2>
          
          {question.type === 'DI' && question.image_url ? (
            <div className="relative w-full h-[300px] bg-slate-50 rounded-lg overflow-hidden">
               <Image 
                 src={question.image_url} 
                 alt="Question Image"
                 fill
                 className="object-contain"
               />
            </div>
          ) : (
            <p className="text-lg leading-relaxed font-serif text-gray-800">
              {question.content}
            </p>
          )}
        </Card>

        {/* User Recording */}
        <Card className="p-6 bg-slate-50 border-slate-200">
          <h2 className="font-semibold text-gray-700 mb-4">Your Recording</h2>
          
          {submission.audio_url ? (
            <div className="w-full">
               <audio src={submission.audio_url} controls className="w-full mb-4" />
               <div className="flex justify-end">
                 <a href={submission.audio_url} download target="_blank" rel="noopener noreferrer">
                   <Button variant="outline" size="sm" className="gap-2">
                     <Download className="h-4 w-4" /> Download Audio
                   </Button>
                 </a>
               </div>
            </div>
          ) : (
             <p className="text-red-500">Audio not found.</p>
          )}
        </Card>

        {/* AI Feedback Placeholder */}
        <Card className="p-6 border-dashed border-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-gray-700">AI Analysis</h2>
            <Badge variant="outline">Coming Soon</Badge>
          </div>
          <p className="text-gray-500 text-sm">
            AI scoring is not yet enabled. Future updates will show your pronunciation score, fluency, and content analysis here.
          </p>
        </Card>
      </div>
    </div>
  )
}

