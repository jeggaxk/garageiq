'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://getcorviz.com'
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${appUrl}/reset-password`,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    setSent(true)
    setLoading(false)
  }

  if (sent) {
    return (
      <>
        <h1 className="text-2xl font-bold text-navy-900 mb-1">Check your email</h1>
        <p className="text-gray-500 text-sm mb-6">
          We've sent a password reset link to <span className="font-medium text-navy-900">{email}</span>. Click the link in the email to set a new password.
        </p>
        <p className="text-center text-sm text-gray-500 mt-6">
          <Link href="/login" className="text-amber-600 font-medium hover:underline">Back to sign in</Link>
        </p>
      </>
    )
  }

  return (
    <>
      <h1 className="text-2xl font-bold text-navy-900 mb-1">Reset your password</h1>
      <p className="text-gray-500 text-sm mb-6">Enter your email and we'll send you a reset link.</p>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
            placeholder="you@yourgarage.co.uk"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-cta-500 text-white font-semibold py-2.5 rounded-lg hover:bg-cta-400 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? 'Sending…' : 'Send reset link'}
        </button>
      </form>

      <p className="text-center text-sm text-gray-500 mt-6">
        <Link href="/login" className="text-amber-600 font-medium hover:underline">Back to sign in</Link>
      </p>
    </>
  )
}
