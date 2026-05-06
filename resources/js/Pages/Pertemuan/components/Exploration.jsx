import { useState, useRef, useEffect } from "react";
import { BeakerIcon, PencilSquareIcon, DocumentIcon } from "@heroicons/react/24/solid";
import { codeToHtml } from 'shiki';

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
    { value: "html", label: "HTML" },
    { value: "css", label: "CSS" },
  ];

  const materials = stepData?.materials || stepData?.exploration_materials || [];
  const caseStudies = stepData?.case_studies || stepData?.exploration_cases || [];
  const [selectedCaseIndex, setSelectedCaseIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('materials');
  const materialRefs = useRef([]);

  const scrollToMaterial = (index) => {
    materialRefs.current[index]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  const [highlightedCode, setHighlightedCode] = useState({});

  // Highlight code blocks ketika material berubah
  useEffect(() => {
    const highlightAllCodes = async () => {
      const allCodes = [];
      materials.forEach((m, midx) => {
        if (Array.isArray(m.blocks)) {
          m.blocks.forEach((block, bidx) => {
            if (block.type === 'code') {
              allCodes.push({ key: `m-${midx}-${bidx}`, code: block.code, lang: block.language });
            }
          });
        }
      });
      caseStudies.forEach((c, cidx) => {
        if (Array.isArray(c.blocks)) {
          c.blocks.forEach((block, bidx) => {
            if (block.type === 'code') {
              allCodes.push({ key: `c-${cidx}-${bidx}`, code: block.code, lang: block.language });
            }
          });
        }
      });

      const newHighlighted = { ...highlightedCode };
      for (const item of allCodes) {
        if (!newHighlighted[item.key]) {
          try {
            const html = await codeToHtml(item.code, {
              lang: getLanguageAlias(item.lang || 'javascript'),
              theme: 'one-dark-pro'
            });
            newHighlighted[item.key] = html;
          } catch (e) {
            console.error('Shiki error:', e);
          }
        }
      }
      setHighlightedCode(newHighlighted);
    };
    
    highlightAllCodes();
  }, [materials, caseStudies]);

  const getLanguageAlias = (lang) => {
    const aliases = {
      'js': 'javascript',
      'py': 'python',
      'html': 'html',
      'css': 'css',
    };
    return aliases[lang?.toLowerCase()] || lang || 'javascript';
  };

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
            {(caseStudies.length > 0
              ? caseStudies[selectedCaseIndex]?.prompt
              : stepData?.exploration_prompt) || "Bagian ini nanti bisa berisi tugas berbeda sesuai materi dan kebutuhan pertemuan yang sedang dibuka."}
          </p>
        </div>

        {/* PDF Viewer Section */}
        {stepData?.exploration_pdf_url && (
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="mb-3 flex items-center gap-2">
              <DocumentIcon className="h-5 w-5 text-blue-600" />
              <h3 className="font-semibold text-slate-900">Materi PDF</h3>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white overflow-hidden">
              <iframe
                src={stepData.exploration_pdf_url}
                className="w-full"
                style={{ height: "600px" }}
                title="PDF Viewer"
              />
            </div>

            <div className="mt-3">
              <a
                href={stepData.exploration_pdf_url}
                download
                className="course-secondary-button inline-block text-center"
              >
                Download PDF
              </a>
            </div>
          </div>
        )}

        {/* Materials & Case Studies Tabs */}
        {(materials.length > 0 || caseStudies.length > 0) && (
          <div className="mt-4 border-b border-slate-200 mb-4">
            <div className="flex gap-4">
              {materials.length > 0 && (
                <button
                  type="button"
                  onClick={() => setActiveTab('materials')}
                  className={`px-4 py-2 font-semibold ${
                    activeTab === 'materials'
                      ? 'border-b-2 border-blue-500 text-blue-600'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Materi ({materials.length})
                </button>
              )}
              {caseStudies.length > 0 && (
                <button
                  type="button"
                  onClick={() => setActiveTab('cases')}
                  className={`px-4 py-2 font-semibold ${
                    activeTab === 'cases'
                      ? 'border-b-2 border-blue-500 text-blue-600'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Studi Kasus ({caseStudies.length})
                </button>
              )}
            </div>
          </div>
        )}

        {/* Materi Tab */}
        {activeTab === 'materials' && materials.length > 0 && (
          <div className="rounded-lg border border-slate-200 bg-white overflow-auto space-y-6 p-4">
            {materials.map((m, idx) => (
              <div
                key={idx}
                ref={(el) => (materialRefs.current[idx] = el)}
                className="pb-4 border-b border-slate-100 last:border-b-0"
              >
                <h5 className="font-semibold text-slate-900 mb-3 text-lg">{m.title || `Materi ${idx + 1}`}</h5>
                
                {Array.isArray(m.blocks) ? (
                  <div className="space-y-4">
                    {m.blocks.map((block, bidx) => (
                      <div key={bidx}>
                        {block.type === 'text' && (
                          <div className="prose prose-sm max-w-none text-slate-700" style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }} dangerouslySetInnerHTML={{ __html: block.content }} />
                        )}
                        {block.type === 'image' && (
                          <img src={block.url} alt={block.alt || 'Materi gambar'} className="rounded-lg max-w-full" />
                        )}
                        {block.type === 'code' && (
                          <div className="relative">
                            <button
                              type="button"
                              onClick={() => copyToClipboard(block.code)}
                              className="absolute top-2 right-2 bg-slate-600 hover:bg-slate-700 text-white px-3 py-1 text-xs rounded z-10"
                            >
                              Salin
                            </button>
                            <div className="mt-2 p-3 rounded overflow-auto" style={{background: '#282C34'}}>
                              <div dangerouslySetInnerHTML={{ __html: highlightedCode[`m-${idx}-${bidx}`] || `<pre><code>${block.code}</code></pre>` }} style={{ background: '#282C34', padding: '0.5rem', borderRadius: '0.375rem', fontSize: '14px', lineHeight: '1.5', fontFamily: 'monospace' }} />
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="prose prose-sm max-w-none text-slate-700" dangerouslySetInnerHTML={{ __html: m.content || "<p>Tidak ada konten materi.</p>" }} />
                )}
              </div>
            ))}
          </div>
        )}

        {/* Studi Kasus Tab */}
        {activeTab === 'cases' && caseStudies.length > 0 && (
          <div className="mt-4">
            <label className="course-field-label">Pilih Studi Kasus</label>
            <select className="mt-1 w-full rounded-lg border-slate-300 text-sm" value={selectedCaseIndex} onChange={(e) => setSelectedCaseIndex(Number(e.target.value))}>
              {caseStudies.map((c, idx) => (
                <option key={idx} value={idx}>{c.title || `Kasus ${idx + 1}`}</option>
              ))}
            </select>
            <div className="mt-3 rounded-lg border border-slate-200 bg-white p-4">
              {Array.isArray(caseStudies[selectedCaseIndex]?.blocks) ? (
                <div className="space-y-4">
                  {caseStudies[selectedCaseIndex]?.blocks.map((block, bidx) => (
                    <div key={bidx}>
                      {block.type === 'text' && (
                        <div className="prose prose-sm max-w-none text-slate-700" style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }} dangerouslySetInnerHTML={{ __html: block.content }} />
                      )}
                      {block.type === 'image' && (
                        <img src={block.url} alt={block.alt || 'Case gambar'} className="rounded-lg max-w-full" />
                      )}
                      {block.type === 'code' && (
                        <div className="relative">
                          <button
                            type="button"
                            onClick={() => copyToClipboard(block.code)}
                            className="absolute top-2 right-2 bg-slate-600 hover:bg-slate-700 text-white px-3 py-1 text-xs rounded z-10"
                          >
                            Salin
                          </button>
                          <div className="mt-2 p-3 rounded overflow-auto" style={{background: '#282C34'}}>
                            <div dangerouslySetInnerHTML={{ __html: highlightedCode[`c-${selectedCaseIndex}-${bidx}`] || `<pre><code>${block.code}</code></pre>` }} style={{ background: '#282C34', padding: '0.5rem', borderRadius: '0.375rem', fontSize: '14px', lineHeight: '1.5', fontFamily: 'monospace' }} />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div dangerouslySetInnerHTML={{ __html: caseStudies[selectedCaseIndex]?.content || '<p>Tidak ada detail kasus.</p>' }} />
              )}
            </div>
          </div>
        )}

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
        ) : null}

        <div className="flex flex-wrap gap-3">
          {isCompileMode && (
            <button className="btn-primary" onClick={onSave}>
              <PencilSquareIcon className="h-5 w-5" />
              Simpan Codingan
            </button>
          )}
          <button className="course-secondary-button" onClick={onNext}>
            {nextLabel}
          </button>
        </div>
      </div>

      <div className="course-detail-card space-y-3 sticky top-4 max-h-fit">
        <h3 className="course-detail-titleprismjs">Daftar Materi</h3>
        {materials.length > 0 ? (
          <ul className="space-y-1 text-sm">
            {materials.map((m, idx) => (
              <li key={idx}>
                <button
                  type="button"
                  onClick={() => scrollToMaterial(idx)}
                  className="w-full text-left rounded-lg px-3 py-2 text-slate-700 hover:bg-slate-100 font-medium"
                >
                  {m.title || `Materi ${idx + 1}`}
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="course-detail-text">Tidak ada materi tersedia.</p>
        )}
      </div>
    </div>
  );
}
