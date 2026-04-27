import AdminLayout from "@/Layouts/AdminLayout";
import { Link, useForm } from "@inertiajs/react";

export default function EditSet({ set }) {
  const { data, setData, put, processing } = useForm({
    title: set.title ?? "",
    quiz_type: set.quiz_type ?? "pre-test",
    description: set.description ?? "",
  });

  function submit(e) {
    e.preventDefault();
    put(`/admin/quiz-sets/${set.id}`);
  }

  return (
    <AdminLayout title="Edit Quiz">
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

        <div className="mt-5 flex gap-2">
          <button disabled={processing} className="rounded-lg bg-yellow-400 px-4 py-2 text-sm font-bold text-slate-950 hover:bg-yellow-500 disabled:opacity-60" type="submit">
            Update
          </button>
          <Link className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50" href="/admin/quiz-sets">
            Batal
          </Link>
        </div>
      </form>
    </AdminLayout>
  );
}
