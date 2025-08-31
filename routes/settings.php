<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Settings\ProfileController;
use App\Http\Controllers\Settings\PasswordController;
use App\Http\Controllers\Settings\AdminProfileController;
use App\Http\Controllers\Settings\AdminPasswordController;

Route::middleware('auth')->group(function () {
    Route::redirect('settings', '/settings/profile');

    Route::get('settings/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('settings/profile', [ProfileController::class, 'update'])->name('profile.update');

    Route::get('settings/password', [PasswordController::class, 'edit'])->name('password.edit');

    Route::put('settings/password', [PasswordController::class, 'update'])
        ->middleware('throttle:6,1')
        ->name('password.update');

    Route::get('settings/appearance', function () {
        return Inertia::render('settings/appearance');
    })->name('appearance');
});


Route::middleware('auth:admin')->group(function () {
    Route::redirect('settings', '/settings/profile');

    Route::get('admin/settings/profile', [AdminProfileController::class, 'edit'])->name('admin.profile.edit');
    Route::patch('admin/settings/profile', [AdminProfileController::class, 'update'])->name('admin.profile.update');

    Route::get('admin/settings/password', [AdminPasswordController::class, 'edit'])->name('admin.password.edit');

    Route::put('admin/settings/password', [AdminPasswordController::class, 'update'])
        ->middleware('throttle:6,1')
        ->name('admin.password.update');

    Route::get('admin/settings/appearance', function () {
        return Inertia::render('settings/appearance');
    })->name('admin.appearance');
});
