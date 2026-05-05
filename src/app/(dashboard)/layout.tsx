// src/app/(dashboard)/layout.tsx
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Navbar from '@/components/Navbar'

export default async function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    // Este es un Server Component: podemos leer la sesión directamente
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // Segunda línea de defensa (el middleware ya redirige, pero por seguridad)
    if (!user) redirect('/login')

    // Obtenemos el perfil del usuario para mostrarlo en la navbar
    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    return (
        <div className="min-h-screen bg-slate-50">
            <Navbar profile={profile} />
            <main className="max-w-4xl mx-auto px-4 py-8">
                {children}
            </main>
        </div>
    )
}