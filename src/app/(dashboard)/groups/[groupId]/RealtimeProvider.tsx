// src/app/(dashboard)/groups/[groupId]/RealtimeProvider.tsx
'use client'

import { useRealtimeDebts } from '@/hooks/useRealtimeDebts'
import { useRealtimeExpenses } from '@/hooks/useRealtimeExpenses'

type Props = {
    groupId: string
    currentUserId: string
    // Pasamos los nombres de los miembros desde el Server Component
    memberNames: Record<string, string>
}

export default function RealtimeProvider({
    groupId,
    currentUserId,
    memberNames,
}: Props) {
    // Activar ambas suscripciones Realtime
    useRealtimeDebts({
        groupId,
        currentUserId,
        memberNames,
    })

    useRealtimeExpenses({
        groupId,
        currentUserId,
        memberNames,
    })

    // Este componente no renderiza nada visible
    // Solo gestiona las suscripciones WebSocket
    return null
}