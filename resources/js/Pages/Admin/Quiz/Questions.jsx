import AdminLayout from "@/Layouts/AdminLayout";
import { Link, router } from "@inertiajs/react";

function cleanHtml(html) {
  return (html || "").replace(/body\s*\{[\s\S]*?\}/gi, "");
}

export default function Questions({ questions, selected_set }) {
  function destroy(question) {
    if (confirm("Hapus pertanyaan ini?")) {
      router.delete(`/admin/quiz-questions/${question.id}`);
    }
  }

  return (
    <AdminLayout title="Soal Kuis">
        <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Soal {selected_set ? `- ${selected_set.title}` : ''}</h2>
          <p className="text-sm text-slate-500">Pertanyaan untuk quiz set.</p>
        </div>
        <div className="flex gap-2">
          <Link className="rounded-lg bg-yellow-400 px-4 py-2 text-sm font-bold text-slate-950 hover:bg-yellow-500" href={`/admin/quiz-questions/create${selected_set ? `?set_id=${selected_set.id}` : ''}`}>
            Tambah
          </Link>
        </div>
      </div>

      <div className="space-y-3">
        {questions.length === 0 ? (
          <div className="rounded-lg bg-white p-6 text-sm text-slate-500 shadow-sm ring-1 ring-slate-200">
            Belum ada pertanyaan.
          </div>
        ) : (
          questions.map((question) => (
            <div key={question.id} className="rounded-lg bg-white p-4 shadow-sm ring-1 ring-slate-200">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-blue-700">
                    {question.quiz_set?.title ?? question.quizSet?.title ?? "Quiz"}
                  </p>
                  <h3
                    className="mt-1 font-semibold text-slate-900 line-clamp-2"
                    dangerouslySetInnerHTML={{
                      __html: cleanHtml(question.question_text),
                    }}
                  />
                  <p className="mt-1 text-sm text-slate-500">Jawaban: {question.correct_option}</p>
                </div>

                <div className="flex gap-2">
                  <Link className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50" href={`/admin/quiz-questions/${question.id}/edit`}>
                    Ubah
                  </Link>
                  <button className="rounded-lg border border-red-200 px-3 py-2 text-sm font-semibold text-red-600 hover:bg-red-50" type="button" onClick={() => destroy(question)}>
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
