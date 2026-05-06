// src/app/(dashboard)/groups/[groupId]/debts/actions.ts
'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

// Liquida todos los splits pendientes entre dos usuarios en un grupo
// Llama a la función SQL settle_split() que creamos en la Fase 2
export async function settleDebt(splitIds: string[], groupId: string) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'No autenticado' }

    // Liquidar cada split individualmente usando la función transaccional
    for (const splitId of splitIds) {
        const { error } = await supabase.rpc('settle_split', {
            p_split_id: splitId,
            p_from_user: user.id,
        })

        if (error) {
            console.error('Error liquidando split:', error)
            return { error: `Error al liquidar: ${error.message}` }
        }
    }

    revalidatePath(`/groups/${groupId}`)
    revalidatePath(`/groups/${groupId}/debts`)
    return { success: true }
}