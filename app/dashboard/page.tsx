import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { logout } from '@/app/actions/auth'
import { Mic, BookOpen, Clock } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch recent submissions
  const { data: submissions } = await supabase
    .from('submissions')
    .select('*, questions(title, type)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(5)

  return (
    <div className="container max-w-4xl mx-auto py-12 px-4">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">Welcome back!</h1>
          <p className="text-gray-500">{user.email}</p>
        </div>
        <form action={logout}>
          <Button variant="outline">Sign Out</Button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <Card className="p-6 bg-gradient-to-br from-red-50 to-white border-red-100 hover:shadow-md transition-shadow">
          <div className="flex items-start justify-between mb-4">
            <div className="bg-red-100 p-2 rounded-lg">
              <Mic className="h-6 w-6 text-red-600" />
            </div>
            <Badge variant="secondary">Hot</Badge>
          </div>
          <h2 className="text-xl font-bold mb-2">Read Aloud</h2>
          <p className="text-gray-500 mb-4 text-sm">Practice pronunciation and oral fluency.</p>
          <Link href="/practice">
            <Button className="w-full">Start Practice</Button>
          </Link>
        </Card>

        <Card className="p-6 border-slate-200 hover:shadow-md transition-shadow">
           <div className="flex items-start justify-between mb-4">
            <div className="bg-blue-100 p-2 rounded-lg">
              <BookOpen className="h-6 w-6 text-blue-600" />
            </div>
            <Badge variant="outline">Coming Soon</Badge>
          </div>
          <h2 className="text-xl font-bold mb-2">Describe Image</h2>
          <p className="text-gray-500 mb-4 text-sm">Analyze charts and graphs in 40 seconds.</p>
          <Button variant="secondary" className="w-full" disabled>Coming Soon</Button>
        </Card>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Clock className="h-4 w-4" />
          Recent Activity
        </h2>
        
        {submissions && submissions.length > 0 ? (
          submissions.map((sub) => (
            <Link href={`/dashboard/submission/${sub.id}`} key={sub.id} className="block group">
              <Card className="p-4 flex items-center justify-between group-hover:shadow-md transition-shadow">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                     {/* @ts-ignore */}
                    <Badge variant="outline" className="text-xs">{sub.questions?.type}</Badge>
                     {/* @ts-ignore */}
                    <span className="font-medium text-sm group-hover:text-blue-600 transition-colors">{sub.questions?.title || 'Unknown Question'}</span>
                  </div>
                  <p className="text-xs text-gray-400">
                    {new Date(sub.created_at).toLocaleString()}
                  </p>
                </div>
                
                {/* Visual indicator instead of inline player to encourage clicking through */}
                <div className="text-gray-400 text-sm flex items-center gap-1 group-hover:text-blue-600">
                  Review <span className="text-lg">→</span>
                </div>
              </Card>
            </Link>
          ))
        ) : (
          <Card className="p-8 text-center text-gray-500 bg-slate-50 border-dashed">
            No practice history yet. Start your first practice above!
          </Card>
        )}
      </div>
    </div>
  )
}

