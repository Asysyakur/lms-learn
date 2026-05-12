import {
    ArrowUpTrayIcon,
    PaperClipIcon,
    XMarkIcon,
} from "@heroicons/react/24/solid";
import { useEffect, useMemo, useState } from "react";

function getPracticeAnswerMap(practiceResponses) {
    return (practiceResponses || []).reduce((accumulator, item, index) => {
        const practiceIndex = Number(item.practice_index ?? index);

        accumulator[practiceIndex] = item.answer ?? item.student_answer ?? "";

        return accumulator;
    }, {});
}

function buildReviewItems(stepData, practiceResponses, savedItems = []) {
    const practiceAnswerMap = getPracticeAnswerMap(practiceResponses);
    const reviewItems = Array.isArray(stepData?.review_items)
        ? stepData.review_items
        : [];

    return reviewItems.map((item, index) => {
        const practiceIndex = Number(item.practice_index ?? 0);
        const savedItem = savedItems[index] ?? {};

        return {
            practice_index: practiceIndex,
            title: item.title || `Review ${index + 1}`,
            question: item.question || "",
            student_answer:
                savedItem.student_answer ??
                practiceAnswerMap[practiceIndex] ??
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

    const indices = practiceItems.length
        ? practiceItems.map((item, index) => ({
              practice_index: Number(item.practice_index ?? index),
              title: item.title || `Latihan Soal ${index + 1}`,
              question: item.question || "",
          }))
        : Array.from(
              new Set(reviewItems.map((item) => Number(item.practice_index ?? 0))),
          ).map((practiceIndex) => ({
              practice_index: practiceIndex,
              title: `Latihan Soal ${practiceIndex + 1}`,
              question: "",
          }));

    return indices.map((practice) => ({
        ...practice,
        items: reviewItems
            .map((item, flatIndex) => ({ ...item, flatIndex }))
            .filter(
                (item) => Number(item.practice_index ?? 0) === practice.practice_index,
            ),
    }));
}

export default function StepFiveReview({
    meetingId,
    stepNumber,
    stepData,
    savedResponse,
    practiceResponses = [],
    onNext,
    nextLabel = "Lanjut",
}) {
    const [answers, setAnswers] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const savedItems = savedResponse?.response_payload?.items ?? [];

        setAnswers(buildReviewItems(stepData, practiceResponses, savedItems));
    }, [stepData, savedResponse, practiceResponses]);

    const groupedItems = useMemo(
        () => groupReviewItems(stepData, answers),
        [stepData, answers],
    );

    const handleAnswerChange = (index, field, value) => {
        const updated = [...answers];

        updated[index] = {
            ...updated[index],
            [field]: value,
        };

        setAnswers(updated);
    };

    const clearEvidenceFile = (index) => {
        handleAnswerChange(index, "evidence", null);
    };

    const getEvidenceLabel = (evidence) => {
        if (!evidence) {
            return "Belum ada file dipilih";
        }

        if (typeof evidence === "string") {
            return `Bukti tersimpan: ${evidence}`;
        }

        if (evidence instanceof File) {
            return `File dipilih: ${evidence.name}`;
        }

        return "File siap diunggah";
    };

    const submitReview = async () => {
        setIsSubmitting(true);

        try {
            // Build FormData for proper file serialization
            const formData = new FormData();
            const items = answers.map((item) => {
                const practiceGroup = groupedItems.find(
                    (group) => group.practice_index === item.practice_index,
                );

                return {
                    practice_index: item.practice_index,
                    title:
                        practiceGroup?.title ||
                        item.title ||
                        `Latihan Soal ${item.practice_index + 1}`,
                    question: item.question,
                    student_answer: item.student_answer,
                    review_answer: item.review_answer || "",
                    evidence: item.evidence instanceof File ? null : (item.evidence || null),
                };
            });

            // Add form fields
            formData.append("response_text", "Review submitted");
            formData.append("response_payload", JSON.stringify({ items }));

            // Add files individually
            answers.forEach((item, index) => {
                if (item.evidence instanceof File) {
                    formData.append(
                        `response_payload.items.${index}.evidence`,
                        item.evidence,
                    );
                }
            });

            // Send via axios with FormData
            await window.axios.post(
                route("pertemuan.step.response", {
                    id: meetingId,
                    step: stepNumber,
                }),
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                },
            );

            // Call onNext to proceed to next step
            onNext?.();
        } catch (error) {
            alert("Gagal menyimpan jawaban. Silakan coba lagi.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5">
                <h2 className="text-xl font-bold text-slate-900">
                    Aktivitas 5: Pembuktian
                </h2>

                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    Kembangkan jawaban latihan soal sebelumnya dengan
                    menambahkan argumen, hasil pengamatan, serta bukti
                    pendukung.
                </p>
            </div>

            <div className="space-y-5">
                {groupedItems.map((group) => (
                    <div
                        key={group.practice_index}
                        className="rounded-2xl border border-slate-200 bg-white p-5"
                    >
                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                            <h3 className="text-lg font-bold text-slate-900">
                                {group.title || `Latihan Soal ${group.practice_index + 1}`}
                            </h3>

                            <p className="mt-2 whitespace-pre-wrap text-sm text-slate-700">
                                {group.question || ""}
                            </p>

                            <div className="mt-4 rounded-lg border border-slate-200 bg-white p-3">
                                <p className="text-xs font-semibold text-slate-500">
                                    Jawaban Siswa
                                </p>

                                <p className="mt-2 whitespace-pre-wrap text-sm text-slate-800">
                                    {group.items[0]?.student_answer || "-"}
                                </p>
                            </div>
                        </div>

                        <div className="mt-5 space-y-4">
                            {group.items.map((item) => (
                                <div
                                    key={item.flatIndex}
                                    className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                                >
                                    <div className="flex items-start gap-3">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                                            {item.flatIndex + 1}
                                        </div>

                                        <div className="flex-1">
                                            <p className="mt-1 whitespace-pre-wrap text-sm text-slate-700">
                                                {item.question}
                                            </p>
                                        </div>
                                    </div>

                                    <textarea
                                        value={answers[item.flatIndex]?.review_answer || ""}
                                        onChange={(e) =>
                                            handleAnswerChange(
                                                item.flatIndex,
                                                "review_answer",
                                                e.target.value,
                                            )
                                        }
                                        rows={6}
                                        className="mt-4 w-full rounded-xl border border-slate-300"
                                        placeholder="Tulis argumen dan pembuktianmu di sini..."
                                    />

                                    <div className="mt-4">
                                        <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                                            <PaperClipIcon className="h-4 w-4" />
                                            Upload Bukti
                                        </label>

                                        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-4">
                                            <label
                                                htmlFor={`evidence-upload-${item.flatIndex}`}
                                                className="flex cursor-pointer items-center justify-between gap-4 rounded-xl bg-slate-50 px-4 py-3 transition hover:bg-slate-100"
                                            >
                                                <div className="min-w-0">
                                                    <p className="text-sm font-semibold text-slate-800">
                                                        Pilih file bukti
                                                    </p>

                                                    <p className="mt-1 text-xs text-slate-500">
                                                        PNG, JPG, PDF. Klik area ini untuk memilih file.
                                                    </p>
                                                </div>

                                                <span className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm">
                                                    <ArrowUpTrayIcon className="h-4 w-4" />
                                                    Upload
                                                </span>
                                            </label>

                                            <input
                                                id={`evidence-upload-${item.flatIndex}`}
                                                type="file"
                                                accept="image/*,application/pdf"
                                                className="sr-only"
                                                onChange={(e) => {
                                                    const file = e.target.files?.[0] ?? null;

                                                    handleAnswerChange(
                                                        item.flatIndex,
                                                        "evidence",
                                                        file,
                                                    );
                                                }}
                                            />

                                            <div className="mt-3 flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
                                                <p className="min-w-0 text-xs font-medium text-slate-600">
                                                    {getEvidenceLabel(
                                                        answers[item.flatIndex]?.evidence,
                                                    )}
                                                </p>

                                                {answers[item.flatIndex]?.evidence && (
                                                    <button
                                                        type="button"
                                                        onClick={() => clearEvidenceFile(item.flatIndex)}
                                                        className="inline-flex shrink-0 items-center gap-2 rounded-xl border border-red-300 bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-100"
                                                        title="Hapus file bukti"
                                                    >
                                                        <XMarkIcon className="h-4 w-4" />
                                                        Hapus
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex justify-end gap-3">
                <button
                    onClick={submitReview}
                    disabled={isSubmitting}
                    className="course-step-primary-button"
                    type="button"
                >
                    {isSubmitting ? "Menyimpan..." : "Simpan Jawaban"}
                </button>

                <button
                    onClick={onNext}
                    disabled={isSubmitting}
                    className="course-step-secondary-button"
                    type="button"
                >
                    {nextLabel}
                </button>
            </div>
        </div>
    );
}
