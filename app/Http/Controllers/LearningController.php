<?php

namespace App\Http\Controllers;

use App\Models\Meeting;
use App\Models\MeetingStep;
use App\Models\MeetingStepAsk;
use App\Models\MeetingStepAskResponse;
use App\Models\MeetingStepCompletion;
use App\Models\MeetingStepExploration;
use App\Models\MeetingStepExplorationResponse;
use App\Models\MeetingStepObservation;
use App\Models\MeetingStepObservationResponse;
use App\Models\MeetingStepPracticeResponse;
use App\Models\MeetingStepReflection;
use App\Models\MeetingStepReflectionResponse;
use App\Models\MeetingStepReview;
use App\Models\MeetingStepReviewResponse;
use App\Models\QuizAttempt;
use App\Models\QuizSet;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class LearningController extends Controller
{
    public function index()
    {
        $meetings = Meeting::query()
            ->with(['steps' => function ($query) {
                $query->orderBy('step_number');
            }])
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->get()
            ->map(function (Meeting $meeting) {
                return [
                    'id' => $meeting->id,
                    'title' => $meeting->title,
                    'description' => $meeting->description,
                    'meeting_number' => $meeting->meeting_number,
                    'step_count' => $meeting->steps->count(),
                    'cover_image' => $meeting->cover_image ?: '/images/learning-card.svg',
                ];
            });

        return Inertia::render('Beranda', [
            'title' => 'Materi Pelajaran PBO',
            'meetings' => $meetings,
        ]);
    }

    public function quizIndex()
    {
        $attempts = QuizAttempt::query()
            ->where('user_id', Auth::id())
            ->get()
            ->keyBy('quiz_set_id');

        $quizSets = QuizSet::query()
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->get()
            ->map(function (QuizSet $quizSet) use ($attempts) {
                $attempt = $attempts->get($quizSet->id);

                return [
                    'id' => $quizSet->id,
                    'title' => $quizSet->title,
                    'label' => $quizSet->quiz_type === 'pre-test' ? 'Pre-test' : 'Post-test',
                    'slug' => $quizSet->slug,
                    'quiz_type' => $quizSet->quiz_type,
                    'description' => $quizSet->description,
                    'image' => $quizSet->cover_image ?: ($quizSet->quiz_type === 'pre-test' ? '/images/pretest-card.svg' : '/images/posttest-card.svg'),
                    'attempt' => $attempt ? $this->formatQuizAttempt($attempt) : null,
                ];
            });

        return Inertia::render('Kuis/Index', [
            'quizSets' => $quizSets,
        ]);
    }

    public function quizShow(string $slug)
    {
        $quizSet = QuizSet::query()
            ->where('slug', $slug)
            ->with(['questions' => function ($query) {
                $query->orderBy('sort_order');
            }])
            ->firstOrFail();

        $attempt = QuizAttempt::query()
            ->where('quiz_set_id', $quizSet->id)
            ->where('user_id', Auth::id())
            ->first();

        return Inertia::render('Kuis/Show', [
            'quizSet' => [
                'id' => $quizSet->id,
                'title' => $quizSet->title,
                'slug' => $quizSet->slug,
                'quiz_type' => $quizSet->quiz_type,
                'description' => $quizSet->description,
                'image' => $quizSet->cover_image ?: ($quizSet->quiz_type === 'pre-test' ? '/images/pretest-card.svg' : '/images/posttest-card.svg'),
            ],
            'questions' => $quizSet->questions->map(function ($question) {
                return [
                    'id' => $question->id,
                    'question_text' => $question->question_text,
                    'options' => $question->options,
                ];
            })->values(),
            'attempt' => $attempt ? $this->formatQuizAttempt($attempt) : null,
        ]);
    }

    public function submitQuiz(Request $request, string $slug)
    {
        $quizSet = QuizSet::query()
            ->where('slug', $slug)
            ->where('is_active', true)
            ->with(['questions' => function ($query) {
                $query->orderBy('sort_order');
            }])
            ->firstOrFail();

        $existingAttempt = QuizAttempt::query()
            ->where('quiz_set_id', $quizSet->id)
            ->where('user_id', Auth::id())
            ->first();

        if ($existingAttempt) {
            return back()->with('error', 'Kuis ini sudah pernah dikerjakan. Setiap user hanya bisa mengerjakan satu kali.');
        }

        $validated = $request->validate([
            'answers' => ['required', 'array'],
            'answers.*' => ['nullable', 'string', 'max:5'],
        ]);

        $answers = $validated['answers'];
        $score = $quizSet->questions->reduce(function (int $result, $question) use ($answers) {
            $selectedAnswer = $answers[$question->id] ?? null;

            return $selectedAnswer === $question->correct_option ? $result + 1 : $result;
        }, 0);
        $totalQuestions = $quizSet->questions->count();
        $percentage = $totalQuestions > 0 ? round(($score / $totalQuestions) * 100, 2) : 0;

        QuizAttempt::create([
            'quiz_set_id' => $quizSet->id,
            'user_id' => Auth::id(),
            'answers' => $answers,
            'score' => $score,
            'total_questions' => $totalQuestions,
            'percentage' => $percentage,
            'submitted_at' => now(),
        ]);

        return redirect()->route('kuis')
            ->with('success', 'Jawaban kuis berhasil disimpan.');
    }

    public function meetingShow(string $id)
    {
        $meeting = Meeting::query()
            ->with([
                'steps' => function ($query) {
                    $query->orderBy('step_number');
                },
                'steps.observation',
                'steps.asks',
                'steps.exploration',
                'steps.practices',
                'steps.review',
                'steps.reflection',
            ])
            ->findOrFail($id);

        $steps = $meeting->steps->map(function (MeetingStep $step) use ($meeting) {
            return $this->formatMeetingStep($step, $meeting->steps);
        })->values();
        $completedSteps = $this->completedStepCount($meeting);

        return Inertia::render('Pertemuan/Index', [
            'id' => $meeting->id,
            'meeting' => [
                'id' => $meeting->id,
                'meeting_number' => $meeting->meeting_number,
                'title' => $meeting->title,
                'description' => $meeting->description,
            ],
            'steps' => $steps,
            'completedSteps' => $completedSteps,
        ]);
    }

    public function meetingStep(string $id, int $step)
    {
        $meeting = Meeting::query()
            ->with([
                'steps' => function ($query) {
                    $query->orderBy('step_number');
                },
                'steps.observation',
                'steps.asks',
                'steps.exploration',
                'steps.practices',
                'steps.review',
                'steps.reflection',
            ])
            ->findOrFail($id);

        $steps = $meeting->steps->map(function (MeetingStep $item) use ($meeting) {
            return $this->formatMeetingStep($item, $meeting->steps);
        })->values();

        $activeStep = $meeting->steps->firstWhere('step_number', $step);
        $currentCompletion = MeetingStepCompletion::query()
            ->where('meeting_id', $meeting->id)
            ->where('user_id', Auth::id())
            ->pluck('step_number')
            ->toArray();

        // CEK STEP SEBELUMNYA
        if ($step > 1) {

            $previousStep = $step - 1;

            if (!in_array($previousStep, $currentCompletion)) {

                return redirect()
                    ->route('pertemuan.step', [
                        'id' => $meeting->id,
                        'step' => $previousStep,
                    ])
                    ->with(
                        'error',
                        'Selesaikan step sebelumnya terlebih dahulu.'
                    );
            }
        }
        $completedSteps = $this->completedStepCount($meeting);
        $savedResponses = $this->savedResponsesForMeeting($meeting);

        if ($step == 5) {

            $practiceStep = $meeting->steps
                ->where('step_type', 'practice')
                ->first();

            if ($practiceStep) {

                $practiceResponse = MeetingStepPracticeResponse::query()
                    ->where('meeting_step_id', $practiceStep->id)
                    ->where('user_id', Auth::id())
                    ->first();

                if (
                    !$practiceResponse ||
                    !$practiceResponse->is_locked
                ) {

                    return redirect()
                        ->route('pertemuan.step', [
                            'id' => $meeting->id,
                            'step' => 4,
                        ])
                        ->with(
                            'error',
                            'Selesaikan latihan soal terlebih dahulu.'
                        );
                }
            }
        }

        return Inertia::render('Pertemuan/Show', [
            'id' => $meeting->id,
            'meeting' => [
                'id' => $meeting->id,
                'meeting_number' => $meeting->meeting_number,
                'title' => $meeting->title,
                'description' => $meeting->description,
            ],
            'step' => $step,
            'steps' => $steps,
            'stepData' => $activeStep ? $this->formatMeetingStep($activeStep, $meeting->steps) : null,
            'completedSteps' => $completedSteps,
            'savedResponses' => $savedResponses,
        ]);
    }

    public function completeMeetingStep(string $id, int $step)
    {
        $meeting = Meeting::query()
            ->with(['steps' => function ($query) {
                $query->orderBy('step_number');
            }])
            ->findOrFail($id);

        $meetingStep = $meeting->steps->firstWhere('step_number', $step);

        abort_unless($meetingStep, 404);

        MeetingStepCompletion::query()->updateOrCreate(
            [
                'meeting_id' => $meeting->id,
                'user_id' => Auth::id(),
                'step_number' => $step,
            ],
            [
                'completed_at' => now(),
            ]
        );

        return back();
    }

    public function saveMeetingStepResponse(Request $request, string $id, int $step)
    {
        $meeting = Meeting::query()
            ->with(['steps' => function ($query) {
                $query->orderBy('step_number');
            }])
            ->findOrFail($id);

        $meetingStep = $meeting->steps->firstWhere('step_number', $step);

        abort_unless($meetingStep, 404);

        $validated = $request->validate([
            'response_text' => ['nullable', 'string'],
            'ask_id' => ['nullable', 'integer'],
        ]);

        $responseText = $validated['response_text'] ?? null;
        $responsePayload = $request->input('response_payload');
        if (is_string($responsePayload)) {
            $decodedPayload = json_decode($responsePayload, true);
            $responsePayload = is_array($decodedPayload) ? $decodedPayload : [];
        }
        $askId = $validated['ask_id'] ?? null;
        $stepType = $meetingStep->step_type;
        $userId = Auth::id();

        // Route to appropriate response model based on step type
        if ($stepType === 'observe') {
            MeetingStepObservationResponse::query()->updateOrCreate(
                ['meeting_step_id' => $meetingStep->id, 'user_id' => $userId],
                [
                    'meeting_id' => $meeting->id,
                    'observation_text' => $responseText,
                    'observation_payload' => $responsePayload,
                    'observed_at' => now(),
                ]
            );
        } elseif ($stepType === 'ask') {

            $payload = $responsePayload ?? [];

            $items = $payload['items'] ?? [];

            foreach ($items as $item) {

                $ask = MeetingStepAsk::find($item['id']);

                if (!$ask) {
                    continue;
                }

                MeetingStepAskResponse::query()->updateOrCreate(
                    [
                        'meeting_step_id' => $meetingStep->id,
                        'meeting_step_ask_id' => $ask->id,
                        'user_id' => $userId,
                    ],
                    [
                        'meeting_id' => $meeting->id,

                        'answer_text' => $item['answer'] ?? null,

                        'answer_payload' => $item,

                        'answered_at' => now(),
                    ]
                );
            }
        } elseif ($stepType === 'exploration') {

            MeetingStepExplorationResponse::query()->updateOrCreate(
                [
                    'meeting_step_id' => $meetingStep->id,
                    'user_id' => $userId,

                    'mission_index' => ($responsePayload['type'] ?? null) === 'coding'
                        ? -1
                        : ($responsePayload['mission_index'] ?? 0),
                ],
                [
                    'meeting_id' => $meeting->id,

                    'exploration_text' =>
                    json_encode($responsePayload),

                    'exploration_payload' =>
                    $responsePayload,

                    'explored_at' => now(),
                ]
            );
        } elseif ($stepType === 'practice') {

            $payload = $responsePayload ?? [];

            $items = $payload['items'] ?? [];

            $practiceText = collect($items)
                ->map(function ($item, $index) {
                    return ($index + 1) . '. ' . ($item['answer'] ?? '-');
                })
                ->implode("\n");

            $existingPractice = MeetingStepPracticeResponse::query()
                ->where('meeting_step_id', $meetingStep->id)
                ->where('user_id', $userId)
                ->first();

            if ($existingPractice && $existingPractice->is_locked) {
                return back()->with(
                    'error',
                    'Jawaban sudah dikunci.'
                );
            }

            MeetingStepPracticeResponse::query()->updateOrCreate(
                [
                    'meeting_step_id' => $meetingStep->id,
                    'user_id' => $userId,
                ],
                [
                    'meeting_id' => $meeting->id,
                    'practice_text' => $practiceText,
                    'practice_payload' => $payload,
                    'is_locked' => true,
                    'practiced_at' => now(),
                ]
            );
        } elseif ($stepType === 'review') {
            $payload = $responsePayload ?? [];
            $items = collect($payload['items'] ?? [])
                ->values()
                ->map(function ($item, $index) use ($request) {

                    $itemId = $item['id'] ?? $index;

                    $evidenceFile = $request->file("response_payload.items.$index.evidence");
                    $evidence = $item['evidence'] ?? null;

                    if ($evidenceFile) {
                        $storedPath = $evidenceFile->store('review-evidence', 'public');
                        $evidence = '/storage/' . $storedPath;
                    }

                    return [

                        'practice_index' => (int) ($item['practice_index'] ?? $index),
                        'title' => $item['title'] ?? '',
                        'question' => $item['question'] ?? '',
                        'student_answer' => $item['student_answer'] ?? '',
                        'review_answer' => $item['review_answer'] ?? '',
                        'evidence' => $evidence,
                    ];
                })
                ->all();

            MeetingStepReviewResponse::query()->updateOrCreate(
                ['meeting_step_id' => $meetingStep->id, 'user_id' => $userId],
                [
                    'meeting_id' => $meeting->id,
                    'review_text' => $responseText,
                    'review_payload' => array_merge($payload, ['items' => $items]),
                    'reviewed_at' => now(),
                ]
            );
        } elseif ($stepType === 'reflection') {
            MeetingStepReflectionResponse::query()->updateOrCreate(
                ['meeting_step_id' => $meetingStep->id, 'user_id' => $userId],
                [
                    'meeting_id' => $meeting->id,
                    'reflection_text' => $responseText,
                    'reflection_payload' => $responsePayload,
                    'reflected_at' => now(),
                ]
            );
        }

        $isCompleted = $this->isStepCompleted(
            $meetingStep,
            $responsePayload,
            $responseText
        );

        if ($isCompleted) {
            $this->markStepCompleted($meeting->id, $step);
        }

        return back();
    }

    private function formatMeetingStep(MeetingStep $step, $allSteps = null): array
    {
        $base = [
            'id' => $step->id,

            'meeting_id' => $step->meeting_id,

            'step' => $step->step_number,

            'step_type' => $step->step_type,

            'title' => $step->title,

            'desc' => $step->description,
        ];

        switch ($step->step_type) {
            case 'observe':
                return array_merge($base, $this->formatObservationStep($step->observation));
            case 'ask':
                return array_merge($base, $this->formatAskStep($step));
            case 'exploration':
                return array_merge($base, $this->formatExplorationStep($step->exploration));
            case 'practice':
                return array_merge($base, $this->formatPracticeStep($step->practices));
            case 'review':
                return array_merge($base, $this->formatReviewStep($step, $allSteps));
            case 'reflection':
                return array_merge($base, $this->formatReflectionStep($step->reflection));
            default:
                return $base;
        }
    }

    private function completedStepCount(Meeting $meeting): int
    {
        return MeetingStepCompletion::query()
            ->where('meeting_id', $meeting->id)
            ->where('user_id', Auth::id())
            ->count();
    }

    private function savedResponsesForMeeting(Meeting $meeting): array
    {
        $userId = Auth::id();
        $responses = [];

        // Fetch all response types
        $observationResponses = MeetingStepObservationResponse::query()
            ->where('meeting_id', $meeting->id)
            ->where('user_id', $userId)
            ->with('meetingStep')
            ->get();

        $askResponses = MeetingStepAskResponse::query()
            ->where('meeting_id', $meeting->id)
            ->where('user_id', $userId)
            ->with(['meetingStep', 'ask'])
            ->get();

        $explorationResponses = MeetingStepExplorationResponse::query()
            ->where('meeting_id', $meeting->id)
            ->where('user_id', $userId)
            ->with('meetingStep')
            ->get();

        $practiceResponses = MeetingStepPracticeResponse::query()
            ->where('meeting_id', $meeting->id)
            ->where('user_id', $userId)
            ->with('meetingStep')
            ->get();

        $reviewResponses = MeetingStepReviewResponse::query()
            ->where('meeting_id', $meeting->id)
            ->where('user_id', $userId)
            ->with('meetingStep')
            ->get();

        $reflectionResponses = MeetingStepReflectionResponse::query()
            ->where('meeting_id', $meeting->id)
            ->where('user_id', $userId)
            ->with('meetingStep')
            ->get();

        // Map observation responses
        foreach ($observationResponses as $response) {
            $stepNumber = $response->meetingStep->step_number;

            $responses[$stepNumber] = [
                'response_text' => $response->observation_text,
                'response_payload' => $response->observation_payload,
            ];
        }

        // Map ask responses (can be multiple per step)
        foreach ($askResponses as $response) {
            $stepNumber = $response->meetingStep->step_number;
            if (!isset($responses[$stepNumber])) {
                $responses[$stepNumber] = [];
            }
            if (!isset($responses[$stepNumber]['ask_responses'])) {
                $responses[$stepNumber]['ask_responses'] = [];
            }
            $responses[$stepNumber]['ask_responses'][] = [
                'ask_id' => $response->meeting_step_ask_id,
                'answer_text' => $response->answer_text,
                'answer_payload' => $response->answer_payload,
            ];
        }

        // Map exploration responses
        foreach ($explorationResponses as $response) {

            $stepNumber =
                $response->meetingStep->step_number;

            if (!isset($responses[$stepNumber])) {
                $responses[$stepNumber] = [
                    'exploration_responses' => [],
                ];
            }

            $responses[$stepNumber]['exploration_responses'][] = [
                'mission_index' => $response->mission_index,
                'response_text' => $response->exploration_text,
                'response_payload' => $response->exploration_payload,
                'coding_answers' =>
                $response->exploration_payload['coding_answers'] ?? [],
            ];
        }

        // Map practice responses
        foreach ($practiceResponses as $response) {
            $stepNumber = $response->meetingStep->step_number;

            $responses[$stepNumber] = [
                'response_text' => $response->practice_text,
                'response_payload' => $response->practice_payload,
                'is_answer_locked' => $response->is_locked,
            ];
        }

        // Map review responses
        foreach ($reviewResponses as $response) {
            $stepNumber = $response->meetingStep->step_number;
            if (!isset($responses[$stepNumber])) {
                $responses[$stepNumber] = [];
            }

            $responses[$stepNumber]['response_text'] =
                $response->review_text;

            $responses[$stepNumber]['response_payload'] =
                $response->review_payload;
        }

        // Map reflection responses
        foreach ($reflectionResponses as $response) {
            $stepNumber = $response->meetingStep->step_number;
            $responses[$stepNumber] = [
                'response_text' => $response->reflection_text,
                'response_payload' => $response->reflection_payload,
            ];
        }

        return $responses;
    }

    private function formatObservationStep(?MeetingStepObservation $observation): array
    {
        return [
            'instruction_text' => optional($observation)->instruction_text,
            'resource_type' => optional($observation)->resource_type,
            'resource_url' => optional($observation)->resource_url,
        ];
    }

    private function formatAskStep(?MeetingStep $step): array
    {
        if (!$step) {
            return ['questions' => []];
        }

        $asks = $step->asks()->orderBy('order')->get();

        return [
            'questions' => $asks->map(function ($question) {
                return [
                    'id' => $question->id,
                    'question_prompt' => $question->question_prompt,
                    'order' => $question->order,
                ];
            })->values()->toArray(),
        ];
    }

    private function formatExplorationStep(?MeetingStepExploration $exploration): array
    {
        return [
            'code_language' => optional($exploration)->code_language,

            'exploration_prompt' =>
            optional($exploration)->exploration_prompt,
            'case_study_title' =>
            optional($exploration)->case_study_title,
            'case_study_description' =>
            optional($exploration)->case_study_description,
            'case_study_alert' =>
            optional($exploration)->case_study_alert,
            'materials' =>
            optional($exploration)->materials ?? [],
            'case_studies' =>
            optional($exploration)->case_studies ?? [],
            'missions' =>
            optional($exploration)->missions ?? [],
        ];
    }

    private function formatPracticeStep($practices): array
    {
        $allItems = collect($practices)->flatMap(function ($practice, $index) {

            $items = is_array($practice->assessment_items)
                ? $practice->assessment_items
                : [];

            if (count($items)) {
                return collect($items)->map(function ($item, $itemIndex) use ($practice, $index) {

                    return [
                        'id' => $item['id'] ?? ('practice-' . $index . '-' . $itemIndex),

                        'mode' => $item['mode'] ?? $practice->assessment_mode ?? 'essay',

                        'question_type' => $item['question_type'] ?? 'text',

                        'option_type' => $item['option_type'] ?? 'text',

                        'question_language' =>
                        $item['question_language'] ?? 'javascript',

                        'question' => $item['question'] ?? $practice->assessment_question,

                        'options' => $item['options'] ?? $practice->assessment_options ?? [],

                        'correct_answer' => $item['correct_answer'] ?? null,

                        'explanation' => $item['explanation'] ?? '',
                    ];
                });
            }

            return [[
                'id' => 'practice-' . ($index + 1),

                'mode' => $practice->assessment_mode ?: 'essay',

                'question_type' => $practice->question_type ?? 'text',

                'option_type' => $practice->option_type ?? 'text',

                'question_language' => $practice->question_language ?? 'javascript',

                'question' => $practice->assessment_question,

                'options' => $practice->assessment_options ?: [],

                'correct_answer' => $practice->assessment_correct_answer ?? null,

                'explanation' => $practice->assessment_explanation ?? '',
            ]];
        })->values()->toArray();

        return [
            'assessment_items' => $allItems,
        ];
    }

    private function formatReviewStep(MeetingStep $step, $allSteps = null): array
    {
        $practiceItems = [];

        if ($allSteps) {
            $practiceStep = collect($allSteps)
                ->filter(function (MeetingStep $candidate) use ($step) {
                    return $candidate->step_type === 'practice'
                        && $candidate->step_number < $step->step_number;
                })
                ->sortByDesc('step_number')
                ->first();

            $explorationStep = collect($allSteps)
                ->filter(function (MeetingStep $candidate) use ($step) {
                    return $candidate->step_type === 'exploration'
                        && $candidate->step_number < $step->step_number;
                })
                ->sortByDesc('step_number')
                ->first();

            if ($practiceStep && $practiceStep->practices) {

                $practiceItems = collect($practiceStep->practices)
                    ->flatMap(function ($practice, $practiceIndex) {

                        $items = is_array($practice->assessment_items)
                            ? $practice->assessment_items
                            : [];

                        if (count($items)) {
                            return collect($items)->map(function ($item, $itemIndex) use ($practiceIndex) {

                                $globalIndex = ($practiceIndex + $itemIndex);

                                return [
                                    'id' => $item['id'] ?? ('practice-' . $practiceIndex . '-' . $itemIndex),

                                    'practice_index' => $globalIndex,

                                    'title' => ($item['mode'] ?? 'essay') === 'essay'
                                        ? 'Essay'
                                        : 'Latihan Soal ' . ($globalIndex + 1),

                                    'question' => $item['question'] ?? '',

                                    'options' => $item['options'] ?? [],

                                    'question_type' => $item['question_type'] ?? 'text',

                                    'option_type' => $item['option_type'] ?? 'text',

                                    'question_language' => $item['question_language'] ?? 'javascript',

                                    'correct_answer' => $item['correct_answer'] ?? null,

                                    'explanation' => $item['explanation'] ?? '',
                                ];
                            });
                        }

                        return [[
                            'id' => 'practice-' . ($practiceIndex + 1),

                            'practice_index' => $practiceIndex,

                            'title' =>
                            $practice->assessment_mode === 'essay'
                                ? 'Essay'
                                : 'Latihan Soal ' . ($practiceIndex + 1),

                            'question' => $practice->assessment_question,

                            'options' => $practice->assessment_options ?? [],

                            'question_type' => $practice->question_type ?? 'text',

                            'option_type' => $practice->option_type ?? 'text',

                            'question_language' => $practice->question_language ?? 'javascript',

                            'correct_answer' => $practice->assessment_correct_answer,

                            'explanation' => $practice->assessment_explanation,
                        ]];
                    })
                    ->values()
                    ->all();
            }
        }

        $explorationResponses =
            MeetingStepExplorationResponse::query()
            ->where('meeting_step_id', $explorationStep?->id)
            ->where('user_id', Auth::id())
            ->get();

        $codingAnswers =
            $explorationResponses
            ->pluck('exploration_payload')
            ->map(fn($payload) => $payload['coding_answers'] ?? [])
            ->collapse()
            ->toArray();

        return [
            'instruction_text' => optional($step->review)->instruction_text,

            'review_items' =>
            optional($step->review)->review_items ?? [],

            'practice_items' => $practiceItems,

            'case_studies' =>
            optional($explorationStep?->exploration)->case_studies ?? [],

            // TAMBAHAN
            'coding_answers' => $codingAnswers,
        ];
    }

    private function formatReflectionStep(?MeetingStepReflection $reflection): array
    {
        return [
            'reflection_question' => optional($reflection)->reflection_question,
        ];
    }

    private function markStepCompleted(int $meetingId, int $step): void
    {
        MeetingStepCompletion::query()->updateOrCreate(
            [
                'meeting_id' => $meetingId,
                'user_id' => Auth::id(),
                'step_number' => $step,
            ],
            [
                'completed_at' => now(),
            ]
        );
    }

    private function formatQuizAttempt(QuizAttempt $attempt): array
    {
        return [
            'id' => $attempt->id,
            'answers' => $attempt->answers,
            'score' => $attempt->score,
            'total_questions' => $attempt->total_questions,
            'percentage' => (float) $attempt->percentage,
            'submitted_at' => optional($attempt->submitted_at)->toISOString(),
        ];
    }

    private function isStepCompleted(
        MeetingStep $meetingStep,
        $responsePayload,
        $responseText
    ): bool {

        switch ($meetingStep->step_type) {

            case 'observe':
                return true;

            case 'ask':

                $items = $responsePayload['items'] ?? [];

                if (!count($items)) {
                    return false;
                }

                foreach ($items as $item) {
                    if (empty(trim($item['answer'] ?? ''))) {
                        return false;
                    }
                }

                return true;

            case 'exploration':

                $items =
                    $responsePayload['items'] ?? [];

                $codingAnswers =
                    $responsePayload['coding_answers'] ?? [];

                /*
    |--------------------------------------------------------------------------
    | VALIDASI MISSION
    |--------------------------------------------------------------------------
    */

                if (
                    isset($responsePayload['mission_title'])
                ) {

                    // mission wajib ada isi
                    if (!count($items)) {
                        return false;
                    }

                    foreach ($items as $item) {

                        if (
                            empty(trim($item['answer'] ?? ''))
                        ) {
                            return false;
                        }
                    }
                }

                /*
    |--------------------------------------------------------------------------
    | VALIDASI CODING
    |--------------------------------------------------------------------------
    */

                if (
                    isset($responsePayload['type']) &&
                    $responsePayload['type'] === 'coding'
                ) {

                    if (!count($codingAnswers)) {
                        return false;
                    }

                    foreach ($codingAnswers as $code) {

                        if (empty(trim($code))) {
                            return false;
                        }
                    }
                }

                return true;

            case 'practice':

                $items = $responsePayload['items'] ?? [];

                foreach ($items as $item) {
                    if (empty(trim($item['answer'] ?? ''))) {
                        return false;
                    }
                }

                return true;

            case 'review':
                return true;

            case 'reflection':
                return !empty(trim($responseText));

            default:
                return false;
        }
    }
}
