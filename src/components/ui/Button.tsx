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
                    {
                        'bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-500': variant === 'primary',
                        'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 focus-visible:ring-slate-400': variant === 'secondary',
                        'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500': variant === 'danger',
                        'text-slate-600 hover:bg-slate-100 focus-visible:ring-slate-400': variant === 'ghost',
                    },
                    // Tamaños
                    {
                        'text-sm px-3 py-1.5': size === 'sm',
                        'text-sm px-4 py-2': size === 'md',
                        'text-base px-6 py-3': size === 'lg',
                    },
                    className
                )}
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