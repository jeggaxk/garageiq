import { NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import { sendEmail } from '@/lib/resend'

export const dynamic = 'force-dynamic'
import { createClient as createSupabaseAdminClient } from '@supabase/supabase-js'
import type Stripe from 'stripe'

export async function POST(request: Request) {
  const stripe = getStripe()
  const supabase = createSupabaseAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')!

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  switch (event.type) {
    // Pilot: £99 one-time payment completed
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session
      if (session.metadata?.plan === 'pilot' && session.metadata?.garage_id) {
        const garageId = session.metadata.garage_id
        const pilotEndsAt = new Date()
        pilotEndsAt.setDate(pilotEndsAt.getDate() + 90)

        const { data: garage } = await supabase
          .from('garages')
          .select('email, owner_name, name')
          .eq('id', garageId)
          .single()

        await supabase
          .from('garages')
          .update({
            plan: 'pilot',
            trial_ends_at: pilotEndsAt.toISOString(),
            stripe_customer_id: session.customer as string,
          })
          .eq('id', garageId)

        // Pilot activation email
        if (garage?.email) {
          const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://getcorviz.com'
          sendEmail({
            to: garage.email,
            subject: `Your Corviz pilot is live — 90 days starts now`,
            text: `Hi ${garage.owner_name || 'there'},

Payment confirmed. Your 90-day Corviz pilot is now active for ${garage.name}.

Here's what to do first:

1. Import your customers
   ${appUrl}/customers

2. Turn on your automations
   ${appUrl}/automations

3. Fill in your garage details (name, phone, Google review link)
   ${appUrl}/settings

Remember: if you don't believe Corviz has paid for itself at the end of 90 days, just reply to this email and we'll refund you in full. No disputes, no questions.

Reply any time if you need a hand getting set up — I personally read every reply.

The Corviz team`,
          }).catch(() => {})
        }
      }
      break
    }

    // Recurring subscription created or updated
    case 'customer.subscription.created':
    case 'customer.subscription.updated': {
      const subscription = event.data.object as Stripe.Subscription
      const customerId = subscription.customer as string
      const plan = getPlanFromPriceId(subscription.items.data[0]?.price.id)

      await supabase
        .from('garages')
        .update({ plan, stripe_customer_id: customerId })
        .eq('stripe_customer_id', customerId)
      break
    }

    case 'customer.subscription.deleted': {
      const subscription = event.data.object as Stripe.Subscription
      const customerId = subscription.customer as string
      await supabase
        .from('garages')
        .update({ plan: 'suspended' })
        .eq('stripe_customer_id', customerId)
      break
    }
  }

  return NextResponse.json({ received: true })
}

function getPlanFromPriceId(priceId: string): string {
  if (priceId === process.env.STRIPE_FOUNDING_PRICE_ID) return 'founding'
  if (priceId === process.env.STRIPE_SOLO_PRICE_ID) return 'solo'
  if (priceId === process.env.STRIPE_PRO_PRICE_ID) return 'pro'
  return 'suspended'
}
