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
                    <section className="relative hidden bg-[rgb(var(--color-primary))] p-10 text-white lg:flex lg:flex-col lg:justify-center">
                        <div
                            className="inline-flex w-fit flex-col items-start rounded-3xlpx-6 py-5 text-white"
                        >
                            <h1 className="text-4xl font-black tracking-tight">
                                OOP CODE
                            </h1>

                            <p className="mt-1 text-xs font-extrabold uppercase tracking-[0.35em] text-yellow-200">
                                Interactive Learning
                            </p>
                        </div>

                        <div className="space-y-8">
                            <div>
                                <h1 className="mt-4 max-w-md text-4xl font-black leading-tight">
                                    Media pembelajaran interaktif untuk memahami
                                    Pemrograman Berorientasi Objek.
                                </h1>
                                <p className="mt-5 max-w-sm text-base leading-7 text-blue-100">
                                    Belajar PBO secara bertahap melalui materi,
                                    studi kasus, latihan, kuis, hingga
                                    menyimpulkan hasil belajar.
                                </p>
                            </div>

                            <div className="space-y-4">
                                {[
                                    {
                                        title: "Materi Bertahap",
                                        desc: "Pelajari konsep PBO setiap pertemuan.",
                                    },
                                    {
                                        title: "Studi Kasus Nyata",
                                        desc: "Belajar konsep melalui contoh program.",
                                    },
                                    {
                                        title: "Progres Belajar",
                                        desc: "Review hasil belajar siswa.",
                                    },
                                ].map((item) => (
                                    <div
                                        key={item.title}
                                        className="flex items-start gap-4 rounded-3xl bg-white/10 px-5 py-4 backdrop-blur-sm ring-1 ring-white/10"
                                    >
                                        <div className="mt-2 h-3 w-3 rounded-full bg-yellow-300 shadow-lg shadow-yellow-300/50" />

                                        <div>
                                            <h3 className="text-base font-bold text-white">
                                                {item.title}
                                            </h3>

                                            <p className="mt-1 text-sm text-blue-100">
                                                {item.desc}
                                            </p>
                                        </div>
                                    </div>
                                ))}
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
                                                setData("email", e.target.value)
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
