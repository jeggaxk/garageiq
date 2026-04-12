import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Sidebar from '@/components/dashboard/Sidebar'
import TrialBanner from '@/components/dashboard/TrialBanner'
import EmailConfirmBanner from '@/components/dashboard/EmailConfirmBanner'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: garage } = await supabase
    .from('garages')
    .select('*')
    .eq('owner_id', user.id)
    .single()

  if (!garage) {
    redirect('/login')
  }

  const showTrialBanner = garage.plan === 'trial' && garage.trial_ends_at
  const emailConfirmed = !!user.email_confirmed_at

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar garage={garage} />
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {!emailConfirmed && <EmailConfirmBanner email={user.email!} />}
        {showTrialBanner && <TrialBanner trialEndsAt={garage.trial_ends_at} />}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
