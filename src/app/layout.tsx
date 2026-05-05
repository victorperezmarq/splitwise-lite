import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from 'sonner'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'Splitwise Lite',
    description: 'Gestión de gastos compartidos para pisos de estudiantes',
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="es">
            <body className={inter.className}>
                {children}
                {/*
          Toaster de Sonner: renderiza las notificaciones toast.
          Lo ponemos aquí (root) para que esté disponible en TODA la app,
          incluyendo las páginas de auth y el dashboard.
        */}
                <Toaster richColors position="top-right" />
            </body>
        </html>
    )
}