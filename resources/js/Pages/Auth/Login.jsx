import Checkbox from "@/Components/Checkbox";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import { Head, Link, useForm } from "@inertiajs/react";
import {
    ArrowRightIcon,
    BookOpenIcon,
    EnvelopeIcon,
    LockClosedIcon,
} from "@heroicons/react/24/outline";

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route("login"), {
            onFinish: () => reset("password"),
        });
    };

    return (
        <>
            <Head title="Login" />

            <div className="min-h-screen bg-[rgb(var(--color-background))] px-4 py-6 text-slate-900 sm:px-6 lg:px-8">
                <div className="mx-auto grid min-h-[calc(100vh-3rem)] w-full max-w-6xl overflow-hidden rounded-[2rem] bg-white shadow-2xl shadow-slate-200/70 ring-1 ring-[rgb(var(--color-border))] lg:grid-cols-[0.95fr_1.05fr]">
                    <section className="relative hidden bg-[rgb(var(--color-primary))] p-10 text-white lg:flex lg:flex-col lg:justify-between">
                        <Link
                            href="/"
                            className="inline-flex w-fit items-center gap-3 rounded-2xl bg-white/10 px-4 py-3 font-black tracking-wide text-white ring-1 ring-white/15 transition hover:bg-white/15"
                        >
                            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-xl text-[rgb(var(--color-primary))]">
                                O
                            </span>
                            OOPCODE
                        </Link>

                        <div className="space-y-8">
                            <div>
                                <p className="text-sm font-bold uppercase tracking-[0.24em] text-yellow-200">
                                    Interactive Learning
                                </p>
                                <h1 className="mt-4 max-w-md text-5xl font-black leading-tight">
                                    Masuk dan lanjutkan progres belajarmu.
                                </h1>
                                <p className="mt-5 max-w-sm text-base leading-7 text-blue-100">
                                    Materi, latihan, dan kuis OOP tersusun dalam
                                    alur belajar yang mudah diikuti.
                                </p>
                            </div>

                            <div className="grid gap-3">
                                {[
                                    "Pantau progres tiap pertemuan",
                                    "Kerjakan latihan langsung di kelas",
                                    "Review hasil belajar dengan cepat",
                                ].map((item) => (
                                    <div
                                        key={item}
                                        className="flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-3 text-sm font-semibold text-white ring-1 ring-white/10"
                                    >
                                        <span className="h-2.5 w-2.5 rounded-full bg-[rgb(var(--color-accent))]" />
                                        {item}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="rounded-3xl bg-white/10 p-5 ring-1 ring-white/15">
                            <div className="flex items-center gap-4">
                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[rgb(var(--color-accent))] text-slate-950">
                                    <BookOpenIcon className="h-6 w-6" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-white">
                                        Object Oriented Programming
                                    </p>
                                    <p className="mt-1 text-sm text-blue-100">
                                        Belajar konsep sampai praktik.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <div className="flex items-center justify-center px-5 py-8 sm:px-8 lg:px-12">
                        <div className="w-full max-w-md">
                            <div className="mb-8 lg:hidden">
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
                                    Selamat Datang
                                </p>
                                <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                                    Login Akun
                                </h2>
                                <p className="mt-3 text-sm leading-6 text-slate-500">
                                    Masuk untuk melanjutkan pembelajaran OOP di
                                    OOPCODE.
                                </p>
                            </div>

                            {status && (
                                <div className="mb-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700">
                                    {status}
                                </div>
                            )}

                            <form onSubmit={submit} className="space-y-5">
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
                                            isFocused={true}
                                            onChange={(e) =>
                                                setData(
                                                    "email",
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="nama@email.com"
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
                                            autoComplete="current-password"
                                            onChange={(e) =>
                                                setData(
                                                    "password",
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Masukkan password"
                                        />
                                    </div>

                                    <InputError
                                        message={errors.password}
                                        className="mt-2"
                                    />
                                </div>

                                <div className="flex flex-col gap-3 text-sm sm:flex-row sm:items-center sm:justify-between">
                                    <label className="flex items-center gap-2 font-semibold text-slate-600">
                                        <Checkbox
                                            name="remember"
                                            checked={data.remember}
                                            onChange={(e) =>
                                                setData(
                                                    "remember",
                                                    e.target.checked,
                                                )
                                            }
                                            className="border-slate-300 text-[rgb(var(--color-primary))] focus:ring-[rgb(var(--color-primary))]"
                                        />
                                        Ingat saya
                                    </label>

                                    {canResetPassword && (
                                        <Link
                                            href={route("password.request")}
                                            className="font-bold text-[rgb(var(--color-primary))] transition hover:text-[rgb(var(--color-primary-hover))]"
                                        >
                                            Lupa password?
                                        </Link>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[rgb(var(--color-primary))] px-5 py-3 text-sm font-black uppercase tracking-wide text-white shadow-lg shadow-blue-500/25 transition hover:bg-[rgb(var(--color-primary-hover))] disabled:cursor-not-allowed disabled:opacity-70"
                                >
                                    {processing ? "Memproses..." : "Login"}
                                    <ArrowRightIcon className="h-4 w-4" />
                                </button>

                                <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-center text-sm font-semibold text-slate-600">
                                    Belum punya akun?{" "}
                                    <Link
                                        href={route("register")}
                                        className="font-black text-[rgb(var(--color-primary))] transition hover:text-[rgb(var(--color-primary-hover))]"
                                    >
                                        Daftar sekarang
                                    </Link>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
