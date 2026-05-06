// src/app/(dashboard)/profile/ProfileForm.tsx
'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { updateProfile } from './actions'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

export default function ProfileForm({ fullName }: { fullName: string }) {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setIsLoading(true)
        setError(null)

        const formData = new FormData(e.currentTarget)
        const result = await updateProfile(formData)

        if (result.error) {
            setError(result.error)
            toast.error(result.error)
        } else {
            toast.success('Nombre actualizado correctamente')
        }

        setIsLoading(false)
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <Input
                label="Nombre completo"
                name="full_name"
                type="text"
                defaultValue={fullName}
                placeholder="Tu nombre"
                error={error ?? undefined}
                required
            />
            <Button
                type="submit"
                isLoading={isLoading}
                variant="primary"
                size="md"
            >
                Guardar nombre
            </Button>
        </form>
    )
}