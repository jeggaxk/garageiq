import { NextResponse } from 'next/server'
import { createClient as createSupabaseAdminClient } from '@supabase/supabase-js'
import { getStripe } from '@/lib/stripe'
import type Stripe from 'stripe'

export const dynamic = 'force-dynamic'

function getAdminClient() {
  return createSupabaseAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

export async function POST(request: Request) {
  const stripe = getStripe()
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const supabase = getAdminClient()

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const garageId = session.metadata?.garage_id
    const plan = session.metadata?.plan

    if (garageId && plan) {
      await supabase
        .from('garages')
        .update({ plan, stripe_customer_id: session.customer as string })
        .eq('id', garageId)
    }
  }

  if (event.type === 'customer.subscription.deleted') {
    const subscription = event.data.object as Stripe.Subscription
    const garageId = subscription.metadata?.garage_id

    if (garageId) {
      await supabase
        .from('garages')
        .update({ plan: 'trial' })
        .eq('id', garageId)
    }
  }

  if (event.type === 'customer.subscription.updated') {
    const subscription = event.data.object as Stripe.Subscription
    const garageId = subscription.metadata?.garage_id

    if (garageId) {
      const status = subscription.status
      if (status === 'active' || status === 'trialing') {
        // Plan stays as-is, just ensure it's not reset
      } else if (status === 'past_due' || status === 'canceled' || status === 'unpaid') {
        await supabase
          .from('garages')
          .update({ plan: 'trial' })
          .eq('id', garageId)
      }
    }
  }

  return NextResponse.json({ received: true })
}
