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
      <div className="grid gap-6 md:grid-cols-2">
        {quizzes.map((quiz) => (
          <div
            key={quiz.label || quiz.slug}
            className="overflow-hidden rounded-xl bg-[rgb(var(--color-surface))] shadow-lg ring-1 ring-[rgb(var(--color-border))]"
          >
            <div className="px-4 py-3 text-center text-lg font-bold text-white bg-[rgb(var(--color-primary-hover))]">
              {quiz.label || quiz.title}
            </div>

            <div className="flex flex-col items-center gap-5 p-4 text-center">
              <div className="flex h-44 w-full items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-slate-100 via-slate-200 to-slate-100 sm:h-52 bg-white/20">
                <img
                  src={quiz.image}
                  alt={quiz.title}
                  className="h-full w-full object-contain"
                />
              </div>
              <h3 className="text-center text-xl font-bold text-slate-800">{quiz.title}</h3>
              <p className="max-w-sm text-sm text-slate-600">
                {quiz.description}
              </p>

              <Link
                href={route("kuis.show", { slug: quiz.slug })}
                className="btn-accent w-full rounded-full sm:max-w-sm"
              >
                Mulai
              </Link>
            </div>
          </div>
        ))}
      </div>
    </AppLayout>
  );
}