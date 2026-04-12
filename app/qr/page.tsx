'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Check, ArrowRight, Car, Zap, Star } from 'lucide-react'

function EmailCaptureForm({ source }: { source: string }) {
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
      <div className="text-center py-4">
        <p className="text-xl font-bold text-navy-900 mb-1">You're on the list!</p>
        <p className="text-gray-500">Check your inbox — the guide is on its way.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
      <input
        type="email"
        required
        placeholder="your@email.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="flex-1 px-4 py-3 rounded-lg text-navy-900 text-sm focus:outline-none focus:ring-2 focus:ring-cta-500 border border-gray-200"
      />
      <button
        type="submit"
        disabled={status === 'loading'}
        className="bg-cta-500 hover:bg-cta-400 text-white font-semibold px-6 py-3 rounded-lg text-sm transition-colors disabled:opacity-60 whitespace-nowrap"
      >
        {status === 'loading' ? 'Sending…' : 'Send me the guide'}
      </button>
      {status === 'error' && (
        <p className="text-red-500 text-xs mt-1">Something went wrong — try again.</p>
      )}
    </form>
  )
}

export default function QRPage() {
  return (
    <div className="min-h-screen bg-white font-sans">
      {/* Nav */}
      <nav className="border-b border-gray-100 px-4 sm:px-6 py-4 flex items-center justify-between">
        <img src="/corviz-logo-transparent.png" alt="Corviz" className="h-10 w-auto" />
        <Link
          href="/signup"
          className="bg-cta-500 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-cta-400 transition-colors"
        >
          Start free trial
        </Link>
      </nav>

      {/* Hero */}
      <section className="py-16 px-4 sm:px-6 bg-navy-900">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-block bg-cta-500/20 text-cta-400 text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full mb-6">
            You received our letter
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold text-white mb-6 leading-tight">
            Your garage is probably losing<br />
            <span className="text-cta-500">£20,000+ a year</span> in lapsed customers
          </h1>
          <p className="text-navy-300 text-lg mb-10 max-w-2xl mx-auto">
            Corviz automatically sends MOT reminders, service follow-ups, and win-back messages to every customer — so none of them slip away quietly.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center gap-2 bg-cta-500 hover:bg-cta-400 text-white font-bold px-8 py-4 rounded-xl transition-colors text-base"
            >
              Start 60-day free trial <ArrowRight size={18} />
            </Link>
          </div>
          <p className="text-navy-400 text-sm mt-4">No credit card required. Cancel anytime.</p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-14 px-4 sm:px-6 border-b border-gray-100">
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          {[
            { stat: '40%', label: 'of customers lapse every year on average' },
            { stat: '35%', label: 'recovery rate with automated reminders' },
            { stat: '£165', label: 'average revenue per recovered customer' },
          ].map(({ stat, label }) => (
            <div key={stat}>
              <p className="text-4xl font-bold text-navy-900 mb-2">{stat}</p>
              <p className="text-gray-500 text-sm">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="py-14 px-4 sm:px-6 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-navy-900 text-center mb-10">How Corviz works</h2>
          <div className="space-y-6">
            {[
              { icon: Car, title: 'Add your customers', body: 'Import a CSV from your existing system or add customers manually. Takes under 10 minutes.' },
              { icon: Zap, title: 'Automations run themselves', body: 'MOT reminders, service follow-ups, win-back messages, and Google review requests — all sent automatically at the right time.' },
              { icon: Star, title: 'Customers come back', body: 'Lapsed customers get a timely reminder and book again. You do nothing except see the bookings come in.' },
            ].map(({ icon: Icon, title, body }) => (
              <div key={title} className="flex gap-4 bg-white p-5 rounded-xl border border-gray-100 shadow-sm">
                <div className="w-10 h-10 bg-cta-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon size={20} className="text-cta-500" />
                </div>
                <div>
                  <p className="font-semibold text-navy-900 mb-1">{title}</p>
                  <p className="text-gray-500 text-sm">{body}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Primary CTA */}
      <section className="py-14 px-4 sm:px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-navy-900 mb-4">Ready to stop losing customers?</h2>
          <p className="text-gray-500 mb-8">60-day free trial. No card needed. Set up in under 10 minutes.</p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 bg-cta-500 hover:bg-cta-400 text-white font-bold px-10 py-4 rounded-xl transition-colors text-lg mb-4"
          >
            Start free trial <ArrowRight size={20} />
          </Link>
          <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-gray-400 mt-4">
            {['No credit card', '60-day free trial', 'Cancel anytime'].map((point) => (
              <li key={point} className="flex items-center gap-1.5">
                <Check size={13} className="text-green-500" /> {point}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Email capture fallback */}
      <section className="py-14 px-4 sm:px-6 bg-navy-900">
        <div className="max-w-xl mx-auto text-center">
          <p className="text-cta-500 text-sm font-semibold uppercase tracking-wider mb-3">Not ready yet?</p>
          <h2 className="text-2xl font-bold text-white mb-3">Get the free guide first</h2>
          <p className="text-navy-300 text-sm mb-8">
            We'll send you <span className="text-white font-medium">"5 ways UK garages lose £20,000+ a year"</span> — no strings attached.
          </p>
          <EmailCaptureForm source="qr" />
          <p className="text-navy-500 text-xs mt-4">No spam. Unsubscribe anytime.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 sm:px-6 border-t border-gray-100 text-center">
        <p className="text-gray-400 text-xs">
          © {new Date().getFullYear()} Corviz. <Link href="/privacy" className="hover:text-gray-600">Privacy</Link> · <Link href="/terms" className="hover:text-gray-600">Terms</Link>
        </p>
      </footer>
    </div>
  )
}
