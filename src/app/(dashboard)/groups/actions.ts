'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

// ── CREAR GRUPO ────────────────────────────────────────────────
export async function createGroup(formData: FormData) {
    const supabase = await createClient()

    // Verificar que el usuario está autenticado
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'No autenticado' }

    const name = (formData.get('name') as string).trim()
    const description = (formData.get('description') as string).trim()

    if (name.length < 2) return { error: 'El nombre debe tener al menos 2 caracteres' }

    const { data: group, error } = await supabase
        .from('groups')
        .insert({ name, description: description || null, created_by: user.id })
        .select()
        .single()

    if (error) {
        console.error('Error creando grupo:', error)
        return { error: 'No se pudo crear el grupo. Inténtalo de nuevo.' }
    }

    // El trigger add_creator_as_admin() añade al creador automáticamente
    // así que no necesitamos insertar en group_members manualmente

    revalidatePath('/groups')
    redirect(`/groups/${group.id}`)
}

// ── UNIRSE A UN GRUPO ──────────────────────────────────────────
export async function joinGroup(formData: FormData) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'No autenticado' }

    const invite_code = (formData.get('invite_code') as string).trim().toUpperCase()

    if (invite_code.length !== 8) {
        return { error: 'El código de invitación tiene 8 caracteres' }
    }

    // Buscar el grupo por código
    const { data: group, error: groupError } = await supabase
        .from('groups')
        .select('id, name')
        .eq('invite_code', invite_code)
        .single()

    if (groupError || !group) {
        return { error: 'Código de invitación incorrecto o expirado' }
    }

    // Comprobar si ya es miembro
    const { data: existing } = await supabase
        .from('group_members')
        .select('id')
        .eq('group_id', group.id)
        .eq('user_id', user.id)
        .single()

    if (existing) {
        return { error: `Ya eres miembro de "${group.name}"` }
    }

    // Unirse al grupo
    const { error: joinError } = await supabase
        .from('group_members')
        .insert({ group_id: group.id, user_id: user.id, role: 'member' })

    if (joinError) {
        return { error: 'No se pudo unir al grupo. Inténtalo de nuevo.' }
    }

    revalidatePath('/groups')
    redirect(`/groups/${group.id}`)
}

// ── SALIR DE UN GRUPO ──────────────────────────────────────────
export async function leaveGroup(groupId: string) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: 'No autenticado' }

    // No permitir salir si eres el único admin
    const { data: admins } = await supabase
        .from('group_members')
        .select('id')
        .eq('group_id', groupId)
        .eq('role', 'admin')

    const { data: myMembership } = await supabase
        .from('group_members')
        .select('role')
        .eq('group_id', groupId)
        .eq('user_id', user.id)
        .single()

    if (myMembership?.role === 'admin' && admins && admins.length <= 1) {
        return { error: 'Eres el único admin. Transfiere el rol antes de salir.' }
    }

    const { error } = await supabase
        .from('group_members')
        .delete()
        .eq('group_id', groupId)
        .eq('user_id', user.id)

    if (error) return { error: 'No se pudo salir del grupo.' }

    revalidatePath('/groups')
    redirect('/groups')
}