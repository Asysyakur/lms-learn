<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class ProfileController extends Controller
{
    /**
     * Show the form for editing the authenticated user's profile.
     */
    public function edit(): Response
    {
        return Inertia::render('Profile/Edit', [
            'user' => Auth::user()->only(['id', 'name', 'email', 'role', 'kelas']),
            'kelasOptions' => User::KELAS_OPTIONS,
            'status' => session('status'),
        ]);
    }

    /**
     * Update the authenticated user's profile.
     */
    public function update(Request $request): RedirectResponse
    {
        $user = $request->user();

        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email,'.$user->id],
            'password' => ['nullable', 'confirmed', 'min:8'],
            'kelas' => ['nullable', Rule::in(User::KELAS_OPTIONS)],
        ]);

        $user->name = $data['name'];
        $user->email = $data['email'];

        if ($user->role === 'student') {
            $user->kelas = $data['kelas'] ?? null;
        }

        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }

        if (! empty($data['password'])) {
            $user->password = Hash::make($data['password']);
        }

        $user->save();

        return redirect()->route('profile.edit')->with('status', 'Profile updated.');
    }

    /**
     * Delete the authenticated user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}
