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

const TYPE_COLOR: Record<string, string> = {
    expense_added: 'bg-blue-50 border-blue-100',
    debt_settled: 'bg-green-50 border-green-100',
    group_joined: 'bg-purple-50 border-purple-100',
    debt_reminder: 'bg-orange-50 border-orange-100',
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
                className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
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
                <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-slate-200 rounded-2xl shadow-lg z-50 overflow-hidden">

                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                        <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-slate-900 text-sm">
                                Notificaciones
                            </h3>
                            {unreadCount > 0 && (
                                <span className="text-xs bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full font-medium">
                                    {unreadCount} nuevas
                                </span>
                            )}
                        </div>
                        <div className="flex items-center gap-1">
                            {unreadCount > 0 && (
                                <button
                                    onClick={handleMarkAllAsRead}
                                    className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                    title="Marcar todas como leídas"
                                >
                                    <CheckCheck className="w-4 h-4" />
                                </button>
                            )}
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Lista */}
                    <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <div className="py-10 text-center">
                                <Bell className="w-8 h-8 text-slate-200 mx-auto mb-2" />
                                <p className="text-sm text-slate-400">Sin notificaciones</p>
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
                        <div className="border-t border-slate-100 px-4 py-2.5 text-center">
                            <Link
                                href="/notifications"
                                className="text-xs text-blue-600 hover:underline font-medium"
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
    const colorClass = TYPE_COLOR[notification.type] ?? 'bg-slate-50 border-slate-100'

    const content = (
        <div
            className={`flex items-start gap-3 px-4 py-3 border-b border-slate-50 transition-colors hover:bg-slate-50 ${!notification.is_read ? 'bg-blue-50/40' : ''
                }`}
        >
            {/* Icono */}
            <div className={`w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 text-base ${colorClass}`}>
                {icon}
            </div>

            {/* Texto */}
            <div className="flex-1 min-w-0">
                <p className={`text-sm leading-snug ${notification.is_read ? 'text-slate-600' : 'text-slate-900 font-medium'}`}>
                    {notification.title}
                </p>
                <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">
                    {notification.body}
                </p>
                <p className="text-xs text-slate-300 mt-1">
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
                        className="p-1 text-slate-300 hover:text-blue-500 transition-colors"
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
                    className="p-1 text-slate-300 hover:text-red-400 transition-colors"
                    title="Eliminar"
                >
                    <Trash2 className="w-3.5 h-3.5" />
                </button>
            </div>

            {/* Punto de no leída */}
            {!notification.is_read && (
                <div className="w-2 h-2 bg-blue-500 rounded-full shrink-0 mt-1" />
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