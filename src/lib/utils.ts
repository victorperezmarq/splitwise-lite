import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

// Combina clases de Tailwind evitando conflictos
// Uso: cn('px-4 py-2', isActive && 'bg-blue-500', className)
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

// Formatea moneda en euros
export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('es-ES', {
        style: 'currency',
        currency: 'EUR',
    }).format(amount)
}

// Formatea fecha en español
export function formatDate(date: string): string {
    return new Intl.DateTimeFormat('es-ES', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    }).format(new Date(date))
}