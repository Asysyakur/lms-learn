import AdminLayout from "@/Layouts/AdminLayout";
import { Link, useForm } from "@inertiajs/react";

export default function EditSet({ set }) {
  const { data, setData, post, processing } = useForm({
    _method: "put",
    title: set.title ?? "",
    quiz_type: set.quiz_type ?? "pre-test",
    description: set.description ?? "",
    cover_image: set.cover_image ?? "",
    cover_image_file: null,
  });

  function submit(e) {
    e.preventDefault();
    post(`/admin/quiz-sets/${set.id}`, { forceFormData: true });
  }

  return (
    <AdminLayout title="Ubah Kuis">
      <form onSubmit={submit} className="max-w-2xl rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200">
        <label className="block text-sm font-semibold text-slate-700">Judul</label>
        <input
          className="mt-1 w-full rounded-lg border-slate-300"
          value={data.title}
          onChange={(e) => setData("title", e.target.value)}
        />

        <label className="mt-4 block text-sm font-semibold text-slate-700">Tipe</label>
        <select
          className="mt-1 w-full rounded-lg border-slate-300"
          value={data.quiz_type}
          onChange={(e) => setData("quiz_type", e.target.value)}
        >
          <option value="pre-test">Pre-test</option>
          <option value="post-test">Post-test</option>
        </select>

        <label className="mt-4 block text-sm font-semibold text-slate-700">Deskripsi</label>
        <textarea
          className="mt-1 min-h-28 w-full rounded-lg border-slate-300"
          value={data.description}
          onChange={(e) => setData("description", e.target.value)}
        />

        <label className="mt-4 block text-sm font-semibold text-slate-700">Thumbnail</label>
        {data.cover_image ? (
          <div className="mt-2 flex h-28 w-full items-center justify-center overflow-hidden rounded-lg bg-slate-50 ring-1 ring-slate-200">
            <img src={data.cover_image} alt={set.title} className="h-full w-full object-contain" />
          </div>
        ) : null}

        <label className="mt-4 block text-sm font-semibold text-slate-700">Upload Thumbnail Baru</label>
        <input
          className="mt-1 w-full rounded-lg border-slate-300"
          type="file"
          accept="image/*"
          onChange={(e) => setData("cover_image_file", e.target.files?.[0] ?? null)}
        />
        <p className="mt-1 text-xs text-slate-500">Upload baru akan mengganti thumbnail lama. Maksimal 2 MB. Rasio disarankan 4:3 (misal 800x600px) agar tampil pas tanpa terpotong.</p>

        <div className="mt-5 flex gap-2">
          <button disabled={processing} className="rounded-lg bg-yellow-400 px-4 py-2 text-sm font-bold text-slate-950 hover:bg-yellow-500 disabled:opacity-60" type="submit">
            Perbarui
          </button>
          <Link className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50" href="/admin/quiz-sets">
            Batal
          </Link>
        </div>
      </form>
    </AdminLayout>
  );
}
