'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { CheckCircle2, Circle, ChevronRight, X } from 'lucide-react'

interface OnboardingData {
  hasCustomers: boolean
  hasAutomations: boolean
  hasTemplates: boolean
  hasProfile: boolean
}

const DISMISS_KEY = 'onboarding_dismissed'

const steps = [
  {
    key: 'hasCustomers' as keyof OnboardingData,
    title: 'Add your customers',
    description: 'Upload a CSV or add customers manually to get started.',
    href: '/customers',
    cta: 'Go to Customers',
  },
  {
    key: 'hasAutomations' as keyof OnboardingData,
    title: 'Turn on your automations',
    description: 'Enable MOT reminders, service follow-ups and win-back messages.',
    href: '/automations',
    cta: 'Go to Automations',
  },
  {
    key: 'hasTemplates' as keyof OnboardingData,
    title: 'Customise your message templates',
    description: 'Make the messages sound like they come from your garage.',
    href: '/messages',
    cta: 'Go to Messages',
  },
  {
    key: 'hasProfile' as keyof OnboardingData,
    title: 'Complete your garage profile',
    description: 'Add your phone number so customers can call you back.',
    href: '/settings',
    cta: 'Go to Settings',
  },
]

export default function OnboardingChecklist({ data }: { data: OnboardingData }) {
  const [dismissed, setDismissed] = useState(true) // start hidden to avoid flash

  useEffect(() => {
    setDismissed(localStorage.getItem(DISMISS_KEY) === 'true')
  }, [])

  const completed = steps.filter((s) => data[s.key]).length
  const allDone = completed === steps.length

  function dismiss() {
    localStorage.setItem(DISMISS_KEY, 'true')
    setDismissed(true)
  }

  if (dismissed || allDone) return null

  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-sm mb-6">
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h2 className="font-semibold text-navy-900">Get started with Corviz</h2>
          <p className="text-xs text-gray-500 mt-0.5">{completed} of {steps.length} steps complete</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex gap-1">
            {steps.map((s) => (
              <div
                key={s.key}
                className={`h-1.5 w-6 rounded-full transition-colors ${data[s.key] ? 'bg-cta-500' : 'bg-gray-200'}`}
              />
            ))}
          </div>
          <button onClick={dismiss} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={16} />
          </button>
        </div>
      </div>

      <div className="divide-y divide-gray-50">
        {steps.map((step) => {
          const done = data[step.key]
          return (
            <div key={step.key} className={`px-5 py-3.5 flex items-center gap-4 ${done ? 'opacity-50' : ''}`}>
              {done
                ? <CheckCircle2 size={20} className="text-cta-500 flex-shrink-0" />
                : <Circle size={20} className="text-gray-300 flex-shrink-0" />
              }
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${done ? 'line-through text-gray-400' : 'text-navy-900'}`}>
                  {step.title}
                </p>
                {!done && <p className="text-xs text-gray-500 mt-0.5">{step.description}</p>}
              </div>
              {!done && (
                <Link
                  href={step.href}
                  className="flex items-center gap-1 text-xs font-medium text-cta-500 hover:text-cta-600 flex-shrink-0 transition-colors"
                >
                  {step.cta} <ChevronRight size={14} />
                </Link>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
