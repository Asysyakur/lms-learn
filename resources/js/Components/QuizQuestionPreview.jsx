const OPTION_LABELS = ["A", "B", "C", "D", "E", "F"];

const PROSE_CLASS = `
    prose prose-sm max-w-none
    [&_pre]:bg-[#0B1120] [&_pre]:text-white [&_pre]:p-3 [&_pre]:rounded-xl [&_pre]:overflow-x-auto
    [&_code]:font-mono [&_code]:text-sm
    [&_pre_code]:bg-transparent [&_pre_code]:text-inherit
`;

export default function QuizQuestionPreview({
    questionText,
    options = [],
    correctOption,
}) {
    return (
        <div className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200">
            <h3 className="text-sm font-semibold text-slate-700">Preview</h3>

            <div className="mt-3 rounded-lg bg-slate-50 p-3">
                <div
                    className={PROSE_CLASS}
                    dangerouslySetInnerHTML={{
                        __html:
                            questionText ||
                            "<span class='text-slate-400'>Belum ada pertanyaan</span>",
                    }}
                />
            </div>

            <div className="mt-3 space-y-2">
                {options.map((option, index) => {
                    const label = OPTION_LABELS[index] || `${index + 1}`;
                    const isCorrect = correctOption === label;

                    return (
                        <div
                            key={index}
                            className={`flex items-start gap-3 rounded-xl border px-3 py-2 ${
                                isCorrect
                                    ? "border-emerald-300 bg-emerald-50"
                                    : "border-slate-200 bg-white"
                            }`}
                        >
                            <span
                                className={`mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                                    isCorrect
                                        ? "bg-emerald-500 text-white"
                                        : "bg-slate-100 text-slate-700"
                                }`}
                            >
                                {label}
                            </span>

                            <div
                                className={`flex-1 ${PROSE_CLASS}`}
                                dangerouslySetInnerHTML={{
                                    __html:
                                        option ||
                                        "<span class='text-slate-400'>Opsi kosong</span>",
                                }}
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
