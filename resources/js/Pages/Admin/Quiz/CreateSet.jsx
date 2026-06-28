import AdminLayout from "@/Layouts/AdminLayout";
import { Link, useForm } from "@inertiajs/react";
import { useState } from "react";

export default function CreateSet() {
  const [previewUrl, setPreviewUrl] = useState(null);
  const { data, setData, post, processing, errors } = useForm({
    title: "",
    quiz_type: "pre-test",
    description: "",
    cover_image: "",
    cover_image_file: null,
  });

  function handleFileChange(file) {
    setData("cover_image_file", file ?? null);
    setPreviewUrl(file ? URL.createObjectURL(file) : null);
  }

  function submit(e) {
    e.preventDefault();
    post("/admin/quiz-sets", { forceFormData: true });
  }

  return (
    <AdminLayout title="Tambah Kuis">
      <form onSubmit={submit} className="max-w-2xl rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200">
        <label className="block text-sm font-semibold text-slate-700">Judul</label>
        <input
          className="mt-1 w-full rounded-lg border-slate-300"
          value={data.title}
          onChange={(e) => setData("title", e.target.value)}
        />
        {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}

        <label className="mt-4 block text-sm font-semibold text-slate-700">Tipe</label>
        <select
          className="mt-1 w-full rounded-lg border-slate-300"
          value={data.quiz_type}
          onChange={(e) => setData("quiz_type", e.target.value)}
        >
          <option value="pre-test">Pre-test</option>
          <option value="post-test">Post-test</option>
        </select>
        {errors.quiz_type && <p className="mt-1 text-sm text-red-600">{errors.quiz_type}</p>}

        <label className="mt-4 block text-sm font-semibold text-slate-700">Deskripsi</label>
        <textarea
          className="mt-1 min-h-28 w-full rounded-lg border-slate-300"
          value={data.description}
          onChange={(e) => setData("description", e.target.value)}
        />

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
        <p className="mt-1 text-xs text-slate-500">Upload dari komputer untuk thumbnail quiz set. Maksimal 2 MB. Rasio disarankan 4:3 (misal 800x600px) agar tampil pas tanpa terpotong.</p>

        <div className="mt-5 flex gap-2">
          <button disabled={processing} className="rounded-lg bg-yellow-400 px-4 py-2 text-sm font-bold text-slate-950 hover:bg-yellow-500 disabled:opacity-60" type="submit">
            Simpan
          </button>
          <Link className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50" href="/admin/quiz-sets">
            Batal
          </Link>
        </div>
      </form>
    </AdminLayout>
  );
}
