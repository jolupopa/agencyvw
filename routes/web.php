<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ListingController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');



Route::get('/offer-types', [OfferTypeController::class, 'index']);
Route::get('/property-types', [PropertyTypeController::class, 'index']);
Route::get('/listings/search', [ListingController::class, 'search'])->name('listings.search');

Route::middleware(['auth:web', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');


    Route::get('/user/listings', [ListingController::class, 'index'])->name('user.listings.index');
    Route::get('/user/listings/create', [ListingController::class, 'create'])->name('user.listings.create');
    Route::post('/user/listings', [ListingController::class, 'store'])->name('user.listings.store');
    Route::get('/user/listings/{id}', [ListingController::class, 'show'])->name('user.listings.show');
    Route::get('/user/listings/{id}/edit', [ListingController::class, 'edit'])->name('user.listings.edit');
    Route::put('/user/listings/{id}', [ListingController::class, 'update'])->name('user.listings.update');
    Route::delete('/user/listings/{id}', [ListingController::class, 'destroy'])->name('user.listings.destroy');

    Route::post('/listings/{id}/media', [ListingController::class, 'storeMedia'])->name('listings.media.store');
    Route::delete('/listings/{listing}/media/{media}', [ListingController::class, 'destroyMedia'])->name('listings.media.destroy');

});




require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
require __DIR__.'/admin.php';
