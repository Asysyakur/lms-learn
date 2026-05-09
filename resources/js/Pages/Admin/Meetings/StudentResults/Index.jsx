import AdminLayout from "@/Layouts/AdminLayout";
import { Link } from "@inertiajs/react";

export default function Index({ meeting, students }) {
    return (
        <AdminLayout title="Hasil Siswa">
            <div className="space-y-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">
                        Hasil Siswa
                    </h1>
                    <p className="mt-1 text-sm text-slate-500">
                        Progress dan hasil step siswa pada {meeting.title}
                    </p>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-slate-500">
                                Total Siswa
                            </p>
                            <h2 className="mt-1 text-3xl font-bold text-slate-900">
                                {students.length}
                            </h2>
                        </div>

                        <div>
                            <p className="text-sm font-medium text-slate-500">
                                Total Step
                            </p>
                            <h2 className="mt-1 text-3xl font-bold text-slate-900">
                                {students[0]?.total_steps || 0}
                            </h2>
                        </div>
                    </div>
                </div>

                <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="border-b border-slate-200 px-6 py-4">
                        <h2 className="text-lg font-semibold text-slate-900">
                            Daftar Siswa
                        </h2>
                    </div>

                    <div className="divide-y divide-slate-100">
                        {students.map((student) => (
                            <div
                                key={student.id}
                                className="flex items-center justify-between px-6 py-5"
                            >
                                <div className="min-w-0 flex-1">
                                    <h3 className="font-semibold text-slate-900">
                                        {student.name}
                                    </h3>

                                    <p className="text-sm text-slate-500">
                                        {student.email}
                                    </p>

                                    <div className="mt-3">
                                        <div className="mb-1 flex items-center justify-between text-xs text-slate-500">
                                            <span>Progress</span>
                                            <span>{student.progress}%</span>
                                        </div>

                                        <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                                            <div
                                                className="h-full rounded-full bg-blue-500 transition-all"
                                                style={{
                                                    width: `${student.progress}%`,
                                                }}
                                            />
                                        </div>

                                        <p className="mt-2 text-xs text-slate-500">
                                            {student.completed_steps} /{" "}
                                            {student.total_steps} step selesai
                                        </p>
                                    </div>
                                </div>

                                <div className="ml-6">
                                    <Link
                                        href={route(
                                            "admin.meetings.student-detail",
                                            {
                                                meeting: meeting.id,
                                                user: student.id,
                                            }
                                        )}
                                        className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                                    >
                                        Detail
                                    </Link>
                                </div>
                            </div>
                        ))}

                        {students.length === 0 && (
                            <div className="px-6 py-10 text-center text-sm text-slate-500">
                                Belum ada data siswa.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}