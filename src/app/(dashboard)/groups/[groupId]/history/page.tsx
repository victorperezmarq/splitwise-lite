// src/app/(dashboard)/groups/[groupId]/history/page.tsx
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ArrowLeft, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { formatCurrency, formatDate } from '@/lib/utils'
import ExportButton from './ExportButton'

type PaymentWithProfiles = {
    id: string
    amount: number
    paid_at: string
    from_user: string
    to_user: string
    from_profile: { full_name: string } | null
    to_profile: { full_name: string } | null
    split: {
        amount: number
        expense: {
            title: string
            category: string
        } | null
    } | null
}

const CATEGORY_EMOJI: Record<string, string> = {
    comida: '🍽️',
    transporte: '🚕',
    ocio: '🎭',
    hogar: '🏠',
    servicios: '⚡',
    otros: '📦',
}

export default async function HistoryPage({
    params,
    searchParams,
}: {
    params: Promise<{ groupId: string }>
    searchParams: Promise<{ user?: string }>
}) {
    const { groupId } = await params
    const { user: filterUserId } = await searchParams
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    // Verificar que el usuario es miembro del grupo
    const { data: membership } = await supabase
        .from('group_members')
        .select('id')
        .eq('group_id', groupId)
        .eq('user_id', user.id)
        .single()

    if (!membership) redirect('/groups')

    // Obtener todos los miembros para el filtro
    const { data: members } = await supabase
        .from('group_members')
        .select('user_id, profiles ( id, full_name )')
        .eq('group_id', groupId)

    // Obtener pagos liquidados del grupo con JOINs
    // Usamos dos queries separadas porque Supabase no soporta
    // múltiples foreign keys al mismo tabla en un select anidado
    const { data: payments } = await supabase
        .from('debt_payments')
        .select(`
      id,
      amount,
      paid_at,
      from_user,
      to_user,
      expense_splits!inner (
        amount,
        expenses!inner (
          title,
          category,
          group_id
        )
      )
    `)
        .eq('expense_splits.expenses.group_id', groupId)
        .order('paid_at', { ascending: false })

    // Filtrar por usuario si se especificó
    const filteredPayments = (payments ?? []).filter(p => {
        if (!filterUserId) return true
        return p.from_user === filterUserId || p.to_user === filterUserId
    })

    // Enriquecer con nombres de perfil
    const memberMap = new Map(
        (members ?? []).map(m => [
            m.user_id,
            (m.profiles as any)?.full_name ?? 'Usuario',
        ])
    )

    // Stats resumen
    const totalPaid = filteredPayments.reduce((sum, p) => sum + p.amount, 0)
    const myPayments = filteredPayments.filter(p => p.from_user === user.id)
    const myReceipts = filteredPayments.filter(p => p.to_user === user.id)
    const myTotalPaid = myPayments.reduce((sum, p) => sum + p.amount, 0)
    const myTotalReceived = myReceipts.reduce((sum, p) => sum + p.amount, 0)

    return (
        <div className="space-y-6 max-w-2xl mx-auto">

            {/* Header */}
            <div>
                <Link
                    href={`/groups/${groupId}`}
                    className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-4 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Volver al grupo
                </Link>
                <h1 className="text-2xl font-bold text-slate-900">Historial de pagos</h1>
                <p className="text-slate-500 text-sm mt-1">
                    {filteredPayments.length} pago{filteredPayments.length !== 1 ? 's' : ''} liquidado{filteredPayments.length !== 1 ? 's' : ''}
                </p>
            </div>

            {/* Stats resumen */}
            <div className="grid grid-cols-3 gap-3">
                <div className="bg-white border border-slate-200 rounded-xl p-4 text-center">
                    <p className="text-xs text-slate-400 mb-1">Total liquidado</p>
                    <p className="font-bold text-slate-900 text-sm tabular-nums">
                        {formatCurrency(totalPaid)}
                    </p>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
                    <p className="text-xs text-green-600 mb-1">Tú pagaste</p>
                    <p className="font-bold text-green-700 text-sm tabular-nums">
                        {formatCurrency(myTotalPaid)}
                    </p>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-center">
                    <p className="text-xs text-blue-600 mb-1">Te pagaron</p>
                    <p className="font-bold text-blue-700 text-sm tabular-nums">
                        {formatCurrency(myTotalReceived)}
                    </p>
                </div>
            </div>

            {/* Filtro por usuario */}
            <div className="bg-white border border-slate-200 rounded-xl p-4">
                <p className="text-xs font-medium text-slate-500 mb-3">
                    Filtrar por persona
                </p>
                <div className="flex flex-wrap gap-2">
                    <Link
                        href={`/groups/${groupId}/history`}
                        className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${!filterUserId
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                            }`}
                    >
                        Todos
                    </Link>
                    {(members ?? []).map(member => {
                        const name = (member.profiles as any)?.full_name ?? 'Usuario'
                        const isActive = filterUserId === member.user_id
                        return (
                            <Link
                                key={member.user_id}
                                href={`/groups/${groupId}/history?user=${member.user_id}`}
                                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${isActive
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                    }`}
                            >
                                {name}
                                {member.user_id === user.id && ' (tú)'}
                            </Link>
                        )
                    })}
                </div>
            </div>

            {/* Lista de pagos */}
            {filteredPayments.length === 0 ? (
                <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center">
                    <CheckCircle className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                    <p className="font-medium text-slate-500">Sin pagos todavía</p>
                    <p className="text-sm text-slate-400 mt-1">
                        Cuando alguien liquide una deuda aparecerá aquí
                    </p>
                </div>
            ) : (
                <div className="space-y-2">
                    {filteredPayments.map(payment => {
                        const fromName = memberMap.get(payment.from_user) ?? 'Usuario'
                        const toName = memberMap.get(payment.to_user) ?? 'Usuario'
                        const isMyPayment = payment.from_user === user.id
                        const isMyReceipt = payment.to_user === user.id
                        const split = (payment.expense_splits as any)
                        const expense = split?.expenses

                        return (
                            <div
                                key={payment.id}
                                className={`bg-white border rounded-xl p-4 transition-all hover:shadow-sm ${isMyPayment
                                    ? 'border-green-200 bg-green-50/30'
                                    : isMyReceipt
                                        ? 'border-blue-200 bg-blue-50/30'
                                        : 'border-slate-200'
                                    }`}
                            >
                                <div className="flex items-center gap-4">

                                    {/* Icono */}
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-lg ${isMyPayment
                                        ? 'bg-green-100'
                                        : isMyReceipt
                                            ? 'bg-blue-100'
                                            : 'bg-slate-100'
                                        }`}>
                                        {expense
                                            ? CATEGORY_EMOJI[expense.category] ?? '📦'
                                            : '💸'}
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium text-slate-900 truncate">
                                            {expense?.title ?? 'Pago'}
                                        </p>
                                        <p className="text-xs text-slate-400 mt-0.5">
                                            <span className={isMyPayment ? 'text-green-600 font-medium' : ''}>
                                                {isMyPayment ? 'Tú' : fromName}
                                            </span>
                                            {' → '}
                                            <span className={isMyReceipt ? 'text-blue-600 font-medium' : ''}>
                                                {isMyReceipt ? 'tú' : toName}
                                            </span>
                                            {' · '}
                                            {formatDate(payment.paid_at)}
                                        </p>
                                    </div>

                                    {/* Cantidad + badge */}
                                    <div className="text-right shrink-0">
                                        <p className="font-semibold text-slate-900 tabular-nums">
                                            {formatCurrency(payment.amount)}
                                        </p>
                                        <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${isMyPayment
                                            ? 'text-green-700 bg-green-100'
                                            : isMyReceipt
                                                ? 'text-blue-700 bg-blue-100'
                                                : 'text-slate-500 bg-slate-100'
                                            }`}>
                                            {isMyPayment ? 'Pagado' : isMyReceipt ? 'Recibido' : 'Liquidado'}
                                        </span>
                                    </div>

                                </div>
                            </div>
                        )
                    })}
                </div>
            )}

            {/* Exportar CSV */}
            {filteredPayments.length > 0 && (
                <ExportButton payments={filteredPayments} memberMap={Object.fromEntries(memberMap)} />
            )}

        </div>
    )
}