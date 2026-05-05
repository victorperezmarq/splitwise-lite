// src/app/(dashboard)/groups/[groupId]/page.tsx
import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Users, Copy, Receipt, TrendingUp } from 'lucide-react'
import { CopyInviteButton } from '@/app/(dashboard)/groups/[groupId]/CopyInviteButton'
import type { GroupWithMembers } from '@/types/database'

export default async function GroupPage({
    params,
}: {
    params: Promise<{ groupId: string }>
}) {
    const { groupId } = await params
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    // Obtener el grupo con todos sus miembros
    const { data: group, error } = await supabase
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
        .eq('id', groupId)
        .single()

    if (error || !group) notFound()

    const typedGroup = group as unknown as GroupWithMembers

    // Verificar que el usuario es miembro del grupo
    const isMember = typedGroup.group_members.some(m => m.user_id === user.id)
    if (!isMember) redirect('/groups')

    const isAdmin = typedGroup.group_members.find(m => m.user_id === user.id)?.role === 'admin'

    return (
        <div className="space-y-6">

            {/* Header del grupo */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">{typedGroup.name}</h1>
                        {typedGroup.description && (
                            <p className="text-slate-500 text-sm mt-1">{typedGroup.description}</p>
                        )}
                    </div>
                    {/* Código de invitación */}
                    <div className="text-right shrink-0">
                        <p className="text-xs text-slate-400 mb-1">Código de invitación</p>
                        <div className="flex items-center gap-2">
                            <code className="bg-slate-100 text-slate-800 font-mono text-sm px-3 py-1.5 rounded-lg tracking-widest">
                                {typedGroup.invite_code}
                            </code>
                            <CopyInviteButton code={typedGroup.invite_code} />
                        </div>
                    </div>
                </div>

                {/* Stats rápidas */}
                <div className="grid grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-100">
                    <StatBox
                        icon={<Users className="w-4 h-4 text-blue-500" />}
                        value={typedGroup.group_members.length}
                        label="Miembros"
                    />
                    <StatBox
                        icon={<Receipt className="w-4 h-4 text-green-500" />}
                        value="—"
                        label="Gastos"
                    />
                    <StatBox
                        icon={<TrendingUp className="w-4 h-4 text-orange-500" />}
                        value="—"
                        label="Total gastado"
                    />
                </div>
            </div>

            {/* Miembros del grupo */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6">
                <h2 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Miembros ({typedGroup.group_members.length})
                </h2>
                <div className="space-y-3">
                    {typedGroup.group_members.map(member => (
                        <div key={member.id} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                {/* Avatar inicial */}
                                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shrink-0">
                                    <span className="text-white text-sm font-medium">
                                        {member.profiles?.full_name?.[0]?.toUpperCase() ?? '?'}
                                    </span>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-slate-900">
                                        {member.profiles?.full_name ?? 'Usuario'}
                                        {member.user_id === user.id && (
                                            <span className="text-slate-400 font-normal ml-1">(tú)</span>
                                        )}
                                    </p>
                                </div>
                            </div>
                            {/* Badge de rol */}
                            {member.role === 'admin' && (
                                <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-medium">
                                    Admin
                                </span>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Placeholder de gastos — Fase 5 */}
            <div className="bg-white border-2 border-dashed border-slate-200 rounded-2xl p-8 text-center">
                <Receipt className="w-8 h-8 text-slate-300 mx-auto mb-3" />
                <p className="text-sm font-medium text-slate-500">Los gastos aparecerán aquí</p>
                <p className="text-xs text-slate-400 mt-1">Fase 5 en construcción 🚧</p>
            </div>

        </div>
    )
}

// ── Subcomponente: caja de stat ───────────────────────────────
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