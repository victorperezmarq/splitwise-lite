// src/app/(dashboard)/groups/page.tsx
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Users, Plus, LogIn } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import JoinGroupForm from './JoinGroupForm'

// Definimos el tipo localmente a partir de lo que Supabase devuelve realmente
// en esta query concreta — más seguro que castear a GroupWithMembers
type GroupResult = {
  id: string
  name: string
  description: string | null
  invite_code: string
  created_by: string
  created_at: string
  group_members: {
    id: string
    role: string
    user_id: string
    joined_at: string
    profiles: {
      id: string
      full_name: string
      avatar_url: string | null
    } | null
  }[]
}

export default async function GroupsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: memberships } = await supabase
    .from('group_members')
    .select(`
      group_id,
      role,
      joined_at,
      groups (
        id,
        name,
        description,
        invite_code,
        created_by,
        created_at,
        group_members (
          id,
          role,
          user_id,
          joined_at,
          profiles ( id, full_name, avatar_url )
        )
      )
    `)
    .eq('user_id', user.id)
    .order('joined_at', { ascending: false })

  // Extraer y filtrar grupos válidos
  const myGroups = (memberships ?? [])
    .map(m => m.groups)
    .filter(Boolean) as unknown as GroupResult[]

  // Obtener deudas pendientes del usuario (balance negativo = debe dinero)
  const { data: pendingBalances } = await supabase
    .from('group_balances')
    .select('group_id, net_balance, user_id')
    .eq('user_id', user.id)
    .lt('net_balance', -0.01)

  const groupsWithDebt = new Set(
    (pendingBalances ?? []).map(b => b.group_id)
  )

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Mis grupos</h1>
          <p className="text-slate-500 text-sm mt-0.5">
            {myGroups.length > 0
              ? `Perteneces a ${myGroups.length} grupo${myGroups.length !== 1 ? 's' : ''}`
              : 'Crea o únete a un grupo para empezar'}
          </p>
        </div>
        <Link
          href="/groups/new"
          className="inline-flex items-center gap-2 bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nuevo grupo
        </Link>
      </div>

      {/* Lista de grupos */}
      {myGroups.length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {myGroups.map(group => (
            <GroupCard
              key={group.id}
              group={group}
              currentUserId={user.id}
              hasDebt={groupsWithDebt.has(group.id)}
            />
          ))}
        </div>
      ) : (
        <EmptyState />
      )}

      {/* Unirse a un grupo */}
      <div className="border-t border-slate-200 pt-6">
        <h2 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
          <LogIn className="w-4 h-4" />
          Unirse con código de invitación
        </h2>
        <JoinGroupForm />
      </div>

    </div>
  )
}

// ── Subcomponente: tarjeta de grupo ───────────────────────────
function GroupCard({
  group,
  currentUserId,
  hasDebt,
}: {
  group: GroupResult
  currentUserId: string
  hasDebt: boolean
}) {
  const isAdmin =
    group.group_members.find(m => m.user_id === currentUserId)?.role === 'admin'

  return (
    <Link
      href={`/groups/${group.id}`}
      className="block bg-white border border-slate-200 rounded-xl p-5 hover:border-blue-300 hover:shadow-sm transition-all group"
    >
      {/* Nombre + badge admin */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <h3 className="font-semibold text-slate-900 group-hover:text-blue-700 transition-colors">
          {group.name}
        </h3>
        {isAdmin && (
          <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full font-medium shrink-0">
            Admin
          </span>
        )}
        {hasDebt && (
          <span className="text-xs bg-red-50 text-red-600 px-2 py-0.5 rounded-full font-medium shrink-0">
            Deuda
          </span>
        )}
      </div>

      {/* Descripción */}
      {group.description && (
        <p className="text-sm text-slate-500 mb-3 line-clamp-2">
          {group.description}
        </p>
      )}

      {/* Footer: avatares + fecha */}
      <div className="flex items-center justify-between">
        <MemberAvatars members={group.group_members} />
        <span className="text-xs text-slate-400">{formatDate(group.created_at)}</span>
      </div>
    </Link>
  )
}

// ── Subcomponente: avatares apilados ──────────────────────────
function MemberAvatars({
  members,
}: {
  members: GroupResult['group_members']
}) {
  const visible = members.slice(0, 4)
  const extra = members.length - 4

  return (
    <div className="flex items-center gap-2">
      <div className="flex -space-x-2">
        {visible.map(m => (
          <div
            key={m.id}
            title={m.profiles?.full_name ?? ''}
            className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 border-2 border-white flex items-center justify-center"
          >
            <span className="text-white text-xs font-medium">
              {m.profiles?.full_name?.[0]?.toUpperCase() ?? '?'}
            </span>
          </div>
        ))}
      </div>
      <span className="text-xs text-slate-400">
        {members.length} {members.length === 1 ? 'miembro' : 'miembros'}
        {extra > 0 && ` (+${extra})`}
      </span>
    </div>
  )
}

// ── Subcomponente: estado vacío ───────────────────────────────
function EmptyState() {
  return (
    <div className="bg-white border-2 border-dashed border-slate-200 rounded-xl p-12 text-center">
      <div className="inline-flex items-center justify-center w-12 h-12 bg-slate-100 rounded-xl mb-4">
        <Users className="w-6 h-6 text-slate-400" />
      </div>
      <h3 className="font-semibold text-slate-700 mb-1">No tienes grupos todavía</h3>
      <p className="text-sm text-slate-400 mb-4">
        Crea un grupo para tu piso, viaje o cena compartida
      </p>
      <Link
        href="/groups/new"
        className="inline-flex items-center gap-2 bg-blue-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
      >
        <Plus className="w-4 h-4" />
        Crear primer grupo
      </Link>
    </div>
  )
}