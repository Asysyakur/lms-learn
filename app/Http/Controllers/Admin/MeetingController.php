<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Meeting;
use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class MeetingController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Meetings/Index', [
            'meetings' => Meeting::latest()->get()
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Meetings/Create', [
            'defaultCourseId' => Course::query()->orderBy('sort_order')->value('id')
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'course_id' => 'required|exists:courses,id',
            'meeting_number' => 'required|numeric',
            'title' => 'required|string|max:255',
            'cover_image' => 'nullable|string|max:255',
            'cover_image_file' => 'nullable|image|max:2048',
        ]);

        $coverImage = $this->resolveCoverImage($request);

        Meeting::create($request->only([
            'course_id',
            'meeting_number',
            'title',
            'description',
            'sort_order',
        ]) + [
            'cover_image' => $coverImage,
        ]);

        return redirect()->route('admin.meetings.index')->with('success', 'Meeting berhasil ditambahkan.');
    }

    public function edit(Meeting $meeting)
    {
        return Inertia::render('Admin/Meetings/Edit', [
            'meeting' => $meeting,
            'defaultCourseId' => Course::query()->orderBy('sort_order')->value('id')
        ]);
    }

    public function update(Request $request, Meeting $meeting)
    {
        $request->validate([
            'course_id' => 'required|exists:courses,id',
            'meeting_number' => 'required|numeric',
            'title' => 'required|string|max:255',
            'cover_image' => 'nullable|string|max:255',
            'cover_image_file' => 'nullable|image|max:2048',
        ]);

        $coverImage = $this->resolveCoverImage($request, $meeting->cover_image);

        $meeting->update($request->only([
            'course_id',
            'meeting_number',
            'title',
            'description',
            'sort_order',
        ]) + [
            'cover_image' => $coverImage,
        ]);

        return redirect()->route('admin.meetings.index')->with('success', 'Meeting berhasil diperbarui.');
    }

    private function resolveCoverImage(Request $request, ?string $currentCoverImage = null): ?string
    {
        $uploadedFile = $request->file('cover_image_file');

        if ($uploadedFile) {
            if ($currentCoverImage && str_starts_with($currentCoverImage, '/storage/')) {
                Storage::disk('public')->delete(ltrim(substr($currentCoverImage, strlen('/storage/')), '/'));
            }

            $storedPath = $uploadedFile->store('meeting-thumbnails', 'public');

            return '/storage/' . $storedPath;
        }

        return $request->input('cover_image') ?: $currentCoverImage;
    }

    public function destroy(Meeting $meeting)
    {
        $meeting->delete();
        return back()->with('success', 'Meeting berhasil dihapus.');
    }
}
