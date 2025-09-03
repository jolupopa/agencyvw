<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ListingController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::get('/listings/search', [ListingController::class, 'search'])->name('listings.search');
Route::get('/listings', [ListingController::class, 'index'])->name('listings.index');
Route::get('/listings/{listing}', [ListingController::class, 'show'])->name('listings.show');

Route::get('/listings/create', [ListingController::class, 'create'])->name('listings.create');
Route::post('/listings', [ListingController::class, 'store'])->name('listings.store');
Route::get('/listings/{listing}/edit', [ListingController::class, 'edit'])->name('listings.edit');
Route::put('/listings/{listing}', [ListingController::class, 'update'])->name('listings.update');
Route::delete('/listings/{listing}', [ListingController::class, 'destroy'])->name('listings.destroy');


Route::get('/offer-types', [OfferTypeController::class, 'index']);
Route::get('/property-types', [PropertyTypeController::class, 'index']);

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});




require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
require __DIR__.'/admin.php';
