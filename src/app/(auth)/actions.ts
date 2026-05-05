'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function login(formData: FormData) {
    const supabase = await createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
        console.error('Login error:', error.message)
        return { error: 'Email o contraseña incorrectos' }
    }

    revalidatePath('/', 'layout')
    redirect('/groups')
}

export async function register(formData: FormData) {
    const supabase = await createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const full_name = formData.get('full_name') as string

    console.log('Attempting to register:', email)

    const { error, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: { full_name },
            // En desarrollo, Supabase puede requerir confirmación de email
            // Desactívalo en tu dashboard: Authentication → Email → "Confirm email"
        },
    })

    if (error) {
        console.error('Register error:', error.message, error.status)
        if (error.message.includes('already registered')) {
            return { error: 'Este email ya está registrado' }
        }
        return { error: `Error al crear la cuenta: ${error.message}` }
    }

    console.log('Registration successful:', data.user?.id)

    revalidatePath('/', 'layout')
    redirect('/groups')
}

export async function logout() {
    const supabase = await createClient()
    await supabase.auth.signOut()
    revalidatePath('/', 'layout')
    redirect('/login')
}