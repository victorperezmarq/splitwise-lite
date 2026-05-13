// src/components/ui/Button.tsx
import { cn } from '@/lib/utils'
import { type ButtonHTMLAttributes, forwardRef } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost'
    size?: 'sm' | 'md' | 'lg'
    isLoading?: boolean
}

// forwardRef permite usar ref en el botón desde componentes padre
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', isLoading, children, disabled, ...props }, ref) => {
        return (
            <button
                ref={ref}
                disabled={disabled || isLoading}
                className={cn(
                    // Base
                    'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
                    // Variantes
                    variant === 'primary' && 'text-white',
                    variant === 'secondary' && 'border',
                    variant === 'danger' && 'text-white',
                    variant === 'ghost' && 'hover:opacity-80',
                    // Tamaños
                    {
                        'text-sm px-3 py-1.5': size === 'sm',
                        'text-sm px-4 py-2': size === 'md',
                        'text-base px-6 py-3': size === 'lg',
                    },
                    className
                )}
                style={{
                    ...(variant === 'primary' ? { background: 'var(--app-accent2)', color: 'white' } : {}),
                    ...(variant === 'secondary' ? { background: 'var(--app-surface2)', color: 'var(--app-text)', borderColor: 'var(--app-border)' } : {}),
                    ...(variant === 'danger' ? { background: '#e11d48', color: 'white' } : {}),
                    ...(variant === 'ghost' ? { color: 'var(--app-sub)', background: 'transparent' } : {}),
                    ['--tw-ring-offset-color' as string]: 'var(--app-bg)',
                    ['--tw-ring-color' as string]: variant === 'danger' ? '#f43f5e' : 'var(--app-accent)',
                }}
                {...props}
            >
                {isLoading && (
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                )}
                {children}
            </button>
        )
    }
)

Button.displayName = 'Button'
export default Button