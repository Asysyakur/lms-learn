import { ClipboardDocumentCheckIcon } from "@heroicons/react/24/solid";

export default function StepFourPractice({
    stepData,
    assessmentMode,
    setAssessmentMode,
    quizAnswer,
    setQuizAnswer,
    essayAnswer,
    setEssayAnswer,
    assessmentAnswers = {},
    setAssessmentAnswers,
    assessmentSaved,
    onSave,
}) {
    const practiceItems =
        Array.isArray(stepData?.assessment_items) &&
        stepData.assessment_items.length > 0
            ? stepData.assessment_items
            : [
                  {
                      id: "practice-1",
                      mode: "quiz",
                      question: "Belum ada soal.",
                      options: [],
                  },
              ];

    const updateAnswer = (item, value) => {
        if (setAssessmentAnswers) {
            setAssessmentAnswers((prev) => ({
                ...prev,
                [item.id]: value,
            }));
        }

        if (practiceItems.length === 1) {
            if (item.mode === "essay") {
                setEssayAnswer?.(value);
            } else {
                setQuizAnswer?.(value);
            }
        }
    };

    const getAnswer = (item) => {
        if (assessmentAnswers[item.id] !== undefined) {
            return assessmentAnswers[item.id];
        }

        return item.mode === "essay" ? essayAnswer : quizAnswer;
    };

    return (
        <div className="course-detail-grid">
            <div className="course-detail-card space-y-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <ClipboardDocumentCheckIcon className="h-5 w-5 text-[rgb(var(--color-primary))]" />
                    Latihan soal
                </div>

                <div className="space-y-5">
                    {practiceItems.map((item, index) => (
                        <div
                            key={item.id || index}
                            className="rounded-lg border border-slate-200 bg-slate-50 p-4"
                        >
                            <div className="mb-3 flex flex-wrap items-center gap-2">
                                <span className="text-sm font-semibold text-slate-500">
                                    Soal {index + 1}
                                </span>
                                <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-700 ring-1 ring-slate-200">
                                    {item.mode === "essay"
                                        ? "Essay"
                                        : "Pilihan ganda"}
                                </span>
                            </div>

                            <p className="course-detail-text font-semibold text-slate-900">
                                {item.question || "Tulis jawabanmu:"}
                            </p>

                            {item.mode === "essay" ? (
                                <textarea
                                    className="course-textarea mt-3"
                                    placeholder="Tulis jawaban essay di sini..."
                                    value={getAnswer(item)}
                                    onChange={(event) =>
                                        updateAnswer(item, event.target.value)
                                    }
                                />
                            ) : (
                                <div className="mt-3 space-y-2">
                                    {(item.options?.length
                                        ? item.options
                                        : []
                                    ).map((option) => (
                                        <label
                                            key={option}
                                            className="course-option"
                                        >
                                            <input
                                                type="radio"
                                                name={`quiz-answer-${item.id || index}`}
                                                value={option}
                                                checked={
                                                    getAnswer(item) === option
                                                }
                                                onChange={(event) =>
                                                    updateAnswer(
                                                        item,
                                                        event.target.value,
                                                    )
                                                }
                                            />
                                            <span>{option}</span>
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <button
                    className="btn-primary w-full sm:w-auto"
                    onClick={() => onSave()}
                >
                    Simpan Latihan Soal
                </button>
            </div>

            <div className="course-detail-card space-y-3">
                <h3 className="course-detail-title">Catatan</h3>
                <p className="course-detail-text">
                    Latihan soal bisa berisi pilihan ganda, essay, atau
                    kombinasi keduanya.
                </p>
                <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
                    <div className="font-semibold text-slate-900">
                        Jawaban tersimpan
                    </div>
                    <p className="mt-2">
                        {assessmentSaved ||
                            "Belum ada jawaban latihan soal yang disimpan."}
                    </p>
                </div>
            </div>
        </div>
    );
}
