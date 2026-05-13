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
                'rounded-2xl border',
                {
                    'p-4': padding === 'sm',
                    'p-6': padding === 'md',
                    'p-8': padding === 'lg',
                },
                className
            )}
            style={{ background: 'var(--app-surface)', borderColor: 'var(--app-border)' }}
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
                    <span style={{ color: 'var(--app-muted)' }}>{icon}</span>
                )}
                <div>
                    <h2 className="font-semibold" style={{ color: 'var(--app-white)' }}>{title}</h2>
                    {subtitle && (
                        <p className="text-xs mt-0.5" style={{ color: 'var(--app-muted)' }}>{subtitle}</p>
                    )}
                </div>
            </div>
            {action}
        </div>
    )
}