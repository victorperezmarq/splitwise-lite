// src/components/Navbar.tsx
'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LogOut, Users, Home } from 'lucide-react'
import { toast } from 'sonner'
import { logout } from '@/app/(auth)/actions'
import { cn } from '@/lib/utils'
import NotificationPanel from '@/components/NotificationPanel'
import type { Profile, Notification } from '@/types/database'

export default function Navbar({
    profile,
    notifications,
}: {
    profile: Profile | null
    notifications: Notification[]
}) {
    const pathname = usePathname()

    async function handleLogout() {
        const id = toast.loading('Cerrando sesión...')
        try {
            await logout()
        } finally {
            toast.dismiss(id)
        }
    }

    return (
        <nav className="sticky top-0 z-10 border-b" style={{ background: 'var(--app-surface)', borderColor: 'var(--app-border)' }}>
            <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">

                {/* Logo */}
                <Link href="/groups" className="flex items-center gap-2.5 font-semibold" style={{ color: 'var(--app-white)' }}>
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-xs font-bold" style={{ background: 'var(--app-accent2)' }}>
                        S
                    </div>
                    <span className="hidden sm:block text-sm">Splitwise Lite</span>
                </Link>

                {/* Links de navegación */}
                <div className="flex items-center gap-1">
                    <Link
                        href="/groups"
                        className={cn(
                            'flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg transition-colors',
                            pathname.startsWith('/groups')
                                ? 'font-medium'
                                : ''
                        )}
                        style={pathname.startsWith('/groups')
                            ? { background: 'rgba(99, 102, 241, .12)', color: 'var(--app-accent)' }
                            : { color: 'var(--app-sub)' }
                        }
                    >
                        <Users className="w-4 h-4" />
                        <span className="hidden sm:block">Mis grupos</span>
                    </Link>
                </div>

                {/* Derecha: notificaciones + perfil + logout */}
                <div className="flex items-center gap-1">

                    {/* Panel de notificaciones */}
                    {profile && (
                        <NotificationPanel
                            userId={profile.id}
                            initialNotifications={notifications}
                        />
                    )}

                    {/* Perfil */}
                    <Link
                        href="/profile"
                        className="flex items-center gap-2 px-2 py-1.5 rounded-lg transition-colors"
                        style={{ color: 'var(--app-sub)' }}
                    >
                        {profile?.avatar_url ? (
                            <img
                                src={profile.avatar_url}
                                alt={profile.full_name}
                                className="w-6 h-6 rounded-full object-cover"
                            />
                        ) : (
                            <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: 'var(--app-accent2)' }}>
                                <span className="text-white text-xs font-medium">
                                    {profile?.full_name?.[0]?.toUpperCase() ?? '?'}
                                </span>
                            </div>
                        )}
                        <span className="text-sm hidden sm:block">
                            {profile?.full_name}
                        </span>
                    </Link>

                    {/* Logout */}
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-1.5 px-2 py-1.5 text-sm rounded-lg transition-colors"
                        style={{ color: 'var(--app-sub)' }}
                        title="Cerrar sesión"
                    >
                        <LogOut className="w-4 h-4" />
                        <span className="hidden sm:block">Salir</span>
                    </button>

                </div>
            </div>
        </nav>
    )
}