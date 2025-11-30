import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/server'
import { logout } from '@/app/actions/auth'
import { Mic } from 'lucide-react'

export async function Navbar() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-bold text-xl text-gray-800 hover:text-blue-600 transition-colors">
          <div className="bg-red-500 p-1.5 rounded-lg text-white">
            <Mic className="h-5 w-5" />
          </div>
          <span>PTE Pro</span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-6">
          {user ? (
            <>
              <Link href="/dashboard" className="text-sm font-medium text-gray-600 hover:text-black transition-colors">
                Dashboard
              </Link>
              <Link href="/practice" className="text-sm font-medium text-gray-600 hover:text-black transition-colors">
                Practice Library
              </Link>
              
              <div className="h-4 w-[1px] bg-gray-200 mx-2 hidden sm:block"></div>
              
              <div className="flex items-center gap-4">
                <span className="text-xs text-gray-400 hidden md:inline-block">
                  {user.email}
                </span>
                <form action={logout}>
                  <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50">
                    Sign Out
                  </Button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-4">
               <Link href="/login">
                 <Button variant="ghost" size="sm">Login</Button>
               </Link>
               <Link href="/login">
                 <Button size="sm">Get Started</Button>
               </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  )
}

