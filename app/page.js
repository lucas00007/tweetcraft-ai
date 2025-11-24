'use client'

import { useState, useEffect } from 'react'
import { Sparkles, Copy, Check, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'

export default function Home() {
  const [topic, setTopic] = useState('')
  const [tone, setTone] = useState('casual')
  const [includeCode, setIncludeCode] = useState(false)
  const [tweets, setTweets] = useState([])
  const [loading, setLoading] = useState(false)
  const [copiedIndex, setCopiedIndex] = useState(null)
  const [generationsLeft, setGenerationsLeft] = useState(5)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem('generationsLeft')
    if (stored !== null) {
      setGenerationsLeft(parseInt(stored))
    }
  }, [])

  const exampleTopics = [
    "Just learned React Server Components",
    "Why I switched from REST to GraphQL",
    "Docker vs Kubernetes for beginners",
    "My biggest coding mistake this week"
  ]

  const generateTweets = async () => {
    if (generationsLeft <= 0) {
      window.location.href = '/pricing'
      return
    }

    setLoading(true)
    try {
      console.log('Sending request:', { topic, tone, includeCode })
      
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, tone, includeCode })
      })
      
      console.log('Response status:', response.status)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      console.log('Response data:', data)
      
      if (data.error) {
        console.error('API Error:', data.error)
        alert('Error: ' + data.error)
        return
      }
      
      if (data.tweets) {
        const tweetArray = data.tweets.split(/\d+\.\s/).filter(tweet => tweet.trim())
        setTweets(tweetArray)
        
        const newCount = generationsLeft - 1
        setGenerationsLeft(newCount)
        localStorage.setItem('generationsLeft', newCount.toString())
      } else {
        console.error('No tweets in response')
        alert('No tweets generated')
      }
    } catch (error) {
      console.error('Error generating tweets:', error)
      alert('Failed to generate tweets: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  const copyTweet = async (tweet, index) => {
    await navigator.clipboard.writeText(tweet.trim())
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-4">
          Generate Perfect Developer Tweets
        </h1>
        <p className="text-slate-300 text-lg">
          AI-powered tweet generation for tech Twitter
        </p>
        <p className="text-purple-400 mt-2">
          {mounted ? `${generationsLeft} generations remaining` : 'Loading...'}
        </p>
      </div>

      <Card className="backdrop-blur-sm bg-slate-800/50 border-slate-700 mb-8">
        <CardContent className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              What do you want to tweet about?
            </label>
            <Textarea
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="bg-slate-700 border-slate-600 text-white placeholder-slate-400"
              rows={3}
              placeholder="Enter your topic..."
            />
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {exampleTopics.map((example, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => setTopic(example)}
                className="bg-purple-600/20 text-purple-300 border-purple-600/30 hover:bg-purple-600/30"
              >
                {example}
              </Button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Tone
              </label>
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white"
              >
                <option value="casual">Casual</option>
                <option value="professional">Professional</option>
                <option value="humorous">Humorous</option>
                <option value="educational">Educational</option>
              </select>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="includeCode"
                checked={includeCode}
                onChange={(e) => setIncludeCode(e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="includeCode" className="text-slate-300">
                Include code snippets
              </label>
            </div>
          </div>

          <Button
            onClick={generateTweets}
            disabled={!topic || loading}
            className="w-full bg-purple-600 hover:bg-purple-700"
          >
            {loading ? (
              <Loader2 className="animate-spin h-5 w-5 mr-2" />
            ) : (
              <Sparkles className="h-5 w-5 mr-2" />
            )}
            Generate Tweets
          </Button>
        </CardContent>
      </Card>

      {tweets.length > 0 && (
        <div className="grid gap-4">
          {tweets.map((tweet, index) => (
            <Card key={index} className="backdrop-blur-sm bg-slate-800/50 border-slate-700">
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="text-white mb-2">{tweet.trim()}</p>
                    <p className="text-slate-400 text-sm">
                      {tweet.trim().length} characters
                    </p>
                  </div>
                  <Button
                    onClick={() => copyTweet(tweet, index)}
                    size="sm"
                    className="ml-4 bg-purple-600 hover:bg-purple-700"
                  >
                    {copiedIndex === index ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </main>
  )
}