'use client'

import { useState } from 'react'
import { CheckCheck, Loader2 } from 'lucide-react'
import { markAllAsRead } from './actions'
import { useRouter } from 'next/navigation'

export default function NotificationActions() {
    const [isPending, setIsPending] = useState(false)
    const router = useRouter()

    const handleMarkAllRead = async () => {
        setIsPending(true)
        try {
            await markAllAsRead()
            router.refresh()
        } catch (error) {
            console.error('Error marking all as read:', error)
        } finally {
            setIsPending(false)
        }
    }

    return (
        <button
            onClick={handleMarkAllRead}
            disabled={isPending}
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {isPending ? (
                <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
                <CheckCheck className="w-4 h-4" />
            )}
            <span>Marcar todo como leído</span>
        </button>
    )
}
