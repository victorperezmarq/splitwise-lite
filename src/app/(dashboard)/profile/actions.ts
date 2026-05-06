// src/app/(dashboard)/profile/actions.ts
'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

// ── Actualizar nombre ──────────────────────────────────────
export async function updateProfile(formData: FormData) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'No autenticado' }

    const full_name = (formData.get('full_name') as string).trim()

    if (full_name.length < 2) {
        return { error: 'El nombre debe tener al menos 2 caracteres' }
    }

    const { error } = await supabase
        .from('profiles')
        .update({ full_name })
        .eq('id', user.id)

    if (error) {
        console.error('Error updating profile:', error)
        return { error: 'No se pudo actualizar el perfil' }
    }

    revalidatePath('/', 'layout')
    return { success: true }
}

// ── Actualizar avatar ──────────────────────────────────────
export async function updateAvatar(data: {
    base64: string
    fileName: string
    mimeType: string
}) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'No autenticado' }

    // Convertir base64 a bytes
    const binaryStr = atob(data.base64)
    const bytes = new Uint8Array(binaryStr.length)
    for (let i = 0; i < binaryStr.length; i++) {
        bytes[i] = binaryStr.charCodeAt(i)
    }

    // Siempre el mismo nombre para sobreescribir el anterior
    const filePath = `${user.id}/avatar`

    const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, bytes, {
            contentType: data.mimeType,
            upsert: true, // sobreescribe si ya existe
        })

    if (uploadError) {
        console.error('Avatar upload error:', uploadError)
        return { error: 'No se pudo subir la imagen' }
    }

    // Obtener URL pública — añadimos timestamp para evitar caché
    const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath)

    const avatarUrl = `${urlData.publicUrl}?t=${Date.now()}`

    // Guardar URL en el perfil
    const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: avatarUrl })
        .eq('id', user.id)

    if (updateError) {
        return { error: 'No se pudo actualizar el perfil' }
    }

    revalidatePath('/', 'layout')
    return { success: true, avatarUrl }
}

// ── Cambiar contraseña ─────────────────────────────────────
export async function updatePassword(formData: FormData) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'No autenticado' }

    const newPassword = formData.get('new_password') as string
    const confirmPassword = formData.get('confirm_password') as string

    if (newPassword.length < 6) {
        return { error: 'La contraseña debe tener al menos 6 caracteres' }
    }

    if (newPassword !== confirmPassword) {
        return { error: 'Las contraseñas no coinciden' }
    }

    const { error } = await supabase.auth.updateUser({
        password: newPassword,
    })

    if (error) {
        console.error('Password update error:', error)
        return { error: 'No se pudo cambiar la contraseña' }
    }

    return { success: true }
}

// ── Eliminar cuenta ────────────────────────────────────────
export async function deleteAccount() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'No autenticado' }

    // Cerrar sesión primero
    await supabase.auth.signOut()

    // Nota: la eliminación real del usuario de auth.users
    // requiere permisos de service_role — aquí solo cerramos sesión
    // Para producción usar Supabase Admin API con service key
    revalidatePath('/', 'layout')
    return { success: true }
}