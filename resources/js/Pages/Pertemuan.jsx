import AppLayout from "@/Layouts/AppLayout";

export default function Pertemuan({ id }) {
  const steps = [
    {
      title: "Mari Mengamati",
      desc: "Ayo amati video atau materi",
    },
    {
      title: "Ayo Bertanya",
      desc: "Tulis pertanyaanmu",
    },
    {
      title: "Eksplorasi",
      desc: "Pelajari dan kerjakan studi kasus",
    },
    {
      title: "Latihan Soal",
      desc: "Uji pemahamanmu",
    },
    {
      title: "Bandingkan & Perbaiki",
      desc: "Periksa dan edit jawabanmu",
    },
    {
      title: "Kesimpulan",
      desc: "Rangkum pembelajaran",
    },
  ];

  return (
    <AppLayout title={`Pertemuan ${id}`}>
      <div className="space-y-4">
        {steps.map((step, i) => (
          <div key={i} className="app-card flex items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-[rgb(var(--color-text))]">
                {i + 1}. {step.title}
              </h3>
              <p className="app-muted">{step.desc}</p>
            </div>

            <button className="btn-accent shrink-0">
              Mulai
            </button>
          </div>
        ))}
      </div>
    </AppLayout>
  );
}