// src/components/NotificationPanel.tsx
'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Bell, X, Check, CheckCheck, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'
import { markAsRead, markAllAsRead, deleteNotification } from '@/app/(dashboard)/notifications/actions'
import { useRealtimeNotifications } from '@/hooks/useRealtimeNotifications'
import type { Notification } from '@/types/database'

const TYPE_ICON: Record<string, string> = {
    expense_added: '🧾',
    debt_settled: '💸',
    group_joined: '👋',
    debt_reminder: '⏰',
}

const TYPE_COLOR: Record<string, { bg: string; border: string }> = {
    expense_added: { bg: 'rgba(99, 102, 241, .1)', border: 'rgba(99, 102, 241, .2)' },
    debt_settled: { bg: 'rgba(52, 211, 153, .1)', border: 'rgba(52, 211, 153, .2)' },
    group_joined: { bg: 'rgba(168, 85, 247, .1)', border: 'rgba(168, 85, 247, .2)' },
    debt_reminder: { bg: 'rgba(251, 146, 60, .1)', border: 'rgba(251, 146, 60, .2)' },
}

export default function NotificationPanel({
    userId,
    initialNotifications,
}: {
    userId: string
    initialNotifications: Notification[]
}) {
    const [isOpen, setIsOpen] = useState(false)
    const [notifications, setNotifications] = useState<Notification[]>(initialNotifications)
    const panelRef = useRef<HTMLDivElement>(null)

    const unreadCount = notifications.filter(n => !n.is_read).length

    // Añadir notificaciones nuevas en tiempo real
    const handleNewNotification = useCallback((n: Notification) => {
        setNotifications(prev => [n, ...prev])
    }, [])

    useRealtimeNotifications({ userId, onNewNotification: handleNewNotification })

    // Cerrar al hacer click fuera
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    async function handleMarkAsRead(id: string) {
        setNotifications(prev =>
            prev.map(n => n.id === id ? { ...n, is_read: true } : n)
        )
        await markAsRead(id)
    }

    async function handleMarkAllAsRead() {
        setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
        await markAllAsRead()
    }

    async function handleDelete(id: string) {
        setNotifications(prev => prev.filter(n => n.id !== id))
        await deleteNotification(id)
    }

    return (
        <div className="relative" ref={panelRef}>

            {/* Campana con badge */}
            <button
                onClick={() => setIsOpen(prev => !prev)}
                className="relative p-2 rounded-lg transition-colors"
                style={{ color: 'var(--app-sub)' }}
                aria-label="Notificaciones"
            >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center leading-none">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Panel desplegable */}
            {isOpen && (
                <div
                    className="absolute right-0 top-full mt-2 w-80 border rounded-2xl shadow-lg z-50 overflow-hidden"
                    style={{ background: 'var(--app-surface)', borderColor: 'var(--app-border)' }}
                >

                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: 'var(--app-border)' }}>
                        <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-sm" style={{ color: 'var(--app-white)' }}>
                                Notificaciones
                            </h3>
                            {unreadCount > 0 && (
                                <span className="text-xs px-1.5 py-0.5 rounded-full font-medium"
                                    style={{ background: 'rgba(251, 113, 133, .15)', color: 'var(--app-red)' }}>
                                    {unreadCount} nuevas
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-1">
                            {unreadCount > 0 && (
                                <button
                                    onClick={handleMarkAllAsRead}
                                    className="p-1.5 rounded-lg transition-colors"
                                    style={{ color: 'var(--app-muted)' }}
                                    title="Marcar todas como leídas"
                                >
                                    <CheckCheck className="w-4 h-4" />
                                </button>
                            )}
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-1.5 rounded-lg transition-colors"
                                style={{ color: 'var(--app-muted)' }}
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Lista */}
                    <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="py-10 text-center">
                                <Bell className="w-8 h-8 mx-auto mb-2" style={{ color: 'var(--app-border2)' }} />
                                <p className="text-sm" style={{ color: 'var(--app-muted)' }}>Sin notificaciones</p>
                            </div>
                        ) : (
                            <div>
                                {notifications.map(notification => (
                                    <NotificationItem
                                        key={notification.id}
                                        notification={notification}
                                        onMarkAsRead={handleMarkAsRead}
                                        onDelete={handleDelete}
                                        onClose={() => setIsOpen(false)}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    {notifications.length > 0 && (
                        <div className="border-t px-4 py-2.5 text-center" style={{ borderColor: 'var(--app-border)' }}>
                            <Link
                                href="/notifications"
                                className="text-xs font-medium hover:underline"
                                style={{ color: 'var(--app-accent)' }}
                                onClick={() => setIsOpen(false)}
                            >
                                Ver todas las notificaciones
                            </Link>
                        </div>
                    )}

                </div>
            )}
        </div>
    )
}

// ── Item individual ────────────────────────────────────────────
function NotificationItem({
    notification,
    onMarkAsRead,
    onDelete,
    onClose,
}: {
    notification: Notification
    onMarkAsRead: (id: string) => void
    onDelete: (id: string) => void
    onClose: () => void
}) {
    const icon = TYPE_ICON[notification.type] ?? '🔔'
    const colors = TYPE_COLOR[notification.type] ?? { bg: 'var(--app-surface2)', border: 'var(--app-border)' }

    const content = (
        <div
            className="flex items-start gap-3 px-4 py-3 border-b transition-colors"
            style={{
                borderColor: 'var(--app-border)',
                background: !notification.is_read ? 'rgba(99, 102, 241, .05)' : 'transparent',
            }}
        >
            {/* Icono */}
            <div
                className="w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 text-base"
                style={{ background: colors.bg, borderColor: colors.border }}
            >
                {icon}
            </div>

            {/* Texto */}
            <div className="flex-1 min-w-0">
                <p className="text-sm leading-snug" style={{
                    color: notification.is_read ? 'var(--app-sub)' : 'var(--app-white)',
                    fontWeight: notification.is_read ? 400 : 500,
                }}>
                    {notification.title}
                </p>
                <p className="text-xs mt-0.5 line-clamp-2" style={{ color: 'var(--app-muted)' }}>
                    {notification.body}
                </p>
                <p className="text-xs mt-1" style={{ color: 'var(--app-border2)' }}>
                    {formatDate(notification.created_at)}
                </p>
            </div>

            {/* Acciones */}
            <div className="flex flex-col gap-1 shrink-0">
                {!notification.is_read && (
                    <button
                        onClick={(e) => {
                            e.preventDefault()
                            onMarkAsRead(notification.id)
                        }}
                        className="p-1 transition-colors"
                        style={{ color: 'var(--app-muted)' }}
                        title="Marcar como leída"
                    >
                        <Check className="w-3.5 h-3.5" />
                    </button>
                )}
                <button
                    onClick={(e) => {
                        e.preventDefault()
                        onDelete(notification.id)
                    }}
                    className="p-1 transition-colors"
                    style={{ color: 'var(--app-muted)' }}
                    title="Eliminar"
                >
                    <Trash2 className="w-3.5 h-3.5" />
                </button>
            </div>

            {/* Punto de no leída */}
            {!notification.is_read && (
                <div className="w-2 h-2 rounded-full shrink-0 mt-1" style={{ background: 'var(--app-accent)' }} />
            )}
        </div>
    )

    // Si tiene grupo asociado, hacerlo clickeable
    if (notification.group_id) {
        return (
            <Link
                href={`/groups/${notification.group_id}`}
                onClick={onClose}
            >
                {content}
            </Link>
        )
    }

    return <div>{content}</div>
}