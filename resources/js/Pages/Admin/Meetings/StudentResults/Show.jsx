import AdminLayout from "@/Layouts/AdminLayout";
import { Link, router } from "@inertiajs/react";
import { useState } from "react";
import CodePreview from "@/Components/CodePreview";

function isFullHtmlDocument(value) {
    return (
        typeof value === "string" && /<!DOCTYPE html>|<html[\s>]/i.test(value)
    );
}

function CodeBlock({ code, language }) {
    return (
        <div
            className="rounded-lg p-3"
            style={{ background: "#282C34" }}
        >
            <p className="mb-2 text-xs text-slate-400">Preview:</p>
            <CodePreview code={code} language={language || "javascript"} />
        </div>
    );
}

function QuestionContent({ value, type, language }) {
    if (!value) {
        return "-";
    }

    if (isFullHtmlDocument(value)) {
        return (
            <iframe
                srcDoc={value}
                sandbox=""
                title="Pertanyaan"
                className="h-64 w-full rounded-lg border border-slate-200 bg-white"
            />
        );
    }

    if (type === "code") {
        return <CodeBlock code={value} language={language} />;
    }

    return value;
}

function ReflectionFeedback({ responseId, initialFeedback }) {
    const [feedback, setFeedback] = useState(initialFeedback || "");
    const [saving, setSaving] = useState(false);

    function save() {
        setSaving(true);

        router.post(
            route("admin.reflection.feedback", { response: responseId }),
            { feedback },
            {
                preserveScroll: true,
                onFinish: () => setSaving(false),
            },
        );
    }

    return (
        <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50 p-4">
            <label className="mb-2 block text-sm font-semibold text-blue-700">
                Feedback untuk Siswa (opsional)
            </label>

            <textarea
                className="min-h-20 w-full rounded-lg border-slate-300 text-sm"
                placeholder="Tulis feedback untuk keseluruhan materi pertemuan ini..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
            />

            <button
                type="button"
                onClick={save}
                disabled={saving}
                className="mt-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
            >
                {saving ? "Menyimpan..." : "Simpan Feedback"}
            </button>
        </div>
    );
}

export default function Show({ meeting, student, responses = [] }) {
    return (
        <AdminLayout title="Detail Hasil Siswa">
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">
                            Detail Hasil Siswa
                        </h1>

                        <p className="mt-1 text-sm text-slate-500">
                            {student.name} • {meeting.title}
                        </p>
                    </div>

                    <Link
                        href={route(
                            "admin.meetings.student-results",
                            meeting.id,
                        )}
                        className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                    >
                        Kembali
                    </Link>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div className="grid gap-4 md:grid-cols-3">
                        <div>
                            <p className="text-sm text-slate-500">Nama</p>

                            <h2 className="mt-1 font-semibold text-slate-900">
                                {student.name}
                            </h2>
                        </div>

                        <div>
                            <p className="text-sm text-slate-500">Email</p>

                            <h2 className="mt-1 font-semibold text-slate-900">
                                {student.email}
                            </h2>
                        </div>

                        <div>
                            <p className="text-sm text-slate-500">
                                Total Response
                            </p>

                            <h2 className="mt-1 font-semibold text-slate-900">
                                {responses.length}
                            </h2>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    {responses.map((response, index) => {
                        if (response.type === "Review") {
                            return null;
                        }

                        return (
                            <div
                                key={index}
                                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                            >
                                <div className="mb-4">
                                    <h2 className="text-lg font-semibold text-slate-900">
                                        {response.step_title || "Step"}
                                    </h2>
                                </div>

                                {response.type === "Exploration" &&
                                Array.isArray(response.items) ? (
                                    <div className="space-y-6">
                                        {response.coding_answers &&
                                            Object.entries(
                                                response.coding_answers,
                                            ).map(([key, code], idx) => (
                                                <div
                                                    key={idx}
                                                    className="rounded-xl border border-slate-200 bg-slate-900 p-4"
                                                >
                                                    <div className="mb-2 text-xs font-semibold text-slate-400">
                                                        Coding Mandiri
                                                    </div>

                                                    <pre className="overflow-auto text-sm text-slate-100">
                                                        <code>{code}</code>
                                                    </pre>
                                                </div>
                                            ))}
                                        {response.items.map(
                                            (mission, missionIndex) => (
                                                <div
                                                    key={missionIndex}
                                                    className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
                                                >
                                                    <div className="mb-4 rounded-xl border border-orange-200 bg-orange-50 p-4">
                                                        <div className="text-sm font-semibold text-orange-700">
                                                            {mission.mission_title ||
                                                                `Mission ${missionIndex + 1}`}
                                                        </div>
                                                    </div>

                                                    <div className="space-y-4">
                                                        {mission.items?.map(
                                                            (
                                                                item,
                                                                itemIndex,
                                                            ) => (
                                                                <div
                                                                    key={
                                                                        itemIndex
                                                                    }
                                                                    className="rounded-xl border border-slate-200 bg-white p-4"
                                                                >
                                                                    <div className="mb-2 text-sm font-semibold text-blue-700">
                                                                        Pertanyaan{" "}
                                                                        {itemIndex +
                                                                            1}
                                                                    </div>

                                                                    <div className="mb-4 whitespace-pre-wrap text-sm text-slate-700">
                                                                        <QuestionContent
                                                                            value={
                                                                                item.question
                                                                            }
                                                                        />
                                                                    </div>

                                                                    <div className="rounded-lg bg-slate-50 p-3">
                                                                        <div className="mb-1 text-xs font-semibold text-slate-500">
                                                                            Jawaban
                                                                            Siswa
                                                                        </div>

                                                                        <div className="whitespace-pre-wrap text-sm text-slate-700">
                                                                            {item.answer ||
                                                                                "-"}
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            ),
                                                        )}
                                                    </div>
                                                </div>
                                            ),
                                        )}
                                    </div>
                                ) : response.type === "Practice" &&
                                  response.items ? (
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between gap-3">
                                            {(() => {
                                                const gradedItems =
                                                    response.items.filter(
                                                        (item) =>
                                                            item.mode !==
                                                                "essay" &&
                                                            item.correct_answer !==
                                                                null &&
                                                            item.correct_answer !==
                                                                undefined,
                                                    );
                                                const correctCount =
                                                    gradedItems.filter(
                                                        (item) =>
                                                            item.answer ===
                                                            item.options?.[
                                                                item
                                                                    .correct_answer
                                                            ],
                                                    ).length;

                                                if (gradedItems.length === 0) {
                                                    return <div />;
                                                }

                                                const score = Math.round(
                                                    (correctCount /
                                                        gradedItems.length) *
                                                        100,
                                                );

                                                return (
                                                    <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700">
                                                        Benar {correctCount}{" "}
                                                        dari{" "}
                                                        {gradedItems.length}{" "}
                                                        soal • Nilai {score}
                                                    </div>
                                                );
                                            })()}

                                            <button
                                                onClick={() =>
                                                    router.post(
                                                        route(
                                                            "admin.practice.unlock",
                                                            {
                                                                response:
                                                                    response.response_id,
                                                            },
                                                        ),
                                                    )
                                                }
                                                className="rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white"
                                            >
                                                Buka Lock Jawaban
                                            </button>
                                        </div>

                                        {response.items.map(
                                            (item, itemIndex) => {
                                                const hasCorrectAnswer =
                                                    item.mode !== "essay" &&
                                                    item.correct_answer !==
                                                        null &&
                                                    item.correct_answer !==
                                                        undefined &&
                                                    item.options?.[
                                                        item.correct_answer
                                                    ] !== undefined;
                                                const isCorrect =
                                                    hasCorrectAnswer &&
                                                    item.answer ===
                                                        item.options[
                                                            item.correct_answer
                                                        ];
                                                const boxClass =
                                                    !hasCorrectAnswer
                                                        ? "bg-white"
                                                        : isCorrect
                                                          ? "border border-emerald-200 bg-emerald-50"
                                                          : "border border-red-200 bg-red-50";
                                                const labelClass =
                                                    !hasCorrectAnswer
                                                        ? "text-slate-500"
                                                        : isCorrect
                                                          ? "text-emerald-700"
                                                          : "text-red-700";

                                                return (
                                                    <div
                                                        key={itemIndex}
                                                        className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                                                    >
                                                        <div className="mb-2 text-sm font-semibold text-blue-700">
                                                            Pertanyaan{" "}
                                                            {itemIndex + 1}
                                                        </div>

                                                        <div className="mb-4 whitespace-pre-wrap text-sm text-slate-700">
                                                            <QuestionContent
                                                                value={
                                                                    item.question
                                                                }
                                                                type={
                                                                    item.question_type
                                                                }
                                                                language={
                                                                    item.question_language
                                                                }
                                                            />
                                                        </div>

                                                        <div
                                                            className={`rounded-lg p-3 ${boxClass}`}
                                                        >
                                                            <div
                                                                className={`mb-1 text-xs font-semibold ${labelClass}`}
                                                            >
                                                                Jawaban Siswa
                                                            </div>

                                                            {item.option_type ===
                                                            "code" ? (
                                                                <CodeBlock
                                                                    code={
                                                                        item.answer
                                                                    }
                                                                    language={
                                                                        item.question_language
                                                                    }
                                                                />
                                                            ) : (
                                                                <div className="whitespace-pre-wrap text-sm text-slate-700">
                                                                    {item.answer ||
                                                                        "-"}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            },
                                        )}
                                    </div>
                                ) : response.items ? (
                                    <div className="space-y-4">
                                        {" "}
                                        {response.items.map(
                                            (item, itemIndex) => (
                                                <div
                                                    key={itemIndex}
                                                    className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                                                >
                                                    {" "}
                                                    <div className="mb-2 text-sm font-semibold text-blue-700">
                                                        {" "}
                                                        Pertanyaan{" "}
                                                        {itemIndex + 1}{" "}
                                                    </div>{" "}
                                                    <div className="mb-4 whitespace-pre-wrap text-sm text-slate-700">
                                                        {" "}
                                                        <QuestionContent
                                                            value={
                                                                item.question
                                                            }
                                                        />{" "}
                                                    </div>{" "}
                                                    {item.mode === "quiz" &&
                                                        item.options && (
                                                            <div className="mb-4 space-y-2">
                                                                {" "}
                                                                {item.options.map(
                                                                    (
                                                                        option,
                                                                        optionIndex,
                                                                    ) => (
                                                                        <div
                                                                            key={
                                                                                optionIndex
                                                                            }
                                                                            className={`rounded-lg border px-3 py-2 text-sm ${item.answer === option ? "border-blue-500 bg-blue-50 text-blue-700" : "border-slate-200 bg-white text-slate-700"}`}
                                                                        >
                                                                            {" "}
                                                                            {
                                                                                option
                                                                            }{" "}
                                                                        </div>
                                                                    ),
                                                                )}{" "}
                                                            </div>
                                                        )}{" "}
                                                    <div className="rounded-lg bg-white p-3">
                                                        {" "}
                                                        <div className="mb-1 text-xs font-semibold text-slate-500">
                                                            {" "}
                                                            Jawaban Siswa{" "}
                                                        </div>{" "}
                                                        <div className="whitespace-pre-wrap text-sm text-slate-700">
                                                            {" "}
                                                            {item.answer ||
                                                                "-"}{" "}
                                                        </div>{" "}
                                                    </div>{" "}
                                                </div>
                                            ),
                                        )}{" "}
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {" "}
                                        <div className="rounded-xl border border-blue-100 bg-blue-50 p-4">
                                            {" "}
                                            <div className="mb-2 text-sm font-semibold text-blue-700">
                                                {" "}
                                                Pertanyaan{" "}
                                            </div>{" "}
                                            <div className="whitespace-pre-wrap text-sm text-slate-700">
                                                {" "}
                                                <QuestionContent
                                                    value={response.question}
                                                />{" "}
                                            </div>{" "}
                                        </div>{" "}
                                        <div className="rounded-xl bg-slate-50 p-4">
                                            {" "}
                                            <div className="mb-2 text-sm font-semibold text-slate-700">
                                                {" "}
                                                Jawaban Siswa{" "}
                                            </div>{" "}
                                            <pre className="whitespace-pre-wrap break-words text-sm text-slate-700">
                                                {" "}
                                                {response.answer || "-"}{" "}
                                            </pre>{" "}
                                        </div>{" "}

                                        {response.type === "Reflection" && (
                                            <ReflectionFeedback
                                                responseId={
                                                    response.response_id
                                                }
                                                initialFeedback={
                                                    response.feedback
                                                }
                                            />
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}

                    {responses.length === 0 && (
                        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500 shadow-sm">
                            Belum ada response siswa.
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
