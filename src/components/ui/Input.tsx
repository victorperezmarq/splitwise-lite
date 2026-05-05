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
                    <label htmlFor={inputId} className="text-sm font-medium text-slate-700">
                        {label}
                    </label>
                )}
                <input
                    ref={ref}
                    id={inputId}
                    className={cn(
                        'w-full px-3 py-2 text-sm rounded-lg border transition-colors duration-200',
                        'placeholder:text-slate-400 bg-white',
                        'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
                        error
                            ? 'border-red-400 focus:ring-red-400'
                            : 'border-slate-200 hover:border-slate-300',
                        className
                    )}
                    {...props}
                />
                {hint && !error && (
                    <p className="text-xs text-slate-400">{hint}</p>
                )}
                {error && (
                    <p className="text-xs text-red-500 flex items-center gap-1">
                        <span>⚠</span> {error}
                    </p>
                )}
            </div>
        )
    }
)

Input.displayName = 'Input'
export default Input