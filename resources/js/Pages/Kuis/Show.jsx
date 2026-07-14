import AppLayout from "@/Layouts/AppLayout";
import { Link, router } from "@inertiajs/react";
import { useEffect, useMemo, useState } from "react";
import {
    ChevronLeftIcon,
    ChevronRightIcon,
    ClockIcon,
    ClipboardDocumentCheckIcon,
    CheckCircleIcon,
} from "@heroicons/react/24/solid";

const optionLabels = ["A", "B", "C", "D"];
const DEFAULT_TIME_SECONDS = 45 * 60;

export default function QuizShow({ quizSet, questions = [], attempt = null }) {
    const [answers, setAnswers] = useState(attempt?.answers ?? {});
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [submitted, setSubmitted] = useState(Boolean(attempt));
    const [processing, setProcessing] = useState(false);
    const [remainingSeconds, setRemainingSeconds] =
        useState(DEFAULT_TIME_SECONDS);
    const [incompleteWarning, setIncompleteWarning] = useState(false);

    const totalQuestions = questions.length;
    const currentQuestion = questions[currentQuestionIndex];

    const answeredCount = useMemo(
        () => Object.values(answers).filter(Boolean).length,
        [answers],
    );

    useEffect(() => {
        if (submitted) {
            return undefined;
        }

        const timer = window.setInterval(() => {
            setRemainingSeconds((current) => Math.max(0, current - 1));
        }, 1000);

        return () => window.clearInterval(timer);
    }, [submitted]);

    useEffect(() => {
        if (remainingSeconds === 0 && !submitted) {
            submitQuiz({ force: true });
        }
    }, [remainingSeconds, submitted]);

    useEffect(() => {
        if (!incompleteWarning) {
            return undefined;
        }

        const timer = window.setTimeout(
            () => setIncompleteWarning(false),
            3000,
        );

        return () => window.clearTimeout(timer);
    }, [incompleteWarning]);

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60)
            .toString()
            .padStart(2, "0");
        const secs = Math.floor(seconds % 60)
            .toString()
            .padStart(2, "0");

        return `${minutes}:${secs}`;
    };

    const submitQuiz = ({ force = false } = {}) => {
        if (submitted || processing) {
            return;
        }

        if (!force && answeredCount < totalQuestions) {
            const firstUnansweredIndex = questions.findIndex(
                (question) => !answers[question.id],
            );

            if (firstUnansweredIndex !== -1) {
                setCurrentQuestionIndex(firstUnansweredIndex);
            }

            setIncompleteWarning(true);
            return;
        }

        router.post(
            route("tes.submit", { slug: quizSet.slug }),
            { answers },
            {
                preserveScroll: true,
                onStart: () => setProcessing(true),
                onSuccess: () => setSubmitted(true),
                onFinish: () => setProcessing(false),
            },
        );
    };

    const goToPrevious = () => {
        setCurrentQuestionIndex((current) => Math.max(0, current - 1));
    };

    const goToNext = () => {
        setCurrentQuestionIndex((current) =>
            Math.min(totalQuestions - 1, current + 1),
        );
    };

    function cleanHtml(html) {
        if (!html) return "";

        let cleaned = html;

        // kalau string json (hanya pakai hasilnya kalau memang string,
        // soalnya JSON.parse("123") balikin number 123, bukan string)
        try {
            const parsed = JSON.parse(cleaned);
            if (typeof parsed === "string") {
                cleaned = parsed;
            }
        } catch (e) {}

        // hapus quote pembungkus
        if (
            typeof cleaned === "string" &&
            cleaned.startsWith('"') &&
            cleaned.endsWith('"')
        ) {
            cleaned = cleaned.slice(1, -1);
        }

        // unescape
        cleaned = String(cleaned)
            .replace(/\\"/g, '"')
            .replace(/\\n/g, "\n")
            .replace(/\\\\/g, "\\");

        return cleaned;
    }

    return (
        <AppLayout title={quizSet.title} showTitleBar={false}>
            <div className="mx-auto bg-white/90 p-3 sm:p-5 ">
                <div className="flex flex-col gap-3 border-b border-slate-200 pb-4 lg:flex-row lg:items-start lg:justify-between">
                    <div className="min-w-0">
                        <h2 className="mt-1 text-xl font-black tracking-tight text-slate-900 sm:text-2xl">
                            {quizSet.title}
                        </h2>
                    </div>

                    <div
                        className={`inline-flex max-w-full items-center gap-2 self-start rounded-full border px-3 py-1.5 text-sm font-semibold shadow-sm ${submitted ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-red-200 bg-red-50 text-red-600"}`}
                    >
                        {submitted ? (
                            <CheckCircleIcon className="h-5 w-5" />
                        ) : (
                            <ClockIcon className="h-5 w-5" />
                        )}
                        <span className="truncate">
                            {submitted
                                ? "Tes sudah dikerjakan"
                                : `Waktu tersisa: ${formatTime(remainingSeconds)}`}
                        </span>
                    </div>
                </div>

                <div className="mt-4 grid min-h-0 gap-4 lg:grid-cols-[minmax(0,1.45fr)_280px]">
                    <section className="flex min-h-0 flex-col gap-3">
                        {currentQuestion ? (
                            <div className="flex min-h-0 flex-1 flex-col rounded-[1.4rem] border border-slate-200 bg-white p-3 shadow-sm">
                                <div className="flex flex-col gap-2 border-b border-slate-200 pb-2 md:flex-row md:items-start md:justify-between">
                                    <div>
                                        <div className="text-xs font-semibold uppercase tracking-[0.16em] text-[rgb(var(--color-primary))]">
                                            Pertanyaan
                                        </div>
                                        <h3 className="mt-1 text-lg font-extrabold tracking-tight text-slate-900 sm:text-xl">
                                            Soal {currentQuestionIndex + 1}
                                        </h3>
                                    </div>

                                    <div className="inline-flex items-center gap-2 self-start rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-600">
                                        {answers[currentQuestion.id] ? (
                                            <>
                                                <CheckCircleIcon className="h-4 w-4" />
                                                <span>Sudah dijawab</span>
                                            </>
                                        ) : (
                                            <span>Belum dijawab</span>
                                        )}
                                    </div>
                                </div>

                                <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-visible pt-2 lg:overflow-hidden">
                                    <div className="rounded-2xl bg-slate-50 p-3 text-sm leading-6 text-slate-800 shadow-inner">
                                        <div
                                            className="
prose
prose-sm
max-w-none
[&_pre]:bg-[#0B1120]
[&_pre]:text-white
[&_pre]:p-4
[&_pre]:rounded-xl
[&_pre]:overflow-x-auto
[&_code]:font-mono
[&_code]:text-sm
[&_pre_code]:bg-transparent
[&_pre_code]:text-inherit
"
                                            dangerouslySetInnerHTML={{
                                                __html: cleanHtml(
                                                    currentQuestion.question_text,
                                                ),
                                            }}
                                        />
                                    </div>

                                    <div className="space-y-2 lg:overflow-y-auto">
                                        {currentQuestion.options.map(
                                            (option, optionIndex) => {
                                                const label =
                                                    optionLabels[optionIndex] ||
                                                    String.fromCharCode(
                                                        65 + optionIndex,
                                                    );
                                                const isSelected =
                                                    answers[
                                                        currentQuestion.id
                                                    ] === label;

                                                return (
                                                    <label
                                                        key={option}
                                                        className={`flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm transition hover:border-[rgb(var(--color-primary))]/40 hover:bg-slate-50 sm:items-center ${isSelected ? "border-[rgb(var(--color-primary))] bg-[rgb(239_246_255)]" : ""}`}
                                                    >
                                                        <input
                                                            type="radio"
                                                            name={`question-${currentQuestion.id}`}
                                                            checked={isSelected}
                                                            disabled={submitted}
                                                            onChange={() =>
                                                                setAnswers(
                                                                    (
                                                                        current,
                                                                    ) => ({
                                                                        ...current,
                                                                        [currentQuestion.id]:
                                                                            label,
                                                                    }),
                                                                )
                                                            }
                                                            className="mt-0 self-center"
                                                        />
                                                        <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-black text-slate-700">
                                                            {label}
                                                        </span>
                                                        <div
                                                            className="
                                                                prose
                                                                prose-sm
                                                                max-w-none
                                                                flex-1

                                                                [&_pre]:bg-[#0B1120]
                                                                [&_pre]:text-white
                                                                [&_pre]:p-4
                                                                [&_pre]:rounded-xl
                                                                [&_pre]:overflow-x-auto

                                                                [&_code]:font-mono
                                                                [&_code]:text-sm

                                                                [&_pre_code]:bg-transparent
                                                                [&_pre_code]:text-inherit
                                                                "
                                                            dangerouslySetInnerHTML={{
                                                                __html: cleanHtml(
                                                                    option,
                                                                ),
                                                            }}
                                                        />
                                                    </label>
                                                );
                                            },
                                        )}
                                    </div>
                                </div>

                                <div className="mt-2 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center sm:justify-between">
                                    <button
                                        type="button"
                                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40 sm:px-4"
                                        onClick={goToPrevious}
                                        disabled={currentQuestionIndex === 0}
                                    >
                                        <ChevronLeftIcon className="h-4 w-4" />
                                        <span>Sebelumnya</span>
                                    </button>

                                    <button
                                        type="button"
                                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-[rgb(var(--color-primary))] px-3 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[rgb(var(--color-primary-hover))] disabled:cursor-not-allowed disabled:opacity-40 sm:px-4"
                                        onClick={goToNext}
                                        disabled={
                                            currentQuestionIndex ===
                                            totalQuestions - 1
                                        }
                                    >
                                        <span>Berikutnya</span>
                                        <ChevronRightIcon className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        ) : null}
                    </section>

                    <aside className="flex min-h-0 flex-col gap-3 overflow-visible rounded-[1.4rem] border border-slate-200 bg-white p-3 shadow-sm lg:overflow-hidden">
                        <div className="flex items-start justify-between gap-3 border-b border-slate-200 pb-2">
                            <div>
                                <div className="text-xs font-semibold uppercase tracking-[0.16em] text-[rgb(var(--color-primary))]">
                                    Pilih Pertanyaan
                                </div>
                            </div>

                            <div className="rounded-full bg-[rgb(239_246_255)] px-3 py-1.5 text-xs font-black text-[rgb(var(--color-primary))]">
                                {answeredCount}/{totalQuestions}
                            </div>
                        </div>

                        <div className="grid grid-cols-5 gap-1.5 sm:grid-cols-6 lg:grid-cols-5">
                            {questions.map((question, index) => {
                                const isActive = index === currentQuestionIndex;
                                const isAnswered = Boolean(
                                    answers[question.id],
                                );

                                return (
                                    <button
                                        key={question.id}
                                        type="button"
                                        onClick={() =>
                                            setCurrentQuestionIndex(index)
                                        }
                                        className={`flex h-9 items-center justify-center rounded-xl border text-sm font-bold transition ${
                                            isActive
                                                ? "border-[rgb(var(--color-primary))] bg-[rgb(var(--color-primary))] text-white shadow-sm"
                                                : isAnswered
                                                  ? "border-emerald-500 bg-emerald-500 text-white shadow-sm"
                                                  : "border-slate-200 bg-slate-100 text-slate-600 hover:border-slate-300 hover:bg-slate-200"
                                        }`}
                                    >
                                        {index + 1}
                                    </button>
                                );
                            })}
                        </div>

                        {attempt ? (
                            <div className="rounded-[1.2rem] border border-slate-200 bg-slate-50 p-3 shadow-sm">
                                <div>
                                    <div className="text-xs font-semibold uppercase tracking-[0.16em] text-[rgb(var(--color-primary))]">
                                        Hasil tes
                                    </div>
                                    <p className="mt-1 text-base font-black text-slate-900">
                                        Nilai kamu: {attempt.percentage}
                                    </p>
                                    <p className="mt-1 text-sm font-semibold text-slate-600">
                                        Benar {attempt.score}/
                                        {attempt.total_questions} soal
                                    </p>
                                </div>
                                <p className="mt-2 text-xs leading-5 text-slate-600">
                                    Tes ini hanya bisa dikerjakan satu kali.
                                </p>
                            </div>
                        ) : null}

                        {incompleteWarning ? (
                            <p className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-700">
                                Masih ada {totalQuestions - answeredCount}{" "}
                                soal yang belum dijawab. Lengkapi semua
                                jawaban sebelum submit.
                            </p>
                        ) : null}

                        <div className="mt-auto grid grid-cols-1 gap-2 pt-1 sm:grid-cols-2 lg:flex">
                            <Link
                                href={route("tes")}
                                className="course-secondary-button flex-1 text-center"
                            >
                                Kembali
                            </Link>

                            <button
                                type="button"
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[rgb(var(--color-primary))] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[rgb(var(--color-primary-hover))] disabled:cursor-not-allowed disabled:opacity-40"
                                onClick={() => submitQuiz()}
                                disabled={
                                    submitted ||
                                    processing ||
                                    totalQuestions === 0
                                }
                            >
                                {processing
                                    ? "Menyimpan..."
                                    : submitted
                                      ? "Sudah Submit"
                                      : "Submit Jawaban"}
                            </button>
                        </div>
                    </aside>
                </div>
            </div>
        </AppLayout>
    );
}
