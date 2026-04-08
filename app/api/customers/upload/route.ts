export const dynamic = 'force-dynamic'
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import Papa from 'papaparse'
import { sendCatchUpReminders } from '@/lib/automation'

const PLAN_LIMITS: Record<string, number> = {
  trial: 500,
  solo: 500,
  pro: 2000,
  multi: Infinity,
  suspended: 0,
}

interface CSVRow {
  name?: string
  phone?: string
  email?: string
  last_service_date?: string
  last_mot_date?: string
  vehicle_reg?: string
  vehicle_make?: string
  [key: string]: string | undefined
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: garage } = await supabase
    .from('garages').select('id, plan').eq('owner_id', user.id).single()
  if (!garage) return NextResponse.json({ error: 'Garage not found' }, { status: 404 })

  const formData = await request.formData()
  const file = formData.get('file') as File
  if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 })

  const text = await file.text()

  const { data: rows, errors } = Papa.parse<CSVRow>(text, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (h) => h.toLowerCase().replace(/\s+/g, '_'),
  })

  if (errors.length > 0) {
    return NextResponse.json({ error: 'CSV parse error', details: errors }, { status: 400 })
  }

  const customers = rows
    .filter((row) => row.name)
    .map((row) => ({
      garage_id: garage.id,
      name: row.name!.trim(),
      phone: row.phone?.trim() || null,
      email: row.email?.trim() || null,
      vehicle_reg: row.vehicle_reg?.trim().toUpperCase() || null,
      vehicle_make: row.vehicle_make?.trim() || null,
      last_service_date: parseDate(row.last_service_date),
      last_mot_date: parseDate(row.last_mot_date),
    }))

  if (customers.length === 0) {
    return NextResponse.json({ error: 'No valid customers found in CSV' }, { status: 400 })
  }

  const limit = PLAN_LIMITS[garage.plan] ?? 500
  const { count: currentCount } = await supabase
    .from('customers')
    .select('id', { count: 'exact', head: true })
    .eq('garage_id', garage.id)

  if ((currentCount ?? 0) >= limit) {
    return NextResponse.json(
      { error: `Customer limit reached for your plan (${limit === Infinity ? 'unlimited' : limit}). Upgrade to add more.` },
      { status: 403 }
    )
  }

  const remaining = limit === Infinity ? customers.length : limit - (currentCount ?? 0)
  const customersToImport = customers.slice(0, remaining)

  const withReg = customersToImport.filter((c) => c.vehicle_reg)
  const withoutReg = customersToImport.filter((c) => !c.vehicle_reg)

  const insertErrors: string[] = []
  const insertedIds: string[] = []

  if (withReg.length > 0) {
    const { data: upserted, error: upsertError } = await supabase
      .from('customers')
      .upsert(withReg, { onConflict: 'garage_id,vehicle_reg', ignoreDuplicates: false })
      .select('id')
    if (upsertError) insertErrors.push(upsertError.message)
    if (upserted) insertedIds.push(...upserted.map((c: { id: string }) => c.id))
  }

  if (withoutReg.length > 0) {
    const { data: inserted, error: insertError } = await supabase
      .from('customers')
      .insert(withoutReg)
      .select('id')
    if (insertError) insertErrors.push(insertError.message)
    if (inserted) insertedIds.push(...inserted.map((c: { id: string }) => c.id))
  }

  if (insertErrors.length > 0) {
    return NextResponse.json({ error: insertErrors.join('; ') }, { status: 500 })
  }

  if (insertedIds.length > 0) {
    sendCatchUpReminders(insertedIds, garage.id).catch(() => {})
  }

  return NextResponse.json({
    imported: customersToImport.length,
    skipped: customers.length - customersToImport.length,
  })
}

function parseDate(dateStr: string | undefined): string | null {
  if (!dateStr) return null
  // Try DD/MM/YYYY
  const ukMatch = dateStr.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/)
  if (ukMatch) {
    return `${ukMatch[3]}-${ukMatch[2].padStart(2, '0')}-${ukMatch[1].padStart(2, '0')}`
  }
  // Try YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return dateStr
  return null
}
