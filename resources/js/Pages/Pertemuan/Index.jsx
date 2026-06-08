import AppLayout from "@/Layouts/AppLayout";
import { Link } from "@inertiajs/react";
import { BookOpenIcon } from "@heroicons/react/24/solid";
import { decorateMeetingSteps } from "@/data/meetingSteps";

export default function Pertemuan({
    id,
    meeting,
    steps = [],
    completedSteps = 0,
}) {
    const meetingSteps = decorateMeetingSteps(steps);
    const progressPercent =
        meetingSteps.length > 0
            ? Math.round((completedSteps / meetingSteps.length) * 100)
            : 0;
    const nextStep = meetingSteps[0]?.step || 1;

    return (
        <AppLayout
            title={meeting?.title || `Pertemuan ${id}`}
            showTitleBar={false}
        >
            <div className="course-shell">
                <div className="course-hero">
                    <div>
                        <div className="course-breadcrumb">Pertemuan</div>

                        <h2 className="course-title">
                            {meeting?.title || `Pertemuan ${id}`}
                        </h2>

                        <p className="course-description">
                            {meeting?.description ||
                                "Mari belajar konsep dasar pada pertemuan ini dengan langkah yang terarah, ringkas, dan mudah diikuti."}
                        </p>

                        <div className="course-progress-label">
                            {completedSteps}/{meetingSteps.length} Selesai
                        </div>

                        <div className="course-progress-track">
                            <div
                                className="course-progress-fill"
                                style={{ width: `${progressPercent}%` }}
                            />
                        </div>
                    </div>
                </div>

                <div className="course-step-list">
                    {meetingSteps.map((step) => {
                        const isUnlocked =
                            step.step === 1 || completedSteps >= step.step - 1;

                        const isCompleted = completedSteps >= step.step;

                        return (
                            <div
                                key={step.step || step.title}
                                className="course-step-card"
                            >
                                <div className="course-step-left">
                                    <div
                                        className={`course-step-icon ${step.accent ? "course-step-icon-blue" : ""}`}
                                    >
                                        <step.icon className="h-6 w-6" />
                                    </div>

                                    <div>
                                        <h3 className="course-step-title">
                                            {step.step}. {step.title}
                                        </h3>
                                        <p className="course-step-desc">
                                            {step.desc}
                                        </p>
                                    </div>
                                </div>

                                <Link
                                    className={`btn-primary course-step-button ${
                                        !isUnlocked
                                            ? "opacity-50 pointer-events-none"
                                            : ""
                                    }`}
                                    href={
                                        isUnlocked
                                            ? route("pertemuan.step", {
                                                  id,
                                                  step: step.step,
                                              })
                                            : "#"
                                    }
                                >
                                    {isCompleted
                                        ? "Ulangi"
                                        : isUnlocked
                                          ? "Mulai"
                                          : "Terkunci"}
                                </Link>
                            </div>
                        );
                    })}
                </div>
            </div>
        </AppLayout>
    );
}
