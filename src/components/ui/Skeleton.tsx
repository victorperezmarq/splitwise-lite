// src/components/ui/Skeleton.tsx
import { cn } from '@/lib/utils'

export function Skeleton({ className }: { className?: string }) {
    return (
        <div
            className={cn(
                'animate-pulse rounded-lg bg-slate-100',
                className
            )}
        />
    )
}

// Skeleton para la tarjeta de grupo
export function GroupCardSkeleton() {
    return (
        <div className="bg-white border border-slate-200 rounded-xl p-5 space-y-3">
            <div className="flex justify-between">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-5 w-12" />
            </div>
            <Skeleton className="h-4 w-48" />
            <div className="flex justify-between items-center">
                <div className="flex gap-1">
                    <Skeleton className="w-6 h-6 rounded-full" />
                    <Skeleton className="w-6 h-6 rounded-full" />
                </div>
                <Skeleton className="h-3 w-20" />
            </div>
        </div>
    )
}

// Skeleton para el dashboard del grupo
export function GroupDashboardSkeleton() {
    return (
        <div className="space-y-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-64" />
                <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-100">
                    <Skeleton className="h-16" />
                    <Skeleton className="h-16" />
                    <Skeleton className="h-16" />
                </div>
            </div>
            <Skeleton className="h-14 rounded-xl" />
            <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-3">
                <Skeleton className="h-5 w-32" />
                {[1, 2, 3].map(i => (
                    <div key={i} className="flex items-center gap-4">
                        <Skeleton className="w-10 h-10 rounded-xl" />
                        <div className="flex-1 space-y-1.5">
                            <Skeleton className="h-4 w-40" />
                            <Skeleton className="h-3 w-24" />
                        </div>
                        <Skeleton className="h-5 w-16" />
                    </div>
                ))}
            </div>
        </div>
    )
}

// Skeleton para la lista de gastos
export function ExpenseSkeleton() {
    return (
        <div className="flex items-center gap-4 p-4">
            <Skeleton className="w-10 h-10 rounded-xl shrink-0" />
            <div className="flex-1 space-y-1.5">
                <Skeleton className="h-4 w-36" />
                <Skeleton className="h-3 w-24" />
            </div>
            <Skeleton className="h-5 w-16" />
        </div>
    )
}