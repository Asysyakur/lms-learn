import AdminLayout from "@/Layouts/AdminLayout";
import { Link, router } from "@inertiajs/react";

export default function Index({ meetings }) {
  function destroy(meeting) {
    if (confirm(`Hapus "${meeting.title}"?`)) {
      router.delete(`/admin/meetings/${meeting.id}`);
    }
  }

  return (
    <AdminLayout title="Meetings">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Meetings</h2>
          <p className="text-sm text-slate-500">Pertemuan yang berisi step pembelajaran.</p>
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
            <div key={meeting.id} className="rounded-lg bg-white p-4 shadow-sm ring-1 ring-slate-200">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-blue-700">
                    Pertemuan {meeting.meeting_number} / {meeting.course?.title ?? "Course"}
                  </p>
                  <h3 className="mt-1 font-semibold text-slate-900">{meeting.title}</h3>
                  <p className="mt-1 text-sm text-slate-500">{meeting.description}</p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Link className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700" href={`/admin/meetings/${meeting.id}/steps`}>
                    Steps
                  </Link>
                  <Link className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50" href={`/admin/meetings/${meeting.id}/edit`}>
                    Edit
                  </Link>
                  <button className="rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50" type="button" onClick={() => destroy(meeting)}>
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
