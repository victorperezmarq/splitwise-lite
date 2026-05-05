// src/app/(dashboard)/groups/[groupId]/GroupActions.tsx
'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import ExpenseModal from './expenses/ExpenseModal'
import type { GroupMember, Profile } from '@/types/database'

type Member = GroupMember & { profiles: Profile | null }

export default function GroupActions({
  groupId,
  members,
  currentUserId,
}: {
  groupId: string
  members: Member[]
  currentUserId: string
}) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white font-medium py-3 rounded-xl hover:bg-blue-700 active:bg-blue-800 transition-colors"
      >
        <Plus className="w-4 h-4" />
        Registrar gasto
      </button>

      <ExpenseModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        groupId={groupId}
        members={members}
        currentUserId={currentUserId}
      />
    </>
  )
}