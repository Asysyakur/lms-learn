import AdminLayout from "@/Layouts/AdminLayout";
import { Link, useForm } from "@inertiajs/react";

export default function CreateQuestion({ sets }) {
  const { data, setData, post, processing, errors } = useForm({
    quiz_set_id: sets[0]?.id ?? "",
    question_text: "",
    options: "",
    correct_option: "A",
  });

  function submit(e) {
    e.preventDefault();
    post("/admin/quiz-questions");
  }

  return (
    <AdminLayout title="Tambah Question">
      <QuestionForm
        data={data}
        setData={setData}
        sets={sets}
        errors={errors}
        processing={processing}
        submit={submit}
        submitLabel="Simpan"
      />
    </AdminLayout>
  );
}

function QuestionForm({ data, setData, sets, errors, processing, submit, submitLabel }) {
  return (
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
      {errors.quiz_set_id && <p className="mt-1 text-sm text-red-600">{errors.quiz_set_id}</p>}

      <label className="mt-4 block text-sm font-semibold text-slate-700">Pertanyaan</label>
      <textarea
        className="mt-1 min-h-28 w-full rounded-lg border-slate-300"
        value={data.question_text}
        onChange={(e) => setData("question_text", e.target.value)}
      />
      {errors.question_text && <p className="mt-1 text-sm text-red-600">{errors.question_text}</p>}

      <label className="mt-4 block text-sm font-semibold text-slate-700">Opsi Jawaban</label>
      <textarea
        className="mt-1 min-h-32 w-full rounded-lg border-slate-300"
        placeholder="Satu opsi per baris"
        value={data.options}
        onChange={(e) => setData("options", e.target.value)}
      />
      {errors.options && <p className="mt-1 text-sm text-red-600">{errors.options}</p>}

      <label className="mt-4 block text-sm font-semibold text-slate-700">Jawaban Benar</label>
      <input
        className="mt-1 w-full rounded-lg border-slate-300"
        value={data.correct_option}
        onChange={(e) => setData("correct_option", e.target.value)}
      />
      {errors.correct_option && <p className="mt-1 text-sm text-red-600">{errors.correct_option}</p>}

      <div className="mt-5 flex gap-2">
        <button disabled={processing} className="rounded-lg bg-yellow-400 px-4 py-2 text-sm font-bold text-slate-950 hover:bg-yellow-500 disabled:opacity-60" type="submit">
          {submitLabel}
        </button>
        <Link className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50" href="/admin/quiz-questions">
          Batal
        </Link>
      </div>
    </form>
  );
}
