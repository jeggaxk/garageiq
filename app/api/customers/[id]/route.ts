export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: garage } = await supabase
    .from('garages').select('id').eq('owner_id', user.id).single()
  if (!garage) return NextResponse.json({ error: 'Garage not found' }, { status: 404 })

  const body = await request.json()

  const sanitised: Record<string, unknown> = { ...body, updated_at: new Date().toISOString() }
  if ('last_mot_date' in body) sanitised.last_mot_date = body.last_mot_date || null
  if ('last_service_date' in body) sanitised.last_service_date = body.last_service_date || null

  const { data: customer, error } = await supabase
    .from('customers')
    .update(sanitised)
    .eq('id', params.id)
    .eq('garage_id', garage.id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ customer })
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: garage } = await supabase
    .from('garages').select('id').eq('owner_id', user.id).single()
  if (!garage) return NextResponse.json({ error: 'Garage not found' }, { status: 404 })

  const { error } = await supabase
    .from('customers')
    .delete()
    .eq('id', params.id)
    .eq('garage_id', garage.id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ success: true })
}
