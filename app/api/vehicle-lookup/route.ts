export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const reg = searchParams.get('reg')?.replace(/\s+/g, '').toUpperCase()
  if (!reg) return NextResponse.json({ error: 'Registration required' }, { status: 400 })

  const response = await fetch('https://driver-vehicle-licensing.api.gov.uk/vehicle-enquiries/v1/vehicles', {
    method: 'POST',
    headers: {
      'x-api-key': process.env.DVLA_API_KEY!,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ registrationNumber: reg }),
  })

  if (!response.ok) {
    return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 })
  }

  const data = await response.json()

  // motExpiryDate is the date the MOT expires — last_mot_date = 1 year before that
  let lastMotDate: string | null = null
  if (data.motExpiryDate) {
    const expiry = new Date(data.motExpiryDate)
    expiry.setFullYear(expiry.getFullYear() - 1)
    lastMotDate = expiry.toISOString().split('T')[0]
  }

  return NextResponse.json({
    make: data.make || null,
    lastMotDate,
    motExpiryDate: data.motExpiryDate || null,
  })
}
