// src/app/(auth)/login/page.tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import { login } from '../actions'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setIsLoading(true)
        setError(null)

        const formData = new FormData(e.currentTarget)
        const result = await login(formData)

        // Si hay error, lo mostramos (si no, el Server Action redirige solo)
        if (result?.error) {
            setError(result.error)
            toast.error(result.error)
            setIsLoading(false)
        }
    }

    return (
        <div className="rounded-2xl border p-8" style={{ background: 'var(--app-surface)', borderColor: 'var(--app-border)' }}>
            <div className="mb-6">
                <h2 className="text-xl font-semibold" style={{ color: 'var(--app-white)' }}>Bienvenido de vuelta</h2>
                <p className="text-sm mt-1" style={{ color: 'var(--app-sub)' }}>Inicia sesión en tu cuenta</p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <Input
                    label="Email"
                    name="email"
                    type="email"
                    placeholder="tu@email.com"
                    autoComplete="email"
                    required
                />
                <Input
                    label="Contraseña"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    autoComplete="current-password"
                    required
                />

                {error && (
                    <div className="text-sm px-4 py-3 rounded-lg" style={{ background: 'rgba(251, 113, 133, .1)', border: '1px solid rgba(251, 113, 133, .2)', color: 'var(--app-red)' }}>
                        {error}
                    </div>
                )}

                <Button type="submit" isLoading={isLoading} size="lg" className="mt-2 w-full">
                    {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
                </Button>
            </form>

            <p className="text-center text-sm mt-6" style={{ color: 'var(--app-sub)' }}>
                ¿No tienes cuenta?{' '}
                <Link href="/register" className="font-medium hover:underline" style={{ color: 'var(--app-accent)' }}>
                    Regístrate gratis
                </Link>
            </p>
        </div>
    )
}