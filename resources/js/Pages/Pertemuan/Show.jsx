import AppLayout from "@/Layouts/AppLayout";
import { router } from "@inertiajs/react";
import { useEffect, useMemo, useState } from "react";
import StepOneObserve from "@/Pages/Pertemuan/components/Observe";
import StepTwoAsk from "@/Pages/Pertemuan/components/Ask";
import StepThreeExploration from "@/Pages/Pertemuan/components/Exploration";
import StepFourPractice from "@/Pages/Pertemuan/components/Practice";
import StepFiveReview from "@/Pages/Student/Steps/StepFiveReview";
import StepSixReflection from "@/Pages/Pertemuan/components/Reflection";
import { decorateMeetingSteps } from "@/data/meetingSteps";

function extractPracticeAnswer(response) {
    const payload = response?.response_payload;

    if (!payload) {
        return "";
    }

    if (payload.items) {
        return payload.items
            .map((item, index) => `${index + 1}. ${item.answer || ""}`)
            .join("\n");
    }

    if (payload.answers) {
        return response?.response_text || "";
    }

    if (payload.answer) {
        return payload.answer;
    }

    return response?.response_text || "";
}

function normalizeText(value) {
    return String(value ?? "")
        .trim()
        .replace(/\s+/g, " ");
}

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

    // Handle multiple ask responses
    const savedAskResponses = useMemo(() => {
        return currentStep?.step_type === "ask" &&
            savedCurrentResponse?.ask_responses
            ? savedCurrentResponse.ask_responses.reduce((acc, resp) => {
                  acc[resp.ask_id] = resp.answer_text;
                  return acc;
              }, {})
            : {};
    }, [currentStep?.step_type, savedCurrentResponse]);

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
    const savedPracticeResponse =
        currentStep?.step_type === "practice"
            ? savedCurrentResponse
            : responseByType("practice") || null;
    const savedReflectionResponse =
        currentStep?.step_type === "reflection"
            ? savedCurrentResponse?.response_text || ""
            : responseByType("reflection")?.response_text || "";
    const savedPracticeMode =
        savedPracticeResponse?.response_payload?.mode ||
        currentStep?.assessment_mode ||
        "quiz";
    const savedPracticeAnswer = extractPracticeAnswer(savedPracticeResponse);
    const practiceItems =
        currentStep?.step_type === "review" &&
        currentStep?.practice_items?.length
            ? currentStep.practice_items.map((item, index) => ({
                  practice_index: Number(item.practice_index ?? index),
                  title: item.title || `Latihan Soal ${index + 1}`,
                  question: item.question || "",
              }))
            : currentStep?.assessment_items?.length
              ? currentStep.assessment_items
              : [
                {
                        id: "practice-1",
                        mode: currentStep?.assessment_mode || "quiz",
                        question: currentStep?.assessment_question || "",
                        options: currentStep?.assessment_options || [],
                },
            ];
    const savedPracticeItems =
        savedPracticeResponse?.response_payload?.items || [];
    const savedPracticeAnswers = savedPracticeResponse?.response_payload?.items
        ? savedPracticeResponse.response_payload.items.reduce((acc, item) => {
              acc[item.id] = item.answer || "";
              return acc;
          }, {})
        : {};
    const savedCodeLanguage =
        savedExplorationPayload?.language ||
        currentStep?.code_language ||
        "javascript";

    const [questionDraft, setQuestionDraft] = useState(savedQuestionResponse);
    const [questionSaved, setQuestionSaved] = useState(
        currentStep?.questions?.length > 0
            ? savedAskResponses
            : savedQuestionResponse,
    );
    const [askAnswerDrafts, setAskAnswerDrafts] = useState(savedAskResponses);
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
    const [assessmentAnswers, setAssessmentAnswers] =
        useState(savedPracticeAnswers);

    const [reflectionDraft, setReflectionDraft] = useState(
        savedReflectionResponse,
    );
    const [reflectionSaved, setReflectionSaved] = useState(
        savedReflectionResponse,
    );

    const goToStep = (targetStep) => {
        router.visit(route("pertemuan.step", { id, step: targetStep }));
    };

    const goToOverview = () => {
        router.visit(route("pertemuan", { id }));
    };

    const saveResponse = (targetStep, payload, onSuccess, options = {}) => {
        router.post(
            route("pertemuan.step.response", { id, step: targetStep }),
            payload,
            {
                preserveScroll: true,
                preserveState: true,
                ...options,
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
        if (!currentStep?.questions?.length) {
            const responseText = questionDraft.trim();

            saveResponse(
                currentStep.step,
                { response_text: responseText },
                () => {
                    setQuestionSaved(responseText);

                    if (typeof onSuccess === "function") {
                        onSuccess();
                    }
                },
            );

            return;
        }

        const items = currentStep.questions.map((question) => ({
            id: question.id,
            question: question.question_prompt,
            answer: (askAnswerDrafts[question.id] || "").trim(),
        }));

        const savedText = items
            .map((item, index) => {
                return `${index + 1}. ${item.answer}`;
            })
            .join("\n");

        saveResponse(
            currentStep.step,
            {
                response_text: savedText,

                response_payload: {
                    items,
                },
            },
            () => {
                const mapped = {};

                currentStep.questions.forEach((q, index) => {
                    mapped[q.id] = items[index]?.answer || "";
                });

                setQuestionSaved(mapped);

                if (typeof onSuccess === "function") {
                    onSuccess();
                }
            },
        );
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
        const firstItem = practiceItems[0] || {};

        const activeMode =
            firstItem.mode || currentStep?.assessment_mode || assessmentMode;

        const items = practiceItems.map((item) => ({
            id: item.id,
            question: item.question,
            answer: (assessmentAnswers[item.id] || "").trim(),
        }));

        const savedText = items
            .map((item, index) => {
                return `${index + 1}. ${item.answer}`;
            })
            .join("\n")
            .trim();

        saveResponse(
            currentStep.step,
            {
                response_text: savedText,

                response_payload: {
                    mode: activeMode,

                    items,
                },
            },
            () => {
                setAssessmentSaved(savedText);

                if (typeof onSuccess === "function") {
                    onSuccess();
                }
            },
        );
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
        if (
            currentStep?.step_type === "ask" &&
            currentStep?.questions?.length > 0
        ) {
            setQuestionDraft("");
            setQuestionSaved(savedAskResponses);
        } else {
            setQuestionDraft(savedQuestionResponse);
            setQuestionSaved(savedQuestionResponse);
        }
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
        setAssessmentAnswers(savedPracticeAnswers);
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
        savedReflectionResponse,
        savedAskResponses,
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
                        askAnswerDrafts={askAnswerDrafts}
                        setAskAnswerDrafts={setAskAnswerDrafts}
                        onSave={saveQuestion}
                        onNext={goNext}
                    />
                );
            case "exploration":
                return (
                    <StepThreeExploration
                        stepData={currentStep}
                        nextLabel={nextStepTitle()}
                        savedResponses={savedResponses}
                        onNext={() => saveExploration(goNext)}
                    />
                );
            case "practice":
                return (
                    <StepFourPractice
                        stepData={{
                            ...stepData,
                            is_answer_locked:
                                savedResponses?.[4]?.is_answer_locked || false,
                        }}
                        quizAnswer={quizAnswer}
                        setQuizAnswer={setQuizAnswer}
                        essayAnswer={essayAnswer}
                        setEssayAnswer={setEssayAnswer}
                        assessmentAnswers={assessmentAnswers}
                        setAssessmentAnswers={setAssessmentAnswers}
                        assessmentSaved={assessmentSaved}
                        onSave={saveAssessment}
                        onNext={() => saveAssessment(goNext)}
                        nextLabel={nextStepTitle()}
                    />
                );
            case "review":
                return (
                    <StepFiveReview
                        meetingId={id}
                        stepNumber={currentStep.step}
                        stepData={currentStep}
                        savedResponse={savedCurrentResponse}
                        practiceResponses={practiceItems.map((item, index) => {
                            const normalizedQuestion = normalizeText(
                                item.question,
                            );
                            const matched =
                                savedPracticeItems.find((savedItem, savedIndex) => {
                                    const savedQuestion = normalizeText(
                                        savedItem.question,
                                    );
                                    const savedPracticeIndex = Number(
                                        savedItem.practice_index ?? savedIndex,
                                    );

                                    return (
                                        savedItem.id === item.id ||
                                        savedPracticeIndex === index ||
                                        savedQuestion === normalizedQuestion
                                    );
                                }) || savedPracticeItems[index];

                            return {
                                practice_index: item.practice_index ?? index,
                                question: item.question,
                                answer:
                                    matched?.answer ??
                                    matched?.student_answer ??
                                    "",
                            };
                        })}
                        nextLabel={nextStepTitle()}
                        onNext={goNext}
                    />
                );
            case "reflection":
                return (
                    <StepSixReflection
                        stepData={currentStep}
                        reflectionDraft={reflectionDraft}
                        setReflectionDraft={setReflectionDraft}
                        reflectionSaved={reflectionSaved}
                        onSave={() => saveReflection(goToOverview)}
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
                            className="course-step-primary-button w-full sm:w-auto"
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
