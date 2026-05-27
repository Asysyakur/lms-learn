import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';
import {
    ArrowRightIcon,
    EnvelopeIcon,
    LockClosedIcon,
    SparklesIcon,
    UserIcon,
} from '@heroicons/react/24/outline';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <>
            <Head title="Register" />

            <div className="min-h-screen bg-[rgb(var(--color-background))] px-4 py-6 text-slate-900 sm:px-6 lg:px-8">
                <div className="mx-auto grid min-h-[calc(100vh-3rem)] w-full max-w-6xl overflow-hidden rounded-[2rem] bg-white shadow-2xl shadow-slate-200/70 ring-1 ring-[rgb(var(--color-border))] lg:grid-cols-[1.05fr_0.95fr]">
                    <div className="flex items-center justify-center px-5 py-8 sm:px-8 lg:px-12">
                        <div className="w-full max-w-md">
                            <div className="mb-8">
                                <Link
                                    href="/"
                                    className="inline-flex items-center gap-3 font-black tracking-wide text-[rgb(var(--color-primary))]"
                                >
                                    <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[rgb(var(--color-primary))] text-xl text-white">
                                        O
                                    </span>
                                    OOPCODE
                                </Link>
                            </div>

                            <div className="mb-8">
                                <p className="text-sm font-bold uppercase tracking-[0.2em] text-[rgb(var(--color-primary))]">
                                    Mulai Belajar
                                </p>
                                <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                                    Buat Akun Baru
                                </h1>
                                <p className="mt-3 text-sm leading-6 text-slate-500">
                                    Daftar untuk mengakses materi dan aktivitas
                                    pembelajaran OOP.
                                </p>
                            </div>

                            <form onSubmit={submit} className="space-y-5">
                                <div>
                                    <InputLabel
                                        htmlFor="name"
                                        value="Nama"
                                        className="mb-2 font-bold text-slate-700"
                                    />

                                    <div className="relative">
                                        <UserIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                                        <TextInput
                                            id="name"
                                            name="name"
                                            value={data.name}
                                            className="block min-h-12 w-full rounded-2xl border-slate-200 bg-slate-50 pl-12 pr-4 text-sm font-semibold text-slate-800 transition placeholder:font-medium placeholder:text-slate-400 focus:border-[rgb(var(--color-primary))] focus:bg-white focus:ring-[rgb(37_99_235_/_0.18)]"
                                            autoComplete="name"
                                            isFocused={true}
                                            onChange={(e) =>
                                                setData(
                                                    'name',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Nama lengkap"
                                            required
                                        />
                                    </div>

                                    <InputError
                                        message={errors.name}
                                        className="mt-2"
                                    />
                                </div>

                                <div>
                                    <InputLabel
                                        htmlFor="email"
                                        value="Email"
                                        className="mb-2 font-bold text-slate-700"
                                    />

                                    <div className="relative">
                                        <EnvelopeIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                                        <TextInput
                                            id="email"
                                            type="email"
                                            name="email"
                                            value={data.email}
                                            className="block min-h-12 w-full rounded-2xl border-slate-200 bg-slate-50 pl-12 pr-4 text-sm font-semibold text-slate-800 transition placeholder:font-medium placeholder:text-slate-400 focus:border-[rgb(var(--color-primary))] focus:bg-white focus:ring-[rgb(37_99_235_/_0.18)]"
                                            autoComplete="username"
                                            onChange={(e) =>
                                                setData(
                                                    'email',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="nama@email.com"
                                            required
                                        />
                                    </div>

                                    <InputError
                                        message={errors.email}
                                        className="mt-2"
                                    />
                                </div>

                                <div>
                                    <InputLabel
                                        htmlFor="password"
                                        value="Password"
                                        className="mb-2 font-bold text-slate-700"
                                    />

                                    <div className="relative">
                                        <LockClosedIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                                        <TextInput
                                            id="password"
                                            type="password"
                                            name="password"
                                            value={data.password}
                                            className="block min-h-12 w-full rounded-2xl border-slate-200 bg-slate-50 pl-12 pr-4 text-sm font-semibold text-slate-800 transition placeholder:font-medium placeholder:text-slate-400 focus:border-[rgb(var(--color-primary))] focus:bg-white focus:ring-[rgb(37_99_235_/_0.18)]"
                                            autoComplete="new-password"
                                            onChange={(e) =>
                                                setData(
                                                    'password',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Minimal 8 karakter"
                                            required
                                        />
                                    </div>

                                    <InputError
                                        message={errors.password}
                                        className="mt-2"
                                    />
                                </div>

                                <div>
                                    <InputLabel
                                        htmlFor="password_confirmation"
                                        value="Konfirmasi Password"
                                        className="mb-2 font-bold text-slate-700"
                                    />

                                    <div className="relative">
                                        <LockClosedIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                                        <TextInput
                                            id="password_confirmation"
                                            type="password"
                                            name="password_confirmation"
                                            value={data.password_confirmation}
                                            className="block min-h-12 w-full rounded-2xl border-slate-200 bg-slate-50 pl-12 pr-4 text-sm font-semibold text-slate-800 transition placeholder:font-medium placeholder:text-slate-400 focus:border-[rgb(var(--color-primary))] focus:bg-white focus:ring-[rgb(37_99_235_/_0.18)]"
                                            autoComplete="new-password"
                                            onChange={(e) =>
                                                setData(
                                                    'password_confirmation',
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Ulangi password"
                                            required
                                        />
                                    </div>

                                    <InputError
                                        message={errors.password_confirmation}
                                        className="mt-2"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[rgb(var(--color-primary))] px-5 py-3 text-sm font-black uppercase tracking-wide text-white shadow-lg shadow-blue-500/25 transition hover:bg-[rgb(var(--color-primary-hover))] disabled:cursor-not-allowed disabled:opacity-70"
                                >
                                    {processing ? 'Memproses...' : 'Daftar'}
                                    <ArrowRightIcon className="h-4 w-4" />
                                </button>

                                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-center text-sm font-semibold text-slate-600">
                                    Sudah punya akun?{' '}
                                    <Link
                                        href={route('login')}
                                        className="font-black text-[rgb(var(--color-primary))] transition hover:text-[rgb(var(--color-primary-hover))]"
                                    >
                                        Login
                                    </Link>
                                </div>
                            </form>
                        </div>
                    </div>

                    <section className="relative hidden bg-[rgb(var(--color-primary))] p-10 text-white lg:flex lg:flex-col lg:justify-between">
                        <div className="inline-flex w-fit items-center gap-3 rounded-2xl bg-white/10 px-4 py-3 font-black tracking-wide text-white ring-1 ring-white/15">
                            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-xl text-[rgb(var(--color-primary))]">
                                O
                            </span>
                            OOPCODE
                        </div>

                        <div className="space-y-8">
                            <div>
                                <p className="text-sm font-bold uppercase tracking-[0.24em] text-yellow-200">
                                    Learning Journey
                                </p>
                                <h2 className="mt-4 max-w-md text-5xl font-black leading-tight">
                                    Siapkan akun, mulai eksplorasi OOP.
                                </h2>
                                <p className="mt-5 max-w-sm text-base leading-7 text-blue-100">
                                    Ikuti pertemuan, simpan jawaban, dan lihat
                                    progres belajar dari satu tempat.
                                </p>
                            </div>

                            <div className="grid grid-cols-3 gap-3">
                                {['Materi', 'Latihan', 'Kuis'].map((item) => (
                                    <div
                                        key={item}
                                        className="rounded-2xl bg-white/10 px-4 py-5 text-center ring-1 ring-white/10"
                                    >
                                        <SparklesIcon className="mx-auto h-6 w-6 text-[rgb(var(--color-accent))]" />
                                        <p className="mt-3 text-sm font-black">
                                            {item}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="rounded-3xl bg-white/10 p-5 ring-1 ring-white/15">
                            <p className="text-sm font-bold text-yellow-200">
                                OOPCODE
                            </p>
                            <p className="mt-2 text-sm leading-6 text-blue-100">
                                Platform belajar interaktif untuk membantu
                                mahasiswa memahami konsep OOP secara bertahap.
                            </p>
                        </div>
                    </section>
                </div>
            </div>
        </>
    );
}
