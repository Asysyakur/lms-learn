import { useEffect, useState } from "react";
import { Link, useForm } from "@inertiajs/react";
import { codeToHtml } from 'shiki';

function CodePreview({ code, language }) {
  const [html, setHtml] = useState('');

  useEffect(() => {
    const highlight = async () => {
      try {
        const langMap = {
          'js': 'javascript',
          'py': 'python',
          'html': 'html',
          'css': 'css',
        };
        const lang = langMap[language?.toLowerCase()] || language || 'javascript';
        const result = await codeToHtml(code, {
          lang,
          theme: 'one-dark-pro'
        });
        setHtml(result);
      } catch (e) {
        setHtml(`<pre><code>${code}</code></pre>`);
      }
    };
    highlight();
  }, [code, language]);

  return (
    <div className="mt-2 p-3 rounded overflow-auto" style={{background: '#282C34'}}>
      <p className="text-slate-400 text-xs mb-2">Preview:</p>
      <div dangerouslySetInnerHTML={{ __html: html }} style={{ background: '#282C34', padding: '0.5rem', borderRadius: '0.375rem', fontSize: '14px', lineHeight: '1.5', fontFamily: 'monospace' }} />
    </div>
  );
}

const STEP_TYPES = [
  { value: "observe", label: "Observe" },
  { value: "ask", label: "Ask" },
  { value: "exploration", label: "Exploration" },
  { value: "practice", label: "Practice" },
  { value: "review", label: "Review" },
  { value: "reflection", label: "Reflection" },
];

const CODE_LANGUAGES = [
  { value: "javascript", label: "JavaScript" },
  { value: "python", label: "Python" },
  { value: "php", label: "PHP" },
  { value: "html", label: "HTML" },
  { value: "css", label: "CSS" },
];

export default function StepForm({ meetingId, step = null, onSuccess = null }) {
  const isEdit = Boolean(step);
  const [highlightedCode, setHighlightedCode] = useState({});
  const [draggedBlock, setDraggedBlock] = useState(null);
  const [dragOverBlock, setDragOverBlock] = useState(null);
  const [expandedMaterials, setExpandedMaterials] = useState({});
  const [expandedCases, setExpandedCases] = useState({});
  const { data, setData, post, transform, processing, errors, reset } = useForm({
    meeting_id: meetingId ?? step?.meeting_id ?? "",
    step_number: step?.step_number ?? "",
    title: step?.title ?? "",
    description: step?.description ?? "",
    step_type: step?.step_type ?? "observe",
    instruction_text: step?.observation?.instruction_text ?? "",
    resource_type: step?.observation?.resource_type ?? "video",
    resource_url: step?.observation?.resource_url ?? "",
    question_prompt: step?.ask?.question_prompt ?? "",
    exploration_mode: step?.exploration?.exploration_mode ?? "analysis",
    code_language: step?.exploration?.code_language ?? "javascript",
    exploration_prompt: step?.exploration?.exploration_prompt ?? "",
    materials: Array.isArray(step?.exploration?.materials) ? step.exploration.materials : [],
    case_studies: Array.isArray(step?.exploration?.case_studies) ? step.exploration.case_studies : [],
    assessment_mode: step?.practice?.assessment_mode ?? "quiz",
    assessment_question: step?.practice?.assessment_question ?? "",
    assessment_options: Array.isArray(step?.practice?.assessment_options)
      ? step.practice.assessment_options.join("\n")
      : "",
    review_prompt: step?.review?.review_prompt ?? "",
    reflection_question: step?.reflection?.reflection_question ?? "",
  });

  useEffect(() => {
    setData("meeting_id", meetingId ?? step?.meeting_id ?? "");
  }, [meetingId]);

  const getLanguageAlias = (lang) => {
    const aliases = {
      'js': 'javascript',
      'py': 'python',
      'html': 'html',
      'css': 'css',
    };
    return aliases[lang?.toLowerCase()] || lang || 'javascript';
  };

  const highlightCodeAsync = async (code, language = 'javascript') => {
    try {
      const html = await codeToHtml(code, {
        lang: getLanguageAlias(language),
        theme: 'one-dark-pro'
      });
      return html;
    } catch (e) {
      return `<pre><code>${code}</code></pre>`;
    }
  };

  // Formatting helpers untuk text blocks
  const insertFormatting = (content, format, parentType, parentIdx, blockIdx) => {
    let newContent = content;
    switch(format) {
      case 'bold':
        newContent += '<b>bold text</b>';
        break;
      case 'italic':
        newContent += '<i>italic text</i>';
        break;
      case 'bullet':
        newContent += '<ul><li>item</li></ul>';
        break;
      case 'number':
        newContent += '<ol><li>item</li></ol>';
        break;
      default:
        break;
    }
    
    const arr = parentType === 'materials' 
      ? [...(data.materials || [])]
      : [...(data.case_studies || [])];
    arr[parentIdx].blocks[blockIdx].content = newContent;
    setData(parentType, arr);
  };

  // Drag and drop handlers untuk blocks
  const handleDragStart = (e, type, parentIdx, blockIdx) => {
    setDraggedBlock({ type, parentIdx, blockIdx });
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragEnter = (e, type, parentIdx, blockIdx) => {
    setDragOverBlock({ type, parentIdx, blockIdx });
  };

  const handleDragLeave = () => {
    setDragOverBlock(null);
  };

  const handleDrop = (e, type, parentIdx, blockIdx) => {
    e.preventDefault();
    if (!draggedBlock || draggedBlock.type !== type || draggedBlock.parentIdx !== parentIdx) {
      return;
    }

    const fromIdx = draggedBlock.blockIdx;
    const toIdx = blockIdx;

    if (fromIdx === toIdx) {
      setDraggedBlock(null);
      setDragOverBlock(null);
      return;
    }

    const arr = type === 'materials' 
      ? [...(data.materials || [])]
      : [...(data.case_studies || [])];

    const [movedBlock] = arr[parentIdx].blocks.splice(fromIdx, 1);
    arr[parentIdx].blocks.splice(toIdx, 0, movedBlock);

    setData(type, arr);
    setDraggedBlock(null);
    setDragOverBlock(null);
  };

  const toggleMaterial = (idx) => {
    setExpandedMaterials(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  const toggleCase = (idx) => {
    setExpandedCases(prev => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  function submit(e) {
    e.preventDefault();

    // Tentukan apakah perlu FormData (jika ada file upload)
    const options = {};

    // If using FormData (file upload), stringify arrays so backend accepts them as JSON.
    if (isEdit) {
      transform((formData) => {
        const out = { ...formData, _method: "put" };
        return out;
      });
      post(`/admin/steps/${step.id}`, options);
      return;
    }

    transform((formData) => {
      const out = { ...formData };
      return out;
    });

    post("/admin/steps", {
      ...options,
      onSuccess: () => {
        reset();
        onSuccess?.();
      },
    });
  }

  return (
    <form onSubmit={submit} className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200">
      <div className="grid gap-4 md:grid-cols-3">
        <div>
          <label className="block text-sm font-semibold text-slate-700">Nomor Step</label>
          <input
            className="mt-1 w-full rounded-lg border-slate-300"
            type="number"
            min="1"
            value={data.step_number}
            onChange={(e) => setData("step_number", e.target.value)}
          />
          {errors.step_number && <p className="mt-1 text-sm text-red-600">{errors.step_number}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700">Tipe</label>
          <select
            className="mt-1 w-full rounded-lg border-slate-300"
            value={data.step_type}
            onChange={(e) => setData("step_type", e.target.value)}
          >
            {STEP_TYPES.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
          {errors.step_type && <p className="mt-1 text-sm text-red-600">{errors.step_type}</p>}
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700">Judul</label>
          <input
            className="mt-1 w-full rounded-lg border-slate-300"
            value={data.title}
            onChange={(e) => setData("title", e.target.value)}
          />
          {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
        </div>
      </div>

      <label className="mt-4 block text-sm font-semibold text-slate-700">Deskripsi</label>
      <textarea
        className="mt-1 min-h-20 w-full rounded-lg border-slate-300"
        value={data.description}
        onChange={(e) => setData("description", e.target.value)}
      />

      <div className="mt-5 rounded-lg border border-slate-200 bg-slate-50 p-4">
        {data.step_type === "observe" && (
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-semibold text-slate-700">Instruksi</label>
              <textarea
                className="mt-1 min-h-24 w-full rounded-lg border-slate-300"
                value={data.instruction_text}
                onChange={(e) => setData("instruction_text", e.target.value)}
              />
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700">Tipe Resource</label>
                <select
                  className="mt-1 w-full rounded-lg border-slate-300"
                  value={data.resource_type}
                  onChange={(e) => setData("resource_type", e.target.value)}
                >
                  <option value="video">Video</option>
                  <option value="ppt">PPT</option>
                  <option value="both">Video dan PPT</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700">URL Resource</label>
                <input
                  className="mt-1 w-full rounded-lg border-slate-300"
                  value={data.resource_url}
                  onChange={(e) => setData("resource_url", e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {data.step_type === "ask" && (
          <div>
            <label className="block text-sm font-semibold text-slate-700">Prompt Pertanyaan</label>
            <textarea
              className="mt-1 min-h-24 w-full rounded-lg border-slate-300"
              value={data.question_prompt}
              onChange={(e) => setData("question_prompt", e.target.value)}
            />
          </div>
        )}

        {data.step_type === "exploration" && (
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-[220px_220px_1fr]">
              <div>
                <label className="block text-sm font-semibold text-slate-700">Mode</label>
                <select
                  className="mt-1 w-full rounded-lg border-slate-300"
                  value={data.exploration_mode}
                  onChange={(e) => setData("exploration_mode", e.target.value)}
                >
                  <option value="analysis">Analysis</option>
                  <option value="code_compile">Code Compile</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700">Bahasa</label>
                <select
                  className="mt-1 w-full rounded-lg border-slate-300 disabled:bg-slate-100"
                  value={data.code_language}
                  disabled={data.exploration_mode !== "code_compile"}
                  onChange={(e) => setData("code_language", e.target.value)}
                >
                  {CODE_LANGUAGES.map((language) => (
                    <option key={language.value} value={language.value}>
                      {language.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700">Prompt Eksplorasi</label>
                <textarea
                  className="mt-1 min-h-24 w-full rounded-lg border-slate-300"
                  value={data.exploration_prompt}
                  onChange={(e) => setData("exploration_prompt", e.target.value)}
                />
              </div>
            </div>

            <div className="border-t border-slate-200 pt-4">
              <h4 className="block text-sm font-semibold text-slate-700 mb-2">Materi (Daftar)</h4>
              {(data.materials || []).map((m, midx) => (
                <div key={midx} className="mb-4 rounded-lg border border-slate-200 p-4 bg-slate-50">
                  <label className="block text-sm font-semibold text-slate-700">Judul Materi</label>
                  <input 
                    className="mt-1 w-full rounded-lg border-slate-300" 
                    value={m.title || ''} 
                    onChange={(e) => {
                      const arr = [...(data.materials || [])];
                      arr[midx] = { ...arr[midx], title: e.target.value };
                      setData('materials', arr);
                    }} 
                  />

                  <div className="mt-3 border-t pt-3">
                    <p className="text-sm font-semibold text-slate-700 mb-2">Blok Konten</p>
                    {(m.blocks || []).map((block, bidx) => (
                      <div 
                        key={bidx} 
                        className={`mb-2 rounded bg-white p-3 border-2 transition-all cursor-move ${
                          draggedBlock?.type === 'materials' && draggedBlock?.parentIdx === midx && draggedBlock?.blockIdx === bidx 
                            ? 'border-blue-400 bg-blue-50 opacity-50'
                            : dragOverBlock?.type === 'materials' && dragOverBlock?.parentIdx === midx && dragOverBlock?.blockIdx === bidx
                            ? 'border-blue-500 bg-blue-100'
                            : 'border-slate-200'
                        }`}
                        draggable
                        onDragStart={(e) => handleDragStart(e, 'materials', midx, bidx)}
                        onDragOver={handleDragOver}
                        onDragEnter={(e) => handleDragEnter(e, 'materials', midx, bidx)}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(e, 'materials', midx, bidx)}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <select 
                            className="text-sm rounded border-slate-300"
                            value={block.type}
                            onChange={(e) => {
                              const arr = [...(data.materials || [])];
                              arr[midx].blocks[bidx].type = e.target.value;
                              setData('materials', arr);
                            }}
                          >
                            <option value="text">Teks</option>
                            <option value="image">Gambar</option>
                            <option value="code">Kode</option>
                          </select>
                          <button 
                            type="button" 
                            className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded"
                            onClick={() => {
                              const arr = [...(data.materials || [])];
                              arr[midx].blocks.splice(bidx, 1);
                              setData('materials', arr);
                            }}
                          >Hapus</button>
                        </div>
                        
                        {block.type === 'text' && (
                          <div>
                            <div className="flex gap-2 mb-2 text-xs">
                              <button 
                                type="button"
                                className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-2 py-1 rounded font-bold"
                                onClick={() => insertFormatting(block.content || '', 'bold', 'materials', midx, bidx)}
                                title="Tambah bold"
                              >B</button>
                              <button 
                                type="button"
                                className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-2 py-1 rounded italic"
                                onClick={() => insertFormatting(block.content || '', 'italic', 'materials', midx, bidx)}
                                title="Tambah italic"
                              >I</button>
                              <button 
                                type="button"
                                className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-2 py-1 rounded"
                                onClick={() => insertFormatting(block.content || '', 'bullet', 'materials', midx, bidx)}
                                title="Tambah bullet"
                              >• List</button>
                              <button 
                                type="button"
                                className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-2 py-1 rounded"
                                onClick={() => insertFormatting(block.content || '', 'number', 'materials', midx, bidx)}
                                title="Tambah numbering"
                              >1. List</button>
                            </div>
                            <textarea 
                              className="w-full text-sm rounded border-slate-300 min-h-16"
                              placeholder="HTML atau plain text. Format: <b>bold</b>, <i>italic</i>, <ul><li>bullet</li></ul>, <ol><li>number</li></ol>"
                              value={block.content || ''}
                              onChange={(e) => {
                                const arr = [...(data.materials || [])];
                                arr[midx].blocks[bidx].content = e.target.value;
                                setData('materials', arr);
                              }}
                            />
                          </div>
                        )}
                        {block.type === 'image' && (
                          <>
                            <input 
                              className="w-full text-sm rounded border-slate-300 mb-1"
                              placeholder="URL gambar"
                              value={block.url || ''}
                              onChange={(e) => {
                                const arr = [...(data.materials || [])];
                                arr[midx].blocks[bidx].url = e.target.value;
                                setData('materials', arr);
                              }}
                            />
                            <input 
                              className="w-full text-sm rounded border-slate-300"
                              placeholder="Alt text"
                              value={block.alt || ''}
                              onChange={(e) => {
                                const arr = [...(data.materials || [])];
                                arr[midx].blocks[bidx].alt = e.target.value;
                                setData('materials', arr);
                              }}
                            />
                          </>
                        )}
                        {block.type === 'code' && (
                          <>
                            <select 
                              className="w-full text-sm rounded border-slate-300 mb-1"
                              value={block.language || 'javascript'}
                              onChange={(e) => {
                                const arr = [...(data.materials || [])];
                                arr[midx].blocks[bidx].language = e.target.value;
                                setData('materials', arr);
                              }}
                            >
                              <option value="javascript">JavaScript</option>
                              <option value="python">Python</option>
                              <option value="php">PHP</option>
                              <option value="html">HTML</option>
                              <option value="css">CSS</option>
                            </select>
                            <textarea 
                              className="w-full text-sm rounded border-slate-300 font-mono min-h-24"
                              placeholder="Source code"
                              value={block.code || ''}
                              onChange={(e) => {
                                const arr = [...(data.materials || [])];
                                arr[midx].blocks[bidx].code = e.target.value;
                                setData('materials', arr);
                              }}
                            />
                            {block.code && (
                              <CodePreview code={block.code} language={block.language || 'javascript'} />
                            )}
                          </>
                        )}
                      </div>
                    ))}
                    <button 
                      type="button" 
                      className="text-sm bg-slate-200 text-slate-700 px-2 py-1 rounded"
                      onClick={() => {
                        const arr = [...(data.materials || [])];
                        if (!arr[midx].blocks) arr[midx].blocks = [];
                        arr[midx].blocks.push({ type: 'text', content: '' });
                        setData('materials', arr);
                      }}
                    >+ Tambah Blok</button>
                  </div>

                  <div className="mt-2 flex gap-2">
                    <button 
                      type="button" 
                      className="rounded-lg bg-red-100 px-3 py-1 text-sm text-red-700"
                      onClick={() => {
                        const arr = [...(data.materials || [])];
                        arr.splice(midx, 1);
                        setData('materials', arr);
                      }}
                    >Hapus Materi</button>
                  </div>
                </div>
              ))}
              <button 
                type="button" 
                className="rounded-lg bg-slate-100 px-3 py-2 text-sm"
                onClick={() => {
                  const arr = [...(data.materials || [])];
                  arr.push({ title: '', blocks: [{ type: 'text', content: '' }] });
                  setData('materials', arr);
                }}
              >Tambah Materi</button>
            </div>

            <div className="border-t border-slate-200 pt-4">
              <h4 className="block text-sm font-semibold text-slate-700 mb-2">Studi Kasus (Daftar)</h4>
              {(data.case_studies || []).map((c, cidx) => (
                <div key={cidx} className="mb-4 rounded-lg border border-slate-200 p-4 bg-slate-50">
                  <label className="block text-sm font-semibold text-slate-700">Judul Kasus</label>
                  <input 
                    className="mt-1 w-full rounded-lg border-slate-300" 
                    value={c.title || ''} 
                    onChange={(e) => {
                      const arr = [...(data.case_studies || [])];
                      arr[cidx] = { ...arr[cidx], title: e.target.value };
                      setData('case_studies', arr);
                    }} 
                  />

                  <label className="mt-2 block text-sm font-semibold text-slate-700">Prompt singkat</label>
                  <input 
                    className="mt-1 w-full rounded-lg border-slate-300" 
                    value={c.prompt || ''} 
                    onChange={(e) => {
                      const arr = [...(data.case_studies || [])];
                      arr[cidx] = { ...arr[cidx], prompt: e.target.value };
                      setData('case_studies', arr);
                    }} 
                  />

                  <div className="mt-3 border-t pt-3">
                    <p className="text-sm font-semibold text-slate-700 mb-2">Blok Konten</p>
                    {(c.blocks || []).map((block, bidx) => (
                      <div 
                        key={bidx} 
                        className={`mb-2 rounded bg-white p-3 border-2 transition-all cursor-move ${
                          draggedBlock?.type === 'case_studies' && draggedBlock?.parentIdx === cidx && draggedBlock?.blockIdx === bidx 
                            ? 'border-blue-400 bg-blue-50 opacity-50'
                            : dragOverBlock?.type === 'case_studies' && dragOverBlock?.parentIdx === cidx && dragOverBlock?.blockIdx === bidx
                            ? 'border-blue-500 bg-blue-100'
                            : 'border-slate-200'
                        }`}
                        draggable
                        onDragStart={(e) => handleDragStart(e, 'case_studies', cidx, bidx)}
                        onDragOver={handleDragOver}
                        onDragEnter={(e) => handleDragEnter(e, 'case_studies', cidx, bidx)}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(e, 'case_studies', cidx, bidx)}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <select 
                            className="text-sm rounded border-slate-300"
                            value={block.type}
                            onChange={(e) => {
                              const arr = [...(data.case_studies || [])];
                              arr[cidx].blocks[bidx].type = e.target.value;
                              setData('case_studies', arr);
                            }}
                          >
                            <option value="text">Teks</option>
                            <option value="image">Gambar</option>
                            <option value="code">Kode</option>
                          </select>
                          <button 
                            type="button" 
                            className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded"
                            onClick={() => {
                              const arr = [...(data.case_studies || [])];
                              arr[cidx].blocks.splice(bidx, 1);
                              setData('case_studies', arr);
                            }}
                          >Hapus</button>
                        </div>
                        
                        {block.type === 'text' && (
                          <div>
                            <div className="flex gap-2 mb-2 text-xs">
                              <button 
                                type="button"
                                className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-2 py-1 rounded font-bold"
                                onClick={() => insertFormatting(block.content || '', 'bold', 'case_studies', cidx, bidx)}
                                title="Tambah bold"
                              >B</button>
                              <button 
                                type="button"
                                className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-2 py-1 rounded italic"
                                onClick={() => insertFormatting(block.content || '', 'italic', 'case_studies', cidx, bidx)}
                                title="Tambah italic"
                              >I</button>
                              <button 
                                type="button"
                                className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-2 py-1 rounded"
                                onClick={() => insertFormatting(block.content || '', 'bullet', 'case_studies', cidx, bidx)}
                                title="Tambah bullet"
                              >• List</button>
                              <button 
                                type="button"
                                className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-2 py-1 rounded"
                                onClick={() => insertFormatting(block.content || '', 'number', 'case_studies', cidx, bidx)}
                                title="Tambah numbering"
                              >1. List</button>
                            </div>
                            <textarea 
                              className="w-full text-sm rounded border-slate-300 min-h-16"
                              placeholder="HTML atau plain text. Format: <b>bold</b>, <i>italic</i>, <ul><li>bullet</li></ul>, <ol><li>number</li></ol>"
                              value={block.content || ''}
                              onChange={(e) => {
                                const arr = [...(data.case_studies || [])];
                                arr[cidx].blocks[bidx].content = e.target.value;
                                setData('case_studies', arr);
                              }}
                            />
                          </div>
                        )}
                        {block.type === 'image' && (
                          <>
                            <input 
                              className="w-full text-sm rounded border-slate-300 mb-1"
                              placeholder="URL gambar"
                              value={block.url || ''}
                              onChange={(e) => {
                                const arr = [...(data.case_studies || [])];
                                arr[cidx].blocks[bidx].url = e.target.value;
                                setData('case_studies', arr);
                              }}
                            />
                            <input 
                              className="w-full text-sm rounded border-slate-300"
                              placeholder="Alt text"
                              value={block.alt || ''}
                              onChange={(e) => {
                                const arr = [...(data.case_studies || [])];
                                arr[cidx].blocks[bidx].alt = e.target.value;
                                setData('case_studies', arr);
                              }}
                            />
                          </>
                        )}
                        {block.type === 'code' && (
                          <>
                            <select 
                              className="w-full text-sm rounded border-slate-300 mb-1"
                              value={block.language || 'javascript'}
                              onChange={(e) => {
                                const arr = [...(data.case_studies || [])];
                                arr[cidx].blocks[bidx].language = e.target.value;
                                setData('case_studies', arr);
                              }}
                            >
                              <option value="javascript">JavaScript</option>
                              <option value="python">Python</option>
                              <option value="php">PHP</option>
                              <option value="html">HTML</option>
                              <option value="css">CSS</option>
                            </select>
                            <textarea 
                              className="w-full text-sm rounded border-slate-300 font-mono min-h-24"
                              placeholder="Source code"
                              value={block.code || ''}
                              onChange={(e) => {
                                const arr = [...(data.case_studies || [])];
                                arr[cidx].blocks[bidx].code = e.target.value;
                                setData('case_studies', arr);
                              }}
                            />
                            {block.code && (
                              <CodePreview code={block.code} language={block.language || 'javascript'} />
                            )}
                          </>
                        )}
                      </div>
                    ))}
                    <button 
                      type="button" 
                      className="text-sm bg-slate-200 text-slate-700 px-2 py-1 rounded"
                      onClick={() => {
                        const arr = [...(data.case_studies || [])];
                        if (!arr[cidx].blocks) arr[cidx].blocks = [];
                        arr[cidx].blocks.push({ type: 'text', content: '' });
                        setData('case_studies', arr);
                      }}
                    >+ Tambah Blok</button>
                  </div>

                  <div className="mt-2 flex gap-2">
                    <button 
                      type="button" 
                      className="rounded-lg bg-red-100 px-3 py-1 text-sm text-red-700"
                      onClick={() => {
                        const arr = [...(data.case_studies || [])];
                        arr.splice(cidx, 1);
                        setData('case_studies', arr);
                      }}
                    >Hapus Kasus</button>
                  </div>
                </div>
              ))}
              <button 
                type="button" 
                className="rounded-lg bg-slate-100 px-3 py-2 text-sm"
                onClick={() => {
                  const arr = [...(data.case_studies || [])];
                  arr.push({ title: '', prompt: '', blocks: [{ type: 'text', content: '' }] });
                  setData('case_studies', arr);
                }}
              >Tambah Studi Kasus</button>
            </div>
          </div>
        )}

        {data.step_type === "practice" && (
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="block text-sm font-semibold text-slate-700">Mode Assessment</label>
              <select
                className="mt-1 w-full rounded-lg border-slate-300"
                value={data.assessment_mode}
                onChange={(e) => setData("assessment_mode", e.target.value)}
              >
                <option value="quiz">Quiz</option>
                <option value="essay">Essay</option>
              </select>
              <label className="mt-4 block text-sm font-semibold text-slate-700">Pertanyaan</label>
              <textarea
                className="mt-1 min-h-24 w-full rounded-lg border-slate-300"
                value={data.assessment_question}
                onChange={(e) => setData("assessment_question", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700">Opsi Jawaban</label>
              <textarea
                className="mt-1 min-h-40 w-full rounded-lg border-slate-300"
                placeholder="Satu opsi per baris"
                value={data.assessment_options}
                onChange={(e) => setData("assessment_options", e.target.value)}
              />
            </div>
          </div>
        )}

        {data.step_type === "review" && (
          <div>
            <label className="block text-sm font-semibold text-slate-700">Prompt Review</label>
            <textarea
              className="mt-1 min-h-24 w-full rounded-lg border-slate-300"
              value={data.review_prompt}
              onChange={(e) => setData("review_prompt", e.target.value)}
            />
          </div>
        )}

        {data.step_type === "reflection" && (
          <div>
            <label className="block text-sm font-semibold text-slate-700">Pertanyaan Refleksi</label>
            <textarea
              className="mt-1 min-h-24 w-full rounded-lg border-slate-300"
              value={data.reflection_question}
              onChange={(e) => setData("reflection_question", e.target.value)}
            />
          </div>
        )}
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <button disabled={processing} className="rounded-lg bg-yellow-400 px-4 py-2 text-sm font-bold text-slate-950 hover:bg-yellow-500 disabled:opacity-60" type="submit">
          {isEdit ? "Perbarui" : "Simpan"}
        </button>
        {isEdit && (
          <Link className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50" href={`/admin/meetings/${step.meeting_id}/steps`}>
            Batal
          </Link>
        )}
      </div>
    </form>
  );
}
