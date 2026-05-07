import AppLayout from "@/Layouts/AppLayout";
import { Link, router } from "@inertiajs/react";
import { useEffect, useState } from "react";
import StepOneObserve from "@/Pages/Pertemuan/components/Observe";
import StepTwoAsk from "@/Pages/Pertemuan/components/Ask";
import StepThreeExploration from "@/Pages/Pertemuan/components/Exploration";
import StepFourPractice from "@/Pages/Pertemuan/components/Practice";
import StepFiveReview from "@/Pages/Pertemuan/components/Review";
import StepSixReflection from "@/Pages/Pertemuan/components/Reflection";
import { decorateMeetingSteps } from "@/data/meetingSteps";

export default function StepPage({
    id,
    meeting,
    step,
    steps = [],
    stepData,
    completedSteps = 0,
    savedResponses = {},
}) {
    const stepItems = decorateMeetingSteps(steps);
    const activeStep =
        stepItems.find((item) => item.step === step) || stepItems[0];
    const currentStep = stepData || activeStep;
    const [localCompletedSteps, setLocalCompletedSteps] =
        useState(completedSteps);
    const progressPercent =
        stepItems.length > 0
            ? Math.round((localCompletedSteps / stepItems.length) * 100)
            : 0;
    const currentStepIndex = stepItems.findIndex(
        (item) => item.step === currentStep?.step,
    );
    const stepByType = (type) =>
        stepItems.find((item) => item.step_type === type);
    const responseByType = (type) => {
        const typedStep = stepByType(type);

        return typedStep ? savedResponses[typedStep.step] : null;
    };
    const nextStepNumber = () => {
        return currentStepIndex >= 0
            ? stepItems[currentStepIndex + 1]?.step
            : null;
    };
    const nextStepTitle = () => {
        const next = stepItems.find((item) => item.step === nextStepNumber());
        return next ? `Lanjut ke ${next.title}` : "Selesai";
    };

    const savedCurrentResponse = currentStep
        ? savedResponses[currentStep.step]
        : null;
    const savedQuestionResponse =
        currentStep?.step_type === "ask"
            ? savedCurrentResponse?.response_text || ""
            : responseByType("ask")?.response_text || "";
    const savedExplorationResponse =
        currentStep?.step_type === "exploration"
            ? savedCurrentResponse?.response_text || ""
            : responseByType("exploration")?.response_text || "";
    const savedExplorationPayload =
        currentStep?.step_type === "exploration"
            ? savedCurrentResponse?.response_payload || null
            : responseByType("exploration")?.response_payload || null;
    const savedExplorationMode =
        savedExplorationPayload?.mode ||
        (stepByType("exploration")?.code_language ? "code_compile" : "analysis");
    const savedPracticeResponse =
        currentStep?.step_type === "practice"
            ? savedCurrentResponse
            : responseByType("practice") || null;
    const savedReviewResponse =
        currentStep?.step_type === "review"
            ? savedCurrentResponse?.response_text || ""
            : responseByType("review")?.response_text || "";
    const savedReflectionResponse =
        currentStep?.step_type === "reflection"
            ? savedCurrentResponse?.response_text || ""
            : responseByType("reflection")?.response_text || "";
    const savedPracticeMode =
        savedPracticeResponse?.response_payload?.mode ||
        currentStep?.assessment_mode ||
        "quiz";
    const savedPracticeAnswer =
        savedPracticeResponse?.response_payload?.answer ||
        savedPracticeResponse?.response_text ||
        "";
    const savedCodeLanguage =
        savedExplorationPayload?.language ||
        currentStep?.code_language ||
        "javascript";

    // Parse saved review response to extract code blocks
    const parseReviewResponse = (reviewText) => {
        try {
            const data = JSON.parse(reviewText);
            return {
                code1: data.code1 || "",
                code2: data.code2 || "",
                output1: data.output1 || "",
                output2: data.output2 || "",
            };
        } catch {
            return {
                code1: "",
                code2: "",
                output1: "",
                output2: "",
            };
        }
    };

    const savedReviewData = parseReviewResponse(savedReviewResponse);

    const [questionDraft, setQuestionDraft] = useState(savedQuestionResponse);
    const [questionSaved, setQuestionSaved] = useState(savedQuestionResponse);
    const [explorationDraft, setExplorationDraft] = useState(
        savedExplorationResponse,
    );
    const [explorationSaved, setExplorationSaved] = useState(
        savedExplorationResponse,
    );
    const [explorationCode, setExplorationCode] = useState(
        savedExplorationPayload?.code || "",
    );
    const [codeLanguage, setCodeLanguage] = useState(savedCodeLanguage);
    const [compileOutput, setCompileOutput] = useState(
        savedExplorationPayload?.output || "",
    );
    const [assessmentMode, setAssessmentMode] = useState(savedPracticeMode);
    const [quizAnswer, setQuizAnswer] = useState(
        savedPracticeMode === "quiz" ? savedPracticeAnswer : "",
    );
    const [essayAnswer, setEssayAnswer] = useState(
        savedPracticeMode === "essay" ? savedPracticeAnswer : "",
    );
    const [assessmentSaved, setAssessmentSaved] = useState(savedPracticeAnswer);
    const [reviewCode1, setReviewCode1] = useState(
        savedReviewData.code1 || currentStep?.review_code1 || "",
    );
    const [reviewCode2, setReviewCode2] = useState(
        savedReviewData.code2 || currentStep?.review_code2 || "",
    );
    const [reviewCode1Output, setReviewCode1Output] = useState(
        savedReviewData.output1,
    );
    const [reviewCode2Output, setReviewCode2Output] = useState(
        savedReviewData.output2,
    );
    const [codingLanguage, setCodingLanguage] = useState(
        currentStep?.review_code_language || savedCodeLanguage,
    );
    const [reviewSaved, setReviewSaved] = useState(savedReviewResponse);
    const [reflectionDraft, setReflectionDraft] = useState(
        savedReflectionResponse,
    );
    const [reflectionSaved, setReflectionSaved] = useState(
        savedReflectionResponse,
    );

    const goToStep = (targetStep) => {
        router.visit(route("pertemuan.step", { id, step: targetStep }));
    };

    const saveResponse = (targetStep, payload, onSuccess) => {
        router.post(
            route("pertemuan.step.response", { id, step: targetStep }),
            payload,
            {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => {
                    setLocalCompletedSteps((current) =>
                        Math.max(current, currentStepIndex + 1),
                    );

                    if (onSuccess) {
                        onSuccess();
                    }
                },
            },
        );
    };

    const completeStep = (currentStepNumber, callback) => {
        router.post(
            route("pertemuan.step.complete", { id, step: currentStepNumber }),
            {},
            {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => {
                    setLocalCompletedSteps((current) =>
                        Math.max(current, currentStepIndex + 1),
                    );

                    if (callback) {
                        callback();
                    }
                },
            },
        );
    };

    const saveQuestion = (onSuccess) => {
        const responseText = questionDraft.trim();

        saveResponse(currentStep.step, { response_text: responseText }, () => {
            setQuestionSaved(responseText);

            if (onSuccess) {
                onSuccess();
            }
        });
    };

    const saveExploration = (onSuccess) => {
        const isCompileMode = Boolean(currentStep?.code_language);
        const responseText = isCompileMode
            ? explorationCode.trim()
            : explorationDraft.trim();
        const payload = isCompileMode
            ? {
                  response_text: responseText,
                  response_payload: {
                      mode: "code_compile",
                      language: codeLanguage,
                      code: explorationCode,
                      output: compileOutput,
                  },
              }
            : { response_text: responseText };

        saveResponse(currentStep.step, payload, () => {
            setExplorationSaved(responseText);

            if (onSuccess) {
                onSuccess();
            }
        });
    };

    const saveAssessment = (onSuccess) => {
        const activeMode = currentStep?.assessment_mode || assessmentMode;
        const savedText = activeMode === "quiz" ? quizAnswer : essayAnswer;

        saveResponse(
            currentStep.step,
            {
                response_text: savedText.trim(),
                response_payload: {
                    mode: activeMode,
                    answer: savedText.trim(),
                },
            },
            () => {
                setAssessmentSaved(savedText.trim());

                if (onSuccess) {
                    onSuccess();
                }
            },
        );
    };

    const saveReview = (onSuccess) => {
        const isCompileMode = Boolean(
            currentStep?.review_code_language ||
                currentStep?.code_language ||
                reviewCode1 ||
                reviewCode2,
        );
        let responseText = "";

        if (isCompileMode) {
            responseText = JSON.stringify({
                code1: reviewCode1.trim(),
                code2: reviewCode2.trim(),
                output1: reviewCode1Output,
                output2: reviewCode2Output,
            });
        } else {
            responseText = "";
        }

        saveResponse(currentStep.step, { response_text: responseText }, () => {
            setReviewSaved(responseText);

            if (onSuccess) {
                onSuccess();
            }
        });
    };

    const saveReflection = (onSuccess) => {
        const responseText = reflectionDraft.trim();

        saveResponse(currentStep.step, { response_text: responseText }, () => {
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
        setExplorationCode(savedExplorationPayload?.code || "");
        setCodeLanguage(savedCodeLanguage);
        setCompileOutput(savedExplorationPayload?.output || "");
        setAssessmentMode(savedPracticeMode);
        setQuizAnswer(savedPracticeMode === "quiz" ? savedPracticeAnswer : "");
        setEssayAnswer(
            savedPracticeMode === "essay" ? savedPracticeAnswer : "",
        );
        setAssessmentSaved(savedPracticeAnswer);
        setReviewCode1(savedReviewData.code1 || currentStep?.review_code1 || "");
        setReviewCode2(savedReviewData.code2 || currentStep?.review_code2 || "");
        setReviewCode1Output(savedReviewData.output1);
        setReviewCode2Output(savedReviewData.output2);
        setCodingLanguage(currentStep?.review_code_language || savedCodeLanguage);
        setReviewSaved(savedReviewResponse);
        setReflectionDraft(savedReflectionResponse);
        setReflectionSaved(savedReflectionResponse);
    }, [
        savedQuestionResponse,
        savedExplorationResponse,
        savedExplorationPayload?.code,
        savedExplorationPayload?.output,
        savedCodeLanguage,
        savedPracticeMode,
        savedPracticeAnswer,
        savedReviewResponse,
        savedReflectionResponse,
        step,
    ]);

    const renderStepContent = () => {
        const next = nextStepNumber();
        const goNext = () => {
            if (next) {
                goToStep(next);
            }
        };

        switch (currentStep?.step_type) {
            case "observe":
                return (
                    <StepOneObserve
                        stepData={currentStep}
                        nextLabel={nextStepTitle()}
                        onNext={() => completeStep(currentStep.step, goNext)}
                    />
                );
            case "ask":
                return (
                    <StepTwoAsk
                        stepData={currentStep}
                        questionDraft={questionDraft}
                        setQuestionDraft={setQuestionDraft}
                        questionSaved={questionSaved}
                        onSave={saveQuestion}
                        nextLabel={nextStepTitle()}
                        onNext={() => saveQuestion(goNext)}
                    />
                );
            case "exploration":
                return (
                    <StepThreeExploration
                        stepData={currentStep}
                        explorationDraft={explorationDraft}
                        setExplorationDraft={setExplorationDraft}
                        explorationCode={explorationCode}
                        setExplorationCode={setExplorationCode}
                        codeLanguage={codeLanguage}
                        setCodeLanguage={setCodeLanguage}
                        compileOutput={compileOutput}
                        setCompileOutput={setCompileOutput}
                        explorationSaved={explorationSaved}
                        onSave={saveExploration}
                        nextLabel={nextStepTitle()}
                        onNext={() => saveExploration(goNext)}
                    />
                );
            case "practice":
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
            case "review":
                return (
                    <StepFiveReview
                        stepData={currentStep}
                        explorationSaved={explorationSaved}
                        explorationMode={savedExplorationMode}
                        explorationOutput={
                            savedExplorationPayload?.output || ""
                        }
                        reviewCode1={reviewCode1}
                        setReviewCode1={setReviewCode1}
                        reviewCode1Output={reviewCode1Output}
                        setReviewCode1Output={setReviewCode1Output}
                        reviewCode2={reviewCode2}
                        setReviewCode2={setReviewCode2}
                        reviewCode2Output={reviewCode2Output}
                        setReviewCode2Output={setReviewCode2Output}
                        codeLanguage={codingLanguage}
                        setCodingLanguage={setCodingLanguage}
                        onSave={saveReview}
                        nextLabel={nextStepTitle()}
                        onNext={() => saveReview(goNext)}
                    />
                );
            case "reflection":
                return (
                    <StepSixReflection
                        stepData={currentStep}
                        reflectionDraft={reflectionDraft}
                        setReflectionDraft={setReflectionDraft}
                        reflectionSaved={reflectionSaved}
                        onSave={saveReflection}
                    />
                );
            default:
                return (
                    <div className="course-detail-card space-y-3">
                        <h3 className="course-detail-title">
                            {currentStep?.title || "Step"}
                        </h3>
                        <p className="course-detail-text">
                            Tipe step ini belum punya tampilan khusus. Hubungi
                            admin untuk menyesuaikan konfigurasi step.
                        </p>
                        <button
                            className="btn-primary w-full sm:w-auto"
                            onClick={() =>
                                completeStep(currentStep.step, goNext)
                            }
                        >
                            {nextStepTitle()}
                        </button>
                    </div>
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
                showProgressCard: true,
                progressDetail: `${localCompletedSteps} dari ${stepItems.length} materi selesai`,
                progressActionLabel: "Kembali ke overview",
                progressActionHref: route("pertemuan", { id }),
            }}
        >
            <div className="course-shell pb-6 sm:pb-8">
                <div className="course-hero">
                    <div>
                        <div className="course-breadcrumb">
                            {meeting?.title || `Pertemuan ${id}`} / Step {step}
                        </div>
                        <h2 className="course-title">{currentStep.title}</h2>
                        <p className="course-description">{currentStep.desc}</p>
                    </div>
                </div>

                <div className="mx-4 mt-6 sm:mx-6 sm:mt-8">
                    {renderStepContent()}
                </div>
            </div>
        </AppLayout>
    );
}
