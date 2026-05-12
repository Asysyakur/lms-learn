import {
    ChatBubbleLeftRightIcon,
} from "@heroicons/react/24/solid";
import { useEffect } from "react";

export default function StepTwoAsk({
    stepData,
    questionDraft,
    setQuestionDraft,
    questionSaved,
    onSave,
    onNext,
    askAnswerDrafts,
    setAskAnswerDrafts,
}) {
    const questions = stepData?.questions || [];

    // Initialize from props
    useEffect(() => {
        if (questions.length > 0) {
            const drafts = {};

            if (typeof questionSaved === "object" && questionSaved !== null) {
                Object.assign(drafts, questionSaved);
            }

            setAskAnswerDrafts(drafts);
            return;
        }

        setAskAnswerDrafts({});
    }, [questions, questionSaved, setAskAnswerDrafts]);

    const handleAnswerChange = (askId, value) => {
        setAskAnswerDrafts((prev) => ({
            ...prev,
            [askId]: value,
        }));
    };

    const handleSaveAll = () => {
        onSave();
    };

    const handleNext = () => {
        onSave(onNext);
    };
    return (
        <div className="course-detail-grid">
            <div className="course-detail-card space-y-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <ChatBubbleLeftRightIcon className="h-5 w-5 text-[rgb(var(--color-primary))]" />
                    {questions.length > 1
                        ? "Jawab Pertanyaan-Pertanyaan"
                        : "Tulis Pertanyaanmu"}
                </div>

                {/* Show intro text if old single question format */}
                {!questions.length && (
                    <p className="course-detail-text">
                        {stepData?.question_prompt ||
                            "Tulis pertanyaan atau tanggapanmu setelah melihat PPT/video."}
                    </p>
                )}

                {/* Multiple questions */}
                {questions.length > 0 ? (
                    <div className="space-y-4">
                        {questions.map((question, idx) => (
                            <div
                                key={question.id}
                                className="p-4 rounded-lg border border-slate-200 bg-slate-50"
                            >
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    Pertanyaan {idx + 1}:
                                </label>
                                <p className="text-sm text-slate-600 mb-3">
                                    {question.question_prompt}
                                </p>
                                <textarea
                                    className="course-textarea"
                                    placeholder="Tulis jawabanmu di sini..."
                                    value={askAnswerDrafts[question.id] || ""}
                                    onChange={(e) =>
                                        handleAnswerChange(
                                            question.id,
                                            e.target.value,
                                        )
                                    }
                                    rows="4"
                                />
                            </div>
                        ))}
                    </div>
                ) : (
                    /* Old single question format for backward compatibility */
                    <div className="space-y-3">
                        <label className="course-field-label">
                            Pertanyaan Siswa
                        </label>
                        <textarea
                            className="course-textarea"
                            placeholder="Tulis pertanyaan atau tanggapanmu di sini..."
                            value={questionDraft}
                            onChange={(event) =>
                                setQuestionDraft(event.target.value)
                            }
                        />
                    </div>
                )}

                <div className="flex flex-wrap gap-3">
                    <button
                        type="button"
                        className="course-step-primary-button"
                        onClick={handleSaveAll}
                    >
                        Simpan Jawaban
                    </button>
                    <button
                        type="button"
                        className="course-step-secondary-button"
                        onClick={handleNext}
                    >
                        Lanjut
                    </button>
                </div>
            </div>

            <div className="course-detail-card space-y-3">
                <h3 className="course-detail-title">Jawaban Tersimpan</h3>
                {questions.length > 0 ? (
                    <div className="space-y-3">
                        {questions.map((question, idx) => (
                            <div
                                key={question.id}
                                className="pb-3 border-b border-slate-200 last:border-b-0"
                            >
                                <p className="text-xs font-semibold text-slate-600">
                                    Pertanyaan {idx + 1}:
                                </p>
                                <p className="text-sm text-slate-700 mt-1">
                                    {questionSaved?.[question.id] || (
                                        <span className="italic text-slate-400">
                                            Belum dijawab
                                        </span>
                                    )}
                                </p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="course-detail-text">
                        {questionSaved || "Belum ada jawaban yang disimpan."}
                    </p>
                )}
            </div>
        </div>
    );
}
