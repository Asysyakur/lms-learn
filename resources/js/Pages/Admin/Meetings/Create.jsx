import AdminLayout from "@/Layouts/AdminLayout";
import { Link, useForm } from "@inertiajs/react";

export default function Create({ defaultCourseId }) {
  const { data, setData, post, processing, errors } = useForm({
    course_id: defaultCourseId ?? "",
    meeting_number: "",
    title: "",
    description: "",
    cover_image: "",
    cover_image_file: null,
    sort_order: 0,
  });

  function submit(e) {
    e.preventDefault();
    post("/admin/meetings", { forceFormData: true });
  }

  return (
    <AdminLayout title="Tambah Meeting">
      <MeetingForm
        data={data}
        setData={setData}
        errors={errors}
        processing={processing}
        submit={submit}
        submitLabel="Simpan"
      />
    </AdminLayout>
  );
}

function MeetingForm({ data, setData, errors, processing, submit, submitLabel }) {
  return (
    <form onSubmit={submit} className="max-w-2xl rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200">
      <input type="hidden" value={data.course_id} onChange={(e) => setData("course_id", e.target.value)} />

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

      <label className="mt-4 block text-sm font-semibold text-slate-700">Thumbnail</label>
      <input
        className="mt-1 w-full rounded-lg border-slate-300"
        type="file"
        accept="image/*"
        onChange={(e) => setData("cover_image_file", e.target.files?.[0] ?? null)}
      />
      <p className="mt-1 text-xs text-slate-500">Upload gambar dari komputer. Maksimal 2 MB. Kalau dikosongkan, thumbnail default dipakai.</p>

      <div className="mt-5 flex gap-2">
        <button disabled={processing} className="rounded-lg bg-yellow-400 px-4 py-2 text-sm font-bold text-slate-950 hover:bg-yellow-500 disabled:opacity-60" type="submit">
          {submitLabel}
        </button>
        <Link className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50" href="/admin/meetings">
          Batal
        </Link>
      </div>
    </form>
  );
}
