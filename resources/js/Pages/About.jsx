import AppLayout from "@/Layouts/AppLayout";

export default function About() {
  return (
    <AppLayout title="Tentang">
      <div className="app-card">
        <h2 className="mb-2 text-lg font-bold text-[rgb(var(--color-text))]">
          Tentang Aplikasi
        </h2>
        <p className="app-muted">
          Aplikasi pembelajaran OOP berbasis discovery learning.
        </p>
      </div>
    </AppLayout>
  );
}