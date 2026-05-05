// src/app/(dashboard)/groups/new/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { createGroup } from '../actions'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

const GROUP_TYPES = [
    { emoji: '🏠', label: 'Piso compartido' },
    { emoji: '✈️', label: 'Viaje' },
    { emoji: '🍽️', label: 'Cena / evento' },
    { emoji: '🎓', label: 'Universidad' },
]

export default function NewGroupPage() {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [selectedType, setSelectedType] = useState<string | null>(null)

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setIsLoading(true)
        setError(null)

        const formData = new FormData(e.currentTarget)

        // Añadir el tipo seleccionado como parte del nombre si se eligió
        if (selectedType) {
            const currentName = formData.get('name') as string
            if (!currentName.includes(selectedType)) {
                // No modificamos el nombre, el tipo es solo visual
            }
        }

        const result = await createGroup(formData)

        if (result?.error) {
            setError(result.error)
            toast.error(result.error)
            setIsLoading(false)
        }
        // Si no hay error, createGroup redirige al nuevo grupo
    }

    return (
        <div className="max-w-lg mx-auto">

            {/* Breadcrumb */}
            <Link
                href="/groups"
                className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-6 transition-colors"
            >
                <ArrowLeft className="w-4 h-4" />
                Volver a grupos
            </Link>

            <div className="bg-white border border-slate-200 rounded-2xl p-8">
                <h1 className="text-xl font-semibold text-slate-900 mb-1">Crear nuevo grupo</h1>
                <p className="text-sm text-slate-500 mb-6">
                    Comparte el código de invitación con tu gente para que se unan
                </p>

                {/* Selector de tipo (solo visual, ayuda a elegir nombre) */}
                <div className="mb-6">
                    <p className="text-sm font-medium text-slate-700 mb-2">¿Qué tipo de grupo es?</p>
                    <div className="grid grid-cols-2 gap-2">
                        {GROUP_TYPES.map(({ emoji, label }) => (
                            <button
                                key={label}
                                type="button"
                                onClick={() => setSelectedType(label)}
                                className={`flex items-center gap-2 px-3 py-2.5 rounded-lg border text-sm transition-all ${selectedType === label
                                        ? 'border-blue-500 bg-blue-50 text-blue-700 font-medium'
                                        : 'border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                                    }`}
                            >
                                <span className="text-lg">{emoji}</span>
                                {label}
                            </button>
                        ))}
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <Input
                        label="Nombre del grupo"
                        name="name"
                        type="text"
                        placeholder={selectedType ?? 'Piso de la calle Gran Vía'}
                        required
                        autoFocus
                    />
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-slate-700">
                            Descripción <span className="text-slate-400 font-normal">(opcional)</span>
                        </label>
                        <textarea
                            name="description"
                            rows={3}
                            placeholder="Una descripción breve del grupo..."
                            className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none placeholder:text-slate-400"
                        />
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
                            {error}
                        </div>
                    )}

                    <Button type="submit" isLoading={isLoading} size="lg" className="w-full mt-2">
                        {isLoading ? 'Creando grupo...' : 'Crear grupo'}
                    </Button>
                </form>
            </div>
        </div>
    )
}