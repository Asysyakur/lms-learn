import AdminLayout from "@/Layouts/AdminLayout";
import { Link } from "@inertiajs/react";

export default function Results({ quizSets = [] }) {
  return (
    <AdminLayout title="Hasil Tes">
      <div className="mb-4">
        <p className="text-sm text-slate-500">
          Pilih salah satu tes untuk membuka tabel hasil siswa.
        </p>
      </div>

      {quizSets.length === 0 ? (
        <div className="rounded-lg bg-white p-6 text-sm text-slate-500 shadow-sm ring-1 ring-slate-200">
          Belum ada tes.
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {quizSets.map((quizSet) => (
            <Link
              key={quizSet.id}
              href={`/admin/quiz-results/${quizSet.id}`}
              className="min-w-0 rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition hover:border-blue-300 hover:bg-blue-50 hover:shadow-md"
            >
              <p className="text-xs font-bold uppercase tracking-wide text-blue-700">
                {quizSet.quiz_type}
              </p>
              <h2 className="mt-1 break-words text-base font-bold text-slate-900">
                {quizSet.title}
              </h2>
              <p className="mt-2 text-sm font-semibold text-slate-500">
                {quizSet.attempts_count} siswa sudah mengerjakan
              </p>
            </Link>
          ))}
        </div>
      )}
    </AdminLayout>
  );
}
