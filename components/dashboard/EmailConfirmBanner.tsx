'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Mail, X, CheckCircle } from 'lucide-react'

interface EmailConfirmBannerProps {
  email: string
}

export default function EmailConfirmBanner({ email }: EmailConfirmBannerProps) {
  const [resent, setResent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) return null

  async function handleResend() {
    setLoading(true)
    const supabase = createClient()
    await supabase.auth.resend({ type: 'signup', email })
    setResent(true)
    setLoading(false)
  }

  return (
    <div className="flex items-center justify-between gap-4 px-5 py-2.5 bg-blue-50 border-b border-blue-200 text-sm">
      <div className="flex items-center gap-2">
        {resent ? (
          <CheckCircle size={15} className="text-blue-500 flex-shrink-0" />
        ) : (
          <Mail size={15} className="text-blue-500 flex-shrink-0" />
        )}
        <span className="text-blue-800">
          {resent ? (
            <>
              <span className="font-semibold">Email sent.</span>
              {' '}Check your inbox at {email} and click the confirmation link.
            </>
          ) : (
            <>
              <span className="font-semibold">Please confirm your email address.</span>
              {' '}We sent a link to <span className="font-medium">{email}</span>
            </>
          )}
        </span>
      </div>
      <div className="flex items-center gap-3 flex-shrink-0">
        {!resent && (
          <button
            onClick={handleResend}
            disabled={loading}
            className="text-xs font-semibold text-blue-700 hover:text-blue-900 underline underline-offset-2 disabled:opacity-50"
          >
            {loading ? 'Sending…' : 'Resend email'}
          </button>
        )}
        <button
          onClick={() => setDismissed(true)}
          className="text-blue-400 hover:text-blue-600 transition-colors"
        >
          <X size={15} />
        </button>
      </div>
    </div>
  )
}
