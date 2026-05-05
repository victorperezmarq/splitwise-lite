// src/app/(dashboard)/groups/JoinGroupForm.tsx
'use client'

import { useState } from 'react'
import { toast } from 'sonner'
import { joinGroup } from './actions'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

export default function JoinGroupForm() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const result = await joinGroup(formData)

    if (result?.error) {
      setError(result.error)
      toast.error(result.error)
      setIsLoading(false)
    }
    // Si no hay error, joinGroup redirige automáticamente al grupo
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 max-w-sm">
      <div className="flex-1">
        <Input
          name="invite_code"
          placeholder="Ej: AB12CD34"
          maxLength={8}
          className="uppercase tracking-widest font-mono"
          onChange={() => setError(null)}
        />
        {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
      </div>
      <Button type="submit" isLoading={isLoading} variant="secondary">
        Unirse
      </Button>
    </form>
  )
}