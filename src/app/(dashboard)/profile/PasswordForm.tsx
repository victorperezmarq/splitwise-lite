// src/app/(dashboard)/profile/PasswordForm.tsx
'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Eye, EyeOff } from 'lucide-react'
import { updatePassword } from './actions'
import Button from '@/components/ui/Button'
import { cn } from '@/lib/utils'

export default function PasswordForm() {
    const [isLoading, setIsLoading] = useState(false)
    const [showNew, setShowNew] = useState(false)
    const [showConfirm, setShowConfirm] = useState(false)
    const [errors, setErrors] = useState<Record<string, string>>({})

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setErrors({})

        const formData = new FormData(e.currentTarget)
        const newPassword = formData.get('new_password') as string
        const confirmPassword = formData.get('confirm_password') as string

        // Validación cliente
        const newErrors: Record<string, string> = {}
        if (newPassword.length < 6) {
            newErrors.new_password = 'Mínimo 6 caracteres'
        }
        if (newPassword !== confirmPassword) {
            newErrors.confirm_password = 'Las contraseñas no coinciden'
        }
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            return
        }

        setIsLoading(true)
        const result = await updatePassword(formData)

        if (result.error) {
            toast.error(result.error)
            setErrors({ general: result.error })
        } else {
            toast.success('Contraseña actualizada correctamente')
            e.currentTarget.reset()
        }

        setIsLoading(false)
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">

            {/* Nueva contraseña */}
            <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-slate-700">
                    Nueva contraseña
                </label>
                <div className="relative">
                    <input
                        name="new_password"
                        type={showNew ? 'text' : 'password'}
                        placeholder="Mínimo 6 caracteres"
                        autoComplete="new-password"
                        required
                        className={cn(
                            'w-full px-3 py-2 pr-10 text-sm rounded-lg border transition-colors',
                            'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                            errors.new_password
                                ? 'border-red-400'
                                : 'border-slate-200 hover:border-slate-300'
                        )}
                    />
                    <button
                        type="button"
                        onClick={() => setShowNew(p => !p)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                        {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                </div>
                {errors.new_password && (
                    <p className="text-xs text-red-500">⚠ {errors.new_password}</p>
                )}
            </div>

            {/* Confirmar contraseña */}
            <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-slate-700">
                    Confirmar contraseña
                </label>
                <div className="relative">
                    <input
                        name="confirm_password"
                        type={showConfirm ? 'text' : 'password'}
                        placeholder="Repite la contraseña"
                        autoComplete="new-password"
                        required
                        className={cn(
                            'w-full px-3 py-2 pr-10 text-sm rounded-lg border transition-colors',
                            'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                            errors.confirm_password
                                ? 'border-red-400'
                                : 'border-slate-200 hover:border-slate-300'
                        )}
                    />
                    <button
                        type="button"
                        onClick={() => setShowConfirm(p => !p)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                        {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                </div>
                {errors.confirm_password && (
                    <p className="text-xs text-red-500">⚠ {errors.confirm_password}</p>
                )}
            </div>

            {errors.general && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
                    {errors.general}
                </div>
            )}

            <Button type="submit" isLoading={isLoading} variant="primary" size="md">
                Cambiar contraseña
            </Button>
        </form>
    )
}