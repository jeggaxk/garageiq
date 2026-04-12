'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Car,
  Wrench,
  Star,
  UserCheck,
  Check,
  ArrowRight,
  Upload,
  Phone,
  Mail,
  TrendingUp,
  Zap,
  Menu,
  X,
  ChevronDown,
  Shield,
} from 'lucide-react'

function EmailCaptureForm({ source, dark = true }: { source: string; dark?: boolean }) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    const res = await fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, source }),
    })
    setStatus(res.ok ? 'done' : 'error')
  }

  if (status === 'done') {
    return (
      <div className={`text-center py-4 ${dark ? 'text-white' : 'text-navy-900'}`}>
        <p className="text-xl font-bold mb-1">You're on the list!</p>
        <p className={dark ? 'text-navy-300' : 'text-gray-500'}>Check your inbox — the guide is on its way.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
      <input
        type="email"
        required
        placeholder="your@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="flex-1 px-4 py-3 rounded-lg text-navy-900 text-sm focus:outline-none focus:ring-2 focus:ring-cta-500 border border-transparent"
      />
      <button
        type="submit"
        disabled={status === 'loading'}
        className="bg-cta-500 hover:bg-cta-400 text-white font-semibold px-6 py-3 rounded-lg text-sm transition-colors disabled:opacity-60 whitespace-nowrap"
      >
        {status === 'loading' ? 'Sending…' : 'Send me the guide'}
      </button>
      {status === 'error' && (
        <p className="text-red-400 text-xs mt-1 w-full">Something went wrong — try again.</p>
      )}
    </form>
  )
}

const plans = [
  { key: 'solo',  label: 'Solo',       price: 79,  maxCustomers: 500,  sliderMax: 500  },
  { key: 'pro',   label: 'Pro',        price: 149, maxCustomers: 2000, sliderMax: 2000 },
  { key: 'multi', label: 'Multi-site', price: 249, maxCustomers: null, sliderMax: 5000 },
] as const

type PlanKey = typeof plans[number]['key']

function ROICalculator() {
  const [planKey, setPlanKey] = useState<PlanKey>('solo')
  const [customers, setCustomers] = useState(200)

  const plan = plans.find((p) => p.key === planKey)!

  const capped = Math.min(customers, plan.sliderMax)

  const lapsedCustomers = Math.round(capped * 0.40)
  const recovered = Math.round(lapsedCustomers * 0.35)
  const revenue = recovered * 165
  const annualCost = plan.price * 12
  const roi = Math.round((revenue / annualCost) * 100)

  function handlePlanChange(key: PlanKey) {
    setPlanKey(key)
    const newPlan = plans.find((p) => p.key === key)!
    if (customers > newPlan.sliderMax) setCustomers(newPlan.sliderMax)
  }

  return (
    <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
      <h3 className="text-2xl font-bold text-navy-900 mb-2">See your potential return</h3>
      <p className="text-gray-500 mb-5">Choose your plan and move the slider to match your customer base</p>

      {/* Plan selector */}
      <div className="flex gap-1 p-1 bg-gray-100 rounded-xl mb-6">
        {plans.map((p) => (
          <button
            key={p.key}
            onClick={() => handlePlanChange(p.key)}
            className={`flex-1 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              planKey === p.key ? 'bg-white text-navy-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {p.label}
            <span className="block text-xs font-normal mt-0.5 opacity-70">£{p.price}/mo</span>
          </button>
        ))}
      </div>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-700">Number of customers</label>
          <span className="text-2xl font-bold text-navy-900">{customers.toLocaleString()}</span>
        </div>
        <input
          type="range"
          min={50}
          max={plan.sliderMax}
          step={50}
          value={customers}
          onChange={(e) => setCustomers(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-full cursor-pointer accent-amber-500"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>50</span>
          <span>{plan.maxCustomers ? plan.maxCustomers.toLocaleString() : '5,000+'}</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center p-4 bg-red-50 rounded-xl">
          <p className="text-3xl font-bold text-red-600">{lapsedCustomers}</p>
          <p className="text-xs text-red-500 mt-1 font-medium">Lapsed per year</p>
          <p className="text-xs text-gray-400 mt-0.5">(40% average)</p>
        </div>
        <div className="text-center p-4 bg-cta-50 rounded-xl">
          <p className="text-3xl font-bold text-cta-500">{recovered}</p>
          <p className="text-xs text-cta-500 mt-1 font-medium">Recovered</p>
          <p className="text-xs text-gray-400 mt-0.5">with Corviz</p>
        </div>
        <div className="text-center p-4 bg-green-50 rounded-xl">
          <p className="text-xl font-bold text-green-600 whitespace-nowrap">£{revenue.toLocaleString()}</p>
          <p className="text-xs text-green-600 mt-1 font-medium">Revenue recovered</p>
          <p className="text-xs text-gray-400 mt-0.5">per year</p>
        </div>
      </div>

      <div className="p-4 bg-navy-900 rounded-xl flex items-center justify-between">
        <div>
          <p className="text-white font-semibold">{plan.label} plan — £{plan.price}/mo</p>
          <p className="text-navy-300 text-sm">
            Your ROI: <span className="text-cta-500 font-bold">{roi}% return</span> on your annual spend
          </p>
        </div>
        <Link
          href="/signup"
          className="flex-shrink-0 bg-cta-500 text-white font-semibold px-4 py-2 rounded-lg text-sm hover:bg-cta-400 transition-colors"
        >
          Start free →
        </Link>
      </div>
    </div>
  )
}

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('monthly')
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <div className="bg-white font-sans">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <div className="flex items-center">
            <img src="/corviz-logo-transparent.png" alt="Corviz" className="h-12 w-auto" />
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-gray-600 hover:text-navy-900 transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm text-gray-600 hover:text-navy-900 transition-colors">How it works</a>
            <a href="#pricing" className="text-sm text-gray-600 hover:text-navy-900 transition-colors">Pricing</a>
            <a href="#faq" className="text-sm text-gray-600 hover:text-navy-900 transition-colors">FAQ</a>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <Link href="/login" className="text-sm text-gray-600 hover:text-navy-900 font-medium transition-colors">Sign in</Link>
            <Link
              href="/signup"
              className="bg-cta-500 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-cta-400 transition-colors"
            >
              Start free trial
            </Link>
          </div>
          <button
            className="md:hidden p-2 text-gray-600"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 px-4 py-4 space-y-3 bg-white">
            <a href="#features" className="block text-sm text-gray-600" onClick={() => setMobileMenuOpen(false)}>Features</a>
            <a href="#pricing" className="block text-sm text-gray-600" onClick={() => setMobileMenuOpen(false)}>Pricing</a>
            <a href="#faq" className="block text-sm text-gray-600" onClick={() => setMobileMenuOpen(false)}>FAQ</a>
            <Link href="/login" className="block text-sm text-gray-600 font-medium">Sign in</Link>
            <Link
              href="/signup"
              className="block text-center bg-cta-500 text-white text-sm font-semibold px-4 py-2.5 rounded-lg"
              onClick={() => setMobileMenuOpen(false)}
            >
              Start free trial
            </Link>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section className="bg-navy-900 pt-20 pb-24 px-4 sm:px-6 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-cta-500/10 border border-cta-500/20 rounded-full mb-6">
                <span className="w-1.5 h-1.5 bg-cta-500 rounded-full" />
                <span className="text-cta-500 text-xs font-medium">60-day free trial · No card required</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                Stop losing customers to garages{' '}
                <span className="text-cta-500">down the road</span>
              </h1>
              <p className="text-navy-300 text-lg mb-4 leading-relaxed">
                Independent UK garages lose <span className="text-white font-semibold">40% of customers every year</span> — not because of bad service, but because no one followed up.
              </p>
              <p className="text-navy-300 text-lg mb-8 leading-relaxed">
                Corviz sends automated MOT reminders, service follow-ups, and Google review requests — so your customers book with <em>you</em>, not someone else.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center gap-2 bg-cta-500 text-white font-bold px-6 py-3.5 rounded-xl hover:bg-cta-400 transition-colors text-base"
                >
                  Start free 60-day trial <ArrowRight size={18} />
                </Link>
                <a
                  href="#features"
                  className="inline-flex items-center justify-center gap-2 border border-navy-700 text-white px-6 py-3.5 rounded-xl hover:bg-navy-800 transition-colors text-base"
                >
                  See how it works
                </a>
              </div>
              <p className="text-navy-400 text-sm mt-4">
                Trusted by 200+ independent UK garages · Setup in under 10 minutes
              </p>
            </div>

            {/* Dashboard preview */}
            <div className="hidden lg:block">
              <div className="bg-navy-800 rounded-2xl p-4 border border-navy-700 shadow-2xl">
                <div className="bg-white rounded-xl overflow-hidden">
                  {/* Mock dashboard */}
                  <div className="flex">
                    <div className="w-44 bg-navy-900 p-3 min-h-64">
                      <div className="flex items-center gap-2 mb-4 px-1">
                        <div className="w-5 h-5 bg-cta-500 rounded" />
                        <span className="text-white text-xs font-bold">Corviz</span>
                      </div>
                      {['Dashboard', 'Customers', 'Automations', 'Messages', 'Settings'].map((item, i) => (
                        <div key={item} className={`flex items-center gap-2 px-2 py-1.5 rounded text-xs mb-0.5 ${i === 0 ? 'bg-cta-500 text-white font-semibold' : 'text-navy-400'}`}>
                          <div className="w-2.5 h-2.5 rounded bg-current opacity-60" />
                          {item}
                        </div>
                      ))}
                    </div>
                    <div className="flex-1 p-3">
                      <p className="text-xs font-bold text-gray-800 mb-2">Dashboard</p>
                      <div className="grid grid-cols-2 gap-1.5 mb-3">
                        {[
                          { label: 'Customers', value: '847' },
                          { label: 'Messages sent', value: '124' },
                          { label: 'MOTs due', value: '31' },
                          { label: 'Est. revenue', value: '£4,200' },
                        ].map((stat) => (
                          <div key={stat.label} className="bg-gray-50 rounded-lg p-2">
                            <p className="text-xs text-gray-400">{stat.label}</p>
                            <p className="text-sm font-bold text-gray-800">{stat.value}</p>
                          </div>
                        ))}
                      </div>
                      <div className="bg-cta-50 rounded-lg p-2">
                        <p className="text-xs font-semibold text-cta-600 mb-1.5">MOTs due this month</p>
                        {[
                          { name: 'J. Smith', reg: 'AB12 CDE', days: '3d' },
                          { name: 'P. Jones', reg: 'XY23 FGH', days: '7d' },
                          { name: 'M. Taylor', reg: 'LM45 NOP', days: '12d' },
                        ].map((c) => (
                          <div key={c.reg} className="flex items-center justify-between text-xs text-gray-600 py-0.5">
                            <span>{c.name}</span>
                            <span className="font-mono bg-gray-100 px-1 rounded text-xs">{c.reg}</span>
                            <span className="text-cta-500 font-medium">{c.days}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social proof strip */}
      <section className="bg-gray-50 border-y border-gray-100 py-5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 sm:flex sm:flex-row items-center justify-center gap-6 sm:gap-12 text-center">
            {[
              { stat: '200+', label: 'UK garages' },
              { stat: '£2.4M', label: 'Revenue recovered' },
              { stat: '94%', label: 'Delivery rate' },
              { stat: '4.8★', label: 'Average rating' },
            ].map((item) => (
              <div key={item.label}>
                <p className="text-2xl font-bold text-navy-900">{item.stat}</p>
                <p className="text-sm text-gray-500">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Problem section */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-navy-900 mb-4">
              The problem every independent garage has
            </h2>
            <p className="text-gray-500 text-lg">
              Your customers don't leave because they're unhappy. They leave because they simply forgot, or another garage remembered to follow up first.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Car,
                stat: '40%',
                title: 'Customer lapse rate',
                description: 'The average independent garage loses 40% of its customers each year purely from lack of follow-up contact.',
                color: 'text-red-500 bg-red-50',
              },
              {
                icon: Mail,
                stat: '£0',
                title: 'Most garages spend on retention',
                description: 'While franchises invest heavily in CRM and reminder systems, most independents have nothing in place.',
                color: 'text-cta-500 bg-cta-50',
              },
              {
                icon: TrendingUp,
                stat: '5×',
                title: 'Cheaper to retain than acquire',
                description: 'Keeping an existing customer costs 5 times less than winning a new one — yet most garages focus only on new business.',
                color: 'text-green-500 bg-green-50',
              },
            ].map((item) => {
              const Icon = item.icon
              return (
                <div key={item.title} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm text-center md:text-left">
                  <div className={`w-12 h-12 rounded-xl ${item.color} flex items-center justify-center mb-4 mx-auto md:mx-0`}>
                    <Icon size={24} />
                  </div>
                  <p className="text-4xl font-bold text-navy-900 mb-1">{item.stat}</p>
                  <p className="font-semibold text-navy-900 mb-2">{item.title}</p>
                  <p className="text-gray-500 text-sm leading-relaxed">{item.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-4 sm:px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-navy-900 mb-4">
              Four automations that run while you work
            </h2>
            <p className="text-gray-500 text-lg">
              Set them up once. They run every morning at 9am, automatically.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                icon: Car,
                color: 'bg-blue-500',
                title: 'MOT reminders',
                description: 'Sent 4 weeks before MOT due date via SMS and email. Customers book with you before they even think about looking elsewhere.',
                example: '"Hi Sarah, your AB12 CDE MOT is due in 4 weeks. Book now at Smith\'s Auto — call us on 01234 567890 or visit our website to book."',
              },
              {
                icon: Wrench,
                color: 'bg-orange-500',
                title: 'Service follow-ups',
                description: '11 months after their last service, your customers get a friendly nudge. Most will book without thinking twice.',
                example: '"Hi Mark, it\'s been almost a year since your last service at Smith\'s Auto. Book your Ford Focus in now — call 01234 567890."',
              },
              {
                icon: Star,
                color: 'bg-cta-500',
                title: 'Google review requests',
                description: 'Sent 24 hours after every visit. More reviews mean higher ranking in local search — more customers finding you first.',
                example: '"Hi James, thanks for visiting Smith\'s Auto today. If you\'re happy, a quick Google review would mean a lot: [link]"',
              },
              {
                icon: UserCheck,
                color: 'bg-purple-500',
                title: 'Win-back campaigns',
                description: 'Customers who haven\'t visited in 12+ months get a personalised message with a free health check offer.',
                example: '"Hi Emma, we haven\'t seen your VW Golf in a while! Come in for a free 10-point vehicle health check — call us to arrange."',
              },
            ].map((feature) => {
              const Icon = feature.icon
              return (
                <div key={feature.title} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm text-center md:text-left">
                  <div className={`w-10 h-10 ${feature.color} rounded-xl flex items-center justify-center mb-4 mx-auto md:mx-0`}>
                    <Icon size={20} className="text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-navy-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-500 text-sm mb-4 leading-relaxed">{feature.description}</p>
                  <div className="bg-gray-50 rounded-xl p-3 border-l-4 border-amber-400">
                    <p className="text-xs text-gray-600 italic leading-relaxed">{feature.example}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-navy-900 mb-4">Up and running in 10 minutes</h2>
            <p className="text-gray-500 text-lg">No technical knowledge needed. No ongoing management required.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                title: 'Import your customers',
                description: 'Upload a CSV from your existing system, or add customers manually. We support all common formats.',
                icon: Upload,
              },
              {
                step: '2',
                title: 'Turn on automations',
                description: 'Toggle on the automations you want. Customise the message text with your garage name, phone, and Google review link.',
                icon: Zap,
              },
              {
                step: '3',
                title: 'Watch customers return',
                description: 'Corviz runs every morning. You\'ll see messages going out, customers booking, and revenue coming in.',
                icon: TrendingUp,
              },
            ].map((step, i) => {
              const Icon = step.icon
              return (
                <div key={step.step} className="text-center">
                  <div className="w-14 h-14 bg-cta-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-amber-200">
                    <span className="text-navy-900 font-bold text-xl">{step.step}</span>
                  </div>
                  <h3 className="text-lg font-bold text-navy-900 mb-2">{step.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{step.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ROI Calculator */}
      <section className="py-20 px-4 sm:px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <h2 className="text-3xl sm:text-4xl font-bold text-navy-900 mb-4">
                What's your garage actually losing?
              </h2>
              <p className="text-gray-500 text-lg mb-6 leading-relaxed">
                Most garages are sitting on hundreds of lapsed customers worth thousands of pounds. Corviz brings them back automatically.
              </p>
              <ul className="space-y-3 inline-block text-left">
                {[
                  'Average MOT booking value: £55',
                  'Average service booking value: £150',
                  'Average recovery rate with Corviz: 35%',
                  'Setup time: under 10 minutes',
                ].map((point) => (
                  <li key={point} className="flex items-center gap-3 text-gray-700">
                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Check size={12} className="text-green-600" />
                    </div>
                    {point}
                  </li>
                ))}
              </ul>
            </div>
            <ROICalculator />
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="py-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-navy-900 mb-4">Why not just do it yourself?</h2>
            <p className="text-gray-500 text-lg">Most garage owners know they should follow up with customers. Almost none do it consistently.</p>
          </div>
          <div className="overflow-x-auto rounded-2xl border border-gray-100 shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-6 py-4 font-semibold text-gray-500 w-1/3"></th>
                  <th className="text-center px-6 py-4 font-semibold text-gray-500 w-1/3">Doing it manually</th>
                  <th className="text-center px-6 py-4 font-semibold text-navy-900 w-1/3 bg-cta-50">Corviz</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { label: 'Time per week', manual: '2–3 hours', corviz: '0 minutes' },
                  { label: 'Cost of your time', manual: '~£2,400/year', corviz: 'Included' },
                  { label: 'Customers contacted', manual: 'The ones you remember', corviz: 'Every single one' },
                  { label: 'MOT reminders sent', manual: 'When you get round to it', corviz: '28 days before, automatically' },
                  { label: 'Customers lost per year', manual: '~160 (worth £24,000+)', corviz: 'None' },
                  { label: 'Google reviews requested', manual: 'Rarely', corviz: 'After every visit' },
                  { label: 'Your cost', manual: '£26,000+/year', corviz: 'From £79/month' },
                ].map((row, i) => (
                  <tr key={row.label} className={`border-b border-gray-50 ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                    <td className="px-6 py-4 font-medium text-gray-700">{row.label}</td>
                    <td className="px-6 py-4 text-center text-gray-400">{row.manual}</td>
                    <td className="px-6 py-4 text-center font-semibold text-navy-900 bg-cta-50/50">{row.corviz}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-8 text-center">
            <p className="text-gray-500 text-sm mb-4">The average garage loses <span className="font-semibold text-navy-900">£24,000+ a year</span> in lapsed customers. Corviz costs <span className="font-semibold text-navy-900">from £79/month</span> and handles it automatically.</p>
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 bg-cta-500 text-white font-bold px-8 py-4 rounded-xl hover:bg-cta-400 transition-colors text-lg"
            >
              Start free — no card required <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Email capture */}
      <section className="py-16 px-4 sm:px-6 bg-navy-900">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-cta-500 text-sm font-semibold uppercase tracking-wider mb-3">Free guide</p>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            Not ready to commit yet?
          </h2>
          <p className="text-navy-300 mb-8">
            Get our free guide — <span className="text-white font-medium">5 ways UK garages lose £20,000+ a year in lapsed customers</span> — and learn how to fix it before you sign up for anything.
          </p>
          <EmailCaptureForm source="website" />
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-navy-900 mb-4">Simple, transparent pricing</h2>
            <p className="text-gray-500 text-lg mb-6">Start free for 60 days. Cancel anytime.</p>
            {/* Billing toggle */}
            <div className="inline-flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
              <button
                onClick={() => setBillingPeriod('monthly')}
                className={`text-sm font-medium px-4 py-1.5 rounded-lg transition-colors ${billingPeriod === 'monthly' ? 'bg-white text-navy-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingPeriod('annual')}
                className={`text-sm font-medium px-4 py-1.5 rounded-lg transition-colors ${billingPeriod === 'annual' ? 'bg-white text-navy-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Annual <span className="text-green-600 text-xs font-semibold ml-1">2 months free</span>
              </button>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: 'Solo',
                monthly: { price: '£79', period: '/month' },
                annual: { price: '£790', period: '/year' },
                description: 'Perfect for single-bay independents',
                features: [
                  'Up to 500 customers',
                  'SMS + email reminders',
                  'All 4 automations',
                  'Google review requests',
                  'Message templates',
                  'Message analytics',
                  'Email support',
                ],
                cta: 'Start free trial',
                popular: false,
              },
              {
                name: 'Pro',
                monthly: { price: '£149', period: '/month' },
                annual: { price: '£1,490', period: '/year' },
                description: 'For established independent garages',
                features: [
                  'Up to 2,000 customers',
                  'SMS + email reminders',
                  'All 4 automations',
                  'Custom message templates',
                  'Priority support',
                  'Message analytics',
                ],
                cta: 'Start free trial',
                popular: true,
              },
              {
                name: 'Multi-site',
                monthly: { price: '£249', period: '/month' },
                annual: { price: '£2,490', period: '/year' },
                description: 'For groups and franchises',
                features: [
                  'Unlimited customers',
                  'Multiple locations',
                  'All Pro features',
                  'Dedicated account manager',
                  'Custom onboarding',
                  'Phone support',
                ],
                cta: 'Contact us',
                popular: false,
              },
            ].map((plan) => {
              const pricing = billingPeriod === 'annual' ? plan.annual : plan.monthly
              return (
              <div
                key={plan.name}
                className={`rounded-2xl p-6 border text-center md:text-left ${
                  plan.popular
                    ? 'bg-navy-900 border-navy-700 shadow-xl shadow-navy-900/20'
                    : 'bg-white border-gray-100 shadow-sm'
                }`}
              >
                {plan.popular && (
                  <span className="inline-block bg-cta-500 text-white text-xs font-bold px-3 py-1 rounded-full mb-4">
                    Most popular
                  </span>
                )}
                <h3 className={`text-xl font-bold mb-1 ${plan.popular ? 'text-white' : 'text-navy-900'}`}>
                  {plan.name}
                </h3>
                <p className={`text-sm mb-4 ${plan.popular ? 'text-navy-300' : 'text-gray-500'}`}>
                  {plan.description}
                </p>
                <div className="flex items-end gap-1 mb-1 justify-center md:justify-start">
                  <span className={`text-4xl font-bold ${plan.popular ? 'text-white' : 'text-navy-900'}`}>
                    {pricing.price}
                  </span>
                  <span className={`text-sm mb-1.5 ${plan.popular ? 'text-navy-300' : 'text-gray-400'}`}>
                    {pricing.period}
                  </span>
                </div>
                {billingPeriod === 'annual' && (
                  <p className={`text-xs mb-5 ${plan.popular ? 'text-green-400' : 'text-green-600'}`}>
                    Save 2 months vs monthly
                  </p>
                )}
                {billingPeriod === 'monthly' && <div className="mb-5" />}
                <ul className="space-y-2.5 mb-6 w-full">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2.5 justify-center md:justify-start">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${
                        plan.popular ? 'bg-cta-500/20' : 'bg-green-100'
                      }`}>
                        <Check size={10} className={plan.popular ? 'text-cta-500' : 'text-green-600'} />
                      </div>
                      <span className={`text-sm ${plan.popular ? 'text-navy-200' : 'text-gray-600'}`}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/signup"
                  className={`block text-center font-semibold px-4 py-2.5 rounded-xl transition-colors ${
                    plan.popular
                      ? 'bg-cta-500 text-white hover:bg-cta-400'
                      : 'bg-navy-900 text-white hover:bg-navy-800'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            )})}
          </div>
          <p className="text-center text-gray-400 text-sm mt-6">
            All plans include a 60-day free trial. No credit card required to start.
          </p>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 sm:px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-navy-900 text-center mb-12">What garage owners say</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                quote: "We got 18 MOT bookings in the first month just from the automated reminders. Paid for itself ten times over.",
                name: "Steve M.",
                garage: "SM Autocare, Birmingham",
                stars: 5,
              },
              {
                quote: "I used to lose track of customers all the time. Now Corviz handles it — I just show up and the bookings are there.",
                name: "Raj P.",
                garage: "Prestige Motors, Leicester",
                stars: 5,
              },
              {
                quote: "The Google review requests are brilliant. We've gone from 12 reviews to 94 in three months. Our search ranking has shot up.",
                name: "Karen T.",
                garage: "TT Auto Services, Manchester",
                stars: 5,
              },
            ].map((testimonial) => (
              <div key={testimonial.name} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm text-center md:text-left">
                <div className="flex gap-0.5 mb-3 justify-center md:justify-start">
                  {[...Array(testimonial.stars)].map((_, i) => (
                    <Star key={i} size={14} className="text-cta-500 fill-cta-500" />
                  ))}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed mb-4 italic">"{testimonial.quote}"</p>
                <div>
                  <p className="font-semibold text-navy-900 text-sm">{testimonial.name}</p>
                  <p className="text-gray-400 text-xs">{testimonial.garage}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Guarantee */}
      <section className="py-20 px-4 sm:px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="bg-navy-900 rounded-3xl p-10 md:p-14 text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #F5A01A 0%, transparent 60%), radial-gradient(circle at 80% 50%, #F5A01A 0%, transparent 60%)' }} />
            <div className="relative">
              <div className="w-16 h-16 bg-cta-500/10 border border-cta-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Shield size={32} className="text-cta-500" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                The Corviz Guarantee
              </h2>
              <p className="text-navy-300 text-lg mb-6 max-w-2xl mx-auto leading-relaxed">
                Try Corviz free for 60 days — no credit card required. If you don't win back at least one lapsed customer in that time, you never pay a penny. Not a reduced rate. Nothing.
              </p>
              <div className="grid sm:grid-cols-3 gap-4 mb-8 text-left">
                {[
                  { title: '60-day free trial', body: 'Solo plan features, up to 500 customers. No card needed to start.' },
                  { title: 'Zero setup risk', body: 'Up and running in under 10 minutes. We\'ll help if you get stuck.' },
                  { title: 'Cancel anytime', body: 'No contracts, no lock-in. Cancel in two clicks if it\'s not for you.' },
                ].map((item) => (
                  <div key={item.title} className="bg-white/5 border border-white/10 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Check size={14} className="text-cta-500" />
                      <p className="text-white font-semibold text-sm">{item.title}</p>
                    </div>
                    <p className="text-navy-400 text-sm leading-relaxed">{item.body}</p>
                  </div>
                ))}
              </div>
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 bg-cta-500 text-white font-bold px-8 py-4 rounded-xl hover:bg-cta-400 transition-colors text-lg"
              >
                Claim your free trial <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 px-4 sm:px-6 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-navy-900 mb-4">Common questions</h2>
            <p className="text-gray-500 text-lg">Everything you need to know before getting started.</p>
          </div>
          <div className="space-y-3">
            {[
              {
                q: 'Do my customers need to opt in to receive messages?',
                a: 'Corviz sends messages to your existing customers who have an established relationship with your garage. Under UK PECR, you can contact existing customers about similar services without a new opt-in. You are responsible for ensuring your customer list is compliant — we provide guidance on this during onboarding.',
              },
              {
                q: 'What if I don\'t have a customer list?',
                a: 'Most garage management systems (Garage Hive, TechMan, Motasoft etc.) let you export a customer list as a CSV. If you\'re not sure how, contact us and we\'ll walk you through it. If your records are on paper, you can add customers manually one by one.',
              },
              {
                q: 'Will customers know the message is automated?',
                a: 'Messages are sent from your garage name and use the customer\'s first name — they feel personal, not robotic. Most customers simply see a helpful reminder from a garage they trust.',
              },
              {
                q: 'What happens when my free trial ends?',
                a: 'Your automations will pause until you choose a plan. The trial runs on Solo plan limits — up to 500 customers and all four automations. We\'ll remind you before the trial ends so you\'re never caught off guard. There\'s no pressure and no automatic charge.',
              },
              {
                q: 'Can I customise the messages?',
                a: 'Custom message templates are available on the Pro and Multi-site plans. On the Solo plan and during your trial, you use our professionally written default templates which include your garage name, phone number, and the customer\'s details automatically.',
              },
              {
                q: 'Does this work alongside my existing garage software?',
                a: 'Yes — Corviz works independently of your garage management system. You import your customer data via CSV and Corviz handles the rest. There\'s no integration required.',
              },
              {
                q: 'How does Corviz know when an MOT is due?',
                a: 'We calculate the MOT due date based on the last MOT date you provide when importing customers. MOTs renew annually, so if a customer\'s last MOT was 14 May 2025, we\'ll send a reminder around 14 April 2026.',
              },
              {
                q: 'Is my customer data safe?',
                a: 'Your data is stored securely in the EU on Supabase infrastructure. We never share or sell your customer data to third parties. We act as a data processor — you remain the data controller. Full details are in our Privacy Policy.',
              },
            ].map((faq, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-5 text-left"
                >
                  <span className="font-semibold text-navy-900 pr-4">{faq.q}</span>
                  <ChevronDown
                    size={18}
                    className={`text-gray-400 flex-shrink-0 transition-transform duration-200 ${openFaq === i ? 'rotate-180' : ''}`}
                  />
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5">
                    <p className="text-gray-600 text-sm leading-relaxed">{faq.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 bg-navy-900">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Start recovering customers today
          </h2>
          <p className="text-navy-300 text-lg mb-8">
            Join 200+ independent UK garages using Corviz to retain more customers and grow revenue — automatically.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 bg-cta-500 text-white font-bold px-8 py-4 rounded-xl hover:bg-cta-400 transition-colors text-lg"
          >
            Start your free 60-day trial <ArrowRight size={20} />
          </Link>
          <p className="text-navy-400 text-sm mt-4">No credit card required · Setup in 10 minutes · Cancel anytime</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-navy-900 border-t border-navy-800 py-8 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center">
            <img src="/corviz-logo-white.png" alt="Corviz" className="h-10 w-auto" />
          </div>
          <p className="text-navy-400 text-xs">© 2026 Corviz. Built for independent UK garages.</p>
          <div className="flex gap-6">
            <a href="/privacy" className="text-navy-400 text-xs hover:text-white transition-colors">Privacy</a>
            <a href="/terms" className="text-navy-400 text-xs hover:text-white transition-colors">Terms</a>
            <a href="mailto:hello@corviz.co.uk" className="text-navy-400 text-xs hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
