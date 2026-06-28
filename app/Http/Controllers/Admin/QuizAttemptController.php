<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
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
