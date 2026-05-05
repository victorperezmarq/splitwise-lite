// src/app/(dashboard)/groups/[groupId]/expenses/actions.ts
'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

type CreateExpenseInput = {
    groupId: string
    title: string
    amount: number
    category: string
    splitUserIds: string[]
    receiptFile?: {
        base64: string
        fileName: string
        mimeType: string
    }
}

export async function createExpense(input: CreateExpenseInput) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'No autenticado' }

    // ── 1. Subir ticket a Storage (si lo hay) ───────────────────
    let receiptUrl: string | null = null

    if (input.receiptFile) {
        const fileName = `${Date.now()}-${input.receiptFile.fileName}`
        const filePath = `${user.id}/${fileName}`

        const { error: uploadError } = await supabase.storage
            .from('receipts')
            .upload(filePath, Buffer.from(input.receiptFile.base64, 'base64'), {
                contentType: input.receiptFile.mimeType,
                upsert: false,
            })

        if (uploadError) {
            console.error('Storage upload error:', uploadError)
            return { error: 'No se pudo subir el ticket. Inténtalo sin él.' }
        }

        // Obtener URL pública del archivo
        const { data } = supabase.storage
            .from('receipts')
            .getPublicUrl(filePath)

        receiptUrl = data?.publicUrl || null
    }

    // ── 2. Crear gasto + splits con función transaccional ──────
    const { data: expense, error: expenseError } = await supabase
        .rpc('create_expense_with_splits', {
            p_group_id: input.groupId,
            p_paid_by: user.id,
            p_title: input.title,
            p_amount: input.amount,
            p_category: input.category,
            p_split_user_ids: input.splitUserIds,
            p_receipt_url: receiptUrl,
        })

    if (expenseError) {
        console.error('Expense creation error:', expenseError)
        return { error: 'No se pudo crear el gasto. Inténtalo de nuevo.' }
    }

    revalidatePath(`/groups/${input.groupId}`)
    return { success: true, expense }
}