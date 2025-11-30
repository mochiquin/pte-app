import { createClient } from '@/lib/supabase/server'

export default async function TestDBPage() {
  const supabase = await createClient()
  
  // Try to fetch questions. Even if empty, it tests the connection.
  const { data, error } = await supabase.from('questions').select('count', { count: 'exact', head: true })

  return (
    <div className="p-8 font-mono">
      <h1 className="text-xl font-bold mb-4">Supabase Connection Test</h1>
      
      <div className={`p-4 rounded border ${error ? 'bg-red-50 border-red-200 text-red-700' : 'bg-green-50 border-green-200 text-green-700'}`}>
        {error ? (
          <>
            <p className="font-bold">❌ Connection Failed</p>
            <p className="mt-2 text-sm">{error.message}</p>
            <pre className="mt-2 text-xs bg-white p-2 rounded border overflow-auto">
              {JSON.stringify(error, null, 2)}
            </pre>
          </>
        ) : (
          <>
            <p className="font-bold">✅ Connection Successful!</p>
            <p className="mt-2 text-sm">Successfully connected to your Supabase project.</p>
            <p className="text-sm">Found {JSON.stringify(data)} questions (using HEAD request).</p>
          </>
        )}
      </div>

      <div className="mt-8 text-sm text-gray-500">
        <p>Environment Variables Check:</p>
        <ul className="list-disc pl-5 mt-2">
          <li>URL: {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Present' : '❌ Missing'}</li>
          <li>Anon Key: {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Present' : '❌ Missing'}</li>
        </ul>
      </div>
    </div>
  )
}

