// src/components/ui/FileInput.tsx
import { cn } from '@/lib/utils'
import { Upload } from 'lucide-react'
import { type InputHTMLAttributes, forwardRef } from 'react'

interface FileInputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string
    error?: string
    hint?: string
    preview?: string | null
}

const FileInput = forwardRef<HTMLInputElement, FileInputProps>(
    ({ className, label, error, hint, preview, id, ...props }, ref) => {
        const inputId = id || label?.toLowerCase().replace(/\s/g, '-')

        return (
            <div className="flex flex-col gap-1">
                {label && (
                    <label htmlFor={inputId} className="text-sm font-medium" style={{ color: 'var(--app-text)' }}>
                        {label}
                    </label>
                )}

                <label
                    htmlFor={inputId}
                    className={cn(
                        'flex flex-col items-center justify-center px-4 py-6 border-2 border-dashed rounded-lg cursor-pointer transition-colors',
                        className
                    )}
                    style={{
                        borderColor: error ? 'rgba(251, 113, 133, .4)' : 'var(--app-border2)',
                        background: error ? 'rgba(251, 113, 133, .05)' : 'var(--app-surface2)',
                    }}
                >
                    <Upload className="w-5 h-5 mb-2" style={{ color: 'var(--app-muted)' }} />
                    <span className="text-sm text-center" style={{ color: 'var(--app-sub)' }}>
                        Arrastra un archivo o haz clic
                    </span>
                    <span className="text-xs mt-0.5" style={{ color: 'var(--app-muted)' }}>
                        PDF, JPG o PNG (máx. 5MB)
                    </span>

                    <input
                        ref={ref}
                        id={inputId}
                        type="file"
                        className="hidden"
                        accept=".pdf,.jpg,.jpeg,.png"
                        {...props}
                    />
                </label>

                {preview && (
                    <div className="text-xs" style={{ color: 'var(--app-green)' }}>
                        ✓ {preview}
                    </div>
                )}

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

FileInput.displayName = 'FileInput'
export default FileInput