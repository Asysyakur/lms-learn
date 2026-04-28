import { BeakerIcon, PencilSquareIcon } from "@heroicons/react/24/solid";

export default function StepThreeExploration({
  stepData,
  explorationDraft,
  setExplorationDraft,
  explorationCode,
  setExplorationCode,
  codeLanguage,
  setCodeLanguage,
  compileOutput,
  setCompileOutput,
  explorationSaved,
  onSave,
  onNext,
  nextLabel = "Lanjut",
}) {
  const isCompileMode = stepData?.exploration_mode === "code_compile";
  const languageOptions = [
    { value: "javascript", label: "JavaScript" },
    { value: "python", label: "Python" },
    { value: "php", label: "PHP" },
    { value: "java", label: "Java" },
    { value: "cpp", label: "C++" },
  ];

  function compileCode() {
    if (codeLanguage !== "javascript") {
      setCompileOutput(
        `${languageOptions.find((item) => item.value === codeLanguage)?.label || codeLanguage} belum bisa dijalankan langsung di browser.\nSaat ini compile/run tersedia untuk JavaScript. Kodenya tetap bisa disimpan.`,
      );
      return;
    }

    const logs = [];
    const originalLog = console.log;
    const originalWarn = console.warn;
    const originalError = console.error;

    console.log = (...args) => logs.push(args.map(String).join(" "));
    console.warn = (...args) => logs.push(args.map(String).join(" "));
    console.error = (...args) => logs.push(args.map(String).join(" "));

    try {
      // Client-side runner for JavaScript practice snippets.
      const result = Function('"use strict";\n' + explorationCode)();

      if (result !== undefined) {
        logs.push(String(result));
      }

      setCompileOutput(logs.length > 0 ? logs.join("\n") : "Program berhasil dijalankan tanpa output.");
    } catch (error) {
      setCompileOutput(`${error.name}: ${error.message}`);
    } finally {
      console.log = originalLog;
      console.warn = originalWarn;
      console.error = originalError;
    }
  }

  return (
    <div className="course-detail-grid">
      <div className="course-detail-card space-y-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
          <BeakerIcon className="h-5 w-5 text-[rgb(var(--color-primary))]" />
          Eksplorasi per pertemuan
        </div>

        <div className="course-exploration-box">
          <p className="font-semibold text-slate-900">
            {isCompileMode
              ? "Compile codingan pertemuan ini lalu tulis hasil yang muncul."
              : stepData?.exploration_mode === "analysis"
                ? "Analisis studi kasus pertemuan ini lalu tulis hasil pengamatanmu."
                : "Konten eksplorasi akan kamu isi per pertemuan."}
          </p>
          <p className="mt-2 text-sm text-slate-600">
            {stepData?.exploration_prompt || "Bagian ini nanti bisa berisi tugas berbeda sesuai materi dan kebutuhan pertemuan yang sedang dibuka."}
          </p>
        </div>

        {isCompileMode ? (
          <div className="space-y-3">
            <label className="course-field-label">Codingan siswa</label>
            <div className="max-w-xs">
              <label className="course-field-label">Bahasa</label>
              <select
                className="mt-1 w-full rounded-lg border-slate-300 text-sm"
                value={codeLanguage}
                onChange={(event) => setCodeLanguage(event.target.value)}
              >
                {languageOptions.map((language) => (
                  <option key={language.value} value={language.value}>
                    {language.label}
                  </option>
                ))}
              </select>
            </div>
            <textarea
              className="course-textarea min-h-56 font-mono"
              placeholder={'Contoh:\nclass Mobil {\n  constructor(nama) {\n    this.nama = nama;\n  }\n}\n\nconst mobil = new Mobil("Avanza");\nconsole.log(mobil.nama);'}
              value={explorationCode}
              onChange={(event) => setExplorationCode(event.target.value)}
            />

            <div className="flex flex-wrap gap-3">
              <button className="course-secondary-button" type="button" onClick={compileCode}>
                Compile / Run
              </button>
            </div>

            <div className="rounded-2xl bg-slate-950 p-4 font-mono text-sm text-slate-100">
              <div className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-400">Output</div>
              <pre className="min-h-20 whitespace-pre-wrap">{compileOutput || "Output akan muncul di sini."}</pre>
            </div>
          </div>
        ) : (
          <>
            <label className="course-field-label">Jawaban eksplorasi siswa</label>
            <textarea
              className="course-textarea"
              placeholder="Tulis jawaban eksplorasi di sini..."
              value={explorationDraft}
              onChange={(event) => setExplorationDraft(event.target.value)}
            />
          </>
        )}

        <div className="flex flex-wrap gap-3">
          <button className="btn-primary" onClick={onSave}>
            <PencilSquareIcon className="h-5 w-5" />
            Simpan Jawaban Eksplorasi
          </button>
          <button className="course-secondary-button" onClick={onNext}>
            {nextLabel}
          </button>
        </div>
      </div>

      <div className="course-detail-card space-y-3">
        <h3 className="course-detail-title">Preview jawaban</h3>
        <p className="course-detail-text">
          {isCompileMode
            ? explorationSaved || "Belum ada codingan yang disimpan."
            : explorationSaved || "Belum ada jawaban eksplorasi yang disimpan."}
        </p>
        {isCompileMode && (
          <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
            <div className="font-semibold text-slate-900">Output tersimpan</div>
            <pre className="mt-2 whitespace-pre-wrap">{compileOutput || "Belum ada output."}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
