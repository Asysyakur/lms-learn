import AppLayout from "@/Layouts/AppLayout";

export default function Kuis() {
  return (
    <AppLayout title="Kuis">
      <div className="grid gap-6 md:grid-cols-2">
        {/* PRE TEST */}
        <div className="app-card">
          <div className="btn-accent mb-4 w-full py-2 text-center">
            Pre-test
          </div>

          <p className="app-muted mb-4">
            Kerjakan pre-test sebelum belajar
          </p>

          <button className="btn-primary w-full">
            Mulai
          </button>
        </div>

        {/* POST TEST */}
        <div className="app-card">
          <div className="btn-primary mb-4 w-full py-2 text-center">
            Post-test
          </div>

          <p className="app-muted mb-4">
            Kerjakan post-test setelah belajar
          </p>

          <button className="btn-primary w-full">
            Mulai
          </button>
        </div>
      </div>
    </AppLayout>
  );
}