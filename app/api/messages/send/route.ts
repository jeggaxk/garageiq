export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createAdminClient } from '@supabase/supabase-js'
import { sendSMS } from '@/lib/twilio'
import { sendEmail } from '@/lib/resend'
import { formatPhoneForTwilio } from '@/lib/utils'

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: garage } = await supabase
    .from('garages').select('*').eq('owner_id', user.id).single()
  if (!garage) return NextResponse.json({ error: 'Garage not found' }, { status: 404 })

  const { customerId, channel, body, subject } = await request.json()
  if (!customerId || !channel || !body) {
    return NextResponse.json({ error: 'customerId, channel and body are required' }, { status: 400 })
  }

  const { data: customer } = await supabase
    .from('customers').select('*').eq('id', customerId).eq('garage_id', garage.id).single()
  if (!customer) return NextResponse.json({ error: 'Customer not found' }, { status: 404 })

  let success = false

  if (channel === 'sms') {
    if (!customer.phone) return NextResponse.json({ error: 'Customer has no phone number' }, { status: 400 })
    const result = await sendSMS(formatPhoneForTwilio(customer.phone), body)
    success = result.success
  } else if (channel === 'email') {
    if (!customer.email) return NextResponse.json({ error: 'Customer has no email address' }, { status: 400 })
    const result = await sendEmail({
      to: customer.email,
      subject: subject || `Message from ${garage.name}`,
      text: body,
    })
    success = result.success
  } else {
    return NextResponse.json({ error: 'channel must be sms or email' }, { status: 400 })
  }

  // Log the message
  const admin = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  await admin.from('messages').insert({
    garage_id: garage.id,
    customer_id: customerId,
    type: 'manual',
    channel,
    status: success ? 'sent' : 'failed',
    sent_at: new Date().toISOString(),
  })

  if (!success) return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
  return NextResponse.json({ success: true })
}
