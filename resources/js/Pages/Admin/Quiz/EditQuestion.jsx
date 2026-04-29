import AdminLayout from "@/Layouts/AdminLayout";
import { Link, useForm } from "@inertiajs/react";

export default function EditQuestion({ question, sets }) {
  const { data, setData, put, processing } = useForm({
    quiz_set_id: question.quiz_set_id ?? sets[0]?.id ?? "",
    question_text: question.question_text ?? "",
    options: Array.isArray(question.options) ? question.options.join("\n") : "",
    correct_option: question.correct_option ?? "",
  });

  function submit(e) {
    e.preventDefault();
    put(`/admin/quiz-questions/${question.id}`);
  }

  return (
    <AdminLayout title="Ubah Soal">
      <form onSubmit={submit} className="max-w-2xl rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200">
        <label className="block text-sm font-semibold text-slate-700">Quiz Set</label>
        <select
          className="mt-1 w-full rounded-lg border-slate-300"
          value={data.quiz_set_id}
          onChange={(e) => setData("quiz_set_id", e.target.value)}
        >
          {sets.map((set) => (
            <option key={set.id} value={set.id}>
              {set.title}
            </option>
          ))}
        </select>

        <label className="mt-4 block text-sm font-semibold text-slate-700">Pertanyaan</label>
        <textarea
          className="mt-1 min-h-28 w-full rounded-lg border-slate-300"
          value={data.question_text}
          onChange={(e) => setData("question_text", e.target.value)}
        />

        <label className="mt-4 block text-sm font-semibold text-slate-700">Opsi Jawaban</label>
        <textarea
          className="mt-1 min-h-32 w-full rounded-lg border-slate-300"
          value={data.options}
          onChange={(e) => setData("options", e.target.value)}
        />

        <label className="mt-4 block text-sm font-semibold text-slate-700">Jawaban Benar</label>
        <input
          className="mt-1 w-full rounded-lg border-slate-300"
          value={data.correct_option}
          onChange={(e) => setData("correct_option", e.target.value)}
        />

        <div className="mt-5 flex gap-2">
          <button disabled={processing} className="rounded-lg bg-yellow-400 px-4 py-2 text-sm font-bold text-slate-950 hover:bg-yellow-500 disabled:opacity-60" type="submit">
            Perbarui
          </button>
          <Link className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50" href="/admin/quiz-questions">
            Batal
          </Link>
        </div>
      </form>
    </AdminLayout>
  );
}
