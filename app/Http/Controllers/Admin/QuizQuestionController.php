<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\QuizQuestion;
use App\Models\QuizSet;
use Illuminate\Http\Request;
use Inertia\Inertia;

class QuizQuestionController extends Controller
{
    public function index(Request $request)
    {
        $setId = $request->query('set_id');

        if ($setId) {
            $questions = QuizQuestion::with('quizSet')->where('quiz_set_id', $setId)->get();
            $selectedSet = QuizSet::find($setId);
        } else {
            $questions = QuizQuestion::with('quizSet')->get();
            $selectedSet = null;
        }

        return Inertia::render('Admin/Quiz/Questions', [
            'questions' => $questions,
            'selected_set' => $selectedSet,
        ]);
    }

    public function create(Request $request)
    {
        return Inertia::render('Admin/Quiz/CreateQuestion', [
            'sets' => QuizSet::all(),
            'selected_set_id' => $request->query('set_id') ?? null,
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

        return redirect()->route('admin.quiz-questions.index', ['set_id' => $request->quiz_set_id])->with('success', 'Soal berhasil ditambahkan');
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

        return redirect()->route('admin.quiz-questions.index', ['set_id' => $quizQuestion->quiz_set_id])->with('success', 'Soal berhasil diperbarui');
    }

    public function destroy(QuizQuestion $quizQuestion)
    {
        $setId = $quizQuestion->quiz_set_id;
        $quizQuestion->delete();
        return redirect()->route('admin.quiz-questions.index', ['set_id' => $setId])->with('success', 'Soal berhasil dihapus');
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
