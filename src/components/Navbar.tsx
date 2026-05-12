// src/components/Navbar.tsx — versión completa actualizada
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
        toast.loading('Cerrando sesión...')
        await logout()
    }

    return (
        <nav className="bg-white border-b border-slate-200 sticky top-0 z-10">
            <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">

                {/* Logo */}
                <Link href="/groups" className="flex items-center gap-2 font-semibold text-slate-900">
                    <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
                        <Home className="w-4 h-4 text-white" />
                    </div>
                    <span className="hidden sm:block">Splitwise Lite</span>
                </Link>

                {/* Links de navegación */}
                <div className="flex items-center gap-1">
                    <Link
                        href="/groups"
                        className={cn(
                            'flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg transition-colors',
                            pathname.startsWith('/groups')
                                ? 'bg-blue-50 text-blue-700 font-medium'
                                : 'text-slate-600 hover:bg-slate-100'
                        )}
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
                        className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
                    >
                        {profile?.avatar_url ? (
                            <img
                                src={profile.avatar_url}
                                alt={profile.full_name}
                                className="w-6 h-6 rounded-full object-cover"
                            />
                        ) : (
                            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                                <span className="text-white text-xs font-medium">
                                    {profile?.full_name?.[0]?.toUpperCase() ?? '?'}
                                </span>
                            </div>
                        )}
                        <span className="text-sm text-slate-600 hidden sm:block">
                            {profile?.full_name}
                        </span>
                    </Link>

                    {/* Logout */}
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-1.5 px-2 py-1.5 text-sm text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
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