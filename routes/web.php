<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ListingController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');



Route::get('/offer-types', [OfferTypeController::class, 'index']);
Route::get('/property-types', [PropertyTypeController::class, 'index']);

Route::middleware(['auth:web', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');


    Route::get('/user/listings', [ListingController::class, 'index'])->name('listings.index');
    Route::get('/listings/search', [ListingController::class, 'search'])->name('listings.search');
    Route::get('/user/listings/create', [ListingController::class, 'create'])->name('listings.create');
    Route::post('/user/listings', [ListingController::class, 'store'])->name('listings.store');
    Route::get('/listings/{listing}', [ListingController::class, 'show'])->name('listings.show')->whereNumber('listing');
    Route::get('/user/listings/{listing}/edit', [ListingController::class, 'edit'])->name('listings.edit');
    Route::put('/user/listings/{listing}', [ListingController::class, 'update'])->name('listings.update');
    Route::delete('/user/listings/{listing}', [ListingController::class, 'destroy'])->name('listings.destroy');


    Route::post('/listings/{listing}/media', [ListingController::class, 'storeMedia'])->name('listings.media.store');
    Route::delete('/listings/{listing}/media/{media}', [ListingController::class, 'destroyMedia'])->name('listings.media.destroy');

});




require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
require __DIR__.'/admin.php';
