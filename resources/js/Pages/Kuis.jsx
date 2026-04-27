import AppLayout from "@/Layouts/AppLayout";
import { Link } from "@inertiajs/react";

export default function Kuis() {
  const quizzes = [
    {
      title: "Kerjakan sebelum belajar",
      description: "Uji pemahaman awal sebelum masuk materi utama.",
      label: "Pre-test",
      image: "/images/pretest-card.svg",
    },
    {
      title: "Kerjakan setelah belajar",
      description: "Cek hasil belajar setelah menyelesaikan seluruh materi.",
      label: "Post-test",
      image: "/images/posttest-card.svg",
    },
  ];

  return (
    <AppLayout title="Kuis">
      <div className="grid gap-6 md:grid-cols-2">
        {quizzes.map((quiz) => (
          <div key={quiz.label} className="day-card ring-0">
            <div className="day-card-header bg-[rgb(var(--color-primary-hover))]">
              {quiz.label}
            </div>

            <div className="day-card-body">
              <div className="day-preview overflow-hidden bg-white/20">
                <img
                  src={quiz.image}
                  alt={quiz.label}
                  className="h-full w-full object-contain"
                />
              </div>
              <h3 className="day-card-title">{quiz.title}</h3>
              <p className="max-w-sm text-sm text-slate-600">
                {quiz.description}
              </p>

              <Link href="#" className="btn-accent w-full rounded-full sm:max-w-sm">
                Mulai
              </Link>
            </div>
          </div>
        ))}
      </div>
    </AppLayout>
  );
}