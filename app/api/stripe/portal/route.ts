import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getStripe } from '@/lib/stripe'

export const dynamic = 'force-dynamic'

export async function POST() {
  const stripe = getStripe()
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: garage } = await supabase
    .from('garages')
    .select('stripe_customer_id')
    .eq('owner_id', user.id)
    .single()

  if (!garage?.stripe_customer_id) {
    return NextResponse.json({ error: 'No billing account found' }, { status: 404 })
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

  const session = await stripe.billingPortal.sessions.create({
    customer: garage.stripe_customer_id,
    return_url: `${appUrl}/settings`,
  })

  return NextResponse.json({ url: session.url })
}
