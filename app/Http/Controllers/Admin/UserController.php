<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index()
    {
        $users = User::query()
            ->with(['quizAttempts.quizSet'])
            ->latest()
            ->get(['id', 'name', 'email', 'role', 'created_at'])
            ->map(function (User $user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->role,
                    'created_at' => $user->created_at,
                    'quiz_attempts' => $user->quizAttempts
                        ->sortBy(fn ($attempt) => $attempt->quizSet?->sort_order ?? 0)
                        ->map(function ($attempt) {
                            return [
                                'id' => $attempt->id,
                                'quiz_title' => $attempt->quizSet?->title ?? 'Quiz',
                                'quiz_type' => $attempt->quizSet?->quiz_type,
                                'score' => $attempt->score,
                                'total_questions' => $attempt->total_questions,
                                'percentage' => (float) $attempt->percentage,
                                'submitted_at' => optional($attempt->submitted_at)->toISOString(),
                            ];
                        })
                        ->values(),
                ];
            });

        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Users/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:users,email'],
            'role' => ['required', Rule::in(['admin', 'student'])],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ]);

        User::create(Arr::except($validated, ['password_confirmation']));

        return redirect()->route('admin.users.index')->with('success', 'User berhasil ditambahkan.');
    }

    public function edit(User $user)
    {
        return Inertia::render('Admin/Users/Edit', [
            'user' => $user->only(['id', 'name', 'email', 'role']),
        ]);
    }

    public function update(Request $request, User $user)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'string',
                'lowercase',
                'email',
                'max:255',
                Rule::unique('users', 'email')->ignore($user->id),
            ],
            'role' => ['required', Rule::in(['admin', 'student'])],
            'password' => ['nullable', 'string', 'min:8', 'confirmed'],
        ]);

        $payload = Arr::except($validated, ['password']);

        if ($request->filled('password')) {
            $payload['password'] = $validated['password'];
        }

        $user->update($payload);

        return redirect()->route('admin.users.index')->with('success', 'User berhasil diperbarui.');
    }

    public function destroy(Request $request, User $user)
    {
        abort_if($request->user()->is($user), 422, 'Tidak bisa menghapus akun sendiri.');

        $user->delete();

        return back()->with('success', 'User berhasil dihapus.');
    }
}
