// src/app/not-found.tsx
import Link from 'next/link'
import Button from '@/components/ui/Button'

export default function NotFound() {
    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-8 max-w-md w-full text-center">
                <p className="text-5xl font-bold text-slate-200 mb-4">404</p>
                <h2 className="text-xl font-bold text-slate-900 mb-2">
                    Página no encontrada
                </h2>
                <p className="text-slate-500 text-sm mb-6">
                    La página que buscas no existe o has perdido el acceso.
                </p>
                <Link href="/groups">
                    <Button className="w-full">Volver a mis grupos</Button>
                </Link>
            </div>
        </div>
    )
}