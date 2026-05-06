// src/app/(dashboard)/groups/[groupId]/debts/page.tsx
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { calculateMinTransfers } from '@/lib/settlement'
import { formatCurrency } from '@/lib/utils'
import SettleButton from './SettleButton'
import RealtimeDebts from './RealtimeDebts'
import type { GroupBalance } from '@/types/database'

export default async function DebtsPage({
    params,
}: {
    params: Promise<{ groupId: string }>
}) {
    const { groupId } = await params
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    // Usar la vista group_balances que creamos en la Fase 2
    const { data: balancesRaw } = await supabase
        .from('group_balances')
        .select('*')
        .eq('group_id', groupId)

    const balances = (balancesRaw ?? []) as GroupBalance[]

    // Construir el formato que necesita el algoritmo
    const userBalances = balances
        .filter(b => b.user_id && b.full_name)
        .map(b => ({
            userId: b.user_id!,
            fullName: b.full_name!,
            avatarUrl: b.avatar_url,
            netBalance: b.net_balance ?? 0,
        }))

    // Ejecutar el algoritmo de mínimas transferencias
    const transfers = calculateMinTransfers(userBalances)

    // ── Obtener los splits pendientes con JOIN a expenses ──────
    const { data: splitsData } = await supabase
        .from('expense_splits')
        .select(`
      id,
      user_id,
      amount,
      expense_id,
      is_settled,
      expenses!inner (
        id,
        group_id,
        paid_by
      )
    `)
        .eq('expenses.group_id', groupId)
        .eq('is_settled', false)

    // ── Construir mapa de splits: deudor→acreedor → [splitIds] ──
    type SplitWithExpense = {
        id: string
        userId: string
        amount: number
        paidBy: string
    }

    const splitsMap = new Map<string, string[]>()

    if (splitsData && splitsData.length > 0) {
        for (const split of splitsData) {
            const expense = (split.expenses as any)
            if (!expense) continue

            // Clave: userId (deudor) → paid_by (acreedor)
            const key = `${split.user_id}→${expense.paid_by}`
            if (!splitsMap.has(key)) {
                splitsMap.set(key, [])
            }
            splitsMap.get(key)!.push(split.id)
        }
    }

    // ── Mapa de nombres para Realtime ──────────────────────────
    const memberNames = Object.fromEntries(
        userBalances.map(b => [b.userId, b.fullName])
    )

    return (
        <div className="space-y-6 max-w-lg mx-auto">

            {/* Realtime: invisible, escucha cambios */}
            <RealtimeDebts
                groupId={groupId}
                currentUserId={user.id}
                memberNames={memberNames}
            />

            {/* Header */}
            <div>
                <Link
                    href={`/groups/${groupId}`}
                    className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 mb-4 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Volver al grupo
                </Link>
                <h1 className="text-2xl font-bold text-slate-900">Liquidar deudas</h1>
                <p className="text-slate-500 text-sm mt-1">
                    {transfers.length === 0
                        ? 'Todo liquidado 🎉'
                        : `${transfers.length} transferencia${transfers.length !== 1 ? 's' : ''} para quedar a cero`}
                </p>
            </div>

            {/* Saldos individuales */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6">
                <h2 className="font-semibold text-slate-900 mb-4">Saldo de cada persona</h2>
                <div className="space-y-3">
                    {userBalances.map(balance => (
                        <div key={balance.userId} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center shrink-0">
                                    <span className="text-white text-sm font-medium">
                                        {balance.fullName[0].toUpperCase()}
                                    </span>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-slate-900">
                                        {balance.fullName}
                                        {balance.userId === user.id && (
                                            <span className="text-slate-400 font-normal ml-1">(tú)</span>
                                        )}
                                    </p>
                                    <p className="text-xs text-slate-400">
                                        {balance.netBalance > 0.01
                                            ? 'Le deben dinero'
                                            : balance.netBalance < -0.01
                                                ? 'Debe dinero'
                                                : 'Al día ✓'}
                                    </p>
                                </div>
                            </div>
                            <span
                                className={`font-semibold text-sm ${balance.netBalance > 0.01
                                        ? 'text-green-600'
                                        : balance.netBalance < -0.01
                                            ? 'text-red-500'
                                            : 'text-slate-400'
                                    }`}
                            >
                                {balance.netBalance > 0.01 && '+'}
                                {formatCurrency(balance.netBalance)}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Transferencias sugeridas */}
            {transfers.length > 0 ? (
                <div className="bg-white border border-slate-200 rounded-2xl p-6">
                    <h2 className="font-semibold text-slate-900 mb-1">
                        Plan de liquidación óptimo
                    </h2>
                    <p className="text-xs text-slate-400 mb-4">
                        El mínimo número de transferencias posible
                    </p>

                    <div className="space-y-3">
                        {transfers.map((transfer, i) => {
                            const isMyDebt = transfer.fromUserId === user.id

                            // Buscar splits correspondientes a esta deuda
                            // Clave: fromUserId (deudor) → toUserId (acreedor)
                            const key = `${transfer.fromUserId}→${transfer.toUserId}`
                            const relevantSplits = splitsMap.get(key) || []

                            return (
                                <div
                                    key={i}
                                    className={`flex items-center justify-between gap-4 p-4 rounded-xl border ${isMyDebt
                                            ? 'bg-red-50 border-red-200'
                                            : 'bg-slate-50 border-slate-200'
                                        }`}
                                >
                                    <div className="flex items-center gap-3 flex-1 min-w-0">
                                        {/* Avatar deudor */}
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-400 to-red-600 flex items-center justify-center shrink-0">
                                            <span className="text-white text-xs font-medium">
                                                {transfer.fromUserName[0].toUpperCase()}
                                            </span>
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-slate-900 truncate">
                                                <span className={isMyDebt ? 'text-red-700' : ''}>
                                                    {isMyDebt ? 'Tú' : transfer.fromUserName}
                                                </span>
                                                {' → '}
                                                <span className="text-slate-700">{transfer.toUserName}</span>
                                            </p>
                                            <p className="text-xs text-slate-400">
                                                {isMyDebt ? 'Debes pagar' : 'Pendiente'}
                                            </p>
                                        </div>

                                        <p className="font-bold text-slate-900 shrink-0">
                                            {formatCurrency(transfer.amount)}
                                        </p>
                                    </div>

                                    {/* Botón liquidar — solo para el que debe y si hay splits */}
                                    {isMyDebt && relevantSplits.length > 0 && (
                                        <SettleButton
                                            splitIds={relevantSplits}
                                            groupId={groupId}
                                            amount={transfer.amount}
                                            toUserName={transfer.toUserName}
                                        />
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </div>
            ) : (
                <div className="bg-green-50 border border-green-200 rounded-2xl p-8 text-center">
                    <p className="text-4xl mb-3">🎉</p>
                    <h3 className="font-semibold text-green-800 mb-1">
                        ¡Todo liquidado!
                    </h3>
                    <p className="text-sm text-green-600">
                        No hay deudas pendientes en este grupo
                    </p>
                </div>
            )}

        </div>
    )
}