import Checkbox from "@/Components/Checkbox";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import { Head, Link, useForm } from "@inertiajs/react";
import {
    ClipboardDocumentCheckIcon,
    CodeBracketIcon,
    EnvelopeIcon,
    LockClosedIcon,
    PlayCircleIcon,
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

            <div className="min-h-screen bg-slate-100 px-4 py-6">
                <div className="mx-auto flex min-h-[92vh] w-full max-w-5xl overflow-hidden rounded-[32px] bg-white shadow-2xl shadow-slate-300/30">
                    {/* LEFT */}
                    <section className="hidden w-[46%] flex-col justify-center bg-[rgb(var(--color-primary))] p-10 text-white lg:flex">
                        <div className="inline-flex w-fit items-center gap-3 font-black tracking-wide text-white">
                            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-xl text-[rgb(var(--color-primary))]">
                                O
                            </span>
                            OOPCODE
                        </div>

                        <div className="mt-8">
                            <h2 className="max-w-md text-4xl font-black leading-tight">
                                Media pembelajaran interaktif untuk memahami
                                PBO.
                            </h2>

                            <p className="mt-5 max-w-sm text-sm leading-7 text-blue-100">
                                Belajar PBO melalui materi, studi kasus,
                                latihan, kuis, dan pembuktian hasil belajar.
                            </p>
                        </div>

                        <div className="mt-8 space-y-4">
                            {[
                                {
                                    title: "Video pembelajaran",
                                    desc: "Video stimulus sebagai pengantar pembelajaran.",
                                    Icon: PlayCircleIcon,
                                },
                                {
                                    title: "Praktik Coding",
                                    desc: "Mengamati, memodifikasi, dan menulis sintaks kode.",
                                    Icon: CodeBracketIcon,
                                },
                                {
                                    title: "Kuis dan pembahasan",
                                    desc: "Menguji pemahaman materi melalui kuis dan pembahasan.",
                                    Icon: ClipboardDocumentCheckIcon,
                                },
                            ].map((item) => (
                                <div
                                    key={item.title}
                                    className="rounded-2xl bg-white/10 p-5 backdrop-blur-sm"
                                >
                                    <div className="flex items-center gap-3">
                                        <item.Icon className="mt-0.5 h-5 w-5 flex-shrink-0 text-yellow-300" />

                                        <div>
                                            <h3 className="text-sm font-bold">
                                                {item.title}
                                            </h3>

                                            {item.desc && (
                                                <p className="mt-1 text-sm text-blue-100">
                                                    {item.desc}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* RIGHT */}
                    <section className="flex flex-1 items-center justify-center px-6 py-10 sm:px-10">
                        <div className="w-full max-w-md">
                            <div className="mb-8">
                                <p className="text-sm font-bold uppercase tracking-[0.2em] text-[rgb(var(--color-primary))]">
                                    Selamat Datang
                                </p>

                                <h2 className="mt-3 text-4xl font-black text-slate-900">
                                    Login Akun
                                </h2>

                                <p className="mt-3 text-sm leading-6 text-slate-500">
                                    Masuk untuk melanjutkan pembelajaran di
                                    OOPCODE.
                                </p>
                            </div>

                            <form onSubmit={submit} className="space-y-5">
                                <div>
                                    <InputLabel
                                        htmlFor="email"
                                        value="Email"
                                        className="mb-2 font-semibold"
                                    />

                                    <div className="relative">
                                        <EnvelopeIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                                        <TextInput
                                            id="email"
                                            type="email"
                                            name="email"
                                            value={data.email}
                                            className="h-14 w-full rounded-2xl border-slate-200 bg-slate-50 pl-12 text-sm"
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
                                        className="mb-2 font-semibold"
                                    />

                                    <div className="relative">
                                        <LockClosedIcon className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />

                                        <TextInput
                                            id="password"
                                            type="password"
                                            name="password"
                                            value={data.password}
                                            className="h-14 w-full rounded-2xl border-slate-200 bg-slate-50 pl-12 text-sm"
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

                                <div className="flex items-center justify-between text-sm">
                                    <label className="flex items-center gap-2 font-medium text-slate-600">
                                        <Checkbox
                                            name="remember"
                                            checked={data.remember}
                                            onChange={(e) =>
                                                setData(
                                                    "remember",
                                                    e.target.checked,
                                                )
                                            }
                                        />
                                        Ingat saya
                                    </label>

                                    {canResetPassword && (
                                        <Link
                                            href={route("password.request")}
                                            className="font-semibold text-[rgb(var(--color-primary))]"
                                        >
                                            Lupa password?
                                        </Link>
                                    )}
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[rgb(var(--color-primary))] text-sm font-bold text-white transition hover:opacity-90"
                                >
                                    {processing ? "Memproses..." : "LOGIN"}
                                </button>

                                <div className="rounded-2xl border border-slate-200 bg-slate-50 py-4 text-center text-sm">
                                    Belum punya akun?{" "}
                                    <Link
                                        href={route("register")}
                                        className="font-bold text-[rgb(var(--color-primary))]"
                                    >
                                        Daftar sekarang
                                    </Link>
                                </div>
                            </form>
                        </div>
                    </section>
                </div>
            </div>
        </>
    );
}
