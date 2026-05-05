// src/app/(dashboard)/groups/[groupId]/CopyInviteButton.tsx
'use client'

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import { toast } from 'sonner'

export const CopyInviteButton = ({ code }: { code: string }) => {
    const [copied, setCopied] = useState(false)

    async function handleCopy() {
        await navigator.clipboard.writeText(code)
        setCopied(true)
        toast.success('Código copiado al portapapeles')
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <button
            onClick={handleCopy}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            title="Copiar código"
        >
            {copied
                ? <Check className="w-4 h-4 text-green-500" />
                : <Copy className="w-4 h-4" />
            }
        </button>
    )
}