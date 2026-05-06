// src/app/(dashboard)/profile/DeleteAccount.tsx
'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { Trash2 } from 'lucide-react'
import { logout } from '@/app/(auth)/actions'

export default function DeleteAccount() {
    const [showConfirm, setShowConfirm] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [confirmText, setConfirmText] = useState('')

    async function handleDelete() {
        if (confirmText !== 'ELIMINAR') {
            toast.error('Escribe ELIMINAR para confirmar')
            return
        }

        setIsLoading(true)
        // En producción aquí llamarías a una API con service_role
        // Por ahora simplemente cerramos sesión
        toast.info('Contacta con el administrador para eliminar la cuenta')
        setIsLoading(false)
        setShowConfirm(false)
    }

    if (!showConfirm) {
        return (
            <button
                onClick={() => setShowConfirm(true)}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
            >
                <Trash2 className="w-4 h-4" />
                Eliminar mi cuenta
            </button>
        )
    }

    return (
        <div className="space-y-3 bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="text-sm text-red-700 font-medium">
                ¿Estás seguro? Esta acción eliminará todos tus datos.
            </p>
            <p className="text-xs text-red-500">
                Escribe <strong>ELIMINAR</strong> para confirmar:
            </p>
            <input
                type="text"
                value={confirmText}
                onChange={e => setConfirmText(e.target.value)}
                placeholder="ELIMINAR"
                className="w-full px-3 py-2 text-sm border border-red-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400 bg-white"
            />
            <div className="flex gap-2">
                <button
                    onClick={handleDelete}
                    disabled={isLoading || confirmText !== 'ELIMINAR'}
                    className="px-4 py-2 text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-40 transition-colors"
                >
                    Confirmar eliminación
                </button>
                <button
                    onClick={() => {
                        setShowConfirm(false)
                        setConfirmText('')
                    }}
                    className="px-4 py-2 text-sm font-medium text-slate-600 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                >
                    Cancelar
                </button>
            </div>
        </div>
    )
}