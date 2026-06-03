import AdminLayout from "@/Layouts/AdminLayout";
import { Link, router } from "@inertiajs/react";

export default function Index({ meetings }) {
    function destroy(meeting) {
        if (confirm(`Hapus "${meeting.title}"?`)) {
            router.delete(`/admin/meetings/${meeting.id}`);
        }
    }

    return (
        <AdminLayout title="Pertemuan">
            <div className="mb-4 flex items-center justify-between gap-3">
                <div>
                    <p className="text-sm text-slate-500">
                        Pertemuan yang berisi step pembelajaran.
                    </p>
                </div>

                <Link
                    href="/admin/meetings/create"
                    className="rounded-lg bg-yellow-400 px-4 py-2 text-sm font-bold text-slate-950 hover:bg-yellow-500"
                >
                    Tambah
                </Link>
            </div>

            <div className="space-y-3">
                {meetings.length === 0 ? (
                    <div className="rounded-lg bg-white p-6 text-sm text-slate-500 shadow-sm ring-1 ring-slate-200">
                        Belum ada meeting.
                    </div>
                ) : (
                    meetings.map((meeting) => (
                        <div
                            key={meeting.id}
                            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md"
                        >
                            <div className="flex items-center justify-between gap-6">
                                {/* LEFT */}
                                <div className="flex min-w-0 items-center gap-4">
                                    <img
                                        src={
                                            meeting.cover_image ||
                                            "/images/learning-card.svg"
                                        }
                                        alt={meeting.title}
                                        className="h-24 w-32 flex-shrink-0 rounded-xl object-cover ring-1 ring-slate-200"
                                    />

                                    <div className="min-w-0">
                                        <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600">
                                            Pertemuan {meeting.meeting_number}
                                        </p>

                                        <h3 className="mt-1 text-xl font-bold text-slate-800">
                                            {meeting.title}
                                        </h3>

                                        <p className="mt-2 line-clamp-2 max-w-4xl text-sm leading-6 text-slate-500">
                                            {meeting.description}
                                        </p>
                                    </div>
                                </div>

                                {/* RIGHT */}
                                <div className="flex flex-shrink-0 items-center gap-2">
                                    <Link
                                        className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                                        href={`/admin/meetings/${meeting.id}/student-results`}
                                    >
                                        Hasil Siswa
                                    </Link>

                                    <Link
                                        className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700"
                                        href={`/admin/meetings/${meeting.id}/steps`}
                                    >
                                        Detail Steps
                                    </Link>

                                    <Link
                                        className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                                        href={`/admin/meetings/${meeting.id}/edit`}
                                    >
                                        Edit
                                    </Link>

                                    <button
                                        className="rounded-xl border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50"
                                        type="button"
                                        onClick={() => destroy(meeting)}
                                    >
                                        Hapus
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </AdminLayout>
    );
}
