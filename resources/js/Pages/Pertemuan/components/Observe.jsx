import { CloudArrowUpIcon, PlayCircleIcon } from "@heroicons/react/24/solid";

export default function StepOneObserve({ stepData, onNext, nextLabel = "Lanjut" }) {
  const resourceUrl = stepData?.resource_url || "";
  const resourceLabel =
    stepData?.resource_type === "video"
      ? "Video"
      : stepData?.resource_type === "ppt"
        ? "PPT"
        : "PPT / Video";

  return (
    <div className="course-detail-grid">
      <div className="course-detail-card space-y-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
          <CloudArrowUpIcon className="h-5 w-5 text-[rgb(var(--color-primary))]" />
          {resourceLabel}
        </div>

        <p className="course-detail-text">
          {stepData?.instruction_text || "Buka PPT atau video terlebih dahulu lalu lanjutkan ke pertanyaan siswa."}
        </p>

        <ResourcePreview url={resourceUrl} resourceType={stepData?.resource_type} />
      </div>

      <div className="course-detail-card space-y-3">
        <h3 className="course-detail-title">Instruksi</h3>
        <p className="course-detail-text">
          {stepData?.instruction_text || "Buka PPT atau video terlebih dahulu. Setelah itu lanjut ke bagian bertanya untuk menuliskan pemahaman awal."}
        </p>
        <button className="btn-primary w-full" onClick={onNext}>
          {nextLabel}
        </button>
      </div>
    </div>
  );
}

function ResourcePreview({ url, resourceType }) {
  if (!url) {
    return (
      <div className="course-media-placeholder">
        <PlayCircleIcon className="h-14 w-14 text-[rgb(var(--color-primary))]" />
        <p className="text-sm font-semibold text-slate-600">
          Preview materi akan tampil di sini setelah admin mengisi URL.
        </p>
      </div>
    );
  }

  const preview = getPreviewSource(url, resourceType);

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
      <div className="aspect-video w-full bg-slate-100">
        {preview.kind === "video" ? (
          <video className="h-full w-full bg-black" src={preview.src} controls />
        ) : preview.kind === "iframe" ? (
          <iframe
            className="h-full w-full"
            src={preview.src}
            title="Preview materi"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center gap-3 p-4 text-center">
            <PlayCircleIcon className="h-14 w-14 text-[rgb(var(--color-primary))]" />
            <p className="text-sm font-semibold text-slate-600">
              Preview belum tersedia untuk tipe file ini.
            </p>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3 border-t border-slate-200 bg-white p-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0 text-sm text-slate-600">
          <span className="font-semibold text-slate-900">Materi:</span>{" "}
          <span className="break-all">{url}</span>
        </div>
        <a href={url} className="course-secondary-button shrink-0" target="_blank" rel="noreferrer">
          Buka Materi
        </a>
      </div>
    </div>
  );
}

function getPreviewSource(url, resourceType) {
  const normalizedUrl = url.trim();
  const lowerUrl = normalizedUrl.toLowerCase();
  const youtubeId = extractYoutubeId(normalizedUrl);
  const googleSlidesId = extractGoogleSlidesId(normalizedUrl);

  if (youtubeId) {
    return {
      kind: "iframe",
      src: `https://www.youtube.com/embed/${youtubeId}?rel=0`,
    };
  }

  if (googleSlidesId) {
    return {
      kind: "iframe",
      src: `https://docs.google.com/presentation/d/${googleSlidesId}/embed?start=false&loop=false&delayms=3000`,
    };
  }

  if (lowerUrl.includes("drive.google.com")) {
    return {
      kind: "iframe",
      src: toGoogleDrivePreviewUrl(normalizedUrl),
    };
  }

  if (resourceType === "video" || /\.(mp4|webm|ogg)(\?|#|$)/.test(lowerUrl)) {
    return { kind: "video", src: normalizedUrl };
  }

  if (/\.(pdf)(\?|#|$)/.test(lowerUrl)) {
    return { kind: "iframe", src: normalizedUrl };
  }

  if (/\.(ppt|pptx|doc|docx)(\?|#|$)/.test(lowerUrl)) {
    return {
      kind: "iframe",
      src: `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(normalizedUrl)}`,
    };
  }

  return { kind: "link", src: normalizedUrl };
}

function extractYoutubeId(url) {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([A-Za-z0-9_-]{11})/);
  return match?.[1] || null;
}

function extractGoogleSlidesId(url) {
  const match = url.match(/docs\.google\.com\/presentation\/d\/([^/]+)/);
  return match?.[1] || null;
}

function toGoogleDrivePreviewUrl(url) {
  const fileMatch = url.match(/\/file\/d\/([^/]+)/);
  const idMatch = url.match(/[?&]id=([^&]+)/);
  const fileId = fileMatch?.[1] || idMatch?.[1];

  return fileId ? `https://drive.google.com/file/d/${fileId}/preview` : url;
}
