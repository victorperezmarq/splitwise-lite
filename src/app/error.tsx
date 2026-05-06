// src/app/error.tsx
'use client'

import { useEffect } from 'react'
import Button from '@/components/ui/Button'

export default function ErrorPage({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error('App error:', error)
    }, [error])

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-8 max-w-md w-full text-center">
                <p className="text-4xl mb-4">💥</p>
                <h2 className="text-xl font-bold text-slate-900 mb-2">
                    Algo ha salido mal
                </h2>
                <p className="text-slate-500 text-sm mb-6">
                    Ha ocurrido un error inesperado. Puedes intentarlo de nuevo.
                </p>
                <Button onClick={reset} className="w-full">
                    Intentar de nuevo
                </Button>
            </div>
        </div>
    )
}