import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Splitwise Lite — Gastos compartidos sin dramas',
    description:
        'La forma más sencilla de gestionar gastos compartidos con tus compañeros de piso. Sin líos, sin deudas pendientes, sin dramas.',
}

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-[#0a0f1e] text-white overflow-x-hidden">
            {/* ───────────────────────── NAV ───────────────────────── */}
            <nav className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-6 py-4 md:px-12 backdrop-blur-md bg-[#0a0f1e]/80 border-b border-white/5">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <span className="font-bold text-lg tracking-tight">Splitwise Lite</span>
                </div>
                <div className="flex items-center gap-3">
                    <Link
                        href="/login"
                        className="text-sm font-medium text-slate-300 hover:text-white transition-colors px-4 py-2 rounded-lg hover:bg-white/5"
                    >
                        Iniciar sesión
                    </Link>
                    <Link
                        href="/register"
                        className="text-sm font-semibold bg-blue-600 hover:bg-blue-500 transition-all duration-200 px-4 py-2 rounded-lg shadow-lg shadow-blue-600/30 hover:shadow-blue-500/40 hover:-translate-y-px"
                    >
                        Crear cuenta
                    </Link>
                </div>
            </nav>

            {/* ───────────────────────── HERO ───────────────────────── */}
            <section className="relative flex flex-col items-center justify-center text-center px-6 pt-40 pb-32 md:pt-52 md:pb-40 overflow-hidden">
                {/* Blobs de fondo */}
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none" />
                <div className="absolute top-1/2 left-1/4 w-[400px] h-[400px] rounded-full bg-indigo-600/10 blur-[100px] pointer-events-none" />
                <div className="absolute top-1/2 right-1/4 w-[400px] h-[400px] rounded-full bg-cyan-500/8 blur-[100px] pointer-events-none" />

                {/* Badge */}
                <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold px-4 py-1.5 rounded-full mb-6 backdrop-blur-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
                    Para pisos de estudiantes y compañeros de piso
                </div>

                <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-[1.08] mb-6 max-w-4xl">
                    Gastos compartidos{' '}
                    <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                        sin dramas
                    </span>
                </h1>

                <p className="text-lg md:text-xl text-slate-400 max-w-2xl mb-10 leading-relaxed">
                    Registra los gastos del piso, ve quién debe qué a quién y salda deudas de un vistazo.
                    Sin hojas de cálculo, sin discusiones, sin líos.
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                    <Link
                        href="/register"
                        id="cta-register"
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold px-8 py-4 rounded-2xl shadow-2xl shadow-blue-600/40 hover:shadow-blue-500/50 hover:-translate-y-0.5 transition-all duration-200 text-base"
                    >
                        Empieza gratis
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                    </Link>
                    <Link
                        href="/login"
                        id="cta-login"
                        className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white font-semibold px-8 py-4 rounded-2xl transition-all duration-200 hover:-translate-y-0.5 text-base"
                    >
                        Ya tengo cuenta
                    </Link>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-8 mt-16 text-center">
                    {[
                        { value: '100%', label: 'Gratis' },
                        { value: '∞', label: 'Grupos' },
                        { value: '0', label: 'Dramas' },
                    ].map(({ value, label }) => (
                        <div key={label}>
                            <div className="text-3xl font-black text-white">{value}</div>
                            <div className="text-xs text-slate-500 mt-1 uppercase tracking-widest">{label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ───────────────────────── MOCKUP / PREVIEW ───────────────────────── */}
            <section className="relative px-6 md:px-12 pb-24">
                <div className="max-w-5xl mx-auto">
                    <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl shadow-black/50 bg-[#111827]">
                        {/* Barra de navegación fake */}
                        <div className="flex items-center gap-2 px-6 py-4 border-b border-white/5 bg-[#0d1526]">
                            <div className="flex gap-1.5">
                                <span className="w-3 h-3 rounded-full bg-red-500/70" />
                                <span className="w-3 h-3 rounded-full bg-yellow-500/70" />
                                <span className="w-3 h-3 rounded-full bg-green-500/70" />
                            </div>
                            <div className="flex-1 mx-4">
                                <div className="bg-white/5 rounded-lg px-4 py-1.5 text-xs text-slate-500 w-56 mx-auto text-center">
                                    splitwise-lite.app/groups
                                </div>
                            </div>
                        </div>

                        {/* Panel fake de la app */}
                        <div className="p-8 md:p-12 grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Sidebar fake */}
                            <div className="space-y-2">
                                <div className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4">Mis grupos</div>
                                {[
                                    { name: 'Piso Goya 14', amount: '12,50 €', color: 'bg-blue-500' },
                                    { name: 'Cena cumpleaños', amount: '8,00 €', color: 'bg-purple-500' },
                                    { name: 'Viaje Praga', amount: '47,30 €', color: 'bg-emerald-500' },
                                ].map((g) => (
                                    <div key={g.name} className={`flex items-center justify-between p-3 rounded-xl ${g.name === 'Piso Goya 14' ? 'bg-blue-600/20 border border-blue-500/30' : 'bg-white/3 hover:bg-white/5'} cursor-default transition-colors`}>
                                        <div className="flex items-center gap-3">
                                            <div className={`w-2.5 h-2.5 rounded-full ${g.color}`} />
                                            <span className="text-sm text-slate-300 font-medium">{g.name}</span>
                                        </div>
                                        <span className="text-xs text-red-400 font-semibold">{g.amount}</span>
                                    </div>
                                ))}
                            </div>

                            {/* Main content fake */}
                            <div className="md:col-span-2 space-y-4">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="font-bold text-white">Piso Goya 14</h3>
                                    <div className="text-xs bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full font-semibold">3 miembros</div>
                                </div>

                                {/* Balance card */}
                                <div className="bg-gradient-to-br from-blue-600/20 to-indigo-600/10 border border-blue-500/20 rounded-2xl p-5">
                                    <div className="text-xs text-slate-400 mb-1">Tu balance total</div>
                                    <div className="text-3xl font-black text-red-400">−12,50 €</div>
                                    <div className="text-xs text-slate-500 mt-1">Debes a Ana López</div>
                                </div>

                                {/* Gastos recientes */}
                                <div className="space-y-2">
                                    {[
                                        { desc: 'Mercadona semana', amount: '€ 87,40', who: 'Ana', date: 'Hoy', icon: '🛒' },
                                        { desc: 'Luz y gas', amount: '€ 64,20', who: 'Tú', date: 'Ayer', icon: '⚡' },
                                        { desc: 'Netflix compartido', amount: '€ 15,99', who: 'Marcos', date: 'Lun', icon: '🎬' },
                                    ].map((e) => (
                                        <div key={e.desc} className="flex items-center justify-between bg-white/3 rounded-xl px-4 py-3 border border-white/5">
                                            <div className="flex items-center gap-3">
                                                <span className="text-xl">{e.icon}</span>
                                                <div>
                                                    <div className="text-sm font-medium text-slate-200">{e.desc}</div>
                                                    <div className="text-xs text-slate-500">Pagó {e.who} · {e.date}</div>
                                                </div>
                                            </div>
                                            <span className="text-sm font-bold text-slate-100">{e.amount}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ───────────────────────── FEATURES ───────────────────────── */}
            <section className="px-6 md:px-12 py-24 max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-black mb-4">
                        Todo lo que necesitas,{' '}
                        <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                            nada que no uses
                        </span>
                    </h2>
                    <p className="text-slate-400 text-lg max-w-xl mx-auto">
                        Diseñado para pisos reales. Simple, rápido y sin curva de aprendizaje.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        {
                            icon: '👥',
                            title: 'Grupos por piso',
                            desc: 'Crea un grupo para tu piso e invita a tus compañeros. Cada grupo tiene sus propios gastos y balances.',
                            gradient: 'from-blue-500/20 to-blue-600/5',
                            border: 'border-blue-500/20',
                        },
                        {
                            icon: '⚖️',
                            title: 'Balances en tiempo real',
                            desc: 'Ve exactamente quién debe cuánto a quién en cada momento. Sin cálculos manuales ni errores.',
                            gradient: 'from-indigo-500/20 to-indigo-600/5',
                            border: 'border-indigo-500/20',
                        },
                        {
                            icon: '✅',
                            title: 'Salda deudas fácilmente',
                            desc: 'Registra los pagos de liquidación con un click. El balance se actualiza automáticamente.',
                            gradient: 'from-cyan-500/20 to-cyan-600/5',
                            border: 'border-cyan-500/20',
                        },
                        {
                            icon: '📂',
                            title: 'Historial completo',
                            desc: 'Consulta todos los gastos pasados, filtra por categoría o fecha y exporta a CSV.',
                            gradient: 'from-emerald-500/20 to-emerald-600/5',
                            border: 'border-emerald-500/20',
                        },
                        {
                            icon: '🔔',
                            title: 'Notificaciones',
                            desc: 'Recibe avisos cuando alguien añada un gasto, te pague o te solicite un pago.',
                            gradient: 'from-violet-500/20 to-violet-600/5',
                            border: 'border-violet-500/20',
                        },
                        {
                            icon: '🔒',
                            title: 'Privado y seguro',
                            desc: 'Solo los miembros del grupo ven sus datos. Autenticación segura con email y contraseña.',
                            gradient: 'from-rose-500/20 to-rose-600/5',
                            border: 'border-rose-500/20',
                        },
                    ].map(({ icon, title, desc, gradient, border }) => (
                        <div
                            key={title}
                            className={`bg-gradient-to-br ${gradient} border ${border} rounded-2xl p-6 hover:-translate-y-1 transition-all duration-300 hover:shadow-lg`}
                        >
                            <div className="text-4xl mb-4">{icon}</div>
                            <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
                            <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ───────────────────────── HOW IT WORKS ───────────────────────── */}
            <section className="px-6 md:px-12 py-24 relative">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-900/10 to-transparent pointer-events-none" />
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-black mb-4">Cómo funciona</h2>
                        <p className="text-slate-400 text-lg">En tres pasos lo tienes funcionando</p>
                    </div>

                    <div className="relative">
                        {/* Línea conectora */}
                        <div className="hidden md:block absolute top-10 left-1/2 -translate-x-1/2 w-px h-[calc(100%-80px)] bg-gradient-to-b from-blue-500/30 via-indigo-500/30 to-transparent" />

                        <div className="space-y-12">
                            {[
                                {
                                    step: '01',
                                    title: 'Crea tu grupo',
                                    desc: 'Regístrate, crea un grupo para tu piso y comparte el enlace de invitación con tus compañeros. Listo en menos de un minuto.',
                                    side: 'left',
                                },
                                {
                                    step: '02',
                                    title: 'Añade los gastos',
                                    desc: 'Cada vez que alguien pague algo compartido (supermercado, luz, internet…), lo añade a la app con el importe y quién participó.',
                                    side: 'right',
                                },
                                {
                                    step: '03',
                                    title: 'Salda y a vivir',
                                    desc: 'La app calcula automáticamente quién debe qué. Cuando alguien pague su parte, se registra y el balance queda a cero.',
                                    side: 'left',
                                },
                            ].map(({ step, title, desc, side }) => (
                                <div key={step} className={`flex items-start gap-8 ${side === 'right' ? 'md:flex-row-reverse' : ''}`}>
                                    <div className="flex-shrink-0 relative">
                                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-xl shadow-blue-600/30">
                                            <span className="text-2xl font-black text-white/90">{step}</span>
                                        </div>
                                    </div>
                                    <div className={`pt-4 flex-1 ${side === 'right' ? 'md:text-right' : ''}`}>
                                        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
                                        <p className="text-slate-400 leading-relaxed">{desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ───────────────────────── CTA FINAL ───────────────────────── */}
            <section className="px-6 md:px-12 py-24">
                <div className="max-w-3xl mx-auto">
                    <div className="relative rounded-3xl overflow-hidden border border-blue-500/20 bg-gradient-to-br from-blue-600/20 via-indigo-600/15 to-[#111827] p-12 text-center">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-64 bg-blue-600/20 blur-[80px] pointer-events-none" />
                        <div className="relative">
                            <h2 className="text-3xl md:text-5xl font-black mb-4">
                                ¿Listo para acabar con las deudas del piso?
                            </h2>
                            <p className="text-slate-400 text-lg mb-10">
                                Únete gratis y empieza a gestionar los gastos compartidos hoy mismo.
                            </p>
                            <div className="flex flex-col sm:flex-row justify-center gap-4">
                                <Link
                                    href="/register"
                                    id="cta-register-bottom"
                                    className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold px-8 py-4 rounded-2xl shadow-2xl shadow-blue-600/40 hover:shadow-blue-500/50 hover:-translate-y-0.5 transition-all duration-200 text-base"
                                >
                                    Crear cuenta gratis
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                    </svg>
                                </Link>
                                <Link
                                    href="/login"
                                    id="cta-login-bottom"
                                    className="inline-flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white font-semibold px-8 py-4 rounded-2xl transition-all duration-200 text-base"
                                >
                                    Iniciar sesión
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ───────────────────────── FOOTER ───────────────────────── */}
            <footer className="px-6 md:px-12 py-8 border-t border-white/5 text-center">
                <div className="flex items-center justify-center gap-2 mb-3">
                    <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <span className="font-bold text-sm text-slate-400">Splitwise Lite</span>
                </div>
                <p className="text-xs text-slate-600">
                    Hecho con ❤️ para pisos con mejores cosas en qué pensar que las deudas.
                </p>
            </footer>
        </div>
    )
}
