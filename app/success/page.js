'use client'

import { useEffect } from 'react'
import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export default function Success() {
  useEffect(() => {
    localStorage.removeItem('generationsLeft')
  }, [])

  return (
    <main className="max-w-2xl mx-auto px-4 py-16 text-center">
      <Card className="backdrop-blur-sm bg-slate-800/50 border-slate-700">
        <CardContent className="p-8">
          <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="h-8 w-8 text-white" />
          </div>
          
          <h1 className="text-3xl font-bold text-white mb-4">
            Welcome to TweetCraft AI Pro!
          </h1>
          
          <p className="text-slate-300 text-lg mb-8">
            Your subscription is now active. You have unlimited tweet generations!
          </p>
          
          <Button asChild className="bg-purple-600 hover:bg-purple-700">
            <a href="/">Start Generating Tweets</a>
          </Button>
        </CardContent>
      </Card>
    </main>
  )
}