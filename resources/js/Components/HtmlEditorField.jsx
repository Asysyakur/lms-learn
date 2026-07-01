import { useRef, useState } from "react";

function cleanHtml(html) {
  return (html || "").replace(/body\s*\{[\s\S]*?\}/gi, "");
}

export default function HtmlEditorField({
  label,
  value,
  onChange,
  error,
  minHeightClass = "min-h-28",
  placeholder,
}) {
  const textareaRef = useRef(null);
  const [showPreview, setShowPreview] = useState(false);

  function applyFormat(format) {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const content = value || "";
    const start = textarea.selectionStart ?? content.length;
    const end = textarea.selectionEnd ?? content.length;
    const selected = content.slice(start, end);

    let inserted = selected;
    let caretAt = null;

    if (format === "bold") {
      inserted = `<b>${selected || "teks tebal"}</b>`;
    } else if (format === "italic") {
      inserted = `<i>${selected || "teks miring"}</i>`;
    } else if (format === "bullet" || format === "number") {
      const tag = format === "bullet" ? "ul" : "ol";
      const items = selected
        ? selected
            .split(/\r?\n/)
            .map((line) => line.trim())
            .filter(Boolean)
            .map((line) => `<li>${line}</li>`)
            .join("")
        : "<li>item</li>";
      inserted = `<${tag}>${items}</${tag}>`;
    }

    const newValue = content.slice(0, start) + inserted + content.slice(end);
    onChange(newValue);

    const nextPos = caretAt ?? start + inserted.length;
    requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(nextPos, nextPos);
    });
  }

  return (
    <div>
      {label && (
        <label className="block text-sm font-semibold text-slate-700">
          {label}
        </label>
      )}
      <div className="mt-1 overflow-hidden rounded-lg border border-slate-300">
        <div className="flex flex-wrap items-center gap-1 border-b border-slate-200 bg-slate-50 px-2 py-1.5">
          <button
            type="button"
            onClick={() => applyFormat("bold")}
            className="rounded px-2 py-1 text-sm font-bold text-slate-700 hover:bg-slate-200"
            title="Tebal"
          >
            B
          </button>
          <button
            type="button"
            onClick={() => applyFormat("italic")}
            className="rounded px-2 py-1 text-sm italic text-slate-700 hover:bg-slate-200"
            title="Miring"
          >
            I
          </button>
          <button
            type="button"
            onClick={() => applyFormat("bullet")}
            className="rounded px-2 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-200"
            title="List bullet"
          >
            • List
          </button>
          <button
            type="button"
            onClick={() => applyFormat("number")}
            className="rounded px-2 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-200"
            title="List angka"
          >
            1. List
          </button>
          <button
            type="button"
            onClick={() => setShowPreview((current) => !current)}
            className="ml-auto rounded px-2 py-1 text-xs font-semibold text-blue-700 hover:bg-blue-50"
          >
            {showPreview ? "Tulis HTML" : "Pratinjau"}
          </button>
        </div>

        {showPreview ? (
          <div
            className={`prose prose-sm max-w-none overflow-y-auto bg-white p-3 ${minHeightClass}`}
            dangerouslySetInnerHTML={{
              __html:
                cleanHtml(value) ||
                '<p class="text-slate-400">Belum ada konten.</p>',
            }}
          />
        ) : (
          <textarea
            ref={textareaRef}
            className={`w-full border-0 p-3 text-sm focus:outline-none focus:ring-0 ${minHeightClass}`}
            value={value || ""}
            placeholder={placeholder}
            onChange={(e) => onChange(e.target.value)}
          />
        )}
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
