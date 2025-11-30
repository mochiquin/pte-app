import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { Mic, Image as ImageIcon, BookOpen, Headphones } from 'lucide-react'

const QUESTION_TYPES = [
  {
    id: 'RA',
    title: 'Read Aloud',
    description: 'Look at the text below. In 40 seconds, you must read this text aloud as naturally and clearly as possible.',
    icon: Mic,
    color: 'text-red-600',
    bg: 'bg-red-50',
    count: 5 // We can make this dynamic later
  },
  {
    id: 'DI',
    title: 'Describe Image',
    description: 'Look at the image below. In 25 seconds, please speak into the microphone and describe in detail what the image is showing.',
    icon: ImageIcon,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    count: 2
  },
  {
    id: 'RS',
    title: 'Repeat Sentence',
    description: 'You will hear a sentence. Please repeat the sentence exactly as you hear it.',
    icon: Headphones,
    color: 'text-purple-600',
    bg: 'bg-purple-50',
    count: 0
  },
  // Add more types as needed
]

export default function PracticeHubPage() {
  return (
    <div className="container max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-2">Practice Library</h1>
      <p className="text-gray-500 mb-8">Select a question type to start practicing.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {QUESTION_TYPES.map((type) => (
          <Link href={`/practice/${type.id.toLowerCase()}`} key={type.id}>
            <Card className="p-6 hover:shadow-lg transition-all cursor-pointer h-full border-l-4 group" style={{ borderLeftColor: type.color.replace('text-', '') }}>
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl ${type.bg}`}>
                  <type.icon className={`h-8 w-8 ${type.color}`} />
                </div>
                <Badge variant="secondary" className="font-mono">
                  {type.id}
                </Badge>
              </div>
              
              <h2 className="text-xl font-bold mb-2 group-hover:text-gray-700">{type.title}</h2>
              <p className="text-sm text-gray-500 leading-relaxed">
                {type.description}
              </p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
