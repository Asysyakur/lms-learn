<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\QuizAttempt;
use App\Models\QuizSet;
use Illuminate\Support\Str;
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

    public function showAttempt(QuizSet $quizSet, QuizAttempt $attempt)
    {
        abort_unless($attempt->quiz_set_id === $quizSet->id, 404);

        $attempt->load('user');

        $questionIds = $attempt->question_ids ?? array_keys($attempt->answers);

        $questions = $quizSet->questions()
            ->whereIn('id', $questionIds)
            ->orderBy('sort_order')
            ->get();

        return Inertia::render('Admin/Quiz/AttemptShow', [
            'quizSet' => [
                'id' => $quizSet->id,
                'title' => $quizSet->title,
                'quiz_type' => $quizSet->quiz_type,
            ],
            'attempt' => [
                'id' => $attempt->id,
                'student_name' => $attempt->user?->name ?? 'User dihapus',
                'student_email' => $attempt->user?->email,
                'score' => $attempt->score,
                'total_questions' => $attempt->total_questions,
                'percentage' => (float) $attempt->percentage,
                'submitted_at' => optional($attempt->submitted_at)->format('d M Y H:i'),
            ],
            'questions' => $questions->map(function ($question) use ($attempt) {
                $selectedOption = $attempt->answers[$question->id] ?? null;

                return [
                    'id' => $question->id,
                    'question_text' => $question->question_text,
                    'options' => $question->options,
                    'correct_option' => $question->correct_option,
                    'selected_option' => $selectedOption,
                    'is_correct' => $selectedOption !== null && $selectedOption === $question->correct_option,
                    'explanation' => $question->explanation,
                ];
            })->values(),
        ]);
    }

    public function export(QuizSet $quizSet)
    {
        $quizSet->load(['attempts' => function ($query) {
            $query->with('user')->latest('submitted_at');
        }]);

        $filename = Str::slug($quizSet->title).'-hasil.csv';

        return response()->streamDownload(function () use ($quizSet) {
            $handle = fopen('php://output', 'w');

            fwrite($handle, "\xEF\xBB\xBF");
            fwrite($handle, "sep=,\n");

            fputcsv($handle, ['No', 'Nama Siswa', 'Email', 'Skor', 'Total Soal', 'Nilai (%)', 'Waktu Submit']);

            foreach ($quizSet->attempts as $index => $attempt) {
                fputcsv($handle, [
                    $index + 1,
                    $attempt->user?->name ?? 'User dihapus',
                    $attempt->user?->email,
                    $attempt->score,
                    $attempt->total_questions,
                    $attempt->percentage,
                    optional($attempt->submitted_at)->format('d M Y H:i'),
                ]);
            }

            fclose($handle);
        }, $filename, [
            'Content-Type' => 'text/csv',
        ]);
    }
}
