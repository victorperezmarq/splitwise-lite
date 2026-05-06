// src/components/charts/CategoryPieChart.tsx
'use client'

import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts'
import { formatCurrency } from '@/lib/utils'

type CategoryData = {
    name: string
    value: number
    emoji: string
    color: string
}

const CATEGORY_CONFIG: Record<string, { emoji: string; color: string }> = {
    comida: { emoji: '🍽️', color: '#3b82f6' },
    transporte: { emoji: '🚕', color: '#8b5cf6' },
    ocio: { emoji: '🎭', color: '#f59e0b' },
    hogar: { emoji: '🏠', color: '#10b981' },
    servicios: { emoji: '⚡', color: '#f97316' },
    otros: { emoji: '📦', color: '#6b7280' },
}

type Expense = {
    amount: number
    category: string
}

// Tooltip personalizado
function CustomTooltip({ active, payload }: any) {
    if (!active || !payload?.length) return null

    const data = payload[0].payload as CategoryData
    return (
        <div className="bg-white border border-slate-200 rounded-xl px-4 py-3 shadow-lg">
            <p className="text-sm font-medium text-slate-900">
                {data.emoji} {data.name}
            </p>
            <p className="text-lg font-bold text-slate-900 mt-0.5">
                {formatCurrency(data.value)}
            </p>
        </div>
    )
}

// Label personalizado dentro del pie
function CustomLabel({
    cx, cy, midAngle, innerRadius, outerRadius, percent,
}: any) {
    if (percent < 0.08) return null // No mostrar si < 8%

    const RADIAN = Math.PI / 180
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5
    const x = cx + radius * Math.cos(-midAngle * RADIAN)
    const y = cy + radius * Math.sin(-midAngle * RADIAN)

    return (
        <text
            x={x} y={y}
            fill="white"
            textAnchor="middle"
            dominantBaseline="central"
            className="text-xs font-bold"
            fontSize={12}
        >
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    )
}

export default function CategoryPieChart({ expenses }: { expenses: Expense[] }) {
    // Agrupar por categoría
    const categoryTotals = expenses.reduce<Record<string, number>>(
        (acc, expense) => {
            const cat = expense.category || 'otros'
            acc[cat] = (acc[cat] || 0) + expense.amount
            return acc
        },
        {}
    )

    const data: CategoryData[] = Object.entries(categoryTotals)
        .map(([name, value]) => ({
            name,
            value,
            emoji: CATEGORY_CONFIG[name]?.emoji ?? '📦',
            color: CATEGORY_CONFIG[name]?.color ?? '#6b7280',
        }))
        .sort((a, b) => b.value - a.value)

    if (data.length === 0) {
        return (
            <div className="text-center py-8 text-slate-400">
                <p className="text-sm">Añade gastos para ver el gráfico</p>
            </div>
        )
    }

    const total = data.reduce((sum, d) => sum + d.value, 0)

    return (
        <div>
            {/* Gráfico */}
            <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        outerRadius={110}
                        innerRadius={55}
                        dataKey="value"
                        labelLine={false}
                        label={CustomLabel}
                        strokeWidth={2}
                        stroke="#fff"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                </PieChart>
            </ResponsiveContainer>

            {/* Leyenda manual — más bonita que la de Recharts */}
            <div className="space-y-2 mt-2">
                {data.map(item => (
                    <div key={item.name} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <div
                                className="w-3 h-3 rounded-full shrink-0"
                                style={{ backgroundColor: item.color }}
                            />
                            <span className="text-sm text-slate-600 capitalize">
                                {item.emoji} {item.name}
                            </span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-xs text-slate-400">
                                {((item.value / total) * 100).toFixed(0)}%
                            </span>
                            <span className="text-sm font-medium text-slate-900 tabular-nums">
                                {formatCurrency(item.value)}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Total */}
            <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center">
                <span className="text-sm text-slate-500">Total gastado</span>
                <span className="font-bold text-slate-900">{formatCurrency(total)}</span>
            </div>
        </div>
    )
}