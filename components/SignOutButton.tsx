'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface SignOutButtonProps {
  userEmail?: string
  userAvatar?: string
}

export const SignOutButton = ({ userEmail, userAvatar }: SignOutButtonProps) => {
  const router = useRouter()

  const handleSignOut = async () => {
    const supabase = createClient()
    const { error } = await supabase.auth.signOut()
    
    if (!error) {
      router.push('/login')
      router.refresh()
    }
  }

  return (
    <div className="flex items-center gap-3">
      {userAvatar && (
        <img
          src={userAvatar}
          alt="Profile"
          className="w-8 h-8 rounded-full"
        />
      )}
      <div className="flex-1 min-w-0">
        {userEmail && (
          <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
            {userEmail}
          </p>
        )}
      </div>
      <button
        type="button"
        onClick={handleSignOut}
        className="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
        aria-label="Sign out"
        tabIndex={0}
      >
        Sign out
      </button>
    </div>
  )
}
