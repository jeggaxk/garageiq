export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { startOfMonth, endOfMonth, addDays, startOfDay } from 'date-fns'
import { subYears } from 'date-fns'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: garage } = await supabase
    .from('garages').select('id').eq('owner_id', user.id).single()
  if (!garage) return NextResponse.json({ error: 'Garage not found' }, { status: 404 })

  const today = startOfDay(new Date())
  const monthStart = startOfMonth(today).toISOString()
  const monthEnd = endOfMonth(today).toISOString()
  const in30Days = addDays(today, 30).toISOString().split('T')[0]

  // Total customers
  const { count: totalCustomers } = await supabase
    .from('customers')
    .select('id', { count: 'exact', head: true })
    .eq('garage_id', garage.id)

  // Messages sent this month
  const { count: messagesSentThisMonth } = await supabase
    .from('messages')
    .select('id', { count: 'exact', head: true })
    .eq('garage_id', garage.id)
    .gte('sent_at', monthStart)
    .lte('sent_at', monthEnd)

  // MOTs due in next 30 days
  const todayStr = today.toISOString().split('T')[0]
  // last_mot_date + 1 year falls between today and today+30
  // i.e. last_mot_date between (today - 1year) and (today + 30 - 1year)
  const motWindowStart = subYears(today, 1).toISOString().split('T')[0]
  const motWindowEnd = subYears(addDays(today, 30), 1).toISOString().split('T')[0]

  const { data: upcomingMOTs, count: motsDueNext30Days } = await supabase
    .from('customers')
    .select('id, name, vehicle_reg, vehicle_make, last_mot_date', { count: 'exact' })
    .eq('garage_id', garage.id)
    .gte('last_mot_date', motWindowStart)
    .lte('last_mot_date', motWindowEnd)
    .order('last_mot_date', { ascending: true })
    .limit(10)

  // Recent activity (last 10 messages)
  const { data: recentMessages } = await supabase
    .from('messages')
    .select('*, customer:customers(name, vehicle_reg)')
    .eq('garage_id', garage.id)
    .order('sent_at', { ascending: false })
    .limit(10)

  // Estimate revenue protected: avg MOT value ~£55, service ~£150
  const estimatedRevenueProtected = ((motsDueNext30Days || 0) * 55 + (messagesSentThisMonth || 0) * 25) * 100

  return NextResponse.json({
    stats: {
      totalCustomers: totalCustomers || 0,
      messagesSentThisMonth: messagesSentThisMonth || 0,
      motsDueNext30Days: motsDueNext30Days || 0,
      estimatedRevenueProtected,
    },
    upcomingMOTs: upcomingMOTs || [],
    recentMessages: recentMessages || [],
  })
}
