import { CloudArrowUpIcon, PlayCircleIcon } from "@heroicons/react/24/solid";

export default function StepOneObserve({ onNext }) {
  return (
    <div className="course-detail-grid">
      <div className="course-detail-card space-y-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
          <CloudArrowUpIcon className="h-5 w-5 text-[rgb(var(--color-primary))]" />
          Attachment PPT / Video
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <button className="course-secondary-button">Upload PPT</button>
          <button className="course-secondary-button">Upload Video</button>
        </div>

        <div className="course-media-placeholder">
          <PlayCircleIcon className="h-14 w-14 text-[rgb(var(--color-primary))]" />
          <p className="text-sm font-semibold text-slate-600">
            Preview materi akan tampil di sini
          </p>
        </div>
      </div>

      <div className="course-detail-card space-y-3">
        <h3 className="course-detail-title">Instruksi</h3>
        <p className="course-detail-text">
          Buka PPT atau video terlebih dahulu. Setelah itu lanjut ke bagian
          bertanya untuk menuliskan pemahaman awal.
        </p>
        <button className="btn-primary w-full" onClick={onNext}>
          Lanjut ke Bertanya
        </button>
      </div>
    </div>
  );
}