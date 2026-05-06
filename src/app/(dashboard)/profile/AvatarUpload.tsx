// src/app/(dashboard)/profile/AvatarUpload.tsx
'use client'

import { useState, useRef } from 'react'
import { toast } from 'sonner'
import { Camera, Loader2 } from 'lucide-react'
import { updateAvatar } from './actions'

export default function AvatarUpload({
    currentAvatar,
    fullName,
}: {
    currentAvatar: string | null
    fullName: string
}) {
    const [preview, setPreview] = useState<string | null>(currentAvatar)
    const [isLoading, setIsLoading] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)

    async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.currentTarget.files?.[0]
        if (!file) return

        // Validar
        if (file.size > 2 * 1024 * 1024) {
            toast.error('La imagen no puede superar 2MB')
            return
        }
        if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
            toast.error('Solo se permiten JPG, PNG o WebP')
            return
        }

        setIsLoading(true)

        // Preview instantáneo antes de subir
        const objectUrl = URL.createObjectURL(file)
        setPreview(objectUrl)

        // Leer como base64
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = async () => {
            const base64 = (reader.result as string).split(',')[1]

            const result = await updateAvatar({
                base64,
                fileName: file.name,
                mimeType: file.type,
            })

            if (result.error) {
                toast.error(result.error)
                setPreview(currentAvatar)
            } else {
                toast.success('Avatar actualizado')
                if (result.avatarUrl) setPreview(result.avatarUrl)
            }

            setIsLoading(false)
            URL.revokeObjectURL(objectUrl)
        }
    }

    const initial = fullName?.[0]?.toUpperCase() ?? '?'

    return (
        <div className="flex flex-col items-center gap-4">
            {/* Avatar preview */}
            <div className="relative">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                    {preview ? (
                        <img
                            src={preview}
                            alt="Avatar"
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <span className="text-white text-3xl font-bold">{initial}</span>
                    )}
                </div>

                {/* Botón de cámara superpuesto */}
                <button
                    type="button"
                    onClick={() => inputRef.current?.click()}
                    disabled={isLoading}
                    className="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center shadow-lg transition-colors disabled:opacity-50"
                >
                    {isLoading
                        ? <Loader2 className="w-4 h-4 animate-spin" />
                        : <Camera className="w-4 h-4" />
                    }
                </button>
            </div>

            <p className="text-xs text-slate-400 text-center">
                JPG, PNG o WebP · máx. 2MB
            </p>

            {/* Input oculto */}
            <input
                ref={inputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={handleFileChange}
            />
        </div>
    )
}