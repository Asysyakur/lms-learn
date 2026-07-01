import AdminLayout from "@/Layouts/AdminLayout";
import HtmlEditorField from "@/Components/HtmlEditorField";
import { Link, useForm } from "@inertiajs/react";
import { useState } from "react";

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
    <AdminLayout title="Tambah Pertemuan">
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
  const [previewUrl, setPreviewUrl] = useState(null);

  function handleFileChange(file) {
    setData("cover_image_file", file ?? null);
    setPreviewUrl(file ? URL.createObjectURL(file) : null);
  }

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

      <div className="mt-4">
        <HtmlEditorField
          label="Deskripsi"
          value={data.description}
          onChange={(value) => setData("description", value)}
          error={errors.description}
          placeholder="Bisa tempel CP/ATP di sini, gunakan tombol List untuk poin-poin."
        />
      </div>

      <label className="mt-4 block text-sm font-semibold text-slate-700">Thumbnail</label>
      {previewUrl && (
        <div className="mt-2 flex h-28 w-full items-center justify-center overflow-hidden rounded-lg bg-slate-50 ring-1 ring-slate-200">
          <img src={previewUrl} alt="Pratinjau thumbnail" className="h-full w-full object-contain" />
        </div>
      )}
      <input
        className="mt-1 w-full rounded-lg border-slate-300"
        type="file"
        accept="image/*"
        onChange={(e) => handleFileChange(e.target.files?.[0])}
      />
      <p className="mt-1 text-xs text-slate-500">Upload gambar dari komputer. Maksimal 2 MB. Rasio disarankan 4:3 (misal 800x600px) agar tampil pas tanpa terpotong. Kalau dikosongkan, thumbnail default dipakai.</p>

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
