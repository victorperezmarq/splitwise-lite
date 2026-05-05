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
                    <label htmlFor={inputId} className="text-sm font-medium text-slate-700">
                        {label}
                    </label>
                )}

                <label
                    htmlFor={inputId}
                    className={cn(
                        'flex flex-col items-center justify-center px-4 py-6 border-2 border-dashed rounded-lg cursor-pointer transition-colors',
                        error
                            ? 'border-red-400 bg-red-50'
                            : 'border-slate-200 hover:border-blue-400 hover:bg-blue-50 bg-white',
                        className
                    )}
                >
                    <Upload className="w-5 h-5 text-slate-400 mb-2" />
                    <span className="text-sm text-slate-600 text-center">
                        Arrastra un archivo o haz clic
                    </span>
                    <span className="text-xs text-slate-400 mt-0.5">
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
                    <div className="text-xs text-green-600">
                        ✓ {preview}
                    </div>
                )}

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

FileInput.displayName = 'FileInput'
export default FileInput