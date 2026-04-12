'use client'

import { useEffect, useState } from 'react'
import PageHeader from '@/components/dashboard/PageHeader'
import { formatDate } from '@/lib/utils'
import type { Automation, AutomationType } from '@/types'
import { Car, Wrench, Star, UserX, Zap } from 'lucide-react'

const automationConfig: Record<AutomationType, {
  label: string
  description: string
  trigger: string
  estimatedValue: string
  icon: React.ElementType
  color: string
}> = {
  mot_reminder: {
    label: 'MOT reminder',
    description: 'Automatically reminds customers their MOT is due in 4 weeks.',
    trigger: 'Sends 28 days before MOT due date via SMS & email',
    estimatedValue: '~£55 per booking',
    icon: Car,
    color: 'text-blue-500 bg-blue-50',
  },
  service_reminder: {
    label: 'Service reminder',
    description: 'Brings customers back for their annual service before they forget.',
    trigger: 'Sends 11 months after last service via SMS & email',
    estimatedValue: '~£150 per booking',
    icon: Wrench,
    color: 'text-orange-500 bg-orange-50',
  },
  review_request: {
    label: 'Google review request',
    description: 'Asks happy customers to leave a Google review while the visit is fresh.',
    trigger: 'Sends 24 hours after service date via SMS & email',
    estimatedValue: 'Boosts search ranking',
    icon: Star,
    color: 'text-amber-500 bg-amber-50',
  },
  win_back: {
    label: 'Win-back campaign',
    description: 'Re-engages lapsed customers who haven\'t visited in over a year.',
    trigger: 'Sends to customers with no visit in 12+ months (max once per 60 days)',
    estimatedValue: '~£200 per recovered customer',
    icon: UserX,
    color: 'text-purple-500 bg-purple-50',
  },
}

export default function AutomationsPage() {
  const [automations, setAutomations] = useState<Automation[]>([])
  const [loading, setLoading] = useState(true)
  const [toggling, setToggling] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/automations')
      .then((r) => r.json())
      .then((d) => setAutomations(d.automations || []))
      .finally(() => setLoading(false))
  }, [])

  async function toggleAutomation(type: AutomationType, enabled: boolean) {
    setToggling(type)
    const res = await fetch('/api/automations', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, enabled }),
    })
    const data = await res.json()
    if (data.automation) {
      setAutomations((prev) =>
        prev.map((a) => (a.type === type ? { ...a, enabled } : a))
      )
    }
    setToggling(null)
  }

  if (loading) {
    return (
      <div className="p-6 md:p-8 pt-20 md:pt-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-48" />
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-xl" />
          ))}
        </div>
      </div>
    )
  }

  const totalSent = automations.reduce((sum, a) => sum + (a.total_sent || 0), 0)

  return (
    <div className="p-6 md:p-8 pt-20 md:pt-8">
      <PageHeader
        title="Automations"
        description="Messages run daily at 9am — toggle each automation on or off"
      />

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm text-center">
          <p className="text-3xl font-bold text-navy-900">{automations.filter((a) => a.enabled).length}</p>
          <p className="text-sm text-gray-500 mt-0.5">Active automations</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm text-center">
          <p className="text-3xl font-bold text-navy-900">{totalSent.toLocaleString()}</p>
          <p className="text-sm text-gray-500 mt-0.5">Total messages sent</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm text-center">
          <p className="text-3xl font-bold text-green-600">£{(Math.floor(totalSent / 2) * 100).toLocaleString()}</p>
          <p className="text-sm text-gray-500 mt-0.5">Est. revenue recovered</p>
        </div>
      </div>

      {/* Prompt when nothing is enabled */}
      {automations.every((a) => !a.enabled) && (
        <div className="bg-cta-50 border border-cta-500/20 rounded-xl px-5 py-4 flex items-start gap-4 mb-6">
          <div className="w-9 h-9 bg-cta-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
            <Zap size={18} className="text-white" />
          </div>
          <div>
            <p className="font-semibold text-navy-900 text-sm">No automations are active yet</p>
            <p className="text-gray-500 text-sm mt-0.5">
              Toggle on the automations below to start sending reminders. They run every morning at 9am — you don't need to do anything else.
            </p>
          </div>
        </div>
      )}

      {/* Automation cards */}
      <div className="space-y-4">
        {(Object.keys(automationConfig) as AutomationType[]).map((type) => {
          const config = automationConfig[type]
          const automation = automations.find((a) => a.type === type)
          const isEnabled = automation?.enabled ?? false
          const isToggling = toggling === type
          const Icon = config.icon

          return (
            <div
              key={type}
              className={`bg-white rounded-xl border shadow-sm transition-all ${isEnabled ? 'border-gray-100' : 'border-gray-100 opacity-75'}`}
            >
              <div className="p-5">
                <div className="flex items-start gap-4">
                  <div className={`p-2.5 rounded-lg flex-shrink-0 ${config.color}`}>
                    <Icon size={20} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-semibold text-navy-900">{config.label}</h3>
                        <p className="text-sm text-gray-500 mt-0.5">{config.description}</p>
                      </div>
                      {/* Toggle switch */}
                      <button
                        onClick={() => automation && toggleAutomation(type, !isEnabled)}
                        disabled={isToggling || !automation}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full flex-shrink-0 transition-colors focus:outline-none ${
                          isEnabled ? 'bg-amber-500' : 'bg-gray-200'
                        } ${isToggling ? 'opacity-50' : ''}`}
                      >
                        <span
                          className={`inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
                            isEnabled ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-gray-400 mb-0.5">Trigger</p>
                        <p className="text-xs font-medium text-navy-900">{config.trigger}</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-gray-400 mb-0.5">Total sent</p>
                        <p className="text-sm font-bold text-navy-900">{(automation?.total_sent || 0).toLocaleString()}</p>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-3">
                        <p className="text-xs text-gray-400 mb-0.5">Est. value per send</p>
                        <p className="text-xs font-medium text-green-600">{config.estimatedValue}</p>
                      </div>
                    </div>

                    {automation?.last_run_at && (
                      <p className="text-xs text-gray-400 mt-3">
                        Last run: {formatDate(automation.last_run_at)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Info box */}
      <div className="mt-6 p-4 bg-navy-900 rounded-xl flex items-start gap-3">
        <Zap size={18} className="text-amber-500 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-white text-sm font-medium">Automations run daily at 9am</p>
          <p className="text-navy-300 text-xs mt-0.5">
            The system checks all customers every morning and sends messages based on their service history. You don't need to do anything.
          </p>
        </div>
      </div>
    </div>
  )
}
