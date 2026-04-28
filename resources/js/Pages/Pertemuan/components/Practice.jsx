import { ClipboardDocumentCheckIcon } from "@heroicons/react/24/solid";

export default function StepFourPractice({
  stepData,
  assessmentMode,
  setAssessmentMode,
  quizAnswer,
  setQuizAnswer,
  essayAnswer,
  setEssayAnswer,
  assessmentSaved,
  onSave,
}) {
  const lockedAssessmentMode = stepData?.assessment_mode;
  const activeMode = lockedAssessmentMode || assessmentMode;

  return (
    <div className="course-detail-grid">
      <div className="course-detail-card space-y-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
          <ClipboardDocumentCheckIcon className="h-5 w-5 text-[rgb(var(--color-primary))]" />
          Latihan soal
        </div>

        {lockedAssessmentMode ? (
          <div className="inline-flex w-fit rounded-full bg-[rgb(var(--color-primary))] px-4 py-2 text-sm font-semibold text-white">
            {lockedAssessmentMode === "quiz" ? "Kuis" : "Essay"}
          </div>
        ) : (
          <div className="flex gap-2">
            <button
              className={`course-tab ${assessmentMode === "quiz" ? "course-tab-active" : ""}`}
              onClick={() => setAssessmentMode("quiz")}
            >
              Kuis
            </button>
            <button
              className={`course-tab ${assessmentMode === "essay" ? "course-tab-active" : ""}`}
              onClick={() => setAssessmentMode("essay")}
            >
              Essay
            </button>
          </div>
        )}

        {activeMode === "quiz" ? (
          <div className="space-y-4">
            <p className="course-detail-text font-semibold text-slate-900">
              {stepData?.assessment_question || "Pilih jawaban yang paling tepat:"}
            </p>

            <div className="space-y-2">
              {(stepData?.assessment_options || [
                "A. OOP adalah pendekatan yang berfokus pada objek.",
                "B. OOP hanya menggunakan fungsi.",
                "C. OOP tidak memiliki class.",
                "D. OOP hanya untuk desain grafis.",
              ]).map((option) => (
                <label key={option} className="course-option">
                  <input
                    type="radio"
                    name="quiz-answer"
                    value={option}
                    checked={quizAnswer === option}
                    onChange={(event) => setQuizAnswer(event.target.value)}
                  />
                  <span>{option}</span>
                </label>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="course-detail-text font-semibold text-slate-900">
              {stepData?.assessment_question || "Tulis jawaban essay singkat:"}
            </p>
            <textarea
              className="course-textarea"
              placeholder="Tulis jawaban essay di sini..."
              value={essayAnswer}
              onChange={(event) => setEssayAnswer(event.target.value)}
            />
          </div>
        )}

        <button className="btn-primary w-full sm:w-auto" onClick={onSave}>
          Simpan Latihan Soal
        </button>
      </div>

      <div className="course-detail-card space-y-3">
        <h3 className="course-detail-title">Catatan</h3>
        <p className="course-detail-text">
          Latihan soal bisa dipakai untuk kuis pilihan ganda atau essay.
          Nanti formatnya bisa diganti per pertemuan.
        </p>
        <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
          <div className="font-semibold text-slate-900">Jawaban tersimpan</div>
          <p className="mt-2">
            {assessmentSaved || "Belum ada jawaban latihan soal yang disimpan."}
          </p>
        </div>
      </div>
    </div>
  );
}
