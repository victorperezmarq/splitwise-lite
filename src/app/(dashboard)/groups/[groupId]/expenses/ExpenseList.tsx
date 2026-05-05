// src/app/(dashboard)/groups/[groupId]/expenses/ExpenseList.tsx
import { formatCurrency, formatDate } from '@/lib/utils'
import { Receipt } from 'lucide-react'
import type { Expense } from '@/types/database'

type ExpenseWithAuthor = Expense & {
  profiles: {
    id: string
    full_name: string
    avatar_url: string | null
  }
}

export default function ExpenseList({ expenses }: { expenses: ExpenseWithAuthor[] }) {
  if (expenses.length === 0) {
    return (
      <div className="text-center py-8 text-slate-400">
        <Receipt className="w-8 h-8 mx-auto mb-2 opacity-50" />
        <p className="text-sm">Sin gastos todavía</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {expenses.map(expense => (
        <div
          key={expense.id}
          className="bg-white border border-slate-200 rounded-xl p-4 hover:shadow-sm transition-all"
        >
          <div className="flex items-start justify-between gap-3">
            {/* Info principal */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded capitalize">
                  {getCategoryEmoji(expense.category)} {expense.category}
                </span>
              </div>
              <h3 className="font-medium text-slate-900 truncate">{expense.title}</h3>
              <p className="text-xs text-slate-400 mt-1">
                Pagado por {expense.profiles?.full_name ?? 'Usuario'}
                {' '}·{' '}
                {formatDate(expense.created_at)}
              </p>
            </div>

            {/* Cantidad */}
            <div className="text-right shrink-0">
              <p className="font-semibold text-slate-900">
                {formatCurrency(expense.amount)}
              </p>
            </div>
          </div>

          {/* Ticket */}
          {expense.receipt_url && (
            <div className="mt-3 pt-3 border-t border-slate-100">
              <a
                href={expense.receipt_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-600 hover:underline flex items-center gap-1"
              >
                <Receipt className="w-3 h-3" />
                Ver ticket
              </a>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

function getCategoryEmoji(category: string): string {
  const emojis: Record<string, string> = {
    comida: '🍽️',
    transporte: '🚕',
    ocio: '🎭',
    hogar: '🏠',
    servicios: '⚡',
    otros: '📦',
  }
  return emojis[category] || '📦'
}