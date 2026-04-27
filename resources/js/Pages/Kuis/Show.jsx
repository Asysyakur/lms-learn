import AppLayout from "@/Layouts/AppLayout";
import { Link } from "@inertiajs/react";
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

export default function QuizShow({ quizSet, questions = [] }) {
    const [answers, setAnswers] = useState({});
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [submitted, setSubmitted] = useState(false);
    const [score, setScore] = useState(0);
    const [remainingSeconds, setRemainingSeconds] =
        useState(DEFAULT_TIME_SECONDS);

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
            submitQuiz();
        }
    }, [remainingSeconds, submitted]);

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60)
            .toString()
            .padStart(2, "0");
        const secs = Math.floor(seconds % 60)
            .toString()
            .padStart(2, "0");

        return `${minutes}:${secs}`;
    };

    const submitQuiz = () => {
        const totalScore = questions.reduce((result, question) => {
            const selectedAnswer = answers[question.id];

            if (selectedAnswer === question.correct_option) {
                return result + 1;
            }

            return result;
        }, 0);

        setScore(totalScore);
        setSubmitted(true);
    };

    const goToPrevious = () => {
        setCurrentQuestionIndex((current) => Math.max(0, current - 1));
    };

    const goToNext = () => {
        setCurrentQuestionIndex((current) =>
            Math.min(totalQuestions - 1, current + 1),
        );
    };

    return (
        <AppLayout title={quizSet.title} showTitleBar={false}>
            <div className="mx-auto h-screen overflow-hidden bg-white/90 p-4 sm:p-5">
                <div className="flex flex-col gap-3 border-b border-slate-200 pb-4 lg:flex-row lg:items-start lg:justify-between">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[rgb(var(--color-primary))]">
                            Quiz /{" "}
                            {quizSet.quiz_type === "pre-test"
                                ? "Pre-test"
                                : "Post-test"}
                        </p>
                        <h2 className="mt-1 text-xl font-black tracking-tight text-slate-900 sm:text-2xl">
                            {quizSet.title}
                        </h2>
                        <p className="mt-1.5 max-w-2xl text-sm leading-6 text-slate-600">
                            {quizSet.description}
                        </p>
                    </div>

                    <div className="inline-flex items-center gap-2 self-start rounded-full border border-red-200 bg-red-50 px-3 py-1.5 text-sm font-semibold text-red-600 shadow-sm">
                        <ClockIcon className="h-5 w-5" />
                        <span>
                            Waktu tersisa: {formatTime(remainingSeconds)}
                        </span>
                    </div>
                </div>

                <div className="mt-4 grid min-h-0 gap-4 lg:h-[calc(100vh-9.5rem)] lg:grid-cols-[minmax(0,1.45fr)_280px]">
                    <section className="flex min-h-0 flex-col gap-3">
                        <div className="overflow-hidden rounded-[1.4rem] border border-slate-200 bg-white shadow-sm">
                            <img
                                src={quizSet.image}
                                alt={quizSet.title}
                                className="h-24 w-full object-cover sm:h-28"
                            />
                            <div className="flex flex-col gap-2 p-3 lg:flex-row lg:items-center lg:justify-between">
                                <div>
                                    <div className="text-xs font-semibold uppercase tracking-[0.16em] text-[rgb(var(--color-primary))]">
                                        Deskripsi Test
                                    </div>
                                    <p className="mt-1 text-xs leading-5 text-slate-600">
                                        {quizSet.description}
                                    </p>
                                </div>

                                <div className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-700">
                                    <ClipboardDocumentCheckIcon className="h-5 w-5" />
                                    <span>
                                        {answeredCount}/{totalQuestions} dijawab
                                    </span>
                                </div>
                            </div>
                        </div>

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

                                <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-hidden pt-2">
                                    <div className="rounded-2xl bg-slate-50 p-3 text-sm leading-6 text-slate-800 shadow-inner">
                                        {currentQuestion.question_text}
                                    </div>

                                    <div className="space-y-2">
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
                                                        className={`flex cursor-pointer items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 shadow-sm transition hover:border-[rgb(var(--color-primary))]/40 hover:bg-slate-50 ${isSelected ? "border-[rgb(var(--color-primary))] bg-[rgb(239_246_255)]" : ""}`}
                                                    >
                                                        <input
                                                            type="radio"
                                                            name={`question-${currentQuestion.id}`}
                                                            checked={isSelected}
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
                                                        <span className="flex-1 leading-6">
                                                            {option}
                                                        </span>
                                                    </label>
                                                );
                                            },
                                        )}
                                    </div>
                                </div>

                                <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                                    <button
                                        type="button"
                                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold shadow-sm transition disabled:cursor-not-allowed disabled:opacity-40 hover:bg-slate-50 text-slate-700"
                                        onClick={goToPrevious}
                                        disabled={currentQuestionIndex === 0}
                                    >
                                        <ChevronLeftIcon className="h-4 w-4" />
                                        <span>Previous</span>
                                    </button>

                                    <button
                                        type="button"
                                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-[rgb(var(--color-primary))] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition disabled:cursor-not-allowed disabled:opacity-40 hover:bg-[rgb(var(--color-primary-hover))]"
                                        onClick={goToNext}
                                        disabled={
                                            currentQuestionIndex ===
                                            totalQuestions - 1
                                        }
                                    >
                                        <span>Next</span>
                                        <ChevronRightIcon className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        ) : null}

                    </section>

                    <aside className="flex min-h-0 flex-col gap-3 overflow-hidden rounded-[1.4rem] border border-slate-200 bg-white p-3 shadow-sm">
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

                        {submitted ? (
                            <div className="rounded-[1.2rem] border border-slate-200 bg-slate-50 p-3 shadow-sm">
                                <div>
                                    <div className="text-xs font-semibold uppercase tracking-[0.16em] text-[rgb(var(--color-primary))]">
                                        Hasil sementara
                                    </div>
                                    <p className="mt-1 text-base font-black text-slate-900">
                                        Skor kamu: {score}/{totalQuestions}
                                    </p>
                                </div>
                                <p className="mt-2 text-xs leading-5 text-slate-600">
                                    Kamu bisa cek lagi nomor soal sebelum kirim ulang.
                                </p>
                            </div>
                        ) : null}

                        <div className="mt-auto flex gap-2 pt-1">
                            <Link
                                href={route("kuis")}
                                className="course-secondary-button flex-1"
                            >
                                Kembali
                            </Link>

                            <button
                                type="button"
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-[rgb(var(--color-primary))] px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition disabled:cursor-not-allowed disabled:opacity-40 hover:bg-[rgb(var(--color-primary-hover))]"
                                onClick={submitQuiz}
                            >
                                Submit Jawaban
                            </button>
                        </div>
                    </aside>
                </div>
            </div>
        </AppLayout>
    );
}
