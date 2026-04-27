<?php

namespace App\Http\Controllers;

use App\Models\Course;
use App\Models\Meeting;
use App\Models\MeetingStep;
use App\Models\QuizSet;
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

        return Inertia::render('Kuis', [
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
            ->with(['steps' => function ($query) {
                $query->orderBy('sort_order');
            }])
            ->findOrFail($id);

        $steps = $meeting->steps->map(function (MeetingStep $step) {
            return $this->formatMeetingStep($step);
        })->values();

        return Inertia::render('Pertemuan', [
            'id' => $meeting->id,
            'meeting' => [
                'id' => $meeting->id,
                'meeting_number' => $meeting->meeting_number,
                'title' => $meeting->title,
                'description' => $meeting->description,
            ],
            'steps' => $steps,
        ]);
    }

    public function meetingStep(string $id, int $step)
    {
        $meeting = Meeting::query()
            ->with(['steps' => function ($query) {
                $query->orderBy('sort_order');
            }])
            ->findOrFail($id);

        $steps = $meeting->steps->map(function (MeetingStep $item) {
            return $this->formatMeetingStep($item);
        })->values();

        $activeStep = $meeting->steps->firstWhere('step_number', $step);

        return Inertia::render('Pertemuan/StepPage', [
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
        ]);
    }

    private function formatMeetingStep(MeetingStep $step): array
    {
        return [
            'id' => $step->id,
            'step' => $step->step_number,
            'step_type' => $step->step_type,
            'title' => $step->title,
            'desc' => $step->description,
            'instruction_text' => $step->instruction_text,
            'resource_type' => $step->resource_type,
            'resource_url' => $step->resource_url,
            'question_prompt' => $step->question_prompt,
            'exploration_mode' => $step->exploration_mode,
            'exploration_prompt' => $step->exploration_prompt,
            'assessment_mode' => $step->assessment_mode,
            'assessment_question' => $step->assessment_question,
            'assessment_options' => $step->assessment_options,
            'review_prompt' => $step->review_prompt,
            'reflection_question' => $step->reflection_question,
        ];
    }
}
