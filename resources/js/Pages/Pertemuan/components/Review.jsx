import { ArrowPathIcon, PencilSquareIcon } from "@heroicons/react/24/solid";

export default function StepFiveReview({
  stepData,
  explorationSaved,
  explorationMode,
  explorationOutput,
  reviewDraft,
  setReviewDraft,
  reviewSaved,
  onSave,
  onNext,
  nextLabel = "Lanjut",
}) {
  const isCompileReview = explorationMode === "code_compile";

  return (
    <div className="course-detail-grid">
      <div className="course-detail-card space-y-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
          <ArrowPathIcon className="h-5 w-5 text-[rgb(var(--color-primary))]" />
          Bandingkan dan perbaiki
        </div>

        <div className="grid gap-3 lg:grid-cols-2">
          <div className="course-review-box">
            <div className="text-sm font-semibold text-slate-700">Jawaban eksplorasi</div>
            {isCompileReview ? (
              <pre className="mt-2 min-h-40 whitespace-pre-wrap rounded-2xl bg-slate-950 p-4 font-mono text-sm text-slate-100">
                {explorationSaved || "Belum ada codingan yang bisa ditampilkan."}
              </pre>
            ) : (
              <p className="mt-2 text-sm text-slate-600">
                {explorationSaved || "Belum ada jawaban eksplorasi yang bisa ditampilkan."}
              </p>
            )}
            {isCompileReview && (
              <div className="mt-3 rounded-2xl bg-white p-4 text-sm text-slate-700 ring-1 ring-slate-200">
                <div className="font-semibold text-slate-900">Output</div>
                <pre className="mt-2 whitespace-pre-wrap font-mono text-xs">
                  {explorationOutput || "Belum ada output."}
                </pre>
              </div>
            )}
          </div>

          <div className="course-review-box course-review-box-accent">
            <div className="text-sm font-semibold text-slate-700">Edit jawaban</div>
            <p className="mt-2 text-sm text-slate-600">
              {stepData?.review_prompt || "Tinjau jawaban eksplorasimu lalu perbaiki jika ada bagian yang kurang tepat."}
            </p>
            <textarea
              className={`course-textarea mt-2 ${isCompileReview ? "min-h-56 font-mono" : ""}`}
              placeholder={isCompileReview ? "Edit codingan di sini..." : "Edit jawaban eksplorasi di sini..."}
              value={reviewDraft}
              onChange={(event) => setReviewDraft(event.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button className="btn-primary" onClick={onSave}>
            <PencilSquareIcon className="h-5 w-5" />
            Simpan Perbaikan
          </button>
          <button className="course-secondary-button" onClick={onNext}>
            {nextLabel}
          </button>
        </div>
      </div>

      <div className="course-detail-card space-y-3">
        <h3 className="course-detail-title">Hasil edit</h3>
        <p className="course-detail-text">
          {reviewSaved || "Belum ada hasil edit jawaban yang disimpan."}
        </p>
      </div>
    </div>
  );
}
