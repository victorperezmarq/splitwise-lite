// src/app/(dashboard)/groups/[groupId]/expenses/ExpenseModal.tsx
'use client'

import { X } from 'lucide-react'
import ExpenseForm from './ExpenseForm'
import type { GroupMember, Profile } from '@/types/database'

type Member = GroupMember & { profiles: Profile | null }

export default function ExpenseModal({
    isOpen,
    onClose,
    groupId,
    members,
    currentUserId,
}: {
    isOpen: boolean
    onClose: () => void
    groupId: string
    members: Member[]
    currentUserId: string
}) {
    if (!isOpen) return null

    return (
        <div
            className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center p-4 z-50"
            onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
        >
            <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">

                {/* Header sticky */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 sticky top-0 bg-white z-10 rounded-t-2xl">
                    <h2 className="font-semibold text-slate-900">Nuevo gasto</h2>
                    <button
                        onClick={onClose}
                        className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Formulario */}
                <div className="px-6 py-5">
                    <ExpenseForm
                        groupId={groupId}
                        members={members}
                        currentUserId={currentUserId}
                        onSuccess={onClose}
                    />
                </div>

            </div>
        </div>
    )
}