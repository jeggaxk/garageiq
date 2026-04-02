import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { stripe, PLANS } from '@/lib/stripe'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { plan } = await request.json()
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

  // Reuse existing Stripe customer or create one
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

  const session = await stripe.checkout.sessions.create({
    customer: stripeCustomerId,
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [
      {
        price: planConfig.priceId,
        quantity: 1,
      },
    ],
    success_url: `${appUrl}/settings?upgraded=true`,
    cancel_url: `${appUrl}/settings`,
    subscription_data: {
      metadata: { garage_id: garage.id },
      trial_end: garage.trial_ends_at
        ? Math.floor(new Date(garage.trial_ends_at).getTime() / 1000)
        : undefined,
    },
    metadata: { garage_id: garage.id, plan },
  })

  return NextResponse.json({ url: session.url })
}
