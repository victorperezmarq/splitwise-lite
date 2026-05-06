// src/app/(dashboard)/groups/[groupId]/page.tsx
import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Users, Receipt, TrendingUp, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { formatCurrency } from '@/lib/utils'
import { CopyInviteButton } from './CopyInviteButton'
import ExpenseList from './expenses/ExpenseList'
import GroupActions from './GroupActions'
import RealtimeProvider from './RealtimeProvider'
import type { GroupMember, Profile, Expense } from '@/types/database'

type Member = GroupMember & { profiles: Profile | null }
type ExpenseWithAuthor = Expense & {
    profiles: Pick<Profile, 'id' | 'full_name' | 'avatar_url'> | null
}

export default async function GroupPage({
    params,
}: {
    params: Promise<{ groupId: string }>
}) {
    const { groupId } = await params
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    const { data: group } = await supabase
        .from('groups')
        .select(`
      *,
      group_members (
        id, role, user_id, joined_at,
        profiles ( id, full_name, avatar_url )
      )
    `)
        .eq('id', groupId)
        .single()

    if (!group) notFound()

    const members = group.group_members as Member[]
    const isMember = members.some(m => m.user_id === user.id)
    if (!isMember) redirect('/groups')

    const { data: expenses } = await supabase
        .from('expenses')
        .select('*, profiles ( id, full_name, avatar_url )')
        .eq('group_id', groupId)
        .order('created_at', { ascending: false })

    const expenseList = (expenses ?? []) as ExpenseWithAuthor[]
    const totalAmount = expenseList.reduce((sum, e) => sum + e.amount, 0)

    // Mapa userId → nombre para Realtime
    const memberNames = Object.fromEntries(
        members.map(m => [m.user_id, m.profiles?.full_name ?? 'Usuario'])
    )

    return (
        <div className="space-y-6">

            {/* Realtime: invisible, solo gestiona WebSockets */}
            <RealtimeProvider
                groupId={groupId}
                currentUserId={user.id}
                memberNames={memberNames}
            />

            {/* Header */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">{group.name}</h1>
                        {group.description && (
                            <p className="text-slate-500 text-sm mt-1">{group.description}</p>
                        )}
                    </div>
                    <div className="text-right">
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
                <div className="grid grid-cols-3 gap-4 mt-6 pt-5 border-t border-slate-100">
                    <StatBox
                        icon={<Users className="w-4 h-4 text-blue-500" />}
                        value={members.length}
                        label="Miembros"
                    />
                    <StatBox
                        icon={<Receipt className="w-4 h-4 text-green-500" />}
                        value={expenseList.length}
                        label="Gastos"
                    />
                    <StatBox
                        icon={<TrendingUp className="w-4 h-4 text-orange-500" />}
                        value={formatCurrency(totalAmount)}
                        label="Total"
                    />
                </div>
            </div>

            {/* Enlace a deudas */}
            <Link
                href={`/groups/${groupId}/debts`}
                className="flex items-center justify-between bg-orange-50 border border-orange-200 rounded-xl px-5 py-4 hover:bg-orange-100 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-orange-100 rounded-lg flex items-center justify-center">
                        <TrendingUp className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                        <p className="font-medium text-slate-900 text-sm">
                            Ver deudas y liquidar
                        </p>
                        <p className="text-xs text-slate-500">
                            Plan óptimo de transferencias
                        </p>
                    </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400" />
            </Link>

            {/* Botón crear gasto */}
            <GroupActions
                groupId={groupId}
                members={members}
                currentUserId={user.id}
            />

            {/* Lista de gastos */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6">
                <h2 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    <Receipt className="w-4 h-4" />
                    Gastos ({expenseList.length})
                </h2>
                <ExpenseList expenses={expenseList} currentUserId={user.id} />
            </div>

            {/* Miembros */}
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
                                <p className="text-sm font-medium text-slate-900">
                                    {member.profiles?.full_name ?? 'Usuario'}
                                    {member.user_id === user.id && (
                                        <span className="text-slate-400 font-normal ml-1">(tú)</span>
                                    )}
                                </p>
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

function StatBox({ icon, value, label }: {
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