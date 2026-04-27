import AdminLayout from "@/Layouts/AdminLayout";
import { Link, useForm } from "@inertiajs/react";

export default function Edit({ meeting, courses }) {
  const { data, setData, put, processing, errors } = useForm({
    course_id: meeting.course_id ?? courses[0]?.id ?? "",
    meeting_number: meeting.meeting_number ?? "",
    title: meeting.title ?? "",
    description: meeting.description ?? "",
    sort_order: meeting.sort_order ?? 0,
    is_active: Boolean(meeting.is_active),
  });

  function submit(e) {
    e.preventDefault();
    put(`/admin/meetings/${meeting.id}`);
  }

  return (
    <AdminLayout title="Edit Meeting">
      <form onSubmit={submit} className="max-w-2xl rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200">
        <label className="block text-sm font-semibold text-slate-700">Course</label>
        <select
          className="mt-1 w-full rounded-lg border-slate-300"
          value={data.course_id}
          onChange={(e) => setData("course_id", e.target.value)}
        >
          {courses.map((course) => (
            <option key={course.id} value={course.id}>
              {course.title}
            </option>
          ))}
        </select>
        {errors.course_id && <p className="mt-1 text-sm text-red-600">{errors.course_id}</p>}

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-semibold text-slate-700">Nomor Pertemuan</label>
            <input
              className="mt-1 w-full rounded-lg border-slate-300"
              type="number"
              min="1"
              value={data.meeting_number}
              onChange={(e) => setData("meeting_number", e.target.value)}
            />
            {errors.meeting_number && <p className="mt-1 text-sm text-red-600">{errors.meeting_number}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700">Urutan</label>
            <input
              className="mt-1 w-full rounded-lg border-slate-300"
              type="number"
              min="0"
              value={data.sort_order}
              onChange={(e) => setData("sort_order", e.target.value)}
            />
          </div>
        </div>

        <label className="mt-4 block text-sm font-semibold text-slate-700">Judul</label>
        <input
          className="mt-1 w-full rounded-lg border-slate-300"
          value={data.title}
          onChange={(e) => setData("title", e.target.value)}
        />
        {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}

        <label className="mt-4 block text-sm font-semibold text-slate-700">Deskripsi</label>
        <textarea
          className="mt-1 min-h-28 w-full rounded-lg border-slate-300"
          value={data.description}
          onChange={(e) => setData("description", e.target.value)}
        />

        <label className="mt-4 flex items-center gap-2 text-sm font-semibold text-slate-700">
          <input
            type="checkbox"
            className="rounded border-slate-300"
            checked={data.is_active}
            onChange={(e) => setData("is_active", e.target.checked)}
          />
          Aktif
        </label>

        <div className="mt-5 flex gap-2">
          <button disabled={processing} className="rounded-lg bg-yellow-400 px-4 py-2 text-sm font-bold text-slate-950 hover:bg-yellow-500 disabled:opacity-60" type="submit">
            Update
          </button>
          <Link className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50" href="/admin/meetings">
            Batal
          </Link>
        </div>
      </form>
    </AdminLayout>
  );
}
