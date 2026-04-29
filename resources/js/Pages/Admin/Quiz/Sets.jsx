import AdminLayout from "@/Layouts/AdminLayout";
import { Link, router } from "@inertiajs/react";

export default function Sets({ sets }) {
  function destroy(set) {
    if (confirm(`Hapus quiz "${set.title}"?`)) {
      router.delete(`/admin/quiz-sets/${set.id}`);
    }
  }

  return (
    <AdminLayout title="Quiz">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Quiz Sets</h2>
          <p className="text-sm text-slate-500">Pre-test dan post-test untuk siswa.</p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/admin/quiz-sets/create"
            className="rounded-lg bg-yellow-400 px-4 py-2 text-sm font-bold text-slate-950 hover:bg-yellow-500"
          >
            Tambah
          </Link>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-slate-200">
        {sets.length === 0 ? (
          <div className="p-6 text-sm text-slate-500">Belum ada quiz.</div>
        ) : (
          sets.map((set) => (
            <div key={set.id} className="flex flex-col gap-3 border-b border-slate-100 p-4 last:border-b-0 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={set.cover_image || (set.quiz_type === "pre-test" ? "/images/pretest-card.svg" : "/images/posttest-card.svg")}
                  alt={set.title}
                  className="h-16 w-24 rounded-lg object-cover ring-1 ring-slate-200"
                />
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-blue-700">{set.quiz_type}</p>
                  <h3 className="mt-1 font-semibold text-slate-900">{set.title}</h3>
                  <p className="mt-1 text-sm text-slate-500">{set.description || set.slug}</p>
                </div>
              </div>

              <div className="flex gap-2">
                <Link className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50" href={`/admin/quiz-sets/${set.id}/edit`}>
                  Edit
                </Link>

                <Link className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50" href={`/admin/quiz-questions?set_id=${set.id}`}>
                  Edit Soal
                </Link>

                <button className="rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50" type="button" onClick={() => destroy(set)}>
                  Hapus
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </AdminLayout>
  );
}
