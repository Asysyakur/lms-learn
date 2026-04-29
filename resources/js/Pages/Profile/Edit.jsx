import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import AdminLayout from '@/Layouts/AdminLayout';
import AppLayout from '@/Layouts/AppLayout';
import { EnvelopeIcon, KeyIcon, UserCircleIcon } from '@heroicons/react/24/outline';
import { Head, useForm } from '@inertiajs/react';

export default function Edit({ user, status }) {
    const { data, setData, put, processing, errors, recentlySuccessful, reset } = useForm({
        name: user.name || '',
        email: user.email || '',
        password: '',
        password_confirmation: '',
    });

    function submit(e) {
        e.preventDefault();

        put(route('profile.update'), {
            onSuccess: () => reset('password', 'password_confirmation'),
        });
    }

    const content = (
        <>
            <Head title="Profil" />

            <div className="grid gap-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
                <section className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200">
                    <div className="flex items-center gap-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-[rgb(var(--color-primary))] text-white">
                            <UserCircleIcon className="h-9 w-9" />
                        </div>
                        <div className="min-w-0">
                            <h2 className="truncate text-xl font-extrabold text-slate-900">{user.name}</h2>
                            <p className="truncate text-sm font-medium text-slate-500">{user.email}</p>
                        </div>
                    </div>

                    <div className="mt-6 space-y-3 text-sm">
                        <div className="flex items-center gap-3 rounded-lg bg-slate-50 px-3 py-3 text-slate-700">
                            <UserCircleIcon className="h-5 w-5 shrink-0 text-slate-400" />
                            <span className="truncate">{user.name}</span>
                        </div>
                        <div className="flex items-center gap-3 rounded-lg bg-slate-50 px-3 py-3 text-slate-700">
                            <EnvelopeIcon className="h-5 w-5 shrink-0 text-slate-400" />
                            <span className="truncate">{user.email}</span>
                        </div>
                    </div>
                </section>

                <section className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200">
                    <div className="mb-5 flex items-start justify-between gap-3">
                        <div>
                            <h2 className="text-lg font-extrabold text-slate-900">Ubah Profil</h2>
                            <p className="mt-1 text-sm text-slate-500">Perbarui nama, email, dan password akun.</p>
                        </div>
                        <KeyIcon className="h-6 w-6 shrink-0 text-slate-300" />
                    </div>

                    {(status || recentlySuccessful) && (
                        <div className="mb-4 rounded-lg bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700 ring-1 ring-emerald-100">
                            {status || 'Profil berhasil diperbarui.'}
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-5">
                        <div>
                            <InputLabel htmlFor="name" value="Name" />
                            <TextInput
                                id="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                className="mt-1 block w-full"
                            />
                            <InputError message={errors.name} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="email" value="Email" />
                            <TextInput
                                id="email"
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className="mt-1 block w-full"
                            />
                            <InputError message={errors.email} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="password" value="New Password" />
                            <TextInput
                                id="password"
                                type="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                className="mt-1 block w-full"
                                placeholder="Leave blank to keep current password"
                            />
                            <InputError message={errors.password} className="mt-2" />
                        </div>

                        <div>
                            <InputLabel htmlFor="password_confirmation" value="Confirm Password" />
                            <TextInput
                                id="password_confirmation"
                                type="password"
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                className="mt-1 block w-full"
                            />
                        </div>

                        <div className="flex items-center justify-end">
                            <PrimaryButton disabled={processing}>Simpan Perubahan</PrimaryButton>
                        </div>
                    </form>
                </section>
            </div>
        </>
    );

    return user.role === 'admin' ? (
        <AdminLayout title="Profil">{content}</AdminLayout>
    ) : (
        <AppLayout title="Profil">{content}</AppLayout>
    );
}
