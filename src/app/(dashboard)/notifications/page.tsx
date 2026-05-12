// src/app/(dashboard)/notifications/page.tsx
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Bell } from 'lucide-react'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'
import NotificationActions from './NotificationActions'
import type { Notification } from '@/types/database'

const TYPE_ICON: Record<string, string> = {
    expense_added: '🧾',
    debt_settled: '💸',
    group_joined: '👋',
    debt_reminder: '⏰',
}

const TYPE_LABEL: Record<string, string> = {
    expense_added: 'Gasto',
    debt_settled: 'Pago',
    group_joined: 'Grupo',
    debt_reminder: 'Recordatorio',
}

export default async function NotificationsPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    const { data: notifications } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

    const allNotifications = (notifications ?? []) as Notification[]
    const unreadCount = allNotifications.filter(n => !n.is_read).length

    // Agrupar por fecha
    const grouped = allNotifications.reduce<Record<string, Notification[]>>(
        (acc, n) => {
            const date = new Date(n.created_at).toLocaleDateString('es-ES', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
            })
            if (!acc[date]) acc[date] = []
            acc[date].push(n)
            return acc
        },
        {}
    )

    return (
        <div className="space-y-6 max-w-2xl mx-auto">

            {/* Header */}
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Notificaciones</h1>
                    <p className="text-slate-500 text-sm mt-1">
                        {unreadCount > 0
                            ? `${unreadCount} sin leer`
                            : 'Todo al día ✓'}
                    </p>
                </div>

                {unreadCount > 0 && (
                    <NotificationActions />
                )}
            </div>

            {/* Lista agrupada por fecha */}
            {Object.keys(grouped).length === 0 ? (
                <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center">
                    <Bell className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                    <p className="font-medium text-slate-500">Sin notificaciones</p>
                    <p className="text-sm text-slate-400 mt-1">
                        Aquí aparecerán los gastos, pagos y novedades de tus grupos
                    </p>
                </div>
            ) : (
                Object.entries(grouped).map(([date, items]) => (
                    <div key={date}>
                        {/* Separador de fecha */}
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 capitalize">
                            {date}
                        </p>

                        <div className="space-y-2">
                            {items.map(notification => {
                                const icon = TYPE_ICON[notification.type] ?? '🔔'
                                const typeLabel = TYPE_LABEL[notification.type] ?? 'Aviso'

                                const card = (
                                    <div
                                        className={`flex items-start gap-4 p-4 bg-white border rounded-xl transition-all hover:shadow-sm ${!notification.is_read
                                                ? 'border-blue-200 bg-blue-50/30'
                                                : 'border-slate-200'
                                            }`}
                                    >
                                        {/* Icono */}
                                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-lg shrink-0">
                                            {icon}
                                        </div>

                                        {/* Contenido */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-0.5">
                                                <span className="text-xs text-slate-400 font-medium">
                                                    {typeLabel}
                                                </span>
                                                {!notification.is_read && (
                                                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                                                )}
                                            </div>
                                            <p className={`text-sm ${!notification.is_read ? 'font-medium text-slate-900' : 'text-slate-700'}`}>
                                                {notification.title}
                                            </p>
                                            <p className="text-sm text-slate-500 mt-0.5">
                                                {notification.body}
                                            </p>
                                            <p className="text-xs text-slate-300 mt-1.5">
                                                {new Date(notification.created_at).toLocaleTimeString('es-ES', {
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })}
                                            </p>
                                        </div>

                                        {/* Punto no leída */}
                                        {!notification.is_read && (
                                            <div className="w-2 h-2 bg-blue-500 rounded-full shrink-0 mt-2" />
                                        )}
                                    </div>
                                )

                                return notification.group_id ? (
                                    <Link key={notification.id} href={`/groups/${notification.group_id}`}>
                                        {card}
                                    </Link>
                                ) : (
                                    <div key={notification.id}>{card}</div>
                                )
                            })}
                        </div>
                    </div>
                ))
            )}

        </div>
    )
}