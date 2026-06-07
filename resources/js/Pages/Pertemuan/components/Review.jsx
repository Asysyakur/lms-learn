import { useEffect, useMemo, useState } from "react";

function getPracticeAnswerMap(practiceResponses) {
    const map = {};

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

        correct_answer: practice.correct_answer ?? null,

        explanation: practice.explanation || "",

        items: reviewItems.filter((item) => item.practice_index === index),
    }));
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
            <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5">
                <h2 className="text-xl font-bold text-slate-900">
                    Aktivitas 5: Pembuktian
                </h2>
            </div>

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

                            <p className="mt-2 whitespace-pre-wrap text-sm text-slate-700">
                                {group.question || ""}
                            </p>

                            <div className="mt-4 space-y-3">
                                {/* JAWABAN SISWA */}
                                <div className="rounded-lg border border-slate-200 bg-white p-3">
                                    <p className="text-xs font-semibold text-slate-500">
                                        Jawaban Siswa
                                    </p>

                                    <p className="mt-2 whitespace-pre-wrap text-sm text-slate-800">
                                        {Array.isArray(group.options)
                                            ? (group.options[
                                                  practiceAnswerMap[
                                                      group.practice_index
                                                  ]
                                              ] ??
                                              practiceAnswerMap[
                                                  group.practice_index
                                              ] ??
                                              "-")
                                            : (practiceAnswerMap[
                                                  group.practice_index
                                              ] ?? "-")}
                                    </p>
                                </div>

                                {/* JAWABAN BENAR */}
                                <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3">
                                    <p className="text-xs font-semibold text-emerald-700">
                                        Jawaban Benar
                                    </p>

                                    <p className="mt-2 whitespace-pre-wrap text-sm text-emerald-900">
                                        {Array.isArray(group.options)
                                            ? group.options[
                                                  group.correct_answer
                                              ]
                                            : "-"}
                                    </p>
                                </div>

                                {/* PEMBAHASAN */}
                                <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
                                    <p className="text-xs font-semibold text-blue-700">
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
                    onClick={onNext}
                    className="course-step-secondary-button"
                    type="button"
                >
                    {nextLabel}
                </button>
            </div>
        </div>
    );
}
