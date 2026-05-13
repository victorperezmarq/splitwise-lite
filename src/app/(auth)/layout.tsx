export default function AuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--app-bg)' }}>
            <div className="w-full max-w-md">
                {/* Logo / branding */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4" style={{ background: 'var(--app-accent2)' }}>
                        <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold" style={{ color: 'var(--app-white)' }}>Splitwise Lite</h1>
                    <p className="text-sm mt-1" style={{ color: 'var(--app-sub)' }}>Gastos compartidos sin dramas</p>
                </div>
                {/* Las páginas de login/register se renderizan aquí */}
                {children}
            </div>
        </div>
    )
}