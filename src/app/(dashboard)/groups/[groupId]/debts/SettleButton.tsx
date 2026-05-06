// src/app/(dashboard)/groups/[groupId]/debts/SettleButton.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { settleDebt } from './actions'
import Button from '@/components/ui/Button'

export default function SettleButton({
  splitIds,
  groupId,
  amount,
  toUserName,
}: {
  splitIds: string[]
  groupId: string
  amount: number
  toUserName: string
}) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  async function handleSettle() {
    if (!confirm(`¿Confirmas que has pagado ${amount}€ a ${toUserName}?`)) return

    setIsLoading(true)
    const result = await settleDebt(splitIds, groupId)

    if (result.error) {
      toast.error(result.error)
      setIsLoading(false)
    } else {
      toast.success('Deuda liquidada correctamente')
      router.refresh()
    }
  }

  return (
    <Button
      size="sm"
      variant="secondary"
      isLoading={isLoading}
      onClick={handleSettle}
      className="shrink-0"
    >
      Liquidar
    </Button>
  )
}
