import { QuestionMarkCircleIcon } from "@heroicons/react/24/solid";

export default function StepSixReflection({
  reflectionDraft,
  setReflectionDraft,
  reflectionSaved,
  onSave,
}) {
  return (
    <div className="course-detail-grid">
      <div className="course-detail-card space-y-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
          <QuestionMarkCircleIcon className="h-5 w-5 text-[rgb(var(--color-primary))]" />
          Pertanyaan refleksi
        </div>

        <p className="course-detail-text font-semibold text-slate-900">
          Apa hal paling penting yang kamu pelajari pada pertemuan ini?
        </p>

        <textarea
          className="course-textarea"
          placeholder="Tulis jawaban refleksimu di sini..."
          value={reflectionDraft}
          onChange={(event) => setReflectionDraft(event.target.value)}
        />

        <button className="btn-primary w-full sm:w-auto" onClick={onSave}>
          Simpan Jawaban
        </button>
      </div>

      <div className="course-detail-card space-y-3">
        <h3 className="course-detail-title">Jawaban tersimpan</h3>
        <p className="course-detail-text">
          {reflectionSaved || "Belum ada jawaban refleksi yang disimpan."}
        </p>
      </div>
    </div>
  );
}