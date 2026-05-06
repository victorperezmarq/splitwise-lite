// src/lib/settlement.ts
// Algoritmo de liquidación de deudas con mínimo número de transferencias

export type UserBalance = {
    userId: string
    fullName: string
    avatarUrl: string | null
    netBalance: number  // positivo = le deben, negativo = debe
}

export type Transfer = {
    fromUserId: string
    fromUserName: string
    toUserId: string
    toUserName: string
    amount: number
}

/**
 * Calcula el número mínimo de transferencias para liquidar todas las deudas.
 *
 * Algoritmo greedy O(n log n):
 * 1. Separar en deudores (balance < 0) y acreedores (balance > 0)
 * 2. Ordenar ambas listas por valor absoluto descendente
 * 3. Emparejar el mayor deudor con el mayor acreedor
 * 4. Reducir ambos balances por el mínimo de los dos
 * 5. Repetir hasta que todos los balances sean 0
 *
 * Ejemplo:
 *   Ana: +50€, Bob: -30€, Carlos: -20€
 *   → Bob paga 30€ a Ana
 *   → Carlos paga 20€ a Ana
 *   Total: 2 transferencias (óptimo)
 */
export function calculateMinTransfers(balances: UserBalance[]): Transfer[] {
    const transfers: Transfer[] = []

    // Separar en deudores y acreedores, ignorar balances cero
    // Clonamos para no mutar el array original
    const debtors = balances
        .filter(b => b.netBalance < -0.01)
        .map(b => ({ ...b, netBalance: b.netBalance }))
        .sort((a, b) => a.netBalance - b.netBalance)  // más negativo primero

    const creditors = balances
        .filter(b => b.netBalance > 0.01)
        .map(b => ({ ...b, netBalance: b.netBalance }))
        .sort((a, b) => b.netBalance - a.netBalance)  // más positivo primero

    let i = 0  // índice deudor actual
    let j = 0  // índice acreedor actual

    while (i < debtors.length && j < creditors.length) {
        const debtor = debtors[i]
        const creditor = creditors[j]

        // Cuánto puede pagar el deudor vs cuánto necesita el acreedor
        const debtAmount = Math.abs(debtor.netBalance)
        const creditAmount = creditor.netBalance

        // El pago es el mínimo de los dos
        const payment = Math.min(debtAmount, creditAmount)

        // Redondear a 2 decimales para evitar 0.30000000000000004
        const roundedPayment = Math.round(payment * 100) / 100

        if (roundedPayment > 0.01) {
            transfers.push({
                fromUserId: debtor.userId,
                fromUserName: debtor.fullName,
                toUserId: creditor.userId,
                toUserName: creditor.fullName,
                amount: roundedPayment,
            })
        }

        // Actualizar balances restantes
        debtor.netBalance += payment
        creditor.netBalance -= payment

        // Avanzar al siguiente si el balance quedó en 0
        if (Math.abs(debtor.netBalance) < 0.01) i++
        if (Math.abs(creditor.netBalance) < 0.01) j++
    }

    return transfers
}

/**
 * Agrupa los splits pendientes en saldos netos por usuario.
 * Esto se usa para mostrar el resumen de deudas del grupo.
 */
export function buildBalancesFromSplits(
    splits: {
        userId: string
        fullName: string
        avatarUrl: string | null
        amount: number
        paidByUserId: string
        paidByName: string
    }[]
): UserBalance[] {
    const balanceMap = new Map<string, UserBalance>()

    for (const split of splits) {
        // El que pagó tiene saldo positivo (le deben)
        if (!balanceMap.has(split.paidByUserId)) {
            balanceMap.set(split.paidByUserId, {
                userId: split.paidByUserId,
                fullName: split.paidByName,
                avatarUrl: null,
                netBalance: 0,
            })
        }
        balanceMap.get(split.paidByUserId)!.netBalance += split.amount

        // El que debe tiene saldo negativo
        if (!balanceMap.has(split.userId)) {
            balanceMap.set(split.userId, {
                userId: split.userId,
                fullName: split.fullName,
                avatarUrl: split.avatarUrl,
                netBalance: 0,
            })
        }
        balanceMap.get(split.userId)!.netBalance -= split.amount
    }

    return Array.from(balanceMap.values())
}