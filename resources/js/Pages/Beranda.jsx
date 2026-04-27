import AppLayout from "@/Layouts/AppLayout";
import { Link } from "@inertiajs/react";

export default function Beranda() {
  const days = [
    { id: 1 },
    { id: 2 },
    { id: 3 },
  ];

  return (
    <AppLayout title="Pembelajaran">
      <div className="grid gap-6 md:grid-cols-3">
        {days.map((day) => (
          <div key={day.id} className="day-card ring-0">
            <div className="day-card-header bg-[rgb(var(--color-primary-hover))]">
              Day {day.id}
            </div>

            <div className="day-card-body">
              <div className="day-preview overflow-hidden bg-white/20">
                <img
                  src="/images/learning-card.svg"
                  alt="Ilustrasi pembelajaran"
                  className="h-full w-full object-contain"
                />
              </div>
              <h3 className="day-card-title">Materi OOP</h3>

              <Link href={`/pertemuan/${day.id}`} className="btn-accent w-full rounded-full sm:max-w-sm">
                Mulai
              </Link>
            </div>
          </div>
        ))}
      </div>
    </AppLayout>
  );
}