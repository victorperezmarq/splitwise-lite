// src/components/Navbar.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LogOut, Users, Home } from 'lucide-react'
import { toast } from 'sonner'
import { logout } from '@/app/(auth)/actions'
import { cn } from '@/lib/utils'
import type { Database } from '@/types/database'

type Profile = Database['public']['Tables']['profiles']['Row']

export default function Navbar({ profile }: { profile: Profile | null }) {
    const pathname = usePathname()

    async function handleLogout() {
        toast.loading('Cerrando sesión...')
        await logout()
    }

    const navLinks = [
        { href: '/groups', label: 'Mis grupos', icon: Users },
    ]

    return (
        <nav className="bg-white border-b border-slate-200 sticky top-0 z-10">
            <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">

                {/* Logo */}
                <Link href="/groups" className="flex items-center gap-2 font-semibold text-slate-900">
                    <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
                        <Home className="w-4 h-4 text-white" />
                    </div>
                    Splitwise Lite
                </Link>

                {/* Links de navegación */}
                <div className="flex items-center gap-1">
                    {navLinks.map(({ href, label, icon: Icon }) => (
                        <Link
                            key={href}
                            href={href}
                            className={cn(
                                'flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg transition-colors',
                                pathname.startsWith(href)
                                    ? 'bg-blue-50 text-blue-700 font-medium'
                                    : 'text-slate-600 hover:bg-slate-100'
                            )}
                        >
                            <Icon className="w-4 h-4" />
                            {label}
                        </Link>
                    ))}
                </div>

                {/* Usuario + logout */}
                <div className="flex items-center gap-3">
                    {profile && (
                        <span className="text-sm text-slate-600 hidden sm:block">
                            {profile.full_name}
                        </span>
                    )}
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                        <LogOut className="w-4 h-4" />
                        <span className="hidden sm:block">Salir</span>
                    </button>
                </div>

            </div>
        </nav>
    )
}