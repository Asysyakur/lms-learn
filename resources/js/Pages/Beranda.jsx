import AppLayout from "@/Layouts/AppLayout";
import { Link } from "@inertiajs/react";

export default function Beranda({ course, meetings = [] }) {
  const learningItems = meetings.length > 0 ? meetings : [
    { id: 1, meeting_number: 1, title: "Pertemuan 1", description: "Mengenal konsep dasar OOP." },
    { id: 2, meeting_number: 2, title: "Pertemuan 2", description: "Eksplorasi dan compile code." },
    { id: 3, meeting_number: 3, title: "Pertemuan 3", description: "Eksplorasi lanjutan." },
  ];

  return (
    <AppLayout title={course?.title || "Pembelajaran"}>
      <div className="grid gap-6 md:grid-cols-3">
        {learningItems.map((item) => (
          <div
            key={item.id}
            className="overflow-hidden rounded-xl bg-[rgb(var(--color-surface))] shadow-lg ring-1 ring-[rgb(var(--color-border))]"
          >
            <div className="px-4 py-3 text-center text-lg font-bold text-white bg-[rgb(var(--color-primary))]">
              Day {item.meeting_number || item.id}
            </div>

            <div className="flex flex-col items-center gap-5 p-4 text-center">
              <div className="flex h-44 w-full items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-slate-100 via-slate-200 to-slate-100 sm:h-52 bg-white/20">
                <img
                  src="/images/learning-card.svg"
                  alt={item.title}
                  className="h-full w-full object-contain"
                />
              </div>
              <h3 className="text-center text-xl font-bold text-slate-800">{item.title}</h3>
              <p className="max-w-sm text-sm text-slate-600">
                {item.description}
              </p>

              <Link
                href={route("pertemuan", { id: item.id })}
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