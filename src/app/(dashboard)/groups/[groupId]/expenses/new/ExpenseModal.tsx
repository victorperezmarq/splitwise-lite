// src/app/(dashboard)/groups/[groupId]/expenses/ExpenseModal.tsx
'use client'

import { useState } from 'react'
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-200 sticky top-0 bg-white">
                    <h1 className="text-lg font-semibold text-slate-900">Nuevo gasto</h1>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Contenido */}
                <div className="p-6">
                    <ExpenseForm
                        groupId={groupId}
                        members={members}
                        currentUserId={currentUserId}
                    />
                </div>
            </div>
        </div>
    )
}