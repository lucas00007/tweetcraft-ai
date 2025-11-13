import './globals.css'
import { Code } from 'lucide-react'

export const metadata = {
  title: 'TweetCraft AI',
  description: 'AI-powered tweet generator for developers',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-br from-slate-900 to-purple-900">
        <nav className="border-b border-slate-800 backdrop-blur-sm bg-slate-900/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between h-16">
              <div className="flex items-center">
                <Code className="h-8 w-8 text-purple-400" />
                <span className="ml-2 text-xl font-bold text-white">TweetCraft AI</span>
              </div>
              <div className="flex items-center space-x-4">
                <a href="/" className="text-slate-300 hover:text-white">Home</a>
                <a href="/pricing" className="text-slate-300 hover:text-white">Pricing</a>
              </div>
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  )
}