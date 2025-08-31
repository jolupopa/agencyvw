<?php
use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\AdminAuthenticatedSessionController;



Route::middleware(['auth:admin', 'verified'])->group(function () {
    Route::get('admin/dashboard', function () {
        return Inertia::render('admin/dashboard');
    })->name('admin.dashboard');

     Route::post('/admin/logout', [AdminAuthenticatedSessionController::class, 'destroy'])
    ->name('admin.logout');
});
