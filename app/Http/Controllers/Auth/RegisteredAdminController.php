<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\UserProfile;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class RegisteredAdminController extends Controller
{
    /**
     * Show the registration page.
     */
    public function create(): Response
    {
        return Inertia::render('auth/admin-register');
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
            'email' => 'required|string|lowercase|email|max:255|unique:'.Admin::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        $success = true;

        DB::beginTransaction();
        try {
            $admin = Admin::create([
                'name' => $request['name'],
                'email' => $request['email'],
                'password' => Hash::make($request['password']),
            ]);

            AdminProfile::create([
                'admin_id' => $admin->id,
            ]);

            //$user->assignRole('user');

        } catch (\Exception $exception) {

            $success = $exception->getMessage();

            Log::error($exception);
            Log::error('rollback registro - hubo un error');

            DB::rollBack();
        }

        if($success === true) {
            DB::commit();
            //enviar email
            event(new Registered($admin));

            Auth::login($admin);

            return redirect()->intended(route('admin.dashboard', absolute: false));
        }

        Log::error('ERROR NO SE REGISTRO ADMINISTRADOR');
        Log::error($exception);
        return redirect(route('admin.register'));
    }
}
