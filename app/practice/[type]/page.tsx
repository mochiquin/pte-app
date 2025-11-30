import { createClient } from '@/lib/supabase/server'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft } from 'lucide-react'
import { QuestionType } from '@/types'

export default async function CategoryListPage({ params }: { params: Promise<{ type: string }> }) {
  const unwrappedParams = await params
  const type = unwrappedParams.type.toUpperCase() as QuestionType
  const supabase = await createClient()

  // Fetch questions of this specific type
  const { data: questions } = await supabase
    .from('questions')
    .select('*')
    .eq('type', type)
    .order('created_at', { ascending: false })

  // Mapping for nice titles
  const TITLES: Record<string, string> = {
    RA: 'Read Aloud',
    DI: 'Describe Image',
    RS: 'Repeat Sentence',
    // ... others
  }

  return (
    <div className="container max-w-4xl mx-auto py-12 px-4">
      <div className="mb-8">
        <Link href="/practice" className="text-sm text-gray-500 hover:text-gray-900 flex items-center gap-1 mb-4">
          <ArrowLeft className="h-4 w-4" /> Back to Library
        </Link>
        <div className="flex items-center gap-3">
          <Badge className="text-lg px-3 py-1">{type}</Badge>
          <h1 className="text-2xl font-bold">{TITLES[type] || type} Practice</h1>
        </div>
      </div>

      <div className="grid gap-4">
        {questions && questions.length > 0 ? (
          questions.map((q) => (
            <Link href={`/practice/${type.toLowerCase()}/${q.id}`} key={q.id}>
              <Card className="p-4 hover:shadow-md transition-shadow cursor-pointer flex justify-between items-center group bg-white">
                <div className="flex-1 min-w-0 pr-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors truncate">
                      {q.title || `Question #${q.id.slice(0, 8)}`}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 line-clamp-2">
                    {q.content || '(Image Question)'}
                  </p>
                </div>
                <Button variant="ghost" className="shrink-0 text-gray-400 group-hover:text-blue-600">
                  Start
                </Button>
              </Card>
            </Link>
          ))
        ) : (
          <div className="text-center py-20 bg-slate-50 rounded-lg border border-dashed">
            <p className="text-gray-500">No questions available for {TITLES[type] || type} yet.</p>
          </div>
        )}
      </div>
    </div>
  )
}

