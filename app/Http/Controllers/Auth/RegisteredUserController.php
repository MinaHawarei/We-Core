<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Show the registration page.
     */
    public function create(): Response
    {
        $admins = User::where('role', 'admin')->select('id', 'name')->get();
        return Inertia::render('auth/register' , [
        'admins' => $admins,
        ]);
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'department' => 'required|string|max:255',
            'site' => 'required|string|max:255',
            'manager_id' => 'nullable|integer|exists:users,id',
            'out_id' => 'required|string|max:10|unique:users,out_id',
        ]);




        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'department' => $request->department,
            'site' => $request->site,
            'manager_id' => $request->manager_id,
            'out_id' => $request->out_id,
            'password' => Hash::make($request->password),

        ]);

        event(new Registered($user));


        return redirect('/')->with('message', 'Your account has been created successfully. Please wait for your Manager activation.');
    }
}
