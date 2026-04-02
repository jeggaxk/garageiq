export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: garage } = await supabase
    .from('garages').select('id').eq('owner_id', user.id).single()
  if (!garage) return NextResponse.json({ error: 'Garage not found' }, { status: 404 })

  const { searchParams } = new URL(request.url)
  const search = searchParams.get('search') || ''
  const status = searchParams.get('status') || ''

  let query = supabase
    .from('customers')
    .select('*')
    .eq('garage_id', garage.id)
    .order('created_at', { ascending: false })

  if (search) {
    query = query.or(`name.ilike.%${search}%,vehicle_reg.ilike.%${search}%,email.ilike.%${search}%`)
  }

  const { data: customers, error } = await query

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ customers })
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: garage } = await supabase
    .from('garages').select('id').eq('owner_id', user.id).single()
  if (!garage) return NextResponse.json({ error: 'Garage not found' }, { status: 404 })

  const body = await request.json()
  const { name, phone, email, vehicle_reg, vehicle_make, last_service_date, last_mot_date } = body

  if (!name) return NextResponse.json({ error: 'Name is required' }, { status: 400 })

  const { data: customer, error } = await supabase
    .from('customers')
    .insert({
      garage_id: garage.id,
      name,
      phone: phone || null,
      email: email || null,
      vehicle_reg: vehicle_reg || null,
      vehicle_make: vehicle_make || null,
      last_service_date: last_service_date || null,
      last_mot_date: last_mot_date || null,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ customer }, { status: 201 })
}
