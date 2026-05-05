// src/app/(dashboard)/groups/[groupId]/expenses/ExpenseForm.tsx
'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { createExpense } from './actions'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import FileInput from '@/components/ui/FileInput'
import type { GroupMember, Profile } from '@/types/database'

const CATEGORIES = [
    { value: 'comida', label: '🍽️ Comida' },
    { value: 'transporte', label: '🚕 Transporte' },
    { value: 'ocio', label: '🎭 Ocio' },
    { value: 'hogar', label: '🏠 Hogar' },
    { value: 'servicios', label: '⚡ Servicios' },
    { value: 'otros', label: '📦 Otros' },
]

type Member = GroupMember & { profiles: Profile | null }

export default function ExpenseForm({
    groupId,
    members,
    currentUserId,
    onSuccess,
}: {
    groupId: string
    members: Member[]
    currentUserId: string
    onSuccess?: () => void
}) {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(false)
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [selectedMembers, setSelectedMembers] = useState<Set<string>>(
        // Por defecto todos seleccionados
        new Set(members.map(m => m.user_id))
    )
    const [receiptFile, setReceiptFile] = useState<File | null>(null)

    function toggleMember(userId: string) {
        setSelectedMembers(prev => {
            const next = new Set(prev)
            if (next.has(userId)) {
                next.delete(userId)
            } else {
                next.add(userId)
            }
            return next
        })
    }

    // Leer File como base64
    async function fileToBase64(file: File): Promise<string> {
        return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.onload = () => {
                const result = reader.result as string
                // Quitar el prefijo "data:image/png;base64,"
                resolve(result.split(',')[1])
            }
            reader.onerror = reject
            reader.readAsDataURL(file)
        })
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setErrors({})

        const form = e.currentTarget
        const formData = new FormData(form)
        const title = (formData.get('title') as string).trim()
        const amount = parseFloat(formData.get('amount') as string)
        const category = formData.get('category') as string

        // ── Validación cliente ────────────────────────────────
        const newErrors: Record<string, string> = {}
        if (title.length < 2) newErrors.title = 'Mínimo 2 caracteres'
        if (isNaN(amount) || amount <= 0) newErrors.amount = 'Introduce una cantidad válida'
        if (selectedMembers.size === 0) newErrors.members = 'Selecciona al menos una persona'

        if (receiptFile && receiptFile.size > 5 * 1024 * 1024) {
            newErrors.file = 'El archivo es demasiado grande (máx. 5MB)'
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            return
        }

        setIsLoading(true)

        // ── Preparar archivo ──────────────────────────────────
        let receiptPayload: { base64: string; fileName: string; mimeType: string } | null = null

        if (receiptFile) {
            const base64 = await fileToBase64(receiptFile)
            receiptPayload = {
                base64,
                fileName: receiptFile.name,
                mimeType: receiptFile.type,
            }
        }

        // ── Llamar Server Action ──────────────────────────────
        const result = await createExpense({
            groupId,
            title,
            amount,
            category,
            splitUserIds: Array.from(selectedMembers),
            receiptFile: receiptPayload,
        })

        if (result.error) {
            toast.error(result.error)
            setErrors({ general: result.error })
            setIsLoading(false)
            return
        }

        toast.success('¡Gasto registrado!')
        router.refresh()
        onSuccess?.()
    }

    // Precio por persona (preview en tiempo real)
    const amountInput = parseFloat(
        (typeof document !== 'undefined'
            ? (document.querySelector('input[name="amount"]') as HTMLInputElement)?.value
            : '0') || '0'
    )
    const splitPreview = selectedMembers.size > 0
        ? (amountInput / selectedMembers.size).toFixed(2)
        : '0.00'

    return (
        <form onSubmit={handleSubmit} className="space-y-5">

            {/* Título */}
            <Input
                label="¿Qué compraste?"
                name="title"
                type="text"
                placeholder="Compra supermercado, Cena pizzería..."
                error={errors.title}
                autoFocus
                required
            />

            {/* Cantidad + Categoría */}
            <div className="grid grid-cols-2 gap-4">
                <Input
                    label="Cantidad (€)"
                    name="amount"
                    type="number"
                    step="0.01"
                    min="0.01"
                    placeholder="0.00"
                    error={errors.amount}
                    required
                />
                <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-slate-700">
                        Categoría
                    </label>
                    <select
                        name="category"
                        defaultValue="otros"
                        className="w-full px-3 py-2 text-sm rounded-lg border border-slate-200 hover:border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors bg-white"
                    >
                        {CATEGORIES.map(cat => (
                            <option key={cat.value} value={cat.value}>
                                {cat.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Ticket */}
            <FileInput
                label="Ticket / factura"
                error={errors.file}
                onChange={(e) => setReceiptFile(e.target.files?.[0] || null)}
                preview={receiptFile?.name}
            />

            {/* Selección de miembros */}
            <div>
                <div className="flex items-center justify-between mb-2">
                    <p className="text-sm font-medium text-slate-700">
                        ¿Quién comparte este gasto?
                    </p>
                    <button
                        type="button"
                        onClick={() =>
                            setSelectedMembers(
                                selectedMembers.size === members.length
                                    ? new Set()
                                    : new Set(members.map(m => m.user_id))
                            )
                        }
                        className="text-xs text-blue-600 hover:underline"
                    >
                        {selectedMembers.size === members.length
                            ? 'Deseleccionar todos'
                            : 'Seleccionar todos'}
                    </button>
                </div>

                {errors.members && (
                    <p className="text-xs text-red-500 mb-2">⚠ {errors.members}</p>
                )}

                <div className="space-y-1 bg-slate-50 rounded-lg p-3 max-h-44 overflow-y-auto">
                    {members.map(member => (
                        <label
                            key={member.id}
                            className="flex items-center gap-3 px-2 py-2 rounded-lg cursor-pointer hover:bg-white transition-colors"
                        >
                            <input
                                type="checkbox"
                                checked={selectedMembers.has(member.user_id)}
                                onChange={() => toggleMember(member.user_id)}
                                className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                            />
                            {/* Avatar inicial */}
                            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shrink-0">
                                <span className="text-white text-xs font-medium">
                                    {member.profiles?.full_name?.[0]?.toUpperCase() ?? '?'}
                                </span>
                            </div>
                            <span className="text-sm text-slate-700 flex-1">
                                {member.profiles?.full_name ?? 'Usuario'}
                                {member.user_id === currentUserId && (
                                    <span className="text-slate-400 ml-1">(tú)</span>
                                )}
                            </span>
                        </label>
                    ))}
                </div>

                {/* Preview del split */}
                {selectedMembers.size > 0 && (
                    <p className="text-xs text-slate-400 mt-2 text-right">
                        Aprox. <span className="font-medium text-slate-600">€{splitPreview}</span> por persona
                    </p>
                )}
            </div>

            {errors.general && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
                    {errors.general}
                </div>
            )}

            <Button
                type="submit"
                isLoading={isLoading}
                size="lg"
                className="w-full"
            >
                {isLoading ? 'Creando gasto...' : 'Registrar gasto'}
            </Button>
        </form>
    )
}