'use client'

import { useState } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import { register } from '../actions'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

export default function RegisterPage() {
    const [isLoading, setIsLoading] = useState(false)
    const [errors, setErrors] = useState<Record<string, string>>({})

    function validate(formData: FormData): boolean {
        const newErrors: Record<string, string> = {}
        const password = formData.get('password') as string
        const full_name = formData.get('full_name') as string
        const email = formData.get('email') as string

        if (full_name.trim().length < 2) {
            newErrors.full_name = 'El nombre debe tener al menos 2 caracteres'
        }
        if (password.length < 6) {
            newErrors.password = 'La contraseña debe tener al menos 6 caracteres'
        }
        if (!email.includes('@')) {
            newErrors.email = 'Email inválido'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)

        if (!validate(formData)) return

        setIsLoading(true)
        setErrors({})

        try {
            const result = await register(formData)

            if (result?.error) {
                console.error('Registration failed:', result.error)
                toast.error(result.error)
                setErrors({ general: result.error })
                setIsLoading(false)
                return
            }

            // Si no hay error, register() redirige automáticamente
            toast.success('¡Cuenta creada! Redirigiendo...')
        } catch (err) {
            console.error('Unexpected error:', err)
            toast.error('Error inesperado. Inténtalo de nuevo.')
            setIsLoading(false)
        }
    }

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
            <div className="mb-6">
                <h2 className="text-xl font-semibold text-slate-900">Crea tu cuenta</h2>
                <p className="text-sm text-slate-500 mt-1">Empieza a gestionar gastos compartidos</p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <Input
                    label="Nombre completo"
                    name="full_name"
                    type="text"
                    placeholder="Ana García"
                    autoComplete="name"
                    error={errors.full_name}
                    required
                />
                <Input
                    label="Email"
                    name="email"
                    type="email"
                    placeholder="tu@email.com"
                    autoComplete="email"
                    error={errors.email}
                    required
                />
                <Input
                    label="Contraseña"
                    name="password"
                    type="password"
                    placeholder="Mínimo 6 caracteres"
                    autoComplete="new-password"
                    error={errors.password}
                    hint="Mínimo 6 caracteres"
                    required
                />

                {errors.general && (
                    <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
                        {errors.general}
                    </div>
                )}

                <Button type="submit" isLoading={isLoading} size="lg" className="mt-2 w-full">
                    {isLoading ? 'Creando cuenta...' : 'Crear cuenta'}
                </Button>
            </form>

            <p className="text-center text-sm text-slate-500 mt-6">
                ¿Ya tienes cuenta?{' '}
                <Link href="/login" className="text-blue-600 font-medium hover:underline">
                    Inicia sesión
                </Link>
            </p>
        </div>
    )
}