'use client'

import { loadStripe } from '@stripe/stripe-js'
import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)

export default function Pricing() {
  const handleSubscribe = async () => {
    const stripe = await stripePromise
    
    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    })
    
    const session = await response.json()
    
    const result = await stripe.redirectToCheckout({
      sessionId: session.id,
    })
    
    if (result.error) {
      console.error(result.error.message)
    }
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-4">
          Choose Your Plan
        </h1>
        <p className="text-slate-300 text-lg">
          Unlock unlimited tweet generation
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
        <Card className="backdrop-blur-sm bg-slate-800/50 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Free</CardTitle>
            <div className="text-3xl font-bold text-white">
              $0<span className="text-lg text-slate-400">/month</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-3">
              <li className="flex items-center text-slate-300">
                <Check className="h-5 w-5 text-green-400 mr-2" />
                5 tweet generations
              </li>
              <li className="flex items-center text-slate-300">
                <Check className="h-5 w-5 text-green-400 mr-2" />
                All tone options
              </li>
              <li className="flex items-center text-slate-300">
                <Check className="h-5 w-5 text-green-400 mr-2" />
                Code snippet support
              </li>
            </ul>
            <Button disabled className="w-full" variant="secondary">
              Current Plan
            </Button>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-sm bg-purple-600/20 border-purple-500">
          <CardHeader>
            <CardTitle className="text-white">Pro</CardTitle>
            <div className="text-3xl font-bold text-white">
              $5<span className="text-lg text-slate-400">/month</span>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="space-y-3">
              <li className="flex items-center text-slate-300">
                <Check className="h-5 w-5 text-green-400 mr-2" />
                Unlimited generations
              </li>
              <li className="flex items-center text-slate-300">
                <Check className="h-5 w-5 text-green-400 mr-2" />
                All tone options
              </li>
              <li className="flex items-center text-slate-300">
                <Check className="h-5 w-5 text-green-400 mr-2" />
                Code snippet support
              </li>
              <li className="flex items-center text-slate-300">
                <Check className="h-5 w-5 text-green-400 mr-2" />
                Priority support
              </li>
            </ul>
            <Button
              onClick={handleSubscribe}
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              Subscribe Now
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}