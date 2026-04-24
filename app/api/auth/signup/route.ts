export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { createClient as createSupabaseAdminClient } from '@supabase/supabase-js'
import { sendEmail } from '@/lib/resend'

export async function POST(request: Request) {
  const adminClient = createSupabaseAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
  const { email, password, garageName, ownerName, phone } = await request.json()

  if (!email || !password || !garageName) {
    return NextResponse.json({ error: 'Email, password and garage name are required' }, { status: 400 })
  }

  let userId: string

  const { data: userData, error: createError } = await adminClient.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  })

  if (createError) {
    if (createError.message?.toLowerCase().includes('already registered') || createError.message?.toLowerCase().includes('already been registered')) {
      const { data: existingUsers } = await adminClient.auth.admin.listUsers()
      const existingUser = existingUsers?.users?.find((u) => u.email === email)

      if (!existingUser) {
        return NextResponse.json({ error: createError.message }, { status: 400 })
      }

      const { data: updatedUser, error: updateError } = await adminClient.auth.admin.updateUserById(
        existingUser.id,
        { email_confirm: true, password }
      )

      if (updateError || !updatedUser.user) {
        return NextResponse.json({ error: 'Failed to update existing account' }, { status: 500 })
      }

      userId = updatedUser.user.id
    } else {
      return NextResponse.json({ error: createError.message }, { status: 400 })
    }
  } else if (!userData.user) {
    return NextResponse.json({ error: 'Failed to create account' }, { status: 500 })
  } else {
    userId = userData.user.id
  }

  const { data: existingGarage } = await adminClient
    .from('garages')
    .select('id')
    .eq('owner_id', userId)
    .single()

  if (!existingGarage) {
    const { error: garageError } = await adminClient.from('garages').insert({
      owner_id: userId,
      name: garageName,
      owner_name: ownerName || null,
      email,
      phone: phone || null,
      plan: 'pilot',
    })

    if (garageError) {
      return NextResponse.json({ error: 'Failed to set up garage. Please try again.' }, { status: 500 })
    }
  }

  // Welcome email — sent before payment, so keep it brief
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://getcorviz.com'
  sendEmail({
    to: email,
    subject: `Almost there, ${ownerName || garageName} — one step left`,
    text: `Hi ${ownerName || 'there'},

Your Corviz account is set up. Complete your payment on the next screen to activate your 90-day pilot.

Once active, here's how to get going:

1. Import your customers — upload a CSV from your garage system, or add them manually.
   ${appUrl}/customers

2. Turn on automations — MOT reminders, service follow-ups, and win-back messages run on autopilot.
   ${appUrl}/automations

3. Fill in your garage details — your name, phone number, and Google review link go into every message.
   ${appUrl}/settings

Most garages are up and running within 10 minutes.

Any questions — just reply to this email.

The Corviz team`,
  }).catch(() => {})

  return NextResponse.json({ success: true })
}
