// src/hooks/useUser.ts
'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { User } from '@supabase/supabase-js'

export function useUser() {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const supabase = createClient()

        // Obtener sesión actual
        supabase.auth.getUser().then(({ data: { user } }) => {
            setUser(user)
            setLoading(false)
        })

        // Suscribirse a cambios de sesión (login, logout, refresh)
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                setUser(session?.user ?? null)
                setLoading(false)
            }
        )

        // Cleanup: cancelar suscripción al desmontar el componente
        return () => subscription.unsubscribe()
    }, [])

    return { user, loading }
}