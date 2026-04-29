import { ChatBubbleLeftRightIcon, PaperAirplaneIcon } from "@heroicons/react/24/solid";

export default function StepTwoAsk({
  stepData,
  questionDraft,
  setQuestionDraft,
  questionSaved,
  onSave,
  onNext,
  nextLabel = "Lanjut",
}) {
  return (
    <div className="course-detail-grid">
      <div className="course-detail-card space-y-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
          <ChatBubbleLeftRightIcon className="h-5 w-5 text-[rgb(var(--color-primary))]" />
          Tulis pertanyaanmu
        </div>

        <p className="course-detail-text">
          {stepData?.question_prompt || "Tulis pertanyaan atau tanggapanmu setelah melihat PPT/video."}
        </p>

        <label className="course-field-label">Pertanyaan siswa</label>
        <textarea
          className="course-textarea"
          placeholder="Tulis pertanyaan atau tanggapanmu di sini..."
          value={questionDraft}
          onChange={(event) => setQuestionDraft(event.target.value)}
        />

        <div className="flex flex-wrap gap-3">
          <button className="btn-primary" onClick={onSave}>
            <PaperAirplaneIcon className="h-5 w-5" />
            Simpan Jawaban
          </button>
          <button className="course-secondary-button" onClick={onNext}>
            Lanjut
          </button>
        </div>
      </div>

      <div className="course-detail-card space-y-3">
        <h3 className="course-detail-title">Jawaban tersimpan</h3>
        <p className="course-detail-text">
          {questionSaved || "Belum ada jawaban yang disimpan."}
        </p>
      </div>
    </div>
  );
}
