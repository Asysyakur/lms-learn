import AppLayout from "@/Layouts/AppLayout";
import { Link, router } from "@inertiajs/react";
import { useEffect, useState } from "react";
import {
  ArrowPathIcon,
  BeakerIcon,
  BookOpenIcon,
  ChatBubbleLeftRightIcon,
  ClipboardDocumentCheckIcon,
  MagnifyingGlassIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/24/solid";
import StepOneObserve from "@/Pages/Pertemuan/StepOneObserve";
import StepTwoAsk from "@/Pages/Pertemuan/StepTwoAsk";
import StepThreeExploration from "@/Pages/Pertemuan/StepThreeExploration";
import StepFourPractice from "@/Pages/Pertemuan/StepFourPractice";
import StepFiveReview from "@/Pages/Pertemuan/StepFiveReview";
import StepSixReflection from "@/Pages/Pertemuan/StepSixReflection";

export default function StepPage({ id, meeting, step, steps = [], stepData }) {
  const [questionDraft, setQuestionDraft] = useState("");
  const [questionSaved, setQuestionSaved] = useState("");
  const [explorationDraft, setExplorationDraft] = useState("");
  const [explorationSaved, setExplorationSaved] = useState("");
  const [assessmentMode, setAssessmentMode] = useState("quiz");
  const [quizAnswer, setQuizAnswer] = useState("");
  const [essayAnswer, setEssayAnswer] = useState("");
  const [assessmentSaved, setAssessmentSaved] = useState("");
  const [reviewDraft, setReviewDraft] = useState("");
  const [reviewSaved, setReviewSaved] = useState("");
  const [reflectionDraft, setReflectionDraft] = useState("");
  const [reflectionSaved, setReflectionSaved] = useState("");

  const defaultSteps = [
    { title: "Mari Mengamati", desc: "Lihat PPT atau video yang sudah disiapkan.", icon: MagnifyingGlassIcon, accent: false, step: 1 },
    { title: "Ayo Bertanya", desc: "Tulis pertanyaan dan simpan jawabanmu.", icon: ChatBubbleLeftRightIcon, accent: true, step: 2 },
    { title: "Eksplorasi", desc: "Isi sesuai instruksi khusus tiap pertemuan.", icon: BeakerIcon, accent: false, step: 3 },
    { title: "Latihan Soal", desc: "Kuis pilihan ganda atau essay.", icon: ClipboardDocumentCheckIcon, accent: true, step: 4 },
    { title: "Bandingkan dan Perbaiki", desc: "Tinjau jawaban eksplorasi dan edit jika perlu.", icon: ArrowPathIcon, accent: false, step: 5 },
    { title: "Refleksi", desc: "Jawab pertanyaan penutup di textbox.", icon: QuestionMarkCircleIcon, accent: true, step: 6 },
  ];

  const stepItems = steps.length > 0 ? steps : defaultSteps;
  const activeStep = stepItems.find((item) => item.step === step) || stepItems[0];
  const currentStep = stepData || activeStep;
  const completedSteps = Math.max(0, step - 1);
  const progressPercent = Math.round((step / stepItems.length) * 100);

  const goToStep = (targetStep) => {
    router.visit(route("pertemuan.step", { id, step: targetStep }));
  };

  const saveQuestion = () => {
    setQuestionSaved(questionDraft.trim());
  };

  const saveExploration = () => {
    setExplorationSaved(explorationDraft.trim());
  };

  const saveAssessment = () => {
    const savedText = assessmentMode === "quiz" ? quizAnswer : essayAnswer;

    setAssessmentSaved(savedText.trim());
  };

  const saveReview = () => {
    setReviewSaved(reviewDraft.trim());
  };

  const saveReflection = () => {
    setReflectionSaved(reflectionDraft.trim());
  };

  useEffect(() => {
    if (step === 5) {
      setReviewDraft(explorationSaved);
    }
  }, [step, explorationSaved]);

  useEffect(() => {
    if (currentStep?.assessment_mode) {
      setAssessmentMode(currentStep.assessment_mode);
    }
  }, [currentStep?.assessment_mode]);

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return <StepOneObserve stepData={currentStep} onNext={() => goToStep(2)} />;
      case 2:
        return (
          <StepTwoAsk
            stepData={currentStep}
            questionDraft={questionDraft}
            setQuestionDraft={setQuestionDraft}
            questionSaved={questionSaved}
            onSave={saveQuestion}
            onNext={() => goToStep(3)}
          />
        );
      case 3:
        return (
          <StepThreeExploration
            stepData={currentStep}
            explorationDraft={explorationDraft}
            setExplorationDraft={setExplorationDraft}
            explorationSaved={explorationSaved}
            onSave={saveExploration}
            onNext={() => goToStep(4)}
          />
        );
      case 4:
        return (
          <StepFourPractice
            stepData={currentStep}
            assessmentMode={assessmentMode}
            setAssessmentMode={setAssessmentMode}
            quizAnswer={quizAnswer}
            setQuizAnswer={setQuizAnswer}
            essayAnswer={essayAnswer}
            setEssayAnswer={setEssayAnswer}
            assessmentSaved={assessmentSaved}
            onSave={saveAssessment}
          />
        );
      case 5:
        return (
          <StepFiveReview
            stepData={currentStep}
            explorationSaved={explorationSaved}
            reviewDraft={reviewDraft}
            setReviewDraft={setReviewDraft}
            reviewSaved={reviewSaved}
            onSave={saveReview}
            onNext={() => goToStep(6)}
          />
        );
      case 6:
      default:
        return (
          <StepSixReflection
            stepData={currentStep}
            reflectionDraft={reflectionDraft}
            setReflectionDraft={setReflectionDraft}
            reflectionSaved={reflectionSaved}
            onSave={saveReflection}
          />
        );
    }
  };

  return (
    <AppLayout
      title={`Pertemuan ${id}`}
      showTitleBar={false}
      showMobileNav={false}
      sidebarVariant="progress"
      sidebarProps={{
        courseTitle: meeting?.title || `Pertemuan ${id}`,
        courseId: id,
        steps: stepItems,
        activeStep: step,
        progressPercent,
        completedSteps,
      }}
    >
      <div className="course-shell">
        <div className="course-hero">
          <div>
            <div className="course-breadcrumb">{meeting?.title || `Pertemuan ${id}`} / Step {step}</div>
            <h2 className="course-title">{currentStep.title}</h2>
            <p className="course-description">{currentStep.desc}</p>

            <div className="course-progress-label">{completedSteps}/{stepItems.length} Selesai</div>
            <div className="course-progress-track">
              <div className="course-progress-fill" style={{ width: `${progressPercent}%` }} />
            </div>
          </div>

          <div className="course-hero-art">
            <div className="course-hero-badge">
              <BookOpenIcon className="h-20 w-20 text-[rgb(var(--color-primary))] sm:h-24 sm:w-24" />
            </div>
          </div>
        </div>

          <div className="course-detail-shell my-6 mx-4 sm:my-8 sm:mx-6">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <div className="text-sm font-semibold text-[rgb(var(--color-primary))]">Bagian aktif</div>
              <h3 className="text-lg font-bold text-slate-900">{currentStep.title}</h3>
              <p className="text-sm text-slate-600">{currentStep.desc}</p>
            </div>

            <Link className="course-secondary-button" href={route("pertemuan", { id })}>
              Kembali
            </Link>
          </div>

          {renderStepContent()}
        </div>
      </div>
    </AppLayout>
  );
}