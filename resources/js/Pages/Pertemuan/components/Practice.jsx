import { ArrowRightIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import { usePage } from "@inertiajs/react";
import { codeToHtml } from "shiki";

export default function StepFourPractice({
    stepData,
    quizAnswer,
    setQuizAnswer,
    essayAnswer,
    setEssayAnswer,
    assessmentAnswers = {},
    setAssessmentAnswers,
    onSave,
    onNext,
    nextLabel = "Lanjut",
}) {
    const [isSaved, setIsSaved] = useState(stepData?.is_answer_locked || false);
    const { flash } = usePage().props;

    function cleanHtml(html) {
        return html.replace(/body\s*\{[\s\S]*?\}/gi, "");
    }

    function CodePreview({ code, language }) {
        const [html, setHtml] = useState("");

        useEffect(() => {
            const run = async () => {
                try {
                    const result = await codeToHtml(code || "", {
                        lang: language || "javascript",
                        theme: "one-dark-pro",
                    });

                    setHtml(result);
                } catch {
                    setHtml(`<pre>${code}</pre>`);
                }
            };

            run();
        }, [code, language]);

        return (
            <div
                dangerouslySetInnerHTML={{ __html: html }}
                className="overflow-auto rounded-lg"
            />
        );
    }

    useEffect(() => {
        setIsSaved(stepData?.is_answer_locked || false);
    }, [stepData?.is_answer_locked]);

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
    console.log(practiceItems);
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

    const handleSaveAndNext = async () => {
        await onSave?.();

        setIsSaved(true);

        onNext?.();
    };

    const isAllAnswered = practiceItems.every((item) => {
        const answer = getAnswer(item);

        return answer !== undefined && answer !== null && answer !== "";
    });

    return (
        <div className="course-detail-grid">
            <div className="course-detail-card space-y-4">
                {/* <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <ClipboardDocumentCheckIcon className="h-5 w-5 text-[rgb(var(--color-primary))]" />
                    Latihan soal
                </div> */}

                <div className="space-y-5 max-h-[620px] overflow-auto">
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
                            {item.question_type === "code" ? (
                                <CodePreview
                                    code={item.question}
                                    language={
                                        item.question_language || "javascript"
                                    }
                                />
                            ) : (
                                <div
                                    className="course-detail-text font-semibold text-slate-900"
                                    dangerouslySetInnerHTML={{
                                        __html: cleanHtml(item.question),
                                    }}
                                />
                            )}
                            {item.mode === "essay" ? (
                                <textarea
                                    disabled={isSaved}
                                    className="course-textarea mt-3"
                                    placeholder="Tulis jawaban essay di sini..."
                                    value={getAnswer(item) || ""}
                                    onChange={(event) =>
                                        updateAnswer(item, event.target.value)
                                    }
                                />
                            ) : (
                                <div className="mt-3 space-y-2">
                                    {(item.options?.length
                                        ? item.options
                                        : []
                                    ).map((option, optIndex) => (
                                        <label
                                            key={option || optIndex}
                                            className="course-option"
                                        >
                                            <input
                                                type="radio"
                                                disabled={isSaved}
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
                                            <span className="flex-1">
                                                {item.option_type === "code" ? (
                                                    <CodePreview
                                                        code={option}
                                                        language={
                                                            item.question_language ||
                                                            "javascript"
                                                        }
                                                    />
                                                ) : (
                                                    option
                                                )}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <button
                    disabled={!isAllAnswered || isSaved}
                    className={`course-step-primary-button ${
                        !isAllAnswered || isSaved
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                    }`}
                    onClick={handleSaveAndNext}
                >
                    Simpan Latihan Soal
                </button>
            </div>

            <div className="course-detail-card space-y-3">
                <h3 className="course-detail-title">Jawaban Tersimpan</h3>

                <div className="space-y-3 min-h-[100px] max-h-[500px] overflow-auto rounded-lg border border-slate-200 bg-slate-50 p-4">
                    {practiceItems.map((item, index) => (
                        <div
                            key={item.id || index}
                            className="pb-3 border-b border-slate-200 last:border-b-0"
                        >
                            <p className="text-xs font-semibold text-slate-600">
                                Soal {index + 1}:
                            </p>

                            <p className="text-sm text-slate-700 mt-1">
                                {getAnswer(item) || (
                                    <span className="italic text-slate-400">
                                        Belum dijawab
                                    </span>
                                )}
                            </p>
                        </div>
                    ))}
                </div>

                {onNext && (
                    <div className="flex justify-end pt-3">
                        <button
                            type="button"
                            disabled={!isAllAnswered || isSaved}
                            onClick={() => onSave?.(onNext)}
                            className={`course-step-primary-button ${
                                !isAllAnswered || isSaved
                                    ? "opacity-50 cursor-not-allowed"
                                    : ""
                            }`}
                        >
                            {nextLabel}
                            <ArrowRightIcon className="h-4 w-4" />
                        </button>
                    </div>
                )}
            </div>
            {flash.error && <div className="text-red-500">{flash.error}</div>}
        </div>
    );
}
