import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import CodePreview from "@/Components/CodePreview";

function getPracticeAnswerMap(practiceResponses) {
    const map = {};

    /*
    |--------------------------------------------------------------------------
    | FORMAT BARU
    |--------------------------------------------------------------------------
    */

    if (practiceResponses?.response_payload?.items) {
        practiceResponses.response_payload.items.forEach((item, index) => {
            map[index] = item.answer ?? "";
        });

        return map;
    }

    /*
    |--------------------------------------------------------------------------
    | FALLBACK FORMAT LAMA
    |--------------------------------------------------------------------------
    */

    (practiceResponses || []).forEach((item) => {
        map[item.practice_index] = item.answer ?? "";
    });

    return map;
}

function buildReviewItems(stepData, practiceResponses, savedItems = []) {
    const practiceAnswerMap = getPracticeAnswerMap(practiceResponses);

    const reviewItems = Array.isArray(stepData?.review_items)
        ? stepData.review_items
        : [];

    return reviewItems.map((item, index) => {
        const savedItem = savedItems[index] ?? {};

        return {
            practice_index: index,

            title: item.title || `Review ${index + 1}`,

            question: item.question || "",

            student_answer:
                savedItem.student_answer ??
                practiceAnswerMap[index] ??
                item.student_answer ??
                "",

            review_answer: savedItem.review_answer ?? item.review_answer ?? "",

            evidence: savedItem.evidence ?? item.evidence ?? null,
        };
    });
}

function groupReviewItems(stepData, reviewItems) {
    const practiceItems = Array.isArray(stepData?.practice_items)
        ? stepData.practice_items
        : [];

    return practiceItems.map((practice, index) => ({
        practice_index: index,

        title: practice.title || `Latihan Soal ${index + 1}`,

        question: practice.question || "",

        options: practice.options || [],

        question_type: practice.question_type || "text",

        option_type: practice.option_type || "text",

        question_language: practice.question_language || "javascript",

        correct_answer: practice.correct_answer ?? null,

        explanation: practice.explanation || "",

        items: reviewItems.filter((item) => item.practice_index === index),
    }));
}

function cleanHtml(html) {
    return html.replace(/body\s*\{[\s\S]*?\}/gi, "");
}

export default function StepFiveReview({
    stepData,
    savedResponse,
    practiceResponses = [],
    onNext,
    nextLabel = "Lanjut",
}) {
    const [answers, setAnswers] = useState([]);
    useEffect(() => {
        const savedItems = savedResponse?.response_payload?.items ?? [];

        setAnswers(buildReviewItems(stepData, practiceResponses, savedItems));
    }, [stepData, savedResponse, practiceResponses]);

    const groupedItems = useMemo(
        () => groupReviewItems(stepData, answers),
        [stepData, answers],
    );

    const practiceAnswerMap = getPracticeAnswerMap(practiceResponses);

    return (
        <div className="space-y-6">
            <div className="space-y-5">
                {groupedItems.map((group) => (
                    <div
                        key={group.practice_index}
                        className="rounded-2xl border border-slate-200 bg-white p-5"
                    >
                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                            <h3 className="text-lg font-bold text-slate-900">
                                {group.title ||
                                    `Latihan Soal ${group.practice_index + 1}`}
                            </h3>

                            {group.question_type === "code" ? (
                                <CodePreview
                                    code={group.question}
                                    language={group.question_language}
                                />
                            ) : (
                                <div
                                    className="course-detail-text font-semibold text-slate-900"
                                    dangerouslySetInnerHTML={{
                                        __html: cleanHtml(group.question),
                                    }}
                                />
                            )}

                            <div className="mt-4 space-y-3">
                                {/* JAWABAN SISWA */}
                                {(() => {
                                    const studentAnswerRaw =
                                        practiceAnswerMap[
                                            group.practice_index
                                        ];
                                    const studentAnswerValue =
                                        Array.isArray(group.options)
                                            ? (group.options[
                                                  studentAnswerRaw
                                              ] ?? studentAnswerRaw)
                                            : studentAnswerRaw;
                                    const correctAnswerValue =
                                        group.options?.[
                                            group.correct_answer
                                        ];
                                    const hasCorrectAnswer =
                                        group.correct_answer !== null &&
                                        group.correct_answer !== undefined &&
                                        correctAnswerValue !== undefined;
                                    const isCorrect =
                                        hasCorrectAnswer &&
                                        studentAnswerValue ===
                                            correctAnswerValue;
                                    const boxClass = !hasCorrectAnswer
                                        ? "border-slate-200 bg-white"
                                        : isCorrect
                                          ? "border-emerald-200 bg-emerald-50"
                                          : "border-red-200 bg-red-50";
                                    const labelClass = !hasCorrectAnswer
                                        ? "text-slate-500"
                                        : isCorrect
                                          ? "text-emerald-700"
                                          : "text-red-700";

                                    return (
                                        <div
                                            className={`rounded-lg border p-3 ${boxClass}`}
                                        >
                                            <p
                                                className={`text-xs font-semibold ${labelClass}`}
                                            >
                                                Jawaban Siswa
                                            </p>

                                            {group.option_type === "code" ? (
                                                <CodePreview
                                                    code={studentAnswerValue}
                                                    language={
                                                        group.question_language
                                                    }
                                                />
                                            ) : (
                                                <div
                                                    className="course-detail-text font-semibold text-slate-900"
                                                    dangerouslySetInnerHTML={{
                                                        __html: cleanHtml(
                                                            studentAnswerValue ||
                                                                "",
                                                        ),
                                                    }}
                                                />
                                            )}
                                        </div>
                                    );
                                })()}

                                {/* JAWABAN BENAR */}
                                <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3">
                                    <p className="text-xs font-semibold text-emerald-700">
                                        Jawaban Benar
                                    </p>

                                    {group.option_type === "code" ? (
                                        <CodePreview
                                            code={
                                                group.options[
                                                    group.correct_answer
                                                ]
                                            }
                                            language={group.question_language}
                                        />
                                    ) : (
                                        <div
                                            className="course-detail-text font-semibold text-slate-900"
                                            dangerouslySetInnerHTML={{
                                                __html: cleanHtml(
                                                    group.options[
                                                        group.correct_answer
                                                    ] || "",
                                                ),
                                            }}
                                        />
                                    )}
                                </div>

                                {/* PEMBAHASAN */}
                                <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-3">
                                    <p className="text-xs font-semibold text-yellow-700">
                                        Pembahasan
                                    </p>

                                    <div
                                        className="prose prose-sm mt-2 max-w-none text-slate-800"
                                        dangerouslySetInnerHTML={{
                                            __html: group.explanation || "",
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex justify-end gap-3">
                <button
                    type="button"
                    className="course-step-secondary-button"
                    onClick={async () => {
                        try {
                            await window.axios.post(
                                route("pertemuan.step.response", {
                                    id: stepData.meeting_id,
                                    step: stepData.step,
                                }),
                                {
                                    response_text: "review completed",

                                    response_payload: {
                                        items: answers,
                                    },
                                },
                            );

                            onNext();
                        } catch (e) {
                            console.error(e);
                        }
                    }}
                >
                    {nextLabel}
                </button>
            </div>
        </div>
    );
}
