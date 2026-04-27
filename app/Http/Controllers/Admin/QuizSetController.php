<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\QuizSet;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class QuizSetController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Quiz/Sets', [
            'sets' => QuizSet::latest()->get()
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Quiz/CreateSet');
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required',
            'quiz_type' => 'required'
        ]);

        QuizSet::create([
            'title' => $request->title,
            'slug' => Str::slug($request->title),
            'quiz_type' => $request->quiz_type,
            'description' => $request->description,
        ]);

        return redirect()->route('admin.quiz-sets.index');
    }

    public function edit(QuizSet $quizSet)
    {
        return Inertia::render('Admin/Quiz/EditSet', [
            'set' => $quizSet
        ]);
    }

    public function update(Request $request, QuizSet $quizSet)
    {
        $quizSet->update([
            'title' => $request->title,
            'slug' => Str::slug($request->title),
            'quiz_type' => $request->quiz_type,
            'description' => $request->description,
        ]);
        return back();
    }

    public function destroy(QuizSet $quizSet)
    {
        $quizSet->delete();
        return back();
    }
}
