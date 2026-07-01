import AdminLayout from "@/Layouts/AdminLayout";
import { Link } from "@inertiajs/react";

export default function ResultShow({ quizSet, attempts = [] }) {
  return (
    <AdminLayout title={`Hasil ${quizSet.title}`}>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-blue-700">
            {quizSet.quiz_type}
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Tabel hasil siswa untuk tes ini.
          </p>
        </div>

        <div className="flex gap-2">
          <a
            href={route("admin.quiz-results.export", quizSet.id)}
            className="inline-flex items-center justify-center rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            Export ke Excel
          </a>

          <Link
            href="/admin/quiz-results"
            className="inline-flex items-center justify-center rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Kembali
          </Link>
        </div>
      </div>

      <section className="overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-slate-200">
        <div className="flex flex-col gap-1 border-b border-slate-200 bg-slate-50 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-base font-bold text-slate-900">
            {quizSet.title}
          </h2>

          <span className="text-sm font-semibold text-slate-500">
            {attempts.length} siswa
          </span>
        </div>

        <div className="divide-y divide-slate-100 md:hidden">
          {attempts.length === 0 ? (
            <div className="p-5 text-center text-sm text-slate-500">
              Belum ada siswa yang mengerjakan tes ini.
            </div>
          ) : (
            attempts.map((attempt, index) => (
              <div key={attempt.id} className="space-y-3 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                      No {index + 1}
                    </p>
                    <p className="mt-1 break-words font-semibold text-slate-900">
                      {attempt.student_name}
                    </p>
                    <p className="mt-1 break-all text-sm text-slate-600">
                      {attempt.student_email || "-"}
                    </p>
                  </div>

                  <span className="shrink-0 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">
                    {attempt.percentage}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="rounded-lg bg-slate-50 p-3">
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                      Skor
                    </p>
                    <p className="mt-1 font-semibold text-slate-800">
                      {attempt.score}/{attempt.total_questions}
                    </p>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-3">
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                      Submit
                    </p>
                    <p className="mt-1 font-semibold text-slate-800">
                      {attempt.submitted_at || "-"}
                    </p>
                  </div>
                </div>

                <Link
                  href={route("admin.quiz-results.attempt", [quizSet.id, attempt.id])}
                  className="inline-flex w-full items-center justify-center rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Lihat Detail Jawaban
                </Link>
              </div>
            ))
          )}
        </div>

        <div className="hidden overflow-x-auto md:block">
          <table className="min-w-full divide-y divide-slate-200 text-sm">
            <thead className="bg-white">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                  No
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                  Nama Siswa
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                  Email
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                  Skor
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                  Nilai
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                  Waktu Submit
                </th>
                <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide text-slate-500">
                  Aksi
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100 bg-white">
              {attempts.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-4 py-5 text-center text-slate-500">
                    Belum ada siswa yang mengerjakan tes ini.
                  </td>
                </tr>
              ) : (
                attempts.map((attempt, index) => (
                  <tr key={attempt.id} className="hover:bg-slate-50">
                    <td className="whitespace-nowrap px-4 py-3 text-slate-500">
                      {index + 1}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 font-semibold text-slate-900">
                      {attempt.student_name}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-slate-600">
                      {attempt.student_email || "-"}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-slate-700">
                      {attempt.score}/{attempt.total_questions}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <span className="inline-flex rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">
                        {attempt.percentage}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-slate-500">
                      {attempt.submitted_at || "-"}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <Link
                        href={route("admin.quiz-results.attempt", [quizSet.id, attempt.id])}
                        className="inline-flex items-center justify-center rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                      >
                        Detail
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </AdminLayout>
  );
}
