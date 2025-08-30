import { GoogleSignInButton } from '@/components/GoogleSignInButton'

export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-black">
      <div className="max-w-md w-full space-y-8 p-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome to Habitual
          </h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Track your habits with a beautiful GitHub-style heatmap
          </p>
        </div>
        
        <div className="mt-8">
          <GoogleSignInButton />
        </div>
      </div>
    </div>
  )
}
