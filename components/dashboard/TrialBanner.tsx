'use client'

import Link from 'next/link'
import { differenceInDays, parseISO } from 'date-fns'
import { AlertCircle, Zap } from 'lucide-react'

interface TrialBannerProps {
  trialEndsAt: string
}

export default function TrialBanner({ trialEndsAt }: TrialBannerProps) {
  const daysLeft = differenceInDays(parseISO(trialEndsAt), new Date())

  if (daysLeft < 0) return null

  const isUrgent = daysLeft <= 7

  return (
    <div
      className={`flex items-center justify-between gap-4 px-5 py-2.5 text-sm ${
        isUrgent
          ? 'bg-red-50 border-b border-red-200'
          : 'bg-amber-50 border-b border-amber-200'
      }`}
    >
      <div className="flex items-center gap-2">
        {isUrgent ? (
          <AlertCircle size={15} className="text-red-500 flex-shrink-0" />
        ) : (
          <Zap size={15} className="text-amber-500 flex-shrink-0" />
        )}
        <span className={isUrgent ? 'text-red-700' : 'text-amber-800'}>
          {isUrgent ? (
            <>
              <span className="font-semibold">Trial ends in {daysLeft} day{daysLeft !== 1 ? 's' : ''}</span>
              {' '}— upgrade now to keep your automations running.
            </>
          ) : (
            <>
              <span className="font-semibold">{daysLeft} days left on your free trial.</span>
              {' '}Your automations are live and working for you.
            </>
          )}
        </span>
      </div>
      <Link
        href="/settings"
        className={`flex-shrink-0 text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${
          isUrgent
            ? 'bg-red-600 text-white hover:bg-red-700'
            : 'bg-amber-500 text-navy-900 hover:bg-amber-400'
        }`}
      >
        Upgrade now
      </Link>
    </div>
  )
}
