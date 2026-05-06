// src/components/ui/Card.tsx
import { cn } from '@/lib/utils'

interface CardProps {
    children: React.ReactNode
    className?: string
    padding?: 'sm' | 'md' | 'lg'
}

export function Card({ children, className, padding = 'md' }: CardProps) {
    return (
        <div
            className={cn(
                'bg-white border border-slate-200 rounded-2xl',
                {
                    'p-4': padding === 'sm',
                    'p-6': padding === 'md',
                    'p-8': padding === 'lg',
                },
                className
            )}
        >
            {children}
        </div>
    )
}

export function CardHeader({
    title,
    subtitle,
    icon,
    action,
}: {
    title: string
    subtitle?: string
    icon?: React.ReactNode
    action?: React.ReactNode
}) {
    return (
        <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex items-center gap-2">
                {icon && (
                    <span className="text-slate-500">{icon}</span>
                )}
                <div>
                    <h2 className="font-semibold text-slate-900">{title}</h2>
                    {subtitle && (
                        <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>
                    )}
                </div>
            </div>
            {action}
        </div>
    )
}