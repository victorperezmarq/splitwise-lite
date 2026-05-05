// src/app/(dashboard)/groups/[groupId]/expenses/actions.ts
'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function createExpense(formData: {
    groupId: string
    title: string
    amount: number
    category: string
    splitUserIds: string[]
    receiptFile?: {
        base64: string
        fileName: string
        mimeType: string
    } | null
}) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'No autenticado' }

    let receiptUrl: string | null = null

    if (formData.receiptFile) {
        const { base64, fileName, mimeType } = formData.receiptFile
        const filePath = `${user.id}/${Date.now()}-${fileName}`

        // Convertir base64 a Uint8Array para subirlo
        const binaryStr = atob(base64)
        const bytes = new Uint8Array(binaryStr.length)
        for (let i = 0; i < binaryStr.length; i++) {
            bytes[i] = binaryStr.charCodeAt(i)
        }

        const { error: uploadError } = await supabase.storage
            .from('receipts')
            .upload(filePath, bytes, { contentType: mimeType })

        if (uploadError) {
            console.error('Upload error:', uploadError)
            // No bloqueamos — creamos el gasto sin ticket
        } else {
            const { data: urlData } = supabase.storage
                .from('receipts')
                .getPublicUrl(filePath)
            receiptUrl = urlData.publicUrl
        }
    }

    const { data, error } = await supabase.rpc('create_expense_with_splits', {
        p_group_id: formData.groupId,
        p_paid_by: user.id,
        p_title: formData.title,
        p_amount: formData.amount,
        p_category: formData.category,
        p_split_user_ids: formData.splitUserIds,
        p_receipt_url: receiptUrl,
    })

    if (error) {
        console.error('RPC error:', error)
        return { error: `No se pudo crear el gasto: ${error.message}` }
    }

    revalidatePath(`/groups/${formData.groupId}`)
    return { success: true, expense: data }
}