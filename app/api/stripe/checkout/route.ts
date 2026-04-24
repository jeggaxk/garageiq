import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getStripe, PLANS } from '@/lib/stripe'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  const stripe = getStripe()
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { plan, billing } = await request.json()
  if (!plan || !(plan in PLANS)) {
    return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
  }

  const { data: garage } = await supabase
    .from('garages')
    .select('*')
    .eq('owner_id', user.id)
    .single()

  if (!garage) return NextResponse.json({ error: 'Garage not found' }, { status: 404 })

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

  let stripeCustomerId = garage.stripe_customer_id
  if (!stripeCustomerId) {
    const customer = await stripe.customers.create({
      email: user.email!,
      name: garage.name,
      metadata: { garage_id: garage.id, owner_id: user.id },
    })
    stripeCustomerId = customer.id
    await supabase
      .from('garages')
      .update({ stripe_customer_id: stripeCustomerId })
      .eq('id', garage.id)
  }

  const planConfig = PLANS[plan as keyof typeof PLANS]

  // Pilot is a one-time £99 payment — activates the 90-day period
  if (plan === 'pilot') {
    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      mode: 'payment',
      payment_method_types: ['card'],
      line_items: [{ price: planConfig.priceId, quantity: 1 }],
      success_url: `${appUrl}/dashboard?pilot=started`,
      cancel_url: `${appUrl}/signup`,
      metadata: { garage_id: garage.id, plan: 'pilot' },
    })
    return NextResponse.json({ url: session.url })
  }

  // Recurring subscriptions (founding, solo, pro)
  const isAnnual = billing === 'annual'
  const priceId = planConfig.priceId

  const session = await stripe.checkout.sessions.create({
    customer: stripeCustomerId,
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${appUrl}/settings?upgraded=true`,
    cancel_url: `${appUrl}/settings`,
    subscription_data: {
      metadata: { garage_id: garage.id },
    },
    metadata: { garage_id: garage.id, plan },
  })

  return NextResponse.json({ url: session.url })
}
