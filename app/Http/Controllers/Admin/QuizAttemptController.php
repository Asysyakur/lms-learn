<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\QuizSet;
use Inertia\Inertia;

class QuizAttemptController extends Controller
{
    public function index()
    {
        $quizSets = QuizSet::query()
            ->withCount('attempts')
            ->orderBy('sort_order')
            ->orderBy('title')
            ->get()
            ->map(function (QuizSet $quizSet) {
                return [
                    'id' => $quizSet->id,
                    'title' => $quizSet->title,
                    'quiz_type' => $quizSet->quiz_type,
                    'attempts_count' => $quizSet->attempts_count,
                ];
            });

        return Inertia::render('Admin/Quiz/Results', [
            'quizSets' => $quizSets,
        ]);
    }

    public function show(QuizSet $quizSet)
    {
        $quizSet->load(['attempts' => function ($query) {
            $query->with('user')->latest('submitted_at');
        }]);

        return Inertia::render('Admin/Quiz/ResultShow', [
            'quizSet' => [
                'id' => $quizSet->id,
                'title' => $quizSet->title,
                'quiz_type' => $quizSet->quiz_type,
            ],
            'attempts' => $quizSet->attempts->map(function ($attempt) {
                return [
                    'id' => $attempt->id,
                    'student_name' => $attempt->user?->name ?? 'User dihapus',
                    'student_email' => $attempt->user?->email,
                    'score' => $attempt->score,
                    'total_questions' => $attempt->total_questions,
                    'percentage' => (float) $attempt->percentage,
                    'submitted_at' => optional($attempt->submitted_at)->format('d M Y H:i'),
                ];
            })->values(),
        ]);
    }
}
