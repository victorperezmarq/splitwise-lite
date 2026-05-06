// src/app/(dashboard)/groups/loading.tsx
import { GroupCardSkeleton } from '@/components/ui/Skeleton'

export default function GroupsLoading() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="space-y-1.5">
                    <div className="h-7 w-28 bg-slate-100 animate-pulse rounded-lg" />
                    <div className="h-4 w-48 bg-slate-100 animate-pulse rounded-lg" />
                </div>
                <div className="h-9 w-32 bg-slate-100 animate-pulse rounded-lg" />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
                {[1, 2, 3, 4].map(i => (
                    <GroupCardSkeleton key={i} />
                ))}
            </div>
        </div>
    )
}