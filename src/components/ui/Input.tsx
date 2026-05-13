// src/components/ui/Input.tsx
import { cn } from '@/lib/utils'
import { type InputHTMLAttributes, forwardRef } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string
    error?: string
    hint?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, error, hint, id, ...props }, ref) => {
        const inputId = id || label?.toLowerCase().replace(/\s/g, '-')

        return (
            <div className="flex flex-col gap-1">
                {label && (
                    <label htmlFor={inputId} className="text-sm font-medium" style={{ color: 'var(--app-text)' }}>
                        {label}
                    </label>
                )}
                <input
                    ref={ref}
                    id={inputId}
                    className={cn(
                        'w-full px-3 py-2 text-sm rounded-lg border transition-colors duration-200',
                        'focus:outline-none focus:ring-2 focus:ring-offset-0',
                        error
                            ? 'focus:ring-red-400'
                            : '',
                        className
                    )}
                    style={{
                        background: 'var(--app-surface2)',
                        color: 'var(--app-text)',
                        borderColor: error ? 'rgba(251, 113, 133, .4)' : 'var(--app-border)',
                    }}
                    {...props}
                />
                {hint && !error && (
                    <p className="text-xs" style={{ color: 'var(--app-muted)' }}>{hint}</p>
                )}
                {error && (
                    <p className="text-xs flex items-center gap-1" style={{ color: 'var(--app-red)' }}>
                        <span>⚠</span> {error}
                    </p>
                )}
            </div>
        )
    }
)

Input.displayName = 'Input'
export default Input