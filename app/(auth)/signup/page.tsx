'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function SignupPage() {
  const [formData, setFormData] = useState({
    garageName: '',
    ownerName: '',
    email: '',
    phone: '',
    password: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: formData.email,
        password: formData.password,
        garageName: formData.garageName,
        ownerName: formData.ownerName,
        phone: formData.phone,
      }),
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data.error || 'Signup failed')
      setLoading(false)
      return
    }

    // Sign in to get a session
    const supabase = createClient()
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password,
    })

    if (signInError) {
      setError('Account created — please sign in.')
      setLoading(false)
      router.push('/login')
      return
    }

    // Redirect to Stripe checkout for the £99 pilot payment
    const checkoutRes = await fetch('/api/stripe/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan: 'pilot' }),
    })
    const checkoutData = await checkoutRes.json()

    if (checkoutData.url) {
      window.location.href = checkoutData.url
    } else {
      // Fallback: go to dashboard (pilot will be pending payment)
      router.push('/dashboard')
    }
  }

  const update = (field: string, value: string) =>
    setFormData((prev) => ({ ...prev, [field]: value }))

  return (
    <>
      <h1 className="text-2xl font-bold text-navy-900 mb-1">Start your 90-day pilot</h1>
      <p className="text-gray-500 text-sm mb-6">£99 · Full refund guarantee if it doesn't pay for itself</p>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSignup} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Garage name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.garageName}
            onChange={(e) => update('garageName', e.target.value)}
            required
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
            placeholder="Smith's Auto Services"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Your name <span className="text-gray-400 font-normal text-xs">(optional)</span>
          </label>
          <input
            type="text"
            value={formData.ownerName}
            onChange={(e) => update('ownerName', e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
            placeholder="John Smith"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email address <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => update('email', e.target.value)}
            required
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
            placeholder="john@smithsauto.co.uk"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Garage phone number <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => update('phone', e.target.value)}
            required
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
            placeholder="01234 567890"
          />
          <p className="text-xs text-gray-400 mt-1">Used in your automated messages so customers can call to book</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password <span className="text-red-500">*</span>
          </label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => update('password', e.target.value)}
            required
            minLength={8}
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
            placeholder="At least 8 characters"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-cta-500 text-white font-semibold py-2.5 rounded-lg hover:bg-cta-400 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? 'Setting up…' : 'Continue to payment — £99'}
        </button>
      </form>

      <p className="text-center text-xs text-gray-400 mt-4">
        By signing up you agree to our Terms of Service and Privacy Policy.
      </p>

      <p className="text-center text-sm text-gray-500 mt-3">
        Already have an account?{' '}
        <Link href="/login" className="text-amber-600 font-medium hover:underline">
          Sign in
        </Link>
      </p>
    </>
  )
}
