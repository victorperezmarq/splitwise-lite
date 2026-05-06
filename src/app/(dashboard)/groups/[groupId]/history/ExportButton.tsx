// src/app/(dashboard)/groups/[groupId]/history/ExportButton.tsx
'use client'

import Button from '@/components/ui/Button'
import { Download } from 'lucide-react'
import { formatDate } from '@/lib/utils'

export default function ExportButton({
  payments,
  memberMap,
}: {
  payments: any[]
  memberMap: Record<string, string>
}) {
  const handleExport = () => {
    // Generar CSV
    const headers = ['Fecha', 'Concepto', 'Categoría', 'Pagó', 'Recibió', 'Cantidad']

    const rows = payments.map(p => {
      const split = p.expense_splits
      const expense = split?.expenses
      const fromName = memberMap[p.from_user] ?? 'Usuario'
      const toName = memberMap[p.to_user] ?? 'Usuario'

      return [
        formatDate(p.paid_at),
        expense?.title ?? 'Pago',
        expense?.category ?? 'otros',
        fromName,
        toName,
        p.amount.toString()
      ].map(val => `"${val.replace(/"/g, '""')}"`).join(',')
    })

    const csvContent = [headers.join(','), ...rows].join('\n')
    // Añadir BOM para que Excel lea los acentos correctamente
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `historial_pagos_${new Date().toISOString().split('T')[0]}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <Button onClick={handleExport} variant="secondary" className="w-full mt-6">
      <Download className="w-4 h-4 mr-2" />
      Exportar a CSV
    </Button>
  )
}
