// src/app/(dashboard)/groups/[groupId]/debts/RealtimeDebts.tsx
'use client'

import { useRealtimeDebts } from '@/hooks/useRealtimeDebts'

export default function RealtimeDebts({
    groupId,
    currentUserId,
    memberNames,
}: {
    groupId: string
    currentUserId: string
    memberNames: Record<string, string>
}) {
    useRealtimeDebts({ groupId, currentUserId, memberNames })
    return null
}