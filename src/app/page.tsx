import Link from 'next/link'
import type { Metadata } from 'next'
import './landing.css'

export const metadata: Metadata = {
    title: 'Splitwise Lite — Gastos compartidos, cero dramas',
    description:
        'Divide gastos con tu grupo, calcula deudas automáticamente y liquida con un toque. Gratis, en tiempo real, sin excusas.',
}

/* ─── tiny SVG icons (no deps) ─── */
const ArrowRight = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
)

const IconSplit = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 3h5v5M4 20L21 3M21 16v5h-5M15 15l6 6M4 4l5 5" /></svg>
)

const IconBell = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" /></svg>
)

const IconShield = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
)

const IconCamera = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" /><circle cx="12" cy="13" r="4" /></svg>
)

const IconPieChart = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21.21 15.89A10 10 0 118 2.83" /><path d="M22 12A10 10 0 0012 2v10z" /></svg>
)

const IconUsers = () => (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" /></svg>
)

export default function LandingPage() {
    return (
        <div className="lp">

            {/* ━━━ NAVBAR ━━━ */}
            <nav className="lp-nav">
                <div className="lp-wrap lp-nav__inner">
                    <Link href="/" className="lp-nav__logo" aria-label="Splitwise Lite home">
                        <span className="lp-nav__mark">S</span>
                        <span className="lp-nav__wordmark">Splitwise Lite</span>
                    </Link>
                    <div className="lp-nav__actions">
                        <Link href="/login" className="lp-btn lp-btn--ghost">Entrar</Link>
                        <Link href="/register" className="lp-btn lp-btn--fill">
                            Crear cuenta <ArrowRight />
                        </Link>
                    </div>
                </div>
            </nav>

            {/* ━━━ HERO ━━━ */}
            <header className="lp-hero">
                <div className="lp-hero__glow" aria-hidden="true" />
                <div className="lp-wrap lp-hero__content">
                    <p className="lp-hero__eyebrow lp-anim lp-anim--1">
                        <span className="lp-hero__dot" />
                        Gestión de gastos compartidos
                    </p>
                    <h1 className="lp-hero__h lp-anim lp-anim--2">
                        Divide gastos.<br />
                        <span className="lp-hero__h--accent">No amistades.</span>
                    </h1>
                    <p className="lp-hero__sub lp-anim lp-anim--3">
                        Añade un gasto, elige quién participa y la app calcula al céntimo
                        quién debe a quién. Sin hojas de cálculo, sin excusas, sin dramas.
                    </p>
                    <div className="lp-hero__cta lp-anim lp-anim--4">
                        <Link href="/register" className="lp-btn lp-btn--fill lp-btn--lg" id="hero-register">
                            Empezar gratis <ArrowRight />
                        </Link>
                        <Link href="/login" className="lp-btn lp-btn--outline lp-btn--lg" id="hero-login">
                            Ya tengo cuenta
                        </Link>
                    </div>
                </div>
            </header>

            {/* ━━━ MARQUEE ━━━ */}
            <div className="lp-marquee" aria-hidden="true">
                <div className="lp-marquee__track">
                    {Array.from({ length: 2 }).map((_, i) => (
                        <span key={i} className="lp-marquee__seg">
                            GRATIS PARA SIEMPRE&ensp;·&ensp;LIQUIDACIÓN INSTANTÁNEA&ensp;·&ensp;TIEMPO REAL&ensp;·&ensp;TICKETS CON FOTO&ensp;·&ensp;DIVISIÓN FLEXIBLE&ensp;·&ensp;PRIVADO POR DISEÑO&ensp;·&ensp;
                        </span>
                    ))}
                </div>
            </div>

            {/* ━━━ APP PREVIEW ━━━ */}
            <section className="lp-preview">
                <div className="lp-wrap">
                    <div className="lp-preview__window">
                        <div className="lp-preview__titlebar">
                            <div className="lp-preview__dots">
                                <span /><span /><span />
                            </div>
                            <div className="lp-preview__url">splitwise-lite.app/groups/viaje-praga</div>
                            <div />
                        </div>
                        <div className="lp-preview__body">
                            {/* sidebar */}
                            <aside className="lp-preview__sidebar">
                                <div className="lp-preview__sidebar-title">Mis grupos</div>
                                {[
                                    { name: 'Viaje Praga', emoji: '✈️', active: true },
                                    { name: 'Piso Goya 14', emoji: '🏠', active: false },
                                    { name: 'Cena cumple', emoji: '🎂', active: false },
                                ].map(g => (
                                    <div key={g.name} className={`lp-preview__group ${g.active ? 'lp-preview__group--active' : ''}`}>
                                        <span className="lp-preview__group-emoji">{g.emoji}</span>
                                        <span>{g.name}</span>
                                    </div>
                                ))}
                            </aside>
                            {/* main */}
                            <div className="lp-preview__main">
                                <div className="lp-preview__header-row">
                                    <h3 className="lp-preview__group-name">✈️ Viaje Praga</h3>
                                    <span className="lp-preview__badge">4 personas</span>
                                </div>
                                {/* balance card */}
                                <div className="lp-preview__balance">
                                    <div className="lp-preview__balance-label">Tu balance</div>
                                    <div className="lp-preview__balance-val lp-preview__balance-val--neg">−23,00 €</div>
                                    <div className="lp-preview__balance-hint">Debes a Ana García</div>
                                </div>
                                {/* expenses */}
                                <div className="lp-preview__expenses">
                                    {[
                                        { icon: '🍕', desc: 'Cena en Lokal', who: 'Ana', amount: '€ 87,40', time: 'Hoy' },
                                        { icon: '🎫', desc: 'Entradas castillo', who: 'Tú', amount: '€ 48,00', time: 'Ayer' },
                                        { icon: '🚇', desc: 'Abono transporte', who: 'Carlos', amount: '€ 26,00', time: 'Lun' },
                                    ].map(e => (
                                        <div key={e.desc} className="lp-preview__expense">
                                            <span className="lp-preview__expense-icon">{e.icon}</span>
                                            <div className="lp-preview__expense-info">
                                                <div className="lp-preview__expense-desc">{e.desc}</div>
                                                <div className="lp-preview__expense-meta">Pagó {e.who} · {e.time}</div>
                                            </div>
                                            <span className="lp-preview__expense-amount">{e.amount}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ━━━ FEATURES ━━━ */}
            <section className="lp-section" id="features">
                <div className="lp-wrap">
                    <p className="lp-section__label">Funcionalidades</p>
                    <h2 className="lp-section__h">
                        Todo lo que necesitas.<br />
                        <span className="lp-section__h--muted">Nada que no uses.</span>
                    </h2>

                    <div className="lp-features">
                        {[
                            { icon: <IconSplit />, title: 'Liquidación inteligente', desc: 'El algoritmo calcula el mínimo de transferencias para que todos queden a cero. Menos movimientos, menos líos.' },
                            { icon: <IconBell />, title: 'Tiempo real', desc: 'Cuando alguien añade un gasto o paga una deuda, todos lo ven al instante. Nada se pierde, nada se olvida.' },
                            { icon: <IconCamera />, title: 'Tickets adjuntos', desc: 'Sube la foto del ticket en cada gasto. Adiós a las dudas de «¿pero cuánto era?». Todo queda registrado.' },
                            { icon: <IconUsers />, title: 'División flexible', desc: 'Elige quién participa en cada gasto. No todo el mundo comparte la compra del supermercado.' },
                            { icon: <IconPieChart />, title: 'Analítica de grupo', desc: 'Gráficos por categoría para saber dónde va el dinero del grupo: comida, transporte, ocio, servicios.' },
                            { icon: <IconShield />, title: 'Privado por diseño', desc: 'Row Level Security en base de datos. Solo los miembros de un grupo pueden ver los datos de ese grupo.' },
                        ].map((f, i) => (
                            <div key={i} className="lp-feature">
                                <div className="lp-feature__icon">{f.icon}</div>
                                <h3 className="lp-feature__title">{f.title}</h3>
                                <p className="lp-feature__desc">{f.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ━━━ HOW IT WORKS ━━━ */}
            <section className="lp-section lp-section--dark" id="how">
                <div className="lp-wrap">
                    <p className="lp-section__label">Cómo funciona</p>
                    <h2 className="lp-section__h">
                        Tres pasos.<br />
                        <span className="lp-section__h--muted">Cero fricción.</span>
                    </h2>

                    <div className="lp-steps">
                        {[
                            { n: '01', title: 'Crea un grupo', desc: 'Dale un nombre, comparte el código de invitación y espera a que tus compañeros se unan. Un minuto, máximo.' },
                            { n: '02', title: 'Registra los gastos', desc: 'Indica quién pagó, cuánto y quién participa. Puedes adjuntar la foto del ticket si quieres pruebas.' },
                            { n: '03', title: 'Liquida y a vivir', desc: 'La app calcula las deudas óptimas. Marca el pago como hecho y todos reciben notificación al momento.' },
                        ].map(s => (
                            <div key={s.n} className="lp-step">
                                <div className="lp-step__n">{s.n}</div>
                                <div>
                                    <h3 className="lp-step__title">{s.title}</h3>
                                    <p className="lp-step__desc">{s.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ━━━ SOCIAL PROOF ━━━ */}
            <section className="lp-section" id="proof">
                <div className="lp-wrap">
                    <p className="lp-section__label">Opiniones</p>
                    <h2 className="lp-section__h">
                        Lo que dicen<br />
                        <span className="lp-section__h--muted">los que ya la usan.</span>
                    </h2>

                    <div className="lp-proof">
                        {[
                            { q: 'Llevamos un año con la app para los gastos del piso. Antes era un drama cada fin de mes, ahora en 10 segundos liquidamos.', name: 'Marcos V.', tag: 'Erasmus en Berlín', color: '#6366f1' },
                            { q: 'Las notificaciones en tiempo real son lo mejor. Subes el gasto y al segundo tus compañeros ya lo ven. Nada se pierde.', name: 'Sofía L.', tag: 'Piso compartido', color: '#10b981' },
                            { q: 'El plan de liquidación óptimo nos ahorró pasar de 8 transferencias a solo 2. Literal, matemáticas que te ahorran tiempo.', name: 'Andrés P.', tag: 'Grupo de viajes', color: '#f59e0b' },
                        ].map((t, i) => (
                            <blockquote key={i} className="lp-quote">
                                <p className="lp-quote__text">&ldquo;{t.q}&rdquo;</p>
                                <footer className="lp-quote__footer">
                                    <div className="lp-quote__avatar" style={{ background: `${t.color}20`, color: t.color }}>
                                        {t.name[0]}
                                    </div>
                                    <div>
                                        <div className="lp-quote__name">{t.name}</div>
                                        <div className="lp-quote__tag">{t.tag}</div>
                                    </div>
                                </footer>
                            </blockquote>
                        ))}
                    </div>
                </div>
            </section>

            {/* ━━━ CTA ━━━ */}
            <section className="lp-cta">
                <div className="lp-cta__glow" aria-hidden="true" />
                <div className="lp-wrap lp-cta__inner">
                    <h2 className="lp-cta__h">
                        Deja de deber<br />favores.
                    </h2>
                    <p className="lp-cta__sub">Gratis para siempre. Sin tarjeta. Sin trucos.</p>
                    <div className="lp-cta__actions">
                        <Link href="/register" className="lp-btn lp-btn--fill lp-btn--lg" id="cta-register">
                            Crear cuenta gratis <ArrowRight />
                        </Link>
                        <Link href="/login" className="lp-btn lp-btn--ghost lp-btn--lg" id="cta-login">
                            Iniciar sesión
                        </Link>
                    </div>
                </div>
            </section>

            {/* ━━━ FOOTER ━━━ */}
            <footer className="lp-footer">
                <div className="lp-wrap lp-footer__inner">
                    <span className="lp-footer__copy">© 2025 Splitwise Lite</span>
                    <div className="lp-footer__links">
                        <Link href="/login">Entrar</Link>
                        <Link href="/register">Registrarse</Link>
                    </div>
                </div>
            </footer>

        </div>
    )
}
