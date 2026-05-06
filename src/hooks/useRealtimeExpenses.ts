// src/hooks/useRealtimeExpenses.ts
'use client'

import { useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'

type ExpensePayload = {
    id: string
    group_id: string
    paid_by: string
    title: string
    amount: number
    category: string
    created_at: string
}

export function useRealtimeExpenses({
    groupId,
    currentUserId,
    memberNames,
}: {
    groupId: string
    currentUserId: string
    memberNames: Record<string, string>
}) {
    const router = useRouter()

    const handleNewExpense = useCallback(
        (expense: ExpensePayload) => {
            // No notificarte si tú eres quien añadió el gasto
            if (expense.paid_by === currentUserId) return

            const payerName = memberNames[expense.paid_by] ?? 'Alguien'
            const euros = new Intl.NumberFormat('es-ES', {
                style: 'currency', currency: 'EUR',
            }).format(expense.amount)

            toast.info(`🧾 ${payerName} añadió "${expense.title}"`, {
                description: `${euros} · ${expense.category}`,
                duration: 5000,
            })

            router.refresh()
        },
        [currentUserId, memberNames, router]
    )

    useEffect(() => {
        const supabase = createClient()

        const channel = supabase
            .channel(`group-expenses-${groupId}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'expenses',
                    // Filtrar directamente por group_id en el servidor
                    filter: `group_id=eq.${groupId}`,
                },
                (payload) => {
                    handleNewExpense(payload.new as ExpensePayload)
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [groupId, handleNewExpense])
}