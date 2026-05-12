// src/hooks/useRealtimeNotifications.ts
'use client'

import { useEffect, useCallback } from 'react'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'
import type { Notification } from '@/types/database'

const TYPE_ICON: Record<string, string> = {
    expense_added: '🧾',
    debt_settled: '💸',
    group_joined: '👋',
    debt_reminder: '⏰',
}

export function useRealtimeNotifications({
    userId,
    onNewNotification,
}: {
    userId: string
    onNewNotification?: (n: Notification) => void
}) {
    const handleNotification = useCallback(
        (notification: Notification) => {
            const icon = TYPE_ICON[notification.type] ?? '🔔'

            // Toast con el icono según el tipo
            if (notification.type === 'debt_settled') {
                toast.success(`${icon} ${notification.title}`, {
                    description: notification.body,
                    duration: 6000,
                })
            } else {
                toast.info(`${icon} ${notification.title}`, {
                    description: notification.body,
                    duration: 5000,
                })
            }

            onNewNotification?.(notification)
        },
        [onNewNotification]
    )

    useEffect(() => {
        const supabase = createClient()

        const channel = supabase
            .channel(`notifications-${userId}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'notifications',
                    filter: `user_id=eq.${userId}`,
                },
                (payload) => handleNotification(payload.new as Notification)
            )
            .subscribe()

        return () => { supabase.removeChannel(channel) }
    }, [userId, handleNotification])
}