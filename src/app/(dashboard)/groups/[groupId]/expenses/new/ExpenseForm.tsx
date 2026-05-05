// src/app/(dashboard)/groups/[groupId]/expenses/ExpenseForm.tsx
'use client'

import { useState, useRef } from 'react'
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
}: {
    groupId: string
    members: Member[]
    currentUserId: string
}) {
    const [isLoading, setIsLoading] = useState(false)
    const [errors, setErrors] = useState<Record<string, string>>({})
    const [selectedMembers, setSelectedMembers] = useState<Set<string>>(new Set())
    const [fileName, setFileName] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    // Seleccionar/deseleccionar miembros para el split
    function toggleMember(userId: string) {
        const newSelected = new Set(selectedMembers)
        if (newSelected.has(userId)) {
            newSelected.delete(userId)
        } else {
            newSelected.add(userId)
        }
        setSelectedMembers(newSelected)
    }

    // Validar archivo (máx 5MB)
    function validateFile(file: File): string | null {
        const maxSize = 5 * 1024 * 1024 // 5MB
        if (file.size > maxSize) return 'El archivo es demasiado grande (máx. 5MB)'
        if (!['application/pdf', 'image/jpeg', 'image/png'].includes(file.type)) {
            return 'Solo se permiten PDF, JPG o PNG'
        }
        return null
    }

    // Leer archivo como base64
    async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.currentTarget.files?.[0]
        if (!file) return

        const error = validateFile(file)
        if (error) {
            toast.error(error)
            setErrors({ file: error })
            return
        }

        setFileName(file.name)
        setErrors(e => ({ ...e, file: '' }))
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        setIsLoading(true)
        setErrors({})

        const formData = new FormData(e.currentTarget)
        const title = (formData.get('title') as string).trim()
        const amount = parseFloat(formData.get('amount') as string)
        const category = formData.get('category') as string

        // ── Validaciones ──────────────────────────────────────────
        const newErrors: Record<string, string> = {}

        if (title.length < 3) newErrors.title = 'Mínimo 3 caracteres'
        if (isNaN(amount) || amount <= 0) newErrors.amount = 'Cantidad válida requerida'
        if (selectedMembers.size === 0) {
            newErrors.members = 'Selecciona al menos una persona'
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors)
            setIsLoading(false)
            return
        }

        // ── Preparar archivo ──────────────────────────────────────
        let receiptFile: { base64: string; fileName: string; mimeType: string } | undefined

        if (fileInputRef.current?.files?.[0]) {
            const file = fileInputRef.current.files[0]
            const reader = new FileReader()

            await new Promise((resolve, reject) => {
                reader.onload = resolve
                reader.onerror = reject
                reader.readAsArrayBuffer(file)
            })

            const arrayBuffer = reader.result as ArrayBuffer
            const bytes = new Uint8Array(arrayBuffer)
            const base64 = btoa(String.fromCharCode(...bytes))

            receiptFile = {
                base64,
                fileName: file.name,
                mimeType: file.type,
            }
        }

        // ── Llamar Server Action ──────────────────────────────────
        const result = await createExpense({
            groupId,
            title,
            amount,
            category,
            splitUserIds: Array.from(selectedMembers),
            receiptFile,
        })

        if (result.error) {
            toast.error(result.error)
            setErrors({ general: result.error })
            setIsLoading(false)
            return
        }

        toast.success('Gasto creado exitosamente')
        // Limpiar formulario
        e.currentTarget.reset()
        setSelectedMembers(new Set())
        setFileName(null)
    }

    return (
        <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-2xl p-6">
            <h2 className="font-semibold text-slate-900 mb-6">Registrar nuevo gasto</h2>

            <div className="space-y-5">
                {/* Título */}
                <Input
                    label="¿Qué compraste?"
                    name="title"
                    type="text"
                    placeholder="Ej: Compra en el supermercado"
                    error={errors.title}
                    required
                />

                {/* Cantidad */}
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

                    {/* Categoría */}
                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium text-slate-700">Categoría</label>
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

                {/* Ticket (opcional) */}
                <FileInput
                    ref={fileInputRef}
                    label="Ticket/factura (opcional)"
                    onChange={handleFileChange}
                    error={errors.file}
                    preview={fileName}
                    hint="Sube una foto o PDF del ticket"
                />

                {/* Seleccionar miembros para split */}
                <div>
                    <p className="text-sm font-medium text-slate-700 mb-3">
                        ¿Quién comparte este gasto?
                    </p>
                    {errors.members && (
                        <p className="text-xs text-red-500 mb-2">⚠ {errors.members}</p>
                    )}
                    <div className="space-y-2 bg-slate-50 rounded-lg p-3 max-h-48 overflow-y-auto">
                        {members.map(member => (
                            <label
                                key={member.id}
                                className="flex items-center gap-3 p-2 rounded cursor-pointer hover:bg-white transition-colors"
                            >
                                <input
                                    type="checkbox"
                                    checked={selectedMembers.has(member.user_id)}
                                    onChange={() => toggleMember(member.user_id)}
                                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                />
                                <span className="text-sm text-slate-700 flex-1">
                                    {member.profiles?.full_name ?? 'Usuario'}
                                    {member.user_id === currentUserId && (
                                        <span className="text-slate-400 font-normal ml-1">(tú)</span>
                                    )}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>

                {errors.general && (
                    <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
                        {errors.general}
                    </div>
                )}

                <Button type="submit" isLoading={isLoading} size="lg" className="w-full mt-6">
                    {isLoading ? 'Creando gasto...' : 'Crear gasto'}
                </Button>
            </div>
        </form>
    )
}