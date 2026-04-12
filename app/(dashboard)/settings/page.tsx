'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import PageHeader from '@/components/dashboard/PageHeader'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import type { Garage } from '@/types'
import { Building2, CreditCard, CheckCircle, ExternalLink } from 'lucide-react'

const planDetails = {
  trial: { label: 'Free trial', color: 'text-amber-600 bg-amber-50', price: 'Free for 60 days' },
  solo: { label: 'Solo', color: 'text-blue-600 bg-blue-50', price: '£79/month' },
  pro: { label: 'Pro', color: 'text-purple-600 bg-purple-50', price: '£149/month' },
  multi: { label: 'Multi-site', color: 'text-green-600 bg-green-50', price: '£249/month' },
  suspended: { label: 'Suspended', color: 'text-red-600 bg-red-50', price: 'Subscription ended' },
}

export default function SettingsPage() {
  const [garage, setGarage] = useState<Garage | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [upgradingPlan, setUpgradingPlan] = useState<string | null>(null)
  const [billing, setBilling] = useState<'monthly' | 'annual'>('monthly')
  const [openingPortal, setOpeningPortal] = useState(false)
  const [form, setForm] = useState({
    name: '', owner_name: '', phone: '', address: '', google_review_url: '',
  })
  const searchParams = useSearchParams()
  const justUpgraded = searchParams.get('upgraded') === 'true'

  useEffect(() => {
    fetch('/api/settings')
      .then((r) => r.json())
      .then((d) => {
        setGarage(d.garage)
        setForm({
          name: d.garage?.name || '',
          owner_name: d.garage?.owner_name || '',
          phone: d.garage?.phone || '',
          address: d.garage?.address || '',
          google_review_url: d.garage?.google_review_url || '',
        })
      })
      .finally(() => setLoading(false))
  }, [])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const res = await fetch('/api/settings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    const data = await res.json()
    if (data.garage) {
      setGarage(data.garage)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    }
    setSaving(false)
  }

  async function handleUpgrade(plan: string) {
    setUpgradingPlan(plan)
    const res = await fetch('/api/stripe/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plan, billing }),
    })
    const data = await res.json()
    if (data.url) {
      window.location.href = data.url
    } else {
      setUpgradingPlan(null)
    }
  }

  async function handleManageBilling() {
    setOpeningPortal(true)
    const res = await fetch('/api/stripe/portal', { method: 'POST' })
    const data = await res.json()
    if (data.url) {
      window.location.href = data.url
    } else {
      setOpeningPortal(false)
    }
  }

  const update = (field: string, value: string) => setForm((prev) => ({ ...prev, [field]: value }))

  const plan = garage?.plan as keyof typeof planDetails | undefined
  const planInfo = plan ? planDetails[plan] : null

  return (
    <div className="p-6 md:p-8 pt-20 md:pt-8 max-w-2xl">
      <PageHeader title="Settings" description="Manage your garage profile and billing" />

      {garage?.plan === 'suspended' && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
          <p className="text-red-800 text-sm font-semibold mb-1">Your subscription has ended</p>
          <p className="text-red-700 text-sm">Your automations have been paused. Resubscribe below to resume sending reminders to your customers.</p>
        </div>
      )}

      {justUpgraded && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3">
          <CheckCircle size={18} className="text-green-500 flex-shrink-0" />
          <p className="text-green-800 text-sm font-medium">You're now on a paid plan — all automations are active. Thank you!</p>
        </div>
      )}

      {/* Garage details */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm mb-6">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
          <Building2 size={18} className="text-amber-500" />
          <h2 className="font-semibold text-navy-900">Garage details</h2>
        </div>
        <form onSubmit={handleSave} className="p-5 space-y-4">
          {loading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => <div key={i} className="h-10 bg-gray-100 rounded-lg animate-pulse" />)}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Garage name" value={form.name} onChange={(e) => update('name', e.target.value)} required />
                <Input label="Owner name" value={form.owner_name} onChange={(e) => update('owner_name', e.target.value)} />
              </div>
              <Input label="Phone number" value={form.phone} onChange={(e) => update('phone', e.target.value)} placeholder="01234 567890" />
              <Input label="Address" value={form.address} onChange={(e) => update('address', e.target.value)} placeholder="123 High Street, Birmingham, B1 1AA" />
              <div>
                <Input
                  label="Google Review URL"
                  value={form.google_review_url}
                  onChange={(e) => update('google_review_url', e.target.value)}
                  placeholder="https://g.page/r/your-review-link"
                />
                <p className="text-xs text-gray-400 mt-1">Paste your Google Business review link — used in review request messages</p>
              </div>
              <div className="flex items-center justify-between pt-2">
                <Button type="submit" loading={saving}>
                  {saved ? <><CheckCircle size={15} /> Saved</> : 'Save changes'}
                </Button>
                {saved && <p className="text-green-600 text-sm">Changes saved</p>}
              </div>
            </>
          )}
        </form>
      </div>

      {/* Billing */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
          <CreditCard size={18} className="text-amber-500" />
          <h2 className="font-semibold text-navy-900">Billing & plan</h2>
        </div>
        <div className="p-5">
          {planInfo && (
            <div className="flex items-center justify-between mb-4 p-4 bg-gray-50 rounded-xl">
              <div>
                <p className="text-sm font-medium text-gray-700">Current plan</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-sm font-semibold px-2 py-0.5 rounded-full ${planInfo.color}`}>
                    {planInfo.label}
                  </span>
                  <span className="text-gray-500 text-sm">{planInfo.price}</span>
                </div>
                {garage?.trial_ends_at && garage.plan === 'trial' && (
                  <p className="text-xs text-amber-600 mt-1">
                    Trial ends {new Date(garage.trial_ends_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </p>
                )}
              </div>
              {garage?.plan !== 'trial' && garage?.stripe_customer_id && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleManageBilling}
                  loading={openingPortal}
                >
                  <ExternalLink size={13} /> Manage billing
                </Button>
              )}
            </div>
          )}

          {/* Billing toggle */}
          <div className="flex items-center justify-center gap-3 mb-4">
            <button
              onClick={() => setBilling('monthly')}
              className={`text-sm font-medium px-3 py-1.5 rounded-lg transition-colors ${billing === 'monthly' ? 'bg-navy-900 text-white' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBilling('annual')}
              className={`text-sm font-medium px-3 py-1.5 rounded-lg transition-colors ${billing === 'annual' ? 'bg-navy-900 text-white' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Annual <span className="text-green-600 text-xs font-semibold ml-1">2 months free</span>
            </button>
          </div>

          <div className="space-y-3">
            {[
              { name: 'Solo', monthly: '£79/mo', annual: '£790/yr', features: ['500 customers', 'SMS + email', 'All 4 automations'], plan: 'solo' },
              { name: 'Pro', monthly: '£149/mo', annual: '£1,490/yr', features: ['2,000 customers', 'Custom templates', 'Priority support'], plan: 'pro', popular: true },
              { name: 'Multi-site', monthly: '£249/mo', annual: '£2,490/yr', features: ['Unlimited customers', 'Multiple locations', 'Dedicated manager'], plan: 'multi' },
            ].map((p) => {
              const price = billing === 'annual' ? p.annual : p.monthly
              return (
              <div
                key={p.plan}
                className={`border rounded-xl p-4 flex items-center justify-between ${
                  garage?.plan === p.plan ? 'border-amber-300 bg-amber-50' : 'border-gray-200'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-navy-900">{p.name}</p>
                    {p.popular && (
                      <span className="text-xs bg-amber-500 text-white font-semibold px-2 py-0.5 rounded-full">Popular</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">{p.features.join(' · ')}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-navy-900">{price}</span>
                  {garage?.plan === p.plan ? (
                    <span className="text-xs text-amber-600 font-medium">Current plan</span>
                  ) : (
                    <Button
                      size="sm"
                      onClick={() => handleUpgrade(p.plan)}
                      loading={upgradingPlan === p.plan}
                      disabled={upgradingPlan !== null}
                    >
                      Upgrade
                    </Button>
                  )}
                </div>
              </div>
            )})}
          </div>
        </div>
      </div>
    </div>
  )
}
