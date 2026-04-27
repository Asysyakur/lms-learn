<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\QuizQuestion;
use App\Models\QuizSet;
use Illuminate\Http\Request;
use Inertia\Inertia;

class QuizQuestionController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Quiz/Questions', [
            'questions' => QuizQuestion::with('quizSet')->get()
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Quiz/CreateQuestion', [
            'sets' => QuizSet::all()
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'quiz_set_id' => 'required',
            'question_text' => 'required',
            'options' => 'required',
            'correct_option' => 'required',
        ]);

        QuizQuestion::create([
            'quiz_set_id' => $request->quiz_set_id,
            'question_text' => $request->question_text,
            'options' => $this->normalizeOptions($request->options),
            'correct_option' => $request->correct_option,
        ]);

        return back();
    }

    public function edit(QuizQuestion $quizQuestion)
    {
        return Inertia::render('Admin/Quiz/EditQuestion', [
            'question' => $quizQuestion,
            'sets' => QuizSet::all()
        ]);
    }

    public function update(Request $request, QuizQuestion $quizQuestion)
    {
        $quizQuestion->update([
            'quiz_set_id' => $request->quiz_set_id,
            'question_text' => $request->question_text,
            'options' => $this->normalizeOptions($request->options),
            'correct_option' => $request->correct_option,
        ]);

        return back();
    }

    public function destroy(QuizQuestion $quizQuestion)
    {
        $quizQuestion->delete();
        return back();
    }

    private function normalizeOptions($options): array
    {
        if (is_array($options)) {
            return array_values(array_filter($options));
        }

        if (! is_string($options)) {
            return [];
        }

        return collect(preg_split('/\r\n|\r|\n/', $options))
            ->map(fn ($option) => trim($option))
            ->filter()
            ->values()
            ->all();
    }
}
