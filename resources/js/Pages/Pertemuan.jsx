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

export default function Pertemuan({ id, meeting, steps = [] }) {
  const stepMeta = [
    { icon: MagnifyingGlassIcon, accent: false },
    { icon: ChatBubbleLeftRightIcon, accent: true },
    { icon: BeakerIcon, accent: false },
    { icon: ClipboardDocumentCheckIcon, accent: true },
    { icon: ArrowPathIcon, accent: false },
    { icon: QuestionMarkCircleIcon, accent: true },
  ];

  const defaultSteps = [
    {
      title: "Mari Mengamati",
      desc: "Lihat PPT atau video yang sudah disiapkan.",
      step: 1,
      ...stepMeta[0],
    },
    {
      title: "Ayo Bertanya",
      desc: "Tulis pertanyaan dan simpan jawabanmu.",
      step: 2,
      ...stepMeta[1],
    },
    {
      title: "Eksplorasi",
      desc: "Isi sesuai instruksi khusus tiap pertemuan.",
      step: 3,
      ...stepMeta[2],
    },
    {
      title: "Latihan Soal",
      desc: "Kuis pilihan ganda atau essay.",
      step: 4,
      ...stepMeta[3],
    },
    {
      title: "Bandingkan dan Perbaiki",
      desc: "Tinjau jawaban eksplorasi dan edit jika perlu.",
      step: 5,
      ...stepMeta[4],
    },
    {
      title: "Refleksi",
      desc: "Jawab pertanyaan penutup di textbox.",
      step: 6,
      ...stepMeta[5],
    },
  ];

  const meetingSteps = (steps.length > 0 ? steps : defaultSteps).map((item, index) => ({
    ...item,
    icon: item.icon || stepMeta[index]?.icon,
    accent: typeof item.accent === "boolean" ? item.accent : stepMeta[index]?.accent,
  }));

  const completed = 3;
  const progressPercent = Math.round((completed / meetingSteps.length) * 100);

  return (
    <AppLayout title={meeting?.title || `Pertemuan ${id}`} showTitleBar={false} showMobileNav={false}>
      <div className="course-shell">
        <div className="course-hero">
          <div>
            <h2 className="course-title">{meeting?.title || `Pertemuan ${id}`}</h2>
            <p className="course-description">
              {meeting?.description || "Mari belajar konsep dasar pada pertemuan ini dengan langkah yang terarah, ringkas, dan mudah diikuti."}
            </p>

            <div className="course-progress-label">
              {completed}/{meetingSteps.length} Selesai
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
          {meetingSteps.map((step, i) => (
            <div
              key={step.step || step.title}
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