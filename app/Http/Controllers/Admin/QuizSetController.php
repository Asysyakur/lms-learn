<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\QuizSet;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;
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
            'quiz_type' => 'required',
            'cover_image' => 'nullable|string|max:255',
            'cover_image_file' => 'nullable|image|max:2048',
        ]);

        $coverImage = $this->resolveCoverImage($request);

        QuizSet::create([
            'title' => $request->title,
            'slug' => Str::slug($request->title),
            'quiz_type' => $request->quiz_type,
            'description' => $request->description,
            'cover_image' => $coverImage,
        ]);

        return redirect()->route('admin.quiz-sets.index')->with('success', 'Quiz berhasil ditambahkan.');
    }

    public function edit(QuizSet $quizSet)
    {
        return Inertia::render('Admin/Quiz/EditSet', [
            'set' => $quizSet
        ]);
    }

    public function update(Request $request, QuizSet $quizSet)
    {
        $request->validate([
            'title' => 'required',
            'quiz_type' => 'required',
            'cover_image' => 'nullable|string|max:255',
            'cover_image_file' => 'nullable|image|max:2048',
        ]);

        $coverImage = $this->resolveCoverImage($request, $quizSet->cover_image);

        $quizSet->update([
            'title' => $request->title,
            'slug' => Str::slug($request->title),
            'quiz_type' => $request->quiz_type,
            'description' => $request->description,
            'cover_image' => $coverImage,
        ]);
        return redirect()->route('admin.quiz-sets.index')->with('success', 'Quiz berhasil diperbarui.');
    }

    private function resolveCoverImage(Request $request, ?string $currentCoverImage = null): ?string
    {
        $uploadedFile = $request->file('cover_image_file');

        if ($uploadedFile) {
            if ($currentCoverImage && str_starts_with($currentCoverImage, '/storage/')) {
                Storage::disk('public')->delete(ltrim(substr($currentCoverImage, strlen('/storage/')), '/'));
            }

            $storedPath = $uploadedFile->store('quiz-thumbnails', 'public');

            return '/storage/' . $storedPath;
        }

        return $request->input('cover_image') ?: $currentCoverImage;
    }

    public function destroy(QuizSet $quizSet)
    {
        $quizSet->delete();
        return back()->with('success', 'Quiz berhasil dihapus.');
    }
}
