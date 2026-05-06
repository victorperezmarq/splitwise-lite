// src/app/(dashboard)/profile/loading.tsx
import { Skeleton } from '@/components/ui/Skeleton'

export default function ProfileLoading() {
    return (
        <div className="space-y-6 max-w-lg mx-auto">
            <div className="space-y-1.5">
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-4 w-56" />
            </div>

            {/* Avatar card */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6">
                <div className="flex flex-col sm:flex-row items-center gap-6">
                    <Skeleton className="w-24 h-24 rounded-full shrink-0" />
                    <div className="flex-1 space-y-3 w-full">
                        <Skeleton className="h-6 w-40" />
                        <Skeleton className="h-4 w-52" />
                        <div className="flex gap-6">
                            <Skeleton className="h-10 w-14" />
                            <Skeleton className="h-10 w-14" />
                            <Skeleton className="h-10 w-14" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Form cards */}
            {[1, 2, 3].map(i => (
                <div key={i} className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4">
                    <Skeleton className="h-5 w-40" />
                    <Skeleton className="h-4 w-64" />
                    <Skeleton className="h-10 w-full rounded-lg" />
                    <Skeleton className="h-9 w-32 rounded-lg" />
                </div>
            ))}
        </div>
    )
}