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
} from 'lucide-react'

function ROICalculator() {
  const [customers, setCustomers] = useState(400)

  const lapsedPercent = 0.40
  const recoveryRate = 0.35
  const avgJobValue = 165

  const lapsedCustomers = Math.round(customers * lapsedPercent)
  const recovered = Math.round(lapsedCustomers * recoveryRate)
  const revenue = recovered * avgJobValue

  return (
    <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
      <h3 className="text-2xl font-bold text-navy-900 mb-2">See your potential return</h3>
      <p className="text-gray-500 mb-6">Move the slider to match your customer base</p>

      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-gray-700">Number of customers</label>
          <span className="text-2xl font-bold text-navy-900">{customers.toLocaleString()}</span>
        </div>
        <input
          type="range"
          min={50}
          max={2000}
          step={50}
          value={customers}
          onChange={(e) => setCustomers(Number(e.target.value))}
          onInput={(e) => setCustomers(Number((e.target as HTMLInputElement).value))}
          className="w-full h-2 bg-gray-200 rounded-full cursor-pointer accent-amber-500"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>50</span>
          <span>2,000</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center p-4 bg-red-50 rounded-xl">
          <p className="text-3xl font-bold text-red-600">{lapsedCustomers}</p>
          <p className="text-xs text-red-500 mt-1 font-medium">Lapsed per year</p>
          <p className="text-xs text-gray-400 mt-0.5">(40% average)</p>
        </div>
        <div className="text-center p-4 bg-amber-50 rounded-xl">
          <p className="text-3xl font-bold text-amber-600">{recovered}</p>
          <p className="text-xs text-amber-600 mt-1 font-medium">Recovered</p>
          <p className="text-xs text-gray-400 mt-0.5">with GarageIQ</p>
        </div>
        <div className="text-center p-4 bg-green-50 rounded-xl">
          <p className="text-xl font-bold text-green-600 whitespace-nowrap">£{revenue.toLocaleString()}</p>
          <p className="text-xs text-green-600 mt-1 font-medium">Revenue recovered</p>
          <p className="text-xs text-gray-400 mt-0.5">per year</p>
        </div>
      </div>

      <div className="p-4 bg-navy-900 rounded-xl flex items-center justify-between">
        <div>
          <p className="text-white font-semibold">GarageIQ costs £49–199/mo</p>
          <p className="text-navy-300 text-sm">Your ROI: <span className="text-amber-400 font-bold">{Math.round(revenue / (49 * 12) * 100)}% return</span> on the Solo plan</p>
        </div>
        <Link
          href="/signup"
          className="flex-shrink-0 bg-amber-500 text-white font-semibold px-4 py-2 rounded-lg text-sm hover:bg-amber-400 transition-colors"
        >
          Start free →
        </Link>
      </div>
    </div>
  )
}

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <div className="bg-white font-sans">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <div className="flex items-center">
            <img src="/garageiq-logo-transparent.png" alt="GarageIQ" className="w-40 h-auto" />
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-gray-600 hover:text-navy-900 transition-colors">Features</a>
            <a href="#how-it-works" className="text-sm text-gray-600 hover:text-navy-900 transition-colors">How it works</a>
            <a href="#pricing" className="text-sm text-gray-600 hover:text-navy-900 transition-colors">Pricing</a>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <Link href="/login" className="text-sm text-gray-600 hover:text-navy-900 font-medium transition-colors">Sign in</Link>
            <Link
              href="/signup"
              className="bg-amber-500 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-amber-400 transition-colors"
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
            <Link href="/login" className="block text-sm text-gray-600 font-medium">Sign in</Link>
            <Link
              href="/signup"
              className="block text-center bg-amber-500 text-white text-sm font-semibold px-4 py-2.5 rounded-lg"
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
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-full mb-6">
                <span className="w-1.5 h-1.5 bg-amber-500 rounded-full" />
                <span className="text-amber-400 text-xs font-medium">60-day free trial · No card required</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                Stop losing customers to garages{' '}
                <span className="text-amber-500">down the road</span>
              </h1>
              <p className="text-navy-300 text-lg mb-4 leading-relaxed">
                Independent UK garages lose <span className="text-white font-semibold">40% of customers every year</span> — not because of bad service, but because no one followed up.
              </p>
              <p className="text-navy-300 text-lg mb-8 leading-relaxed">
                GarageIQ sends automated MOT reminders, service follow-ups, and Google review requests — so your customers book with <em>you</em>, not someone else.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center gap-2 bg-amber-500 text-white font-bold px-6 py-3.5 rounded-xl hover:bg-amber-400 transition-colors text-base"
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
                        <div className="w-5 h-5 bg-amber-500 rounded" />
                        <span className="text-white text-xs font-bold">GarageIQ</span>
                      </div>
                      {['Dashboard', 'Customers', 'Automations', 'Messages', 'Settings'].map((item, i) => (
                        <div key={item} className={`flex items-center gap-2 px-2 py-1.5 rounded text-xs mb-0.5 ${i === 0 ? 'bg-amber-500 text-white font-semibold' : 'text-navy-400'}`}>
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
                      <div className="bg-amber-50 rounded-lg p-2">
                        <p className="text-xs font-semibold text-amber-800 mb-1.5">MOTs due this month</p>
                        {[
                          { name: 'J. Smith', reg: 'AB12 CDE', days: '3d' },
                          { name: 'P. Jones', reg: 'XY23 FGH', days: '7d' },
                          { name: 'M. Taylor', reg: 'LM45 NOP', days: '12d' },
                        ].map((c) => (
                          <div key={c.reg} className="flex items-center justify-between text-xs text-gray-600 py-0.5">
                            <span>{c.name}</span>
                            <span className="font-mono bg-gray-100 px-1 rounded text-xs">{c.reg}</span>
                            <span className="text-amber-600 font-medium">{c.days}</span>
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
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12 text-center">
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
                color: 'text-amber-500 bg-amber-50',
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
                <div key={item.title} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                  <div className={`w-12 h-12 rounded-xl ${item.color} flex items-center justify-center mb-4`}>
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
                example: '"Hi Sarah, your AB12 CDE MOT is due in 4 weeks. Book now at Smith\'s Auto — reply YES to confirm or call us on 01234 567890."',
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
                color: 'bg-amber-500',
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
                <div key={feature.title} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                  <div className={`w-10 h-10 ${feature.color} rounded-xl flex items-center justify-center mb-4`}>
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
                description: 'GarageIQ runs every morning. You\'ll see messages going out, customers booking, and revenue coming in.',
                icon: TrendingUp,
              },
            ].map((step, i) => {
              const Icon = step.icon
              return (
                <div key={step.step} className="text-center">
                  <div className="w-14 h-14 bg-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-amber-200">
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
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-navy-900 mb-4">
                What's your garage actually losing?
              </h2>
              <p className="text-gray-500 text-lg mb-6 leading-relaxed">
                Most garages are sitting on hundreds of lapsed customers worth thousands of pounds. GarageIQ brings them back automatically.
              </p>
              <ul className="space-y-3">
                {[
                  'Average MOT booking value: £55',
                  'Average service booking value: £150',
                  'Average recovery rate with GarageIQ: 35%',
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

      {/* Pricing */}
      <section id="pricing" className="py-20 px-4 sm:px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-navy-900 mb-4">Simple, transparent pricing</h2>
            <p className="text-gray-500 text-lg">Start free for 60 days. Cancel anytime.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: 'Solo',
                price: '£49',
                period: '/month',
                description: 'Perfect for single-bay independents',
                features: [
                  'Up to 500 customers',
                  'SMS + email reminders',
                  'All 4 automations',
                  'Google review requests',
                  'Message templates',
                  'Email support',
                ],
                cta: 'Start free trial',
                popular: false,
              },
              {
                name: 'Pro',
                price: '£99',
                period: '/month',
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
                price: '£199',
                period: '/month',
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
            ].map((plan) => (
              <div
                key={plan.name}
                className={`rounded-2xl p-6 border ${
                  plan.popular
                    ? 'bg-navy-900 border-navy-700 shadow-xl shadow-navy-900/20'
                    : 'bg-white border-gray-100 shadow-sm'
                }`}
              >
                {plan.popular && (
                  <span className="inline-block bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full mb-4">
                    Most popular
                  </span>
                )}
                <h3 className={`text-xl font-bold mb-1 ${plan.popular ? 'text-white' : 'text-navy-900'}`}>
                  {plan.name}
                </h3>
                <p className={`text-sm mb-4 ${plan.popular ? 'text-navy-300' : 'text-gray-500'}`}>
                  {plan.description}
                </p>
                <div className="flex items-end gap-1 mb-6">
                  <span className={`text-4xl font-bold ${plan.popular ? 'text-white' : 'text-navy-900'}`}>
                    {plan.price}
                  </span>
                  <span className={`text-sm mb-1.5 ${plan.popular ? 'text-navy-300' : 'text-gray-400'}`}>
                    {plan.period}
                  </span>
                </div>
                <ul className="space-y-2.5 mb-6">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2.5">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${
                        plan.popular ? 'bg-amber-500/20' : 'bg-green-100'
                      }`}>
                        <Check size={10} className={plan.popular ? 'text-amber-400' : 'text-green-600'} />
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
                      ? 'bg-amber-500 text-white hover:bg-amber-400'
                      : 'bg-navy-900 text-white hover:bg-navy-800'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
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
                quote: "I used to lose track of customers all the time. Now GarageIQ handles it — I just show up and the bookings are there.",
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
              <div key={testimonial.name} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <div className="flex gap-0.5 mb-3">
                  {[...Array(testimonial.stars)].map((_, i) => (
                    <Star key={i} size={14} className="text-amber-500 fill-amber-500" />
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

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 bg-navy-900">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Start recovering customers today
          </h2>
          <p className="text-navy-300 text-lg mb-8">
            Join 200+ independent UK garages using GarageIQ to retain more customers and grow revenue — automatically.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 bg-amber-500 text-white font-bold px-8 py-4 rounded-xl hover:bg-amber-400 transition-colors text-lg"
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
            <img src="/garageiq-logo-transparent.png" alt="GarageIQ" className="h-7 w-auto brightness-0 invert opacity-80" />
          </div>
          <p className="text-navy-400 text-xs">© 2026 GarageIQ. Built for independent UK garages.</p>
          <div className="flex gap-6">
            <a href="#" className="text-navy-400 text-xs hover:text-white transition-colors">Privacy</a>
            <a href="#" className="text-navy-400 text-xs hover:text-white transition-colors">Terms</a>
            <a href="mailto:hello@garageiq.co.uk" className="text-navy-400 text-xs hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
