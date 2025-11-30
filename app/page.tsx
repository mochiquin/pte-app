import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-4">
      <main className="flex w-full max-w-3xl flex-col items-center gap-8 text-center">
        
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
          PTE Practice App
        </h1>
        
        <p className="max-w-xl text-lg text-gray-600">
          Simple, effective PTE practice with real-time audio recording and review.
        </p>

        {/* Debug Info */}
        <div className="p-4 bg-white border rounded-lg text-xs font-mono text-left w-full max-w-sm">
          <p className="font-bold mb-2 border-b pb-1">System Check:</p>
          <div className="space-y-1">
            <p className="flex justify-between">
              <span>Supabase URL:</span> 
              <span>{process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Loaded' : '❌ Missing'}</span>
            </p>
            <p className="flex justify-between">
              <span>Anon Key:</span> 
              <span>{process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Loaded' : '❌ Missing'}</span>
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          <Link href="/login">
            <Button size="lg">Login to Start</Button>
          </Link>
          <Link href="/practice/ra/demo-1">
            <Button size="lg" variant="outline">Try Demo</Button>
          </Link>
        </div>

      </main>
    </div>
  );
}
