import AdminLayout from "@/Layouts/AdminLayout";
import { Link } from "@inertiajs/react";

const optionLabels = ["A", "B", "C", "D", "E", "F"];

function cleanHtml(html) {
  return (html || "").replace(/body\s*\{[\s\S]*?\}/gi, "");
}

export default function AttemptShow({ quizSet, attempt, questions = [] }) {
  return (
    <AdminLayout title={`Detail Jawaban - ${attempt.student_name}`}>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-blue-700">
            {quizSet.quiz_type} &middot; {quizSet.title}
          </p>
          <h2 className="mt-1 text-lg font-bold text-slate-900">
            {attempt.student_name}
          </h2>
          <p className="text-sm text-slate-500">
            {attempt.student_email || "-"}
          </p>
        </div>

        <Link
          href={route("admin.quiz-results.show", quizSet.id)}
          className="inline-flex items-center justify-center rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
        >
          Kembali
        </Link>
      </div>

      <div className="mb-4 grid grid-cols-3 gap-2 sm:gap-3">
        <div className="rounded-lg bg-white p-3 text-center shadow-sm ring-1 ring-slate-200">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
            Skor
          </p>
          <p className="mt-1 font-semibold text-slate-800">
            {attempt.score}/{attempt.total_questions}
          </p>
        </div>
        <div className="rounded-lg bg-white p-3 text-center shadow-sm ring-1 ring-slate-200">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
            Nilai
          </p>
          <p className="mt-1 font-semibold text-emerald-700">
            {attempt.percentage}%
          </p>
        </div>
        <div className="rounded-lg bg-white p-3 text-center shadow-sm ring-1 ring-slate-200">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
            Submit
          </p>
          <p className="mt-1 font-semibold text-slate-800">
            {attempt.submitted_at || "-"}
          </p>
        </div>
      </div>

      {questions.length > 0 && (
        <div className="sticky top-0 z-10 mb-4 rounded-lg bg-white p-3 shadow-sm ring-1 ring-slate-200">
          <p className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-400">
            Navigasi Soal
          </p>
          <div className="flex flex-wrap gap-2">
            {questions.map((question, index) => {
              const stateClass =
                question.selected_option === null
                  ? "bg-slate-100 text-slate-500 hover:bg-slate-200"
                  : question.is_correct
                    ? "bg-emerald-500 text-white hover:bg-emerald-600"
                    : "bg-red-500 text-white hover:bg-red-600";

              return (
                <button
                  key={question.id}
                  type="button"
                  onClick={() =>
                    document
                      .getElementById(`soal-${question.id}`)
                      ?.scrollIntoView({ behavior: "smooth", block: "start" })
                  }
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold transition ${stateClass}`}
                >
                  {index + 1}
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="space-y-3">
        {questions.length === 0 ? (
          <div className="rounded-lg bg-white p-6 text-sm text-slate-500 shadow-sm ring-1 ring-slate-200">
            Tidak ada soal untuk tes ini.
          </div>
        ) : (
          questions.map((question, index) => (
            <div
              key={question.id}
              id={`soal-${question.id}`}
              className="scroll-mt-28 rounded-lg bg-white p-4 shadow-sm ring-1 ring-slate-200"
            >
              <div className="mb-3 flex items-start justify-between gap-3">
                <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                  Soal {index + 1}
                </p>
                <span
                  className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-bold ${
                    question.selected_option === null
                      ? "bg-slate-100 text-slate-500"
                      : question.is_correct
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-red-50 text-red-700"
                  }`}
                >
                  {question.selected_option === null
                    ? "Tidak dijawab"
                    : question.is_correct
                      ? "Benar"
                      : "Salah"}
                </span>
              </div>

              <div
                className="prose prose-sm max-w-none text-slate-800"
                dangerouslySetInnerHTML={{
                  __html: cleanHtml(question.question_text),
                }}
              />

              <div className="mt-3 space-y-2">
                {(question.options || []).map((option, optionIndex) => {
                  const label =
                    optionLabels[optionIndex] ||
                    String.fromCharCode(65 + optionIndex);
                  const isCorrectOption = label === question.correct_option;
                  const isSelectedOption = label === question.selected_option;

                  let stateClass = "border-slate-200";
                  if (isCorrectOption) {
                    stateClass = "border-emerald-400 bg-emerald-50";
                  } else if (isSelectedOption && !question.is_correct) {
                    stateClass = "border-red-400 bg-red-50";
                  }

                  return (
                    <div
                      key={`${question.id}-${label}`}
                      className={`flex items-start gap-3 rounded-2xl border px-3 py-2 text-sm ${stateClass}`}
                    >
                      <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-black text-slate-700">
                        {label}
                      </span>
                      <div
                        className="prose prose-sm max-w-none flex-1"
                        dangerouslySetInnerHTML={{
                          __html: cleanHtml(option),
                        }}
                      />
                      {isSelectedOption && (
                        <span className="shrink-0 text-xs font-bold text-slate-500">
                          Jawaban siswa
                        </span>
                      )}
                      {isCorrectOption && !isSelectedOption && (
                        <span className="shrink-0 text-xs font-bold text-emerald-600">
                          Kunci jawaban
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              {question.explanation && (
                <div className="mt-3 rounded-lg bg-slate-50 p-3 text-sm text-slate-600">
                  <p className="mb-1 text-xs font-bold uppercase tracking-wide text-slate-400">
                    Pembahasan
                  </p>
                  <div
                    className="prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{
                      __html: cleanHtml(question.explanation),
                    }}
                  />
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </AdminLayout>
  );
}
