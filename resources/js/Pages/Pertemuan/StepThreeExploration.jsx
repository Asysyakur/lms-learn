import { BeakerIcon, PencilSquareIcon } from "@heroicons/react/24/solid";

export default function StepThreeExploration({
  stepData,
  explorationDraft,
  setExplorationDraft,
  explorationSaved,
  onSave,
  onNext,
}) {
  return (
    <div className="course-detail-grid">
      <div className="course-detail-card space-y-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
          <BeakerIcon className="h-5 w-5 text-[rgb(var(--color-primary))]" />
          Eksplorasi per pertemuan
        </div>

        <div className="course-exploration-box">
          <p className="font-semibold text-slate-900">
            {stepData?.exploration_mode === "code_compile"
              ? "Compile codingan pertemuan ini lalu tulis hasil yang muncul."
              : stepData?.exploration_mode === "analysis"
                ? "Analisis studi kasus pertemuan ini lalu tulis hasil pengamatanmu."
                : "Konten eksplorasi akan kamu isi per pertemuan."}
          </p>
          <p className="mt-2 text-sm text-slate-600">
            {stepData?.exploration_prompt || "Bagian ini nanti bisa berisi tugas berbeda sesuai materi dan kebutuhan pertemuan yang sedang dibuka."}
          </p>
        </div>

        <label className="course-field-label">Jawaban eksplorasi siswa</label>
        <textarea
          className="course-textarea"
          placeholder="Tulis jawaban eksplorasi di sini..."
          value={explorationDraft}
          onChange={(event) => setExplorationDraft(event.target.value)}
        />

        <div className="flex flex-wrap gap-3">
          <button className="btn-primary" onClick={onSave}>
            <PencilSquareIcon className="h-5 w-5" />
            Simpan Jawaban Eksplorasi
          </button>
          <button className="course-secondary-button" onClick={onNext}>
            Lanjut ke Latihan Soal
          </button>
        </div>
      </div>

      <div className="course-detail-card space-y-3">
        <h3 className="course-detail-title">Preview jawaban</h3>
        <p className="course-detail-text">
          {explorationSaved || "Belum ada jawaban eksplorasi yang disimpan."}
        </p>
      </div>
    </div>
  );
}