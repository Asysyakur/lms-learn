import AdminLayout from "@/Layouts/AdminLayout";
import { Link, useForm } from "@inertiajs/react";
import QuizQuestionPreview from "@/Components/QuizQuestionPreview";

const OPTION_LABELS = ["A", "B", "C", "D", "E", "F"];

function cleanOption(opt) {
    if (typeof opt !== "string") return opt;

    return opt.replace(/\\"/g, '"').replace(/^"(.*)"$/, "$1");
}

export default function EditQuestion({ question, sets }) {
    const initialOptions = (question.options ?? []).map(cleanOption);

    const { data, setData, put, processing, errors } = useForm({
        quiz_set_id: question.quiz_set_id ?? sets[0]?.id ?? "",
        question_text: question.question_text ?? "",
        options: initialOptions.length > 0 ? initialOptions : ["", ""],
        correct_option: question.correct_option ?? "A",
    });

    function submit(e) {
        e.preventDefault();
        put(`/admin/quiz-questions/${question.id}`);
    }

    function updateOption(index, value) {
        const next = [...data.options];
        next[index] = value;
        setData("options", next);
    }

    function addOption() {
        setData("options", [...data.options, ""]);
    }

    function removeOption(index) {
        const removedLabel = OPTION_LABELS[index];
        const next = data.options.filter((_, i) => i !== index);
        setData("options", next);

        if (data.correct_option === removedLabel) {
            setData("correct_option", OPTION_LABELS[0]);
        }
    }

    return (
        <AdminLayout title="Ubah Soal">
            <div className="grid gap-4 lg:grid-cols-2 lg:items-start">
            <form
                onSubmit={submit}
                className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-slate-200"
            >
                <label className="block text-sm font-semibold text-slate-700">
                    Quiz Set
                </label>
                <select
                    className="mt-1 w-full rounded-lg border-slate-300"
                    value={data.quiz_set_id}
                    onChange={(e) => setData("quiz_set_id", e.target.value)}
                >
                    {sets.map((set) => (
                        <option key={set.id} value={set.id}>
                            {set.title}
                        </option>
                    ))}
                </select>

                <label className="mt-4 block text-sm font-semibold text-slate-700">
                    Pertanyaan
                </label>
                <textarea
                    className="mt-1 min-h-28 w-full rounded-lg border-slate-300"
                    value={data.question_text}
                    onChange={(e) => setData("question_text", e.target.value)}
                />

                <div className="mt-4 flex items-center justify-between">
                    <label className="block text-sm font-semibold text-slate-700">
                        Opsi Jawaban
                    </label>
                    <button
                        type="button"
                        className="rounded-lg bg-blue-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-blue-700"
                        onClick={addOption}
                    >
                        + Tambah Opsi
                    </button>
                </div>

                <div className="mt-2 space-y-2">
                    {data.options.map((option, index) => {
                        const label = OPTION_LABELS[index] || `${index + 1}`;

                        return (
                            <div
                                key={index}
                                className="flex items-start gap-2 rounded-lg border border-slate-200 p-2"
                            >
                                <label className="mt-2 flex items-center gap-1.5">
                                    <input
                                        type="radio"
                                        name="correct_option"
                                        checked={
                                            data.correct_option === label
                                        }
                                        onChange={() =>
                                            setData("correct_option", label)
                                        }
                                    />
                                    <span className="text-sm font-semibold text-slate-700">
                                        {label}
                                    </span>
                                </label>

                                <textarea
                                    className="min-h-12 flex-1 rounded-lg border-slate-300 text-sm"
                                    value={option}
                                    onChange={(e) =>
                                        updateOption(index, e.target.value)
                                    }
                                />

                                {data.options.length > 2 && (
                                    <button
                                        type="button"
                                        className="mt-1 rounded-lg border border-red-200 px-3 py-1.5 text-sm font-semibold text-red-600 hover:bg-red-50"
                                        onClick={() => removeOption(index)}
                                    >
                                        Hapus
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>
                {errors.options && (
                    <p className="mt-1 text-sm text-red-600">
                        {errors.options}
                    </p>
                )}

                <p className="mt-2 text-xs text-slate-500">
                    Pilih radio di samping opsi untuk menandai jawaban benar.
                </p>

                <div className="mt-5 flex gap-2">
                    <button
                        disabled={processing}
                        className="rounded-lg bg-yellow-400 px-4 py-2 text-sm font-bold text-slate-950 hover:bg-yellow-500 disabled:opacity-60"
                        type="submit"
                    >
                        Perbarui
                    </button>
                    <Link
                        className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                        href="/admin/quiz-questions"
                    >
                        Batal
                    </Link>
                </div>
            </form>

            <QuizQuestionPreview
                questionText={data.question_text}
                options={data.options}
                correctOption={data.correct_option}
            />
            </div>
        </AdminLayout>
    );
}
