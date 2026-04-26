import AppLayout from "@/Layouts/AppLayout";
import { Link } from "@inertiajs/react";

export default function Beranda() {
  const days = [1, 2, 3];

  return (
    <AppLayout title="Pembelajaran">
      <div className="grid gap-6 md:grid-cols-3">
        {days.map((day) => (
          <div key={day} className="app-card bg-primary text-white ring-0">
            <h3 className="mb-2 text-lg font-bold">Day {day}</h3>
            <p className="text-sm text-white/80">Materi OOP</p>

            <Link href={`/pertemuan/${day}`}>
              <button className="btn-accent mt-4">
                Mulai
              </button>
            </Link>
          </div>
        ))}
      </div>
    </AppLayout>
  );
}