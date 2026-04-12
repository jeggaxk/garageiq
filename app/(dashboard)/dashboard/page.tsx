'use client'

import { useEffect, useState } from 'react'
import StatsCard from '@/components/dashboard/StatsCard'
import PageHeader from '@/components/dashboard/PageHeader'
import Badge from '@/components/ui/Badge'
import { formatDate, formatCurrency } from '@/lib/utils'
import { addYears, parseISO } from 'date-fns'
import {
  Users,
  MessageSquare,
  Car,
  TrendingUp,
  Bell,
  Mail,
  Phone,
} from 'lucide-react'
import OnboardingChecklist from '@/components/dashboard/OnboardingChecklist'

interface OnboardingData {
  hasCustomers: boolean
  hasAutomations: boolean
  hasTemplates: boolean
  hasProfile: boolean
}

interface DashboardData {
  stats: {
    totalCustomers: number
    messagesSentThisMonth: number
    motsDueNext30Days: number
    estimatedRevenueProtected: number
  }
  onboarding: OnboardingData
  upcomingMOTs: Array<{
    id: string
    name: string
    vehicle_reg: string
    vehicle_make: string
    last_mot_date: string
  }>
  recentMessages: Array<{
    id: string
    type: string
    channel: string
    status: string
    sent_at: string
    customer: { name: string; vehicle_reg: string } | null
  }>
}

const typeLabels: Record<string, string> = {
  mot_reminder: 'MOT Reminder',
  service_reminder: 'Service Reminder',
  review_request: 'Review Request',
  win_back: 'Win-back',
  manual: 'Manual',
}

const statusColors: Record<string, 'green' | 'amber' | 'red' | 'gray' | 'blue'> = {
  sent: 'blue',
  delivered: 'green',
  opened: 'green',
  clicked: 'green',
  failed: 'red',
  pending: 'gray',
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/dashboard')
      .then((r) => r.json())
      .then(setData)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="p-6 md:p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-48" />
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-28 bg-gray-200 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  const { stats, upcomingMOTs, recentMessages, onboarding } = data || {
    stats: { totalCustomers: 0, messagesSentThisMonth: 0, motsDueNext30Days: 0, estimatedRevenueProtected: 0 },
    onboarding: { hasCustomers: false, hasAutomations: false, hasTemplates: false, hasProfile: false },
    upcomingMOTs: [],
    recentMessages: [],
  }

  return (
    <div className="p-6 md:p-8 pt-20 md:pt-8">
      <PageHeader
        title="Dashboard"
        description="Your garage performance at a glance"
      />

      <OnboardingChecklist data={onboarding} />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatsCard
          title="Total customers"
          value={stats.totalCustomers.toLocaleString()}
          icon={Users}
          iconColor="text-blue-500"
        />
        <StatsCard
          title="Messages this month"
          value={stats.messagesSentThisMonth.toLocaleString()}
          icon={MessageSquare}
          iconColor="text-amber-500"
        />
        <StatsCard
          title="MOTs due (30 days)"
          value={stats.motsDueNext30Days.toLocaleString()}
          subtitle="Book before they go elsewhere"
          icon={Car}
          iconColor="text-orange-500"
        />
        <StatsCard
          title="Revenue protected"
          value={formatCurrency(stats.estimatedRevenueProtected)}
          subtitle="Estimated this month"
          icon={TrendingUp}
          iconColor="text-green-500"
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Upcoming MOTs */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
            <Car size={18} className="text-amber-500" />
            <h2 className="font-semibold text-navy-900">MOTs due in 30 days</h2>
            <span className="ml-auto text-xs text-gray-400">{upcomingMOTs.length} customers</span>
          </div>
          {upcomingMOTs.length === 0 ? (
            <div className="px-5 py-8 text-center">
              <Car size={32} className="mx-auto text-gray-200 mb-2" />
              <p className="text-gray-400 text-sm">No MOTs due in the next 30 days</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {upcomingMOTs.map((customer) => {
                const dueDate = addYears(parseISO(customer.last_mot_date), 1)
                const daysUntil = Math.ceil((dueDate.getTime() - Date.now()) / 86400000)
                return (
                  <div key={customer.id} className="px-5 py-3 flex items-center gap-3">
                    <div className="w-8 h-8 bg-amber-50 rounded-full flex items-center justify-center flex-shrink-0">
                      <Car size={14} className="text-amber-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-navy-900 truncate">{customer.name}</p>
                      <p className="text-xs text-gray-400">
                        {customer.vehicle_reg} · {customer.vehicle_make}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-xs font-medium text-navy-900">{formatDate(dueDate.toISOString())}</p>
                      <p className={`text-xs ${daysUntil <= 7 ? 'text-red-500' : 'text-gray-400'}`}>
                        {daysUntil}d left
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Recent activity */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
            <Bell size={18} className="text-amber-500" />
            <h2 className="font-semibold text-navy-900">Recent activity</h2>
          </div>
          {recentMessages.length === 0 ? (
            <div className="px-5 py-8 text-center">
              <Bell size={32} className="mx-auto text-gray-200 mb-2" />
              <p className="text-gray-400 text-sm">No messages sent yet</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {recentMessages.map((msg) => (
                <div key={msg.id} className="px-5 py-3 flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-50 rounded-full flex items-center justify-center flex-shrink-0">
                    {msg.channel === 'sms' ? (
                      <Phone size={13} className="text-gray-400" />
                    ) : (
                      <Mail size={13} className="text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-navy-900 truncate">
                      {msg.customer?.name || 'Unknown'}
                    </p>
                    <p className="text-xs text-gray-400">
                      {typeLabels[msg.type] || msg.type} · {msg.channel.toUpperCase()}
                    </p>
                  </div>
                  <div className="flex-shrink-0 flex flex-col items-end gap-1">
                    <Badge
                      label={msg.status}
                      color={statusColors[msg.status] || 'gray'}
                    />
                    <p className="text-xs text-gray-400">{formatDate(msg.sent_at)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
