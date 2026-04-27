<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Meeting;
use App\Models\MeetingStep;
use App\Models\MeetingStepAsk;
use App\Models\MeetingStepCompletion;
use App\Models\MeetingStepExploration;
use App\Models\MeetingStepObservation;
use App\Models\MeetingStepPractice;
use App\Models\MeetingStepReflection;
use App\Models\MeetingStepResponse;
use App\Models\MeetingStepReview;
use App\Models\QuizSet;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class LearningController extends Controller
{
    public function index()
    {
        $course = Course::query()
            ->with(['meetings.steps' => function ($query) {
                $query->orderBy('sort_order');
            }])
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->first();

        $meetings = $course
            ? $course->meetings->sortBy('sort_order')->values()->map(function (Meeting $meeting) {
                return [
                    'id' => $meeting->id,
                    'title' => $meeting->title,
                    'description' => $meeting->description,
                    'meeting_number' => $meeting->meeting_number,
                    'step_count' => $meeting->steps->count(),
                    'cover_image' => '/images/learning-card.svg',
                ];
            })
            : collect();

        return Inertia::render('Beranda', [
            'course' => $course?->only(['id', 'title', 'slug', 'description']),
            'meetings' => $meetings,
        ]);
    }

    public function quizIndex()
    {
        $quizSets = QuizSet::query()
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->get()
            ->map(function (QuizSet $quizSet) {
                return [
                    'id' => $quizSet->id,
                    'title' => $quizSet->title,
                    'label' => $quizSet->quiz_type === 'pre-test' ? 'Pre-test' : 'Post-test',
                    'slug' => $quizSet->slug,
                    'quiz_type' => $quizSet->quiz_type,
                    'description' => $quizSet->description,
                    'image' => $quizSet->cover_image,
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

        return Inertia::render('Kuis/Show', [
            'quizSet' => [
                'id' => $quizSet->id,
                'title' => $quizSet->title,
                'slug' => $quizSet->slug,
                'quiz_type' => $quizSet->quiz_type,
                'description' => $quizSet->description,
                'image' => $quizSet->cover_image,
            ],
            'questions' => $quizSet->questions->map(function ($question) {
                return [
                    'id' => $question->id,
                    'question_text' => $question->question_text,
                    'options' => $question->options,
                    'correct_option' => $question->correct_option,
                ];
            })->values(),
        ]);
    }

    public function meetingShow(string $id)
    {
        $meeting = Meeting::query()
            ->with([
                'steps' => function ($query) {
                    $query->orderBy('sort_order');
                },
                'steps.observation',
                'steps.ask',
                'steps.exploration',
                'steps.practice',
                'steps.review',
                'steps.reflection',
            ])
            ->findOrFail($id);

        $steps = $meeting->steps->map(function (MeetingStep $step) {
            return $this->formatMeetingStep($step);
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
                    $query->orderBy('sort_order');
                },
                'steps.observation',
                'steps.ask',
                'steps.exploration',
                'steps.practice',
                'steps.review',
                'steps.reflection',
            ])
            ->findOrFail($id);

        $steps = $meeting->steps->map(function (MeetingStep $item) {
            return $this->formatMeetingStep($item);
        })->values();

        $activeStep = $meeting->steps->firstWhere('step_number', $step);
        $completedSteps = $this->completedStepCount($meeting);
        $savedResponses = $this->savedResponsesForMeeting($meeting);

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
            'stepData' => $activeStep ? $this->formatMeetingStep($activeStep) : null,
            'completedSteps' => $completedSteps,
            'savedResponses' => $savedResponses,
        ]);
    }

    public function completeMeetingStep(string $id, int $step)
    {
        $meeting = Meeting::query()
            ->with(['steps' => function ($query) {
                $query->orderBy('sort_order');
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
                $query->orderBy('sort_order');
            }])
            ->findOrFail($id);

        $meetingStep = $meeting->steps->firstWhere('step_number', $step);

        abort_unless($meetingStep, 404);

        $validated = $request->validate([
            'response_text' => ['nullable', 'string'],
            'response_payload' => ['nullable', 'array'],
        ]);

        $responseType = $meetingStep->step_type;
        $responseText = $validated['response_text'] ?? null;
        $responsePayload = $validated['response_payload'] ?? null;

        if ($responseType === 'practice' && ! $responsePayload) {
            $responsePayload = [
                'mode' => $meetingStep->practice?->assessment_mode ?? 'quiz',
                'answer' => $responseText,
            ];
        }

        MeetingStepResponse::query()->updateOrCreate(
            [
                'meeting_id' => $meeting->id,
                'meeting_step_id' => $meetingStep->id,
                'user_id' => Auth::id(),
                'response_type' => $responseType,
            ],
            [
                'response_text' => $responseText,
                'response_payload' => $responsePayload,
                'completed_at' => now(),
            ]
        );

        $this->markStepCompleted($meeting->id, $step);

        return back();
    }

    private function formatMeetingStep(MeetingStep $step): array
    {
        $base = [
            'id' => $step->id,
            'step' => $step->step_number,
            'step_type' => $step->step_type,
            'title' => $step->title,
            'desc' => $step->description,
        ];

        return match ($step->step_type) {
            'observe' => array_merge($base, $this->formatObservationStep($step->observation)),
            'ask' => array_merge($base, $this->formatAskStep($step->ask)),
            'exploration' => array_merge($base, $this->formatExplorationStep($step->exploration)),
            'practice' => array_merge($base, $this->formatPracticeStep($step->practice)),
            'review' => array_merge($base, $this->formatReviewStep($step->review)),
            'reflection' => array_merge($base, $this->formatReflectionStep($step->reflection)),
            default => $base,
        };
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
        return MeetingStepResponse::query()
            ->where('meeting_id', $meeting->id)
            ->where('user_id', Auth::id())
            ->with('meetingStep')
            ->get()
            ->mapWithKeys(function (MeetingStepResponse $response) {
                return [
                    $response->meetingStep->step_number => [
                        'response_type' => $response->response_type,
                        'response_text' => $response->response_text,
                        'response_payload' => $response->response_payload,
                    ],
                ];
            })
            ->all();
    }

    private function formatObservationStep(?MeetingStepObservation $observation): array
    {
        return [
            'instruction_text' => $observation?->instruction_text,
            'resource_type' => $observation?->resource_type,
            'resource_url' => $observation?->resource_url,
        ];
    }

    private function formatAskStep(?MeetingStepAsk $ask): array
    {
        return [
            'question_prompt' => $ask?->question_prompt,
        ];
    }

    private function formatExplorationStep(?MeetingStepExploration $exploration): array
    {
        return [
            'exploration_mode' => $exploration?->exploration_mode,
            'exploration_prompt' => $exploration?->exploration_prompt,
        ];
    }

    private function formatPracticeStep(?MeetingStepPractice $practice): array
    {
        return [
            'assessment_mode' => $practice?->assessment_mode,
            'assessment_question' => $practice?->assessment_question,
            'assessment_options' => $practice?->assessment_options,
        ];
    }

    private function formatReviewStep(?MeetingStepReview $review): array
    {
        return [
            'review_prompt' => $review?->review_prompt,
        ];
    }

    private function formatReflectionStep(?MeetingStepReflection $reflection): array
    {
        return [
            'reflection_question' => $reflection?->reflection_question,
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
}
