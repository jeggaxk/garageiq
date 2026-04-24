'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Car,
  Wrench,
  Star,
  Check,
  ArrowRight,
  Upload,
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
        <p className={dark ? 'text-white/75' : 'text-gray-500'}>Check your inbox — the guide is on its way.</p>
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
        <p className="text-red-600 text-xs mt-1 w-full">Something went wrong — try again.</p>
      )}
    </form>
  )
}

function ROICalculator() {
  const [missing, setMissing] = useState(10)

  const annualMissing = missing * 12
  const revenue = annualMissing * 85  // £85/car: £55 MOT + £30 average fix-on
  const annualCost = 39 * 12
  const roi = Math.round((revenue / annualCost) * 100)

  return (
    <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
      <h3 className="text-2xl font-bold text-navy-900 mb-2">Run the numbers on your garage</h3>
      <p className="text-gray-500 mb-5">How many customers go missing each month without a reminder?</p>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-700" htmlFor="missing-slider">Customers missing per month</label>
          <span className="text-2xl font-bold text-navy-900">{missing}</span>
        </div>
        <input
          id="missing-slider"
          type="range"
          min={5}
          max={20}
          step={1}
          value={missing}
          onChange={(e) => setMissing(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-full cursor-pointer accent-amber-500"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>5</span>
          <span>20</span>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center p-4 bg-red-50 rounded-xl">
          <p className="text-3xl font-bold text-red-600">{annualMissing}</p>
          <p className="text-xs text-red-500 mt-1 font-medium">Missing per year</p>
          <p className="text-xs text-gray-500 mt-0.5">({missing}/month × 12)</p>
        </div>
        <div className="text-center p-4 bg-green-50 rounded-xl">
          <p className="text-2xl font-bold text-green-600">£{revenue.toLocaleString()}</p>
          <p className="text-xs text-green-600 mt-1 font-medium">Potential value</p>
          <p className="text-xs text-gray-500 mt-0.5">at £85/car recovered</p>
        </div>
      </div>

      <div className="p-4 bg-navy-900 rounded-xl flex items-center justify-between">
        <div>
          <p className="text-white font-semibold">Founding member — £39/mo</p>
          <p className="text-white/75 text-sm">
            vs. <span className="text-cta-500 font-bold">£{revenue.toLocaleString()}</span> in recoverable bookings
          </p>
        </div>
        <Link
          href="/signup"
          className="flex-shrink-0 bg-cta-500 text-navy-900 font-semibold px-4 py-2 rounded-lg text-sm hover:bg-cta-400 transition-colors"
        >
          Start pilot →
        </Link>
      </div>
    </div>
  )
}

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [founderCount, setFounderCount] = useState<number | null>(null)

  useEffect(() => {
    fetch('/api/founding-member-count')
      .then((r) => r.json())
      .then((d) => setFounderCount(d.count ?? 0))
      .catch(() => setFounderCount(0))
  }, [])

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
              className="bg-cta-500 text-navy-900 text-sm font-semibold px-4 py-2 rounded-lg hover:bg-cta-400 transition-colors"
            >
              Start your 90-day pilot
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
          <div className="md:hidden border-t border-gray-100 px-4 py-4 bg-white">
            <div className="flex gap-2 mb-4">
              <Link
                href="/signup"
                className="flex-1 text-center bg-cta-500 text-navy-900 text-sm font-semibold px-4 py-2.5 rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                Start your 90-day pilot
              </Link>
              <Link
                href="/login"
                className="flex-1 text-center border border-gray-200 text-navy-900 text-sm font-semibold px-4 py-2.5 rounded-lg"
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign in
              </Link>
            </div>
            <div className="space-y-1 border-t border-gray-100 pt-3">
              <a href="#features" className="block text-sm text-gray-600 py-2" onClick={() => setMobileMenuOpen(false)}>Features</a>
              <a href="#how-it-works" className="block text-sm text-gray-600 py-2" onClick={() => setMobileMenuOpen(false)}>How it works</a>
              <a href="#pricing" className="block text-sm text-gray-600 py-2" onClick={() => setMobileMenuOpen(false)}>Pricing</a>
              <a href="#faq" className="block text-sm text-gray-600 py-2" onClick={() => setMobileMenuOpen(false)}>FAQ</a>
            </div>
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
                <span className="text-cta-500 text-xs font-medium">90-day pilot · £99 · Full refund guarantee</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                The reminder tool your garage system{' '}
                <span className="text-cta-500">never got right.</span>
              </h1>
              <p className="text-white/75 text-lg mb-4 leading-relaxed">
                The reminder function in your garage management system probably tried. It fired blind — no DVLA check, no number validation. You got angry replies and turned it off.
              </p>
              <p className="text-white/75 text-lg mb-8 leading-relaxed">
                Corviz cross-checks every reminder against the DVLA before it sends. First reminders firing within 72 hours of signup.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center gap-2 bg-cta-500 text-navy-900 font-bold px-6 py-3.5 rounded-xl hover:bg-cta-400 transition-colors text-base"
                >
                  Start your 90-day pilot — £99 <ArrowRight size={18} />
                </Link>
                <Link
                  href="/guide-optin"
                  className="inline-flex items-center justify-center gap-2 border border-navy-700 text-white px-6 py-3.5 rounded-xl hover:bg-navy-800 transition-colors text-base"
                >
                  Or read the £20,000 guide first
                </Link>
              </div>
              <p className="text-white/60 text-sm mt-4">
                Concierge setup from the founder · Full refund if it doesn't pay for itself
              </p>
            </div>

            {/* Dashboard preview */}
            <div className="hidden lg:block">
              <div className="bg-navy-800 rounded-2xl p-4 border border-navy-700 shadow-2xl">
                <div className="bg-white rounded-xl overflow-hidden">
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

      {/* Problem */}
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
              { icon: Car, stat: '8–15', title: 'Customers missing every month', description: 'Pull up last April\'s bookings against this April\'s. 8 to 15 names are usually missing — not angry, just never followed up.', color: 'text-red-500 bg-red-50' },
              { icon: TrendingUp, stat: '£8–15k', title: 'Walking out the door each year', description: 'At £85 per recovered car, those missing customers add up to £8,000 to £15,000 in revenue that left quietly without a single reminder.', color: 'text-cta-500 bg-cta-50' },
              { icon: Zap, stat: '72hrs', title: 'Until your first reminders fire', description: 'Upload your CSV, Jack cross-checks it against the DVLA, you approve the first batch. First reminders out within 72 hours of signup.', color: 'text-green-500 bg-green-50' },
            ].map((item) => {
              const Icon = item.icon
              return (
                <div key={item.title} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm text-center md:text-left">
                  <div className={`w-12 h-12 rounded-xl ${item.color} flex items-center justify-center mb-4 mx-auto md:mx-0`}><Icon size={24} /></div>
                  <p className="text-4xl font-bold text-navy-900 mb-1">{item.stat}</p>
                  <p className="font-semibold text-navy-900 mb-2">{item.title}</p>
                  <p className="text-gray-500 text-sm leading-relaxed">{item.description}</p>
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
              <h2 className="text-3xl sm:text-4xl font-bold text-navy-900 mb-4">What's your garage actually losing?</h2>
              <p className="text-gray-500 text-lg mb-6 leading-relaxed">Most garages are sitting on hundreds of lapsed customers worth thousands of pounds. Corviz brings them back automatically.</p>
              <ul className="space-y-3 inline-block text-left">
                {[
                  '£85 per recovered car: £55 MOT + £30 average advisory fix-on',
                  'Typical garages are missing 8 to 15 customers per month',
                  'First reminders fire within 72 hours of signup',
                  'Concierge setup from the founder',
                ].map((point) => (
                  <li key={point} className="flex items-center gap-3 text-gray-700">
                    <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0"><Check size={12} className="text-green-600" /></div>
                    {point}
                  </li>
                ))}
              </ul>
            </div>
            <ROICalculator />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-navy-900 mb-4">How it works</h2>
            <p className="text-gray-500 text-lg">Concierge onboarding. You upload your customer list. I handle the rest.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '1', title: 'Upload your customer list', description: 'Export a CSV from your existing system, or I help you if it\'s on paper. Takes 5 minutes.', icon: Upload },
              { step: '2', title: 'Jack reviews your list personally', description: 'Within 24 hours I send you a tailored walkthrough video. I cross-check your MOT dates against DVLA, flag any issues, and show you the first batch of reminders ready to go.', icon: Zap },
              { step: '3', title: 'Approve and launch', description: 'You approve the first batch with one click. Reminders start sending automatically. I stay on WhatsApp throughout your pilot.', icon: TrendingUp },
            ].map((step) => {
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

      {/* Features */}
      <section id="features" className="py-20 px-4 sm:px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-navy-900 mb-4">Three automations that run while you work</h2>
            <p className="text-gray-500 text-lg">Set them up once. They run every morning at 9am, automatically.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { icon: Car, color: 'bg-blue-500', title: 'MOT reminders', description: 'Sent 4 weeks before MOT due date via SMS and email. Customers book with you before they even think about looking elsewhere.', example: '"Hi Sarah, your AB12 CDE MOT is due in 4 weeks. Book now at Smith\'s Auto — call us on 01234 567890 or visit our website to book."' },
              { icon: Wrench, color: 'bg-orange-500', title: 'Service follow-ups', description: '11 months after their last service, your customers get a friendly nudge. Most will book without thinking twice.', example: '"Hi Mark, it\'s been almost a year since your last service at Smith\'s Auto. Book your Ford Focus in now — call 01234 567890."' },
              { icon: Star, color: 'bg-cta-500', title: 'Google review requests', description: 'Sent 24 hours after every visit. More reviews mean higher ranking in local search — more customers finding you first.', example: '"Hi James, thanks for visiting Smith\'s Auto today. If you\'re happy, a quick Google review would mean a lot: [link]"' },
            ].map((feature, index, arr) => {
              const Icon = feature.icon
              const isLastOdd = index === arr.length - 1 && arr.length % 2 !== 0
              return (
                <div key={feature.title} className={`bg-white rounded-2xl p-6 border border-gray-100 shadow-sm text-center md:text-left${isLastOdd ? ' md:col-span-2 max-w-lg mx-auto w-full' : ''}`}>
                  <div className={`w-10 h-10 ${feature.color} rounded-xl flex items-center justify-center mb-4 mx-auto md:mx-0`}><Icon size={20} className="text-white" /></div>
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

      {/* Guarantee */}
      <section className="py-20 px-4 sm:px-6 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="bg-navy-900 rounded-3xl p-10 md:p-14 text-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #F5A01A 0%, transparent 60%), radial-gradient(circle at 80% 50%, #F5A01A 0%, transparent 60%)' }} />
            <div className="relative">
              <div className="w-16 h-16 bg-cta-500/10 border border-cta-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Shield size={32} className="text-cta-500" />
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">The Corviz Guarantee</h2>
              <p className="text-white/75 text-lg mb-6 max-w-2xl mx-auto leading-relaxed">
                90-day guarantee — if you don't believe Corviz has paid for itself at the end of 90 days, full refund, your call, no disputes.
              </p>
              <div className="grid sm:grid-cols-3 gap-4 mb-8 text-left">
                {[
                  { title: 'Paid 90-day pilot', body: 'All automations active from day one. £99 upfront — no monthly commitment during the pilot.' },
                  { title: 'Concierge setup', body: 'I personally help you get set up. Upload your customer list and I\'ll send you a tailored walkthrough video within 24 hours.' },
                  { title: 'You decide', body: 'At 90 days, if you don\'t think it paid for itself — just ask. Full refund, no questions, no disputes.' },
                ].map((item) => (
                  <div key={item.title} className="bg-white/5 border border-white/10 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Check size={14} className="text-cta-500" />
                      <p className="text-white font-semibold text-sm">{item.title}</p>
                    </div>
                    <p className="text-white/60 text-sm leading-relaxed">{item.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* Who this is for / not for */}
      <section className="py-20 px-4 sm:px-6 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-navy-900 mb-4">Who Corviz is for</h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              Most garages I&apos;d ignore. Fast-fit places, solo operations, the big multi-site chains. What I built isn&apos;t for them.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Check size={16} className="text-green-600" />
                </div>
                <h3 className="text-lg font-bold text-navy-900">This is for you if</h3>
              </div>
              <ul className="space-y-4">
                {[
                  '2 to 4 staff, owner-operated',
                  'Doing MOTs and servicing',
                  '300 to 1,500 customers on the books',
                  '3 to 7 years under current ownership',
                  'Using garage management software or working from spreadsheets',
                  'Frustrated watching customers drift away year on year',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check size={11} className="text-green-600" />
                    </div>
                    <span className="text-gray-700 text-sm leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <X size={16} className="text-red-500" />
                </div>
                <h3 className="text-lg font-bold text-navy-900">This is not for you if</h3>
              </div>
              <ul className="space-y-4">
                {[
                  'Under 300 customers on your books',
                  '5 or more staff — your garage management system already handles this',
                  'Multi-site or franchise operation',
                  'Specialist workshop — bodywork, performance, diagnostics only',
                  'Fast-fit, tyres, exhausts, batteries — transactional not relationship-driven',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <X size={11} className="text-red-500" />
                    </div>
                    <span className="text-gray-700 text-sm leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <p className="text-center text-gray-500 text-sm mt-8">
            Not sure if you fit? Email <a href="mailto:jack@getcorviz.com" className="text-amber-600 underline">jack@getcorviz.com</a> — I&apos;ll give you an honest answer.
          </p>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-4 sm:px-6">
        <div className="max-w-xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-navy-900 mb-3">Founding Member Pilot</h2>
            <p className="text-gray-500 text-lg">Limited to the first 10 garages. Personally onboarded by Jack.</p>
            {founderCount !== null && founderCount > 0 && (
              <p className="mt-3 text-sm font-medium text-amber-700 bg-amber-50 border border-amber-200 rounded-full inline-block px-4 py-1.5">
                {founderCount} of 10 founding member spots secured. When they're gone, the rate rises to £79/month.
              </p>
            )}
          </div>

          {/* Single pilot card */}
          <div className="bg-navy-900 rounded-2xl p-8 border border-navy-700 shadow-xl shadow-navy-900/20">
            {/* Price */}
            <div className="text-center mb-6">
              <div className="flex items-end justify-center gap-2 mb-1">
                <span className="text-6xl font-bold text-white">£99</span>
              </div>
              <p className="text-white/60 text-sm">One-time, covers your full 90-day pilot</p>
            </div>

            {/* Inclusions */}
            <ul className="space-y-3 mb-6">
              {[
                'Full access to Corviz for 90 days',
                'Personal onboarding — Jack reviews your customer list and sends a tailored walkthrough video within 24 hours of signup',
                'Direct WhatsApp access to Jack for the full pilot',
                'DVLA cross-check on every reminder before it sends',
                'Your first batch reviewed and approved by you before anything fires',
                'Written reviews at day 30, 60, and 90 with your actual dashboard numbers',
              ].map((feature) => (
                <li key={feature} className="flex items-start gap-3">
                  <div className="w-4 h-4 rounded-full bg-cta-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check size={10} className="text-cta-500" />
                  </div>
                  <span className="text-sm text-navy-200 leading-snug">{feature}</span>
                </li>
              ))}
            </ul>

            {/* Guarantee box */}
            <div className="border border-cta-500/30 bg-cta-500/5 rounded-xl p-4 mb-6">
              <div className="flex items-start gap-3">
                <Shield size={18} className="text-cta-500 flex-shrink-0 mt-0.5" />
                <p className="text-white/80 text-sm leading-relaxed">
                  If at the end of 90 days you don't believe Corviz has paid for itself, tell me, and you get a full refund.{' '}
                  <span className="text-white font-semibold">Your call. No forms, no disputes.</span>
                </p>
              </div>
            </div>

            {/* CTA */}
            <Link
              href="/signup"
              className="block text-center font-bold px-6 py-3.5 rounded-xl bg-cta-500 text-navy-900 hover:bg-cta-400 transition-colors text-base"
            >
              Start my 90-day pilot — £99
            </Link>
            <p className="text-center text-white/40 text-xs mt-3 leading-relaxed">
              After your pilot, continue at founding member pricing — £39/month for life.{' '}
              Standard pricing after the first 10 founding members is £79/month.
            </p>
          </div>

          {/* What happens after */}
          <div className="mt-8 text-center">
            <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider mb-3">What happens after the pilot</h3>
            <p className="text-gray-500 text-sm leading-relaxed">
              After your 90-day pilot, you continue with Corviz at <strong className="text-navy-900">£39/month for life</strong> as a founding member — no price increases, no surprise charges. This founding member rate is available only to the first 10 garages. After that, Corviz is £79/month.
            </p>
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
                a: 'Under UK PECR, the "soft opt-in" rule allows you to contact existing customers about similar services — such as MOT reminders and service follow-ups — without a separate opt-in, provided they were given a chance to opt out when you first collected their details. You are responsible for ensuring your customer list is compliant with this rule. If you are unsure, I recommend seeking independent legal advice.',
              },
              {
                q: 'What if I don\'t have a customer list?',
                a: 'Most independent garages run on a mix of paper, spreadsheets, and legacy software. On your onboarding I\'ll walk you through how to export from any system — or if you\'re fully on paper, we\'ll start with your most recent customers and build from there.',
              },
              {
                q: 'Will customers know the message is automated?',
                a: 'Messages are sent from your garage name and use the customer\'s first name — they feel personal, not robotic. Most customers simply see a helpful reminder from a garage they trust.',
              },
              {
                q: 'How does the 90-day refund guarantee work?',
                a: 'If at the end of 90 days you don\'t believe Corviz has paid for itself, email me or message me on WhatsApp. I\'ll refund you in full. No forms, no disputes, no \'prove it\' required. Your call.',
              },
              {
                q: 'Can I customise the messages?',
                a: 'Yes. You get a default template out of the box — it auto-fills your garage name, your phone number, and the customer\'s details so the reminder reads like it came from you, not a robot. If you want to change the wording, you can — every template is editable in your dashboard before the batch fires.',
              },
              {
                q: 'Does this work alongside my existing garage software?',
                a: 'Yes — Corviz works independently of your garage management system. You import your customer data via CSV and Corviz handles the rest. There\'s no integration required.',
              },
              {
                q: 'How does Corviz know when an MOT is due?',
                a: 'I calculate the MOT due date based on the last MOT date you provide when importing customers. I also cross-reference with the DVLA to keep dates accurate — if a customer has renewed elsewhere, I update their record automatically.',
              },
              {
                q: 'Is my customer data safe?',
                a: 'Your data is stored securely in the EU on Supabase infrastructure. I never share or sell your customer data to third parties. I act as a data processor — you remain the data controller. Full details are in our Privacy Policy.',
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
                    className={`text-gray-500 flex-shrink-0 transition-transform duration-200 ${openFaq === i ? 'rotate-180' : ''}`}
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

      {/* Founder */}
      <section className="py-16 px-4 sm:px-6 bg-white border-t border-gray-100">
        <div className="max-w-2xl mx-auto flex flex-col sm:flex-row items-center gap-8 text-center sm:text-left">
          <img
            src="/jack.jpg"
            alt="Jack, founder of Corviz"
            className="w-20 h-20 rounded-full object-cover flex-shrink-0 border-2 border-gray-100"
          />
          <div>
            <p className="font-bold text-navy-900 text-lg">Jack</p>
            <p className="text-gray-500 text-sm mb-3">Founder, Corviz</p>
            <p className="text-gray-600 text-sm leading-relaxed">
              I built Corviz for owner-operated garages — great at the job, no time for anything that isn&apos;t under a bonnet. I run every pilot personally. If you have a question, email me: <a href="mailto:jack@getcorviz.com" className="text-amber-600 underline">jack@getcorviz.com</a>
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 bg-navy-900">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Start recovering customers today</h2>
          <p className="text-white/75 text-lg mb-8">Paid 90-day pilot with full refund guarantee. Concierge setup from the founder.</p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 bg-cta-500 text-navy-900 font-bold px-8 py-4 rounded-xl hover:bg-cta-400 transition-colors text-lg"
          >
            Start your 90-day pilot — £99 <ArrowRight size={20} />
          </Link>
          <p className="text-white/60 text-sm mt-4">Full refund if it doesn't pay for itself · Cancel anytime after pilot</p>
        </div>
      </section>

      {/* Email capture */}
      <section className="py-14 px-4 sm:px-6 bg-gray-50 border-t border-gray-100">
        <div className="max-w-xl mx-auto text-center">
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Free guide</p>
          <h3 className="text-xl font-bold text-navy-900 mb-2">Not ready to sign up yet?</h3>
          <p className="text-gray-500 text-sm mb-6">
            Get <span className="font-medium text-navy-900">"5 ways UK garages lose £20,000+ a year in lapsed customers"</span> — free, no strings attached.
          </p>
          <Link
            href="/guide-optin"
            className="inline-flex items-center justify-center gap-2 bg-navy-900 text-white font-semibold px-6 py-3 rounded-lg text-sm hover:bg-navy-800 transition-colors"
          >
            Get the free guide <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-navy-900 border-t border-navy-800 py-8 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center">
            <img src="/corviz-logo-white.png" alt="Corviz" className="h-10 w-auto" />
          </div>
          <p className="text-navy-300 text-xs">© 2026 Corviz. Built for independent UK garages.</p>
          <div className="flex gap-6">
            <a href="/privacy" className="text-navy-300 text-xs hover:text-white transition-colors">Privacy</a>
            <a href="/terms" className="text-navy-300 text-xs hover:text-white transition-colors">Terms</a>
            <a href="mailto:jack@getcorviz.com" className="text-navy-300 text-xs hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
