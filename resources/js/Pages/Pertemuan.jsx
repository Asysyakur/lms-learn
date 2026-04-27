import AppLayout from "@/Layouts/AppLayout";
import {
  ArrowPathIcon,
  BeakerIcon,
  BookOpenIcon,
  ChatBubbleLeftRightIcon,
  ClipboardDocumentCheckIcon,
  MagnifyingGlassIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/24/solid";
import { Link } from "@inertiajs/react";

export default function Pertemuan({ id }) {
  const steps = [
    {
      title: "Mari Mengamati",
      desc: "Lihat PPT atau video yang sudah disiapkan.",
      icon: MagnifyingGlassIcon,
      accent: false,
      step: 1,
    },
    {
      title: "Ayo Bertanya",
      desc: "Tulis pertanyaan dan simpan jawabanmu.",
      icon: ChatBubbleLeftRightIcon,
      accent: true,
      step: 2,
    },
    {
      title: "Eksplorasi",
      desc: "Isi sesuai instruksi khusus tiap pertemuan.",
      icon: BeakerIcon,
      accent: false,
      step: 3,
    },
    {
      title: "Latihan Soal",
      desc: "Kuis pilihan ganda atau essay.",
      icon: ClipboardDocumentCheckIcon,
      accent: true,
      step: 4,
    },
    {
      title: "Bandingkan dan Perbaiki",
      desc: "Tinjau jawaban eksplorasi dan edit jika perlu.",
      icon: ArrowPathIcon,
      accent: false,
      step: 5,
    },
    {
      title: "Refleksi",
      desc: "Jawab pertanyaan penutup di textbox.",
      icon: QuestionMarkCircleIcon,
      accent: true,
      step: 6,
    },
  ];

  const completed = 3;
  const progressPercent = Math.round((completed / steps.length) * 100);

  return (
    <AppLayout title={`Pertemuan ${id}`} showTitleBar={false} showMobileNav={false}>
      <div className="course-shell">
        <div className="course-hero">
          <div>
            <h2 className="course-title">Pertemuan {id}</h2>
            <p className="course-description">
              Mari belajar konsep dasar pada pertemuan ini dengan langkah yang
              terarah, ringkas, dan mudah diikuti.
            </p>

            <div className="course-progress-label">
              {completed}/{steps.length} Selesai
            </div>
            <div className="course-progress-track">
              <div
                className="course-progress-fill"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          <div className="course-hero-art">
            <div className="course-hero-badge">
              <BookOpenIcon className="h-20 w-20 text-[rgb(var(--color-primary))] sm:h-24 sm:w-24" />
            </div>
          </div>
        </div>

        <div className="course-step-list">
          {steps.map((step, i) => (
            <div
              key={step.title}
              className="course-step-card"
            >
              <div className="course-step-left">
                <div className={`course-step-icon ${step.accent ? "course-step-icon-blue" : ""}`}>
                  <step.icon className="h-6 w-6" />
                </div>

                <div>
                  <h3 className="course-step-title">
                    {i + 1}. {step.title}
                  </h3>
                  <p className="course-step-desc">{step.desc}</p>
                </div>
              </div>

              <Link
                className="btn-primary course-step-button"
                href={route("pertemuan.step", { id, step: step.step })}
              >
                Mulai
              </Link>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}