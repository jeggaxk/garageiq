export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { createClient as createSupabaseAdminClient } from '@supabase/supabase-js'

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

  // Try to create the user
  const { data: userData, error: createError } = await adminClient.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  })

  if (createError) {
    // If user already exists from a previous failed attempt, find and update them
    if (createError.message?.toLowerCase().includes('already registered') || createError.message?.toLowerCase().includes('already been registered')) {
      const { data: existingUsers } = await adminClient.auth.admin.listUsers()
      const existingUser = existingUsers?.users?.find((u) => u.email === email)

      if (!existingUser) {
        return NextResponse.json({ error: createError.message }, { status: 400 })
      }

      // Confirm their email and update password in case it changed
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

  // Check if garage already exists for this user
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
      plan: 'trial',
    })

    if (garageError) {
      return NextResponse.json({ error: 'Failed to set up garage. Please try again.' }, { status: 500 })
    }
  }

  return NextResponse.json({ success: true })
}
