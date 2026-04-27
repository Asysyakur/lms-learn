<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Meeting;
use App\Models\Course;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MeetingController extends Controller
{
    public function index()
    {
        return Inertia::render('Admin/Meetings/Index', [
            'meetings' => Meeting::with('course')->latest()->get()
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Meetings/Create', [
            'courses' => Course::all()
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'course_id' => 'required|exists:courses,id',
            'meeting_number' => 'required|numeric',
            'title' => 'required|string|max:255',
        ]);

        Meeting::create($request->only([
            'course_id',
            'meeting_number',
            'title',
            'description',
            'sort_order',
            'is_active',
        ]));

        return redirect()->route('admin.meetings.index');
    }

    public function edit(Meeting $meeting)
    {
        return Inertia::render('Admin/Meetings/Edit', [
            'meeting' => $meeting,
            'courses' => Course::all()
        ]);
    }

    public function update(Request $request, Meeting $meeting)
    {
        $request->validate([
            'course_id' => 'required|exists:courses,id',
            'meeting_number' => 'required|numeric',
            'title' => 'required|string|max:255',
        ]);

        $meeting->update($request->only([
            'course_id',
            'meeting_number',
            'title',
            'description',
            'sort_order',
            'is_active',
        ]));

        return back();
    }

    public function destroy(Meeting $meeting)
    {
        $meeting->delete();
        return back();
    }
}
