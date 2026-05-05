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
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
            <div className="mb-6">
                <h2 className="text-xl font-semibold text-slate-900">Bienvenido de vuelta</h2>
                <p className="text-sm text-slate-500 mt-1">Inicia sesión en tu cuenta</p>
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
                    <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
                        {error}
                    </div>
                )}

                <Button type="submit" isLoading={isLoading} size="lg" className="mt-2 w-full">
                    {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
                </Button>
            </form>

            <p className="text-center text-sm text-slate-500 mt-6">
                ¿No tienes cuenta?{' '}
                <Link href="/register" className="text-blue-600 font-medium hover:underline">
                    Regístrate gratis
                </Link>
            </p>
        </div>
    )
}