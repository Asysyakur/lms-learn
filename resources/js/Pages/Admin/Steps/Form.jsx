import { useEffect } from "react";
import { Link, useForm } from "@inertiajs/react";

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
  { value: "java", label: "Java" },
  { value: "cpp", label: "C++" },
];

export default function StepForm({ meetingId, step = null }) {
  const isEdit = Boolean(step);
  const { data, setData, post, put, processing, errors, reset } = useForm({
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

  function submit(e) {
    e.preventDefault();

    if (isEdit) {
      put(`/admin/steps/${step.id}`);
      return;
    }

    post("/admin/steps", {
      onSuccess: () => reset(),
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
          {isEdit ? "Update" : "Simpan"}
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
