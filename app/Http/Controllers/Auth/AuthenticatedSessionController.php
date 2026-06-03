<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Login', [
            'canResetPassword' => false, // Password reset feature disabled
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();

        $request->session()->regenerate();

        $user = $request->user();

        // Redirect admins to the admin dashboard, regular users to the learning homepage.
        $default = $user && isset($user->role) && $user->role === 'admin'
            ? route('admin.meetings.index')
            : route('beranda');

        // Respect an "intended" URL only when it's appropriate for the user.
        // If the intended URL points under /admin but the user is not an admin,
        // ignore it to avoid a 403 and fall back to the default.
        $intended = $request->session()->pull('url.intended');

        if ($intended) {
            $path = parse_url($intended, PHP_URL_PATH) ?: $intended;
            $isAdminPath = Str::startsWith($path, '/admin');

            if (! $isAdminPath || ($user && isset($user->role) && $user->role === 'admin')) {
                return redirect($intended);
            }
        }

        return redirect($default);
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();

        return redirect('/');
    }
}
