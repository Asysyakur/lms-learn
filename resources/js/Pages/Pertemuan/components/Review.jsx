import { ArrowRightIcon, PaperClipIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";

export default function StepFiveReview({
    stepData,
    savedResponse,
    practiceResponses = [],
    onSave,
    onNext,
    nextLabel = "Lanjut",
}) {
    const [answers, setAnswers] = useState([]);
    const [proofFiles, setProofFiles] = useState({});

    useEffect(() => {
        const existing = savedResponse?.response_payload?.items ?? [];

        if (existing.length > 0) {
            setAnswers(existing);
        } else {
            setAnswers(
                (stepData?.proof_questions || []).map((item) => ({
                    question: item.question,
                    review_answer: "",
                    evidence: "",
                })),
            );
        }
    }, [stepData, savedResponse]);

    const handleAnswerChange = (index, field, value) => {
        const updated = [...answers];

        updated[index][field] = value;

        setAnswers(updated);
    };

    const submitReview = () => {
        const items = (stepData?.proof_questions || []).map((item, index) => ({
            question: item.question,
            student_answer: practiceResponses[index]?.answer || "",
            review_answer: answers[index]?.review_answer || "",
            evidence: answers[index]?.evidence || null,
        }));

        onSave?.({
            response_text: "Review submitted",
            response_payload: {
                items,
            },
        });
    };

    return (
        <div className="space-y-6">
            {/* HEADER */}
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

            {/* CONTENT */}
            <div className="grid gap-5 xl:grid-cols-2">
                {/* KIRI */}
                <div className="rounded-2xl border border-slate-200 bg-white p-5">
                    <h3 className="text-lg font-bold text-slate-900">
                        Jawaban Latihan Soal
                    </h3>

                    <div className="mt-5 space-y-4">
                        {practiceResponses.map((item, index) => (
                            <div
                                key={index}
                                className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                            >
                                <p className="text-sm font-semibold text-slate-700">
                                    Pertanyaan {index + 1}
                                </p>

                                <p className="mt-2 text-sm text-slate-600">
                                    {item.question}
                                </p>

                                <div className="mt-4 rounded-lg bg-white p-3 border border-slate-200">
                                    <p className="text-xs font-semibold text-slate-500">
                                        Jawaban Siswa
                                    </p>

                                    <p className="mt-2 whitespace-pre-wrap text-sm text-slate-800">
                                        {item.answer || "-"}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* KANAN */}
                <div className="rounded-2xl border border-slate-200 bg-white p-5">
                    <h3 className="text-lg font-bold text-slate-900">
                        Pembuktian & Argumen
                    </h3>

                    <div className="mt-5 space-y-5">
                        {(stepData?.proof_questions || []).map(
                            (item, index) => (
                                <div
                                    key={index}
                                    className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                                            {index + 1}
                                        </div>

                                        <h4 className="font-semibold text-slate-800">
                                            {item.question}
                                        </h4>
                                    </div>

                                    <textarea
                                        value={
                                            answers[index]?.review_answer || ""
                                        }
                                        onChange={(e) =>
                                            handleAnswerChange(
                                                index,
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

                                        <input
                                            type="file"
                                            className="w-full rounded-xl border border-slate-300 bg-white"
                                            onChange={(e) => {
                                                const file =
                                                    e.target.files?.[0];

                                                setProofFiles({
                                                    ...proofFiles,
                                                    [index]: file,
                                                });
                                            }}
                                        />
                                    </div>
                                </div>
                            ),
                        )}
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                        <button
                            onClick={submitReview}
                            className="rounded-xl bg-orange-500 px-5 py-3 font-semibold text-white hover:bg-orange-600"
                        >
                            Simpan Jawaban
                        </button>

                        <button
                            onClick={onNext}
                            className="flex items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
                        >
                            {nextLabel}

                            <ArrowRightIcon className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
