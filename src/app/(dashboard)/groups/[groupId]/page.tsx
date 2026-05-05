// src/app/(dashboard)/groups/[groupId]/page.tsx
'use client'

import { useState } from 'react'
import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Users, Copy, Receipt, TrendingUp, Plus } from 'lucide-react'
import { useEffect } from 'react'
import { CopyInviteButton } from './CopyInviteButton'
import ExpenseModal from './expenses/new/ExpenseModal'
import ExpenseList from './expenses/ExpenseList'
import type { GroupMember, Profile, Expense } from '@/types/database'

type Member = GroupMember & { profiles: Profile | null }
type ExpenseWithAuthor = Expense & { profiles: Profile }

export default function GroupPage({
    params,
}: {
    params: Promise<{ groupId: string }>
}) {
    const [groupId, setGroupId] = useState('')
    const [group, setGroup] = useState<any>(null)
    const [members, setMembers] = useState<Member[]>([])
    const [expenses, setExpenses] = useState<ExpenseWithAuthor[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [currentUser, setCurrentUser] = useState<string>('')

    useEffect(() => {
        const fetchData = async () => {
            const p = await params
            setGroupId(p.groupId)

            const supabase = createClient()
            const { data: { user } } = await supabase.auth.getUser()

            if (!user) return redirect('/login')
            setCurrentUser(user.id)

            // Obtener grupo con miembros
            const { data: groupData } = await supabase
                .from('groups')
                .select(`
          *,
          group_members (
            id,
            role,
            user_id,
            joined_at,
            profiles ( id, full_name, avatar_url )
          )
        `)
                .eq('id', p.groupId)
                .single()

            if (!groupData) {
                notFound()
            }

            // Verificar que es miembro
            const isMember = groupData.group_members.some((m: any) => m.user_id === user.id)
            if (!isMember) {
                redirect('/groups')
            }

            setGroup(groupData)
            setMembers(groupData.group_members)

            // Obtener gastos
            const { data: expensesData } = await supabase
                .from('expenses')
                .select(`
          *,
          profiles ( id, full_name, avatar_url )
        `)
                .eq('group_id', p.groupId)
                .order('created_at', { ascending: false })

            setExpenses(expensesData || [])
            setIsLoading(false)
        }

        fetchData()
    }, [params])

    if (isLoading || !group) {
        return <div className="animate-pulse py-8">Cargando...</div>
    }

    const isAdmin = members.find(m => m.user_id === currentUser)?.role === 'admin'

    return (
        <div className="space-y-6">

            {/* Header del grupo */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">{group.name}</h1>
                        {group.description && (
                            <p className="text-slate-500 text-sm mt-1">{group.description}</p>
                        )}
                    </div>
                    <div className="text-right shrink-0">
                        <p className="text-xs text-slate-400 mb-1">Código de invitación</p>
                        <div className="flex items-center gap-2">
                            <code className="bg-slate-100 text-slate-800 font-mono text-sm px-3 py-1.5 rounded-lg tracking-widest">
                                {group.invite_code}
                            </code>
                            <CopyInviteButton code={group.invite_code} />
                        </div>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-100">
                    <StatBox
                        icon={<Users className="w-4 h-4 text-blue-500" />}
                        value={members.length}
                        label="Miembros"
                    />
                    <StatBox
                        icon={<Receipt className="w-4 h-4 text-green-500" />}
                        value={expenses.length}
                        label="Gastos"
                    />
                    <StatBox
                        icon={<TrendingUp className="w-4 h-4 text-orange-500" />}
                        value={expenses.length > 0 ? `€${expenses.reduce((sum, e) => sum + e.amount, 0).toFixed(2)}` : '€0'}
                        label="Total"
                    />
                </div>
            </div>

            {/* Botón crear gasto */}
            <button
                onClick={() => setIsModalOpen(true)}
                className="w-full bg-blue-600 text-white font-medium py-3 rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
            >
                <Plus className="w-4 h-4" />
                Registrar gasto
            </button>

            {/* Modal crear gasto */}
            <ExpenseModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                groupId={groupId}
                members={members}
                currentUserId={currentUser}
            />

            {/* Lista de gastos */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6">
                <h2 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    <Receipt className="w-4 h-4" />
                    Gastos ({expenses.length})
                </h2>
                <ExpenseList expenses={expenses} />
            </div>

            {/* Miembros del grupo */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6">
                <h2 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Miembros ({members.length})
                </h2>
                <div className="space-y-3">
                    {members.map(member => (
                        <div key={member.id} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shrink-0">
                                    <span className="text-white text-sm font-medium">
                                        {member.profiles?.full_name?.[0]?.toUpperCase() ?? '?'}
                                    </span>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-slate-900">
                                        {member.profiles?.full_name ?? 'Usuario'}
                                        {member.user_id === currentUser && (
                                            <span className="text-slate-400 font-normal ml-1">(tú)</span>
                                        )}
                                    </p>
                                </div>
                            </div>
                            {member.role === 'admin' && (
                                <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                                    Admin
                                </span>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

function StatBox({
    icon,
    value,
    label,
}: {
    icon: React.ReactNode
    value: string | number
    label: string
}) {
    return (
        <div className="text-center">
            <div className="flex justify-center mb-1">{icon}</div>
            <p className="text-lg font-bold text-slate-900">{value}</p>
            <p className="text-xs text-slate-400">{label}</p>
        </div>
    )
}