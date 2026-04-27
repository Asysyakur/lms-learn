import AdminLayout from "@/Layouts/AdminLayout";
import { Link, router } from "@inertiajs/react";

export default function Index({ courses }) {
  function destroy(course) {
    if (confirm(`Hapus course "${course.title}"?`)) {
      router.delete(`/admin/courses/${course.id}`);
    }
  }

  return (
    <AdminLayout title="Courses">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Courses</h2>
          <p className="text-sm text-slate-500">Materi utama yang muncul di halaman belajar.</p>
        </div>
        <Link
          href="/admin/courses/create"
          className="rounded-lg bg-yellow-400 px-4 py-2 text-sm font-bold text-slate-950 hover:bg-yellow-500"
        >
          Tambah
        </Link>
      </div>

      <div className="overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-slate-200">
        {courses.length === 0 ? (
          <div className="p-6 text-sm text-slate-500">Belum ada course.</div>
        ) : (
          courses.map((course) => (
            <div key={course.id} className="flex flex-col gap-3 border-b border-slate-100 p-4 last:border-b-0 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h3 className="font-semibold text-slate-900">{course.title}</h3>
                <p className="text-sm text-slate-500">{course.description || course.slug}</p>
              </div>

              <div className="flex gap-2">
                <Link className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50" href={`/admin/courses/${course.id}/edit`}>
                  Edit
                </Link>
                <button className="rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50" type="button" onClick={() => destroy(course)}>
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
