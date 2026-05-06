// src/app/(dashboard)/groups/[groupId]/history/loading.tsx
import { Skeleton } from '@/components/ui/Skeleton'

export default function HistoryLoading() {
    return (
        <div className="space-y-6 max-w-2xl mx-auto">
            <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-32" />
            </div>
            <div className="grid grid-cols-3 gap-3">
                {[1, 2, 3].map(i => (
                    <Skeleton key={i} className="h-20 rounded-xl" />
                ))}
            </div>
            <Skeleton className="h-20 rounded-xl" />
            <div className="space-y-2">
                {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="bg-white border border-slate-200 rounded-xl p-4">
                        <div className="flex items-center gap-4">
                            <Skeleton className="w-10 h-10 rounded-xl shrink-0" />
                            <div className="flex-1 space-y-1.5">
                                <Skeleton className="h-4 w-40" />
                                <Skeleton className="h-3 w-56" />
                            </div>
                            <div className="space-y-1.5 text-right">
                                <Skeleton className="h-4 w-16 ml-auto" />
                                <Skeleton className="h-4 w-14 ml-auto" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}