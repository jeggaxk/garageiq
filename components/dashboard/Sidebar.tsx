'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import type { Garage } from '@/types'
import {
  LayoutDashboard,
  Users,
  Zap,
  MessageSquare,
  Settings,
  LogOut,
  Menu,
  X,
} from 'lucide-react'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/customers', label: 'Customers', icon: Users },
  { href: '/automations', label: 'Automations', icon: Zap },
  { href: '/messages', label: 'Messages', icon: MessageSquare },
  { href: '/settings', label: 'Settings', icon: Settings },
]

export default function Sidebar({ garage }: { garage: Garage }) {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)

  async function handleSignOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

  const NavContent = () => (
    <>
      {/* Logo */}
      <div className="px-6 py-5 border-b border-navy-800">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 bg-cta-500 rounded-md flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-xs">G</span>
          </div>
          <div>
            <span className="text-white font-bold text-base tracking-tight leading-none">GarageIQ</span>
            <p className="text-navy-300 text-xs mt-0.5 truncate max-w-[140px]">{garage.name}</p>
          </div>
        </div>
      </div>

      {/* Trial banner */}
      {garage.plan === 'trial' && garage.trial_ends_at && (
        <div className="mx-4 mt-4 p-3 bg-cta-500/10 border border-cta-500/20 rounded-lg">
          <p className="text-cta-500 text-xs font-medium">Free trial active</p>
          <p className="text-cta-500/70 text-xs mt-0.5">
            {Math.max(0, Math.ceil((new Date(garage.trial_ends_at).getTime() - Date.now()) / 86400000))} days remaining
          </p>
        </div>
      )}

      {/* Nav links */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href
          return (
            <Link
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-cta-500 text-white'
                  : 'text-navy-300 hover:text-white hover:bg-navy-800'
              )}
            >
              <Icon size={18} className="flex-shrink-0" />
              {label}
            </Link>
          )
        })}
      </nav>

      {/* Sign out */}
      <div className="px-3 py-4 border-t border-navy-800">
        <button
          onClick={handleSignOut}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-navy-300 hover:text-white hover:bg-navy-800 w-full transition-colors"
        >
          <LogOut size={18} />
          Sign out
        </button>
      </div>
    </>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-60 bg-navy-900 flex-col flex-shrink-0 h-screen">
        <NavContent />
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-navy-900 flex items-center justify-between px-4 py-3 border-b border-navy-800">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-cta-500 rounded flex items-center justify-center">
            <span className="text-white font-bold text-xs">G</span>
          </div>
          <span className="text-white font-bold text-sm">GarageIQ</span>
        </div>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="text-white p-1"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-30 bg-navy-900 flex flex-col pt-14">
          <NavContent />
        </div>
      )}
    </>
  )
}
