import AppLayout from "@/Layouts/AppLayout";
import { Link } from "@inertiajs/react";

export default function Kuis({ quizSets = [], activeQuizTitle = null }) {
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
    <AppLayout title="Tes">
      {activeQuizTitle ? (
        <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800">
          Kamu sedang mengerjakan <span className="font-black">"{activeQuizTitle}"</span>. Selesaikan tes ini dulu sebelum membuka tes lain.
        </div>
      ) : null}

      <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
        {quizzes.map((quiz) => {
          const isLocked = Boolean(quiz.locked);
          const cardContent = (
            <>
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
                {quiz.duration_minutes ? (
                  <p className="text-xs font-semibold text-slate-500">
                    Waktu pengerjaan: {quiz.duration_minutes} menit
                  </p>
                ) : null}

                {quiz.is_running ? (
                  <div className="w-full rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-center sm:max-w-sm">
                    <p className="text-xs font-bold uppercase tracking-wide text-amber-700">
                      Sedang berjalan
                    </p>
                    <p className="mt-1 text-sm font-semibold text-amber-800">
                      Lanjutkan pengerjaan tes ini.
                    </p>
                  </div>
                ) : quiz.attempt ? (
                  <div className="w-full rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-center sm:max-w-sm">
                    <p className="text-xs font-bold uppercase tracking-wide text-emerald-700">
                      Sudah dikerjakan
                    </p>
                    <p className="mt-1 break-words text-base font-black text-emerald-800 sm:text-lg">
                      Nilai: {quiz.attempt.percentage} ({quiz.attempt.score}/{quiz.attempt.total_questions})
                    </p>
                  </div>
                ) : isLocked ? (
                  <div className="w-full rounded-2xl border border-slate-200 bg-slate-100 px-4 py-3 text-center sm:max-w-sm">
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                      Terkunci
                    </p>
                    <p className="mt-1 text-sm font-semibold text-slate-600">
                      Selesaikan tes yang sedang berjalan dulu.
                    </p>
                  </div>
                ) : (
                  <span className="btn-accent w-full rounded-full text-center sm:max-w-sm">
                    Buka {quiz.label || "Quiz"}
                  </span>
                )}
              </div>
            </>
          );

          if (isLocked) {
            return (
              <div
                key={quiz.label || quiz.slug}
                aria-disabled="true"
                className="min-w-0 cursor-not-allowed overflow-hidden rounded-xl bg-[rgb(var(--color-surface))] opacity-60 shadow-lg ring-1 ring-[rgb(var(--color-border))]"
              >
                {cardContent}
              </div>
            );
          }

          return (
            <Link
              key={quiz.label || quiz.slug}
              href={route("tes.show", { slug: quiz.slug })}
              className="group min-w-0 overflow-hidden rounded-xl bg-[rgb(var(--color-surface))] shadow-lg ring-1 ring-[rgb(var(--color-border))] transition hover:-translate-y-0.5 hover:shadow-xl"
            >
              {cardContent}
            </Link>
          );
        })}
      </div>
    </AppLayout>
  );
}
