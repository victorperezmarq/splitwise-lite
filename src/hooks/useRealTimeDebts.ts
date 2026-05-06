// src/hooks/useRealtimeDebts.ts
'use client'

import { useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'

type DebtPaymentPayload = {
    id: string
    split_id: string
    from_user: string
    to_user: string
    amount: number
    paid_at: string
}

type UseRealtimeDebtsOptions = {
    groupId: string
    currentUserId: string
    // Mapa de userId → nombre para personalizar el toast
    memberNames: Record<string, string>
}

export function useRealtimeDebts({
    groupId,
    currentUserId,
    memberNames,
}: UseRealtimeDebtsOptions) {
    const router = useRouter()

    const handlePayment = useCallback(
        (payload: DebtPaymentPayload) => {
            const { from_user, to_user, amount } = payload

            // No notificarte a ti mismo si tú eres el que pagó
            if (from_user === currentUserId) return

            const payerName = memberNames[from_user] ?? 'Alguien'
            const euros = new Intl.NumberFormat('es-ES', {
                style: 'currency', currency: 'EUR',
            }).format(amount)

            // Si te pagan a ti
            if (to_user === currentUserId) {
                toast.success(`💸 ${payerName} te ha pagado ${euros}`, {
                    duration: 6000,
                    description: 'Tu saldo ha sido actualizado',
                })
            } else {
                // Pago entre otros miembros del grupo
                const receiverName = memberNames[to_user] ?? 'alguien'
                toast.info(`${payerName} pagó ${euros} a ${receiverName}`, {
                    duration: 4000,
                })
            }

            // Refrescar los datos de la página automáticamente
            router.refresh()
        },
        [currentUserId, memberNames, router]
    )

    useEffect(() => {
        const supabase = createClient()

        // Suscribirse a INSERTs en debt_payments filtrado por el grupo
        // Supabase Realtime permite filtrar por columna con eq()
        // NOTA: para filtrar por group_id necesitamos un JOIN, así que
        // filtramos en el cliente comparando los user_ids del grupo
        const channel = supabase
            .channel(`group-payments-${groupId}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'debt_payments',
                },
                (payload) => {
                    const payment = payload.new as DebtPaymentPayload

                    // Filtrar: solo nos interesan pagos entre miembros de ESTE grupo
                    // memberNames contiene los IDs de todos los miembros
                    const isGroupPayment =
                        payment.from_user in memberNames ||
                        payment.to_user in memberNames

                    if (isGroupPayment) {
                        handlePayment(payment)
                    }
                }
            )
            .subscribe((status) => {
                if (status === 'SUBSCRIBED') {
                    console.log(`✓ Realtime conectado al grupo ${groupId}`)
                }
                if (status === 'CHANNEL_ERROR') {
                    console.error('Error en el canal Realtime')
                }
            })

        // Cleanup: desuscribirse al desmontar el componente
        return () => {
            supabase.removeChannel(channel)
        }
    }, [groupId, handlePayment, memberNames])
}