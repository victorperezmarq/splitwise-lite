// src/app/(dashboard)/profile/page.tsx
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { User, Lock, ShieldAlert } from 'lucide-react'
import AvatarUpload from './AvatarUpload'
import ProfileForm from './ProfileForm'
import PasswordForm from './PasswordForm'
import DeleteAccount from './DeleteAccountAction'

export default async function ProfilePage() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    if (!profile) redirect('/login')

    // Estadísticas del usuario
    const { count: groupCount } = await supabase
        .from('group_members')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)

    const { count: expenseCount } = await supabase
        .from('expenses')
        .select('*', { count: 'exact', head: true })
        .eq('paid_by', user.id)

    const { count: paymentCount } = await supabase
        .from('debt_payments')
        .select('*', { count: 'exact', head: true })
        .eq('from_user', user.id)

    return (
        <div className="space-y-6 max-w-lg mx-auto">

            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-slate-900">Mi perfil</h1>
                <p className="text-slate-500 text-sm mt-1">
                    Gestiona tu cuenta y preferencias
                </p>
            </div>

            {/* Avatar + stats */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6">
                <div className="flex flex-col sm:flex-row items-center gap-6">

                    {/* Avatar */}
                    <AvatarUpload
                        currentAvatar={profile.avatar_url}
                        fullName={profile.full_name}
                    />

                    {/* Info + stats */}
                    <div className="flex-1 text-center sm:text-left">
                        <h2 className="text-xl font-bold text-slate-900">
                            {profile.full_name}
                        </h2>
                        <p className="text-sm text-slate-400 mt-0.5">{user.email}</p>

                        {/* Stats del usuario */}
                        <div className="flex justify-center sm:justify-start gap-6 mt-4">
                            <div>
                                <p className="text-lg font-bold text-slate-900">{groupCount ?? 0}</p>
                                <p className="text-xs text-slate-400">Grupos</p>
                            </div>
                            <div>
                                <p className="text-lg font-bold text-slate-900">{expenseCount ?? 0}</p>
                                <p className="text-xs text-slate-400">Gastos</p>
                            </div>
                            <div>
                                <p className="text-lg font-bold text-slate-900">{paymentCount ?? 0}</p>
                                <p className="text-xs text-slate-400">Pagos</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            {/* Editar nombre */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6">
                <h2 className="font-semibold text-slate-900 mb-1 flex items-center gap-2">
                    <User className="w-4 h-4 text-slate-400" />
                    Información personal
                </h2>
                <p className="text-xs text-slate-400 mb-5">
                    Este nombre se mostrará a los demás miembros de tus grupos
                </p>
                <ProfileForm fullName={profile.full_name} />
            </div>

            {/* Cambiar contraseña */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6">
                <h2 className="font-semibold text-slate-900 mb-1 flex items-center gap-2">
                    <Lock className="w-4 h-4 text-slate-400" />
                    Seguridad
                </h2>
                <p className="text-xs text-slate-400 mb-5">
                    Usa una contraseña segura que no uses en otros sitios
                </p>
                <PasswordForm />
            </div>

            {/* Zona de peligro */}
            <div className="bg-white border border-red-200 rounded-2xl p-6">
                <h2 className="font-semibold text-red-700 mb-1 flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4" />
                    Zona de peligro
                </h2>
                <p className="text-xs text-slate-400 mb-5">
                    Estas acciones son irreversibles. Procede con cuidado.
                </p>
                <DeleteAccount />
            </div>

        </div>
    )
}