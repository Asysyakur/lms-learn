import AppLayout from "@/Layouts/AppLayout";
import { Link, router } from "@inertiajs/react";
import { useEffect, useState } from "react";
import {
  BookOpenIcon,
} from "@heroicons/react/24/solid";
import StepOneObserve from "@/Pages/Pertemuan/StepOneObserve";
import StepTwoAsk from "@/Pages/Pertemuan/StepTwoAsk";
import StepThreeExploration from "@/Pages/Pertemuan/StepThreeExploration";
import StepFourPractice from "@/Pages/Pertemuan/StepFourPractice";
import StepFiveReview from "@/Pages/Pertemuan/StepFiveReview";
import StepSixReflection from "@/Pages/Pertemuan/StepSixReflection";
import { decorateMeetingSteps } from "@/data/meetingSteps";

export default function StepPage({ id, meeting, step, steps = [], stepData, completedSteps = 0, savedResponses = {} }) {
  const savedQuestionResponse = savedResponses[2]?.response_text || "";
  const savedExplorationResponse = savedResponses[3]?.response_text || "";
  const savedPracticeResponse = savedResponses[4] || null;
  const savedReviewResponse = savedResponses[5]?.response_text || "";
  const savedReflectionResponse = savedResponses[6]?.response_text || "";
  const savedPracticeMode = savedPracticeResponse?.response_payload?.mode || stepData?.assessment_mode || "quiz";
  const savedPracticeAnswer = savedPracticeResponse?.response_payload?.answer || savedPracticeResponse?.response_text || "";

  const [questionDraft, setQuestionDraft] = useState(savedQuestionResponse);
  const [questionSaved, setQuestionSaved] = useState(savedQuestionResponse);
  const [explorationDraft, setExplorationDraft] = useState(savedExplorationResponse);
  const [explorationSaved, setExplorationSaved] = useState(savedExplorationResponse);
  const [assessmentMode, setAssessmentMode] = useState(savedPracticeMode);
  const [quizAnswer, setQuizAnswer] = useState(savedPracticeMode === "quiz" ? savedPracticeAnswer : "");
  const [essayAnswer, setEssayAnswer] = useState(savedPracticeMode === "essay" ? savedPracticeAnswer : "");
  const [assessmentSaved, setAssessmentSaved] = useState(savedPracticeAnswer);
  const [reviewDraft, setReviewDraft] = useState(savedReviewResponse || savedExplorationResponse);
  const [reviewSaved, setReviewSaved] = useState(savedReviewResponse);
  const [reflectionDraft, setReflectionDraft] = useState(savedReflectionResponse);
  const [reflectionSaved, setReflectionSaved] = useState(savedReflectionResponse);

  const [localCompletedSteps, setLocalCompletedSteps] = useState(completedSteps);

  const stepItems = decorateMeetingSteps(steps);
  const activeStep = stepItems.find((item) => item.step === step) || stepItems[0];
  const currentStep = stepData || activeStep;
  const progressPercent = stepItems.length > 0 ? Math.round((localCompletedSteps / stepItems.length) * 100) : 0;

  const goToStep = (targetStep) => {
    router.visit(route("pertemuan.step", { id, step: targetStep }));
  };

  const saveResponse = (targetStep, payload, onSuccess) => {
    router.post(route("pertemuan.step.response", { id, step: targetStep }), payload, {
      preserveScroll: true,
      preserveState: true,
      onSuccess: () => {
        setLocalCompletedSteps((current) => Math.max(current, targetStep));

        if (onSuccess) {
          onSuccess();
        }
      },
    });
  };

  const completeStep = (currentStepNumber, callback) => {
    router.post(
      route("pertemuan.step.complete", { id, step: currentStepNumber }),
      {},
      {
        preserveScroll: true,
        preserveState: true,
        onSuccess: () => {
          setLocalCompletedSteps((current) => Math.max(current, currentStepNumber));

          if (callback) {
            callback();
          }
        },
      },
    );
  };

  const saveQuestion = (onSuccess) => {
    const responseText = questionDraft.trim();

    saveResponse(2, { response_text: responseText }, () => {
      setQuestionSaved(responseText);

      if (onSuccess) {
        onSuccess();
      }
    });
  };

  const saveExploration = (onSuccess) => {
    const responseText = explorationDraft.trim();

    saveResponse(3, { response_text: responseText }, () => {
      setExplorationSaved(responseText);

      if (onSuccess) {
        onSuccess();
      }
    });
  };

  const saveAssessment = (onSuccess) => {
    const savedText = assessmentMode === "quiz" ? quizAnswer : essayAnswer;

    saveResponse(4, {
      response_text: savedText.trim(),
      response_payload: {
        mode: assessmentMode,
        answer: savedText.trim(),
      },
    }, () => {
      setAssessmentSaved(savedText.trim());

      if (onSuccess) {
        onSuccess();
      }
    });
  };

  const saveReview = (onSuccess) => {
    const responseText = reviewDraft.trim();

    saveResponse(5, { response_text: responseText }, () => {
      setReviewSaved(responseText);

      if (onSuccess) {
        onSuccess();
      }
    });
  };

  const saveReflection = (onSuccess) => {
    const responseText = reflectionDraft.trim();

    saveResponse(6, { response_text: responseText }, () => {
      setReflectionSaved(responseText);

      if (onSuccess) {
        onSuccess();
      }
    });
  };

  useEffect(() => {
    if (currentStep?.assessment_mode) {
      setAssessmentMode(currentStep.assessment_mode);
    }
  }, [currentStep?.assessment_mode]);

  useEffect(() => {
    setLocalCompletedSteps(completedSteps);
  }, [completedSteps]);

  useEffect(() => {
    setQuestionDraft(savedQuestionResponse);
    setQuestionSaved(savedQuestionResponse);
    setExplorationDraft(savedExplorationResponse);
    setExplorationSaved(savedExplorationResponse);
    setAssessmentMode(savedPracticeMode);
    setQuizAnswer(savedPracticeMode === "quiz" ? savedPracticeAnswer : "");
    setEssayAnswer(savedPracticeMode === "essay" ? savedPracticeAnswer : "");
    setAssessmentSaved(savedPracticeAnswer);
    setReviewDraft(savedReviewResponse || savedExplorationResponse);
    setReviewSaved(savedReviewResponse);
    setReflectionDraft(savedReflectionResponse);
    setReflectionSaved(savedReflectionResponse);
  }, [savedQuestionResponse, savedExplorationResponse, savedPracticeMode, savedPracticeAnswer, savedReviewResponse, savedReflectionResponse, step]);

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return <StepOneObserve stepData={currentStep} onNext={() => completeStep(1, () => goToStep(2))} />;
      case 2:
        return (
          <StepTwoAsk
            stepData={currentStep}
            questionDraft={questionDraft}
            setQuestionDraft={setQuestionDraft}
            questionSaved={questionSaved}
            onSave={saveQuestion}
            onNext={() => saveQuestion(() => goToStep(3))}
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
            onNext={() => saveExploration(() => goToStep(4))}
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
            onNext={() => saveReview(() => goToStep(6))}
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
        completedSteps: localCompletedSteps,
      }}
    >
      <div className="course-shell">
        <div className="course-hero">
          <div>
            <div className="course-breadcrumb">{meeting?.title || `Pertemuan ${id}`} / Step {step}</div>
            <h2 className="course-title">{currentStep.title}</h2>
            <p className="course-description">{currentStep.desc}</p>

            <div className="course-progress-label">{localCompletedSteps}/{stepItems.length} Selesai</div>
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