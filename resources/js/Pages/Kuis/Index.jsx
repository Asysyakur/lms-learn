import AppLayout from "@/Layouts/AppLayout";
import { Link } from "@inertiajs/react";

export default function Kuis({ quizSets = [] }) {
  const quizzes = quizSets.length > 0 ? quizSets : [
    {
      title: "Kerjakan sebelum belajar",
      description: "Uji pemahaman awal sebelum masuk materi utama.",
      label: "Pre-test",
      slug: "pre-test",
      image: "/images/pretest-card.svg",
    },
    {
      title: "Kerjakan setelah belajar",
      description: "Cek hasil belajar setelah menyelesaikan seluruh materi.",
      label: "Post-test",
      slug: "post-test",
      image: "/images/posttest-card.svg",
    },
  ];

  return (
    <AppLayout title="Kuis">
      <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
        {quizzes.map((quiz) => (
          <Link
            key={quiz.label || quiz.slug}
            href={route("kuis.show", { slug: quiz.slug })}
            className="group min-w-0 overflow-hidden rounded-xl bg-[rgb(var(--color-surface))] shadow-lg ring-1 ring-[rgb(var(--color-border))] transition hover:-translate-y-0.5 hover:shadow-xl"
          >
            <div className="px-4 py-3 text-center text-lg font-bold text-white bg-[rgb(var(--color-primary-hover))]">
              {quiz.label || quiz.title}
            </div>

            <div className="flex flex-col items-center gap-4 p-4 text-center sm:gap-5">
              <div className="flex h-44 w-full items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-slate-100 via-slate-200 to-slate-100 sm:h-52 bg-white/20">
                <img
                  src={quiz.image}
                  alt={quiz.title}
                  className="h-full w-full object-contain"
                />
              </div>
              <h3 className="break-words text-center text-lg font-bold text-slate-800 sm:text-xl">{quiz.title}</h3>
              <p className="max-w-sm text-sm text-slate-600">
                {quiz.description}
              </p>

              {quiz.attempt ? (
                <div className="w-full rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-center sm:max-w-sm">
                  <p className="text-xs font-bold uppercase tracking-wide text-emerald-700">
                    Sudah dikerjakan
                  </p>
                  <p className="mt-1 break-words text-base font-black text-emerald-800 sm:text-lg">
                    Nilai: {quiz.attempt.percentage} ({quiz.attempt.score}/{quiz.attempt.total_questions})
                  </p>
                </div>
              ) : (
                <span className="btn-accent w-full rounded-full text-center sm:max-w-sm">
                  Buka {quiz.label || "Quiz"}
                </span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </AppLayout>
  );
}
