<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\PostController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {



    Route::get('/reservation', [BookingController::class, 'index'])->name('reservation');
    Route::post('/bookings', [BookingController::class, 'store']);

    Route::get('/posts', [PostController::class, 'index'])->name('posts');
    Route::post('/posts', [PostController::class, 'store']);


});



Route::middleware(['auth', 'admin'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('Admin/dashboard');
    })->name('dashboard');

    Route::prefix('admin')->group(function () {
        // Dashboard
        Route::get('/reservation', [BookingController::class, 'admin'])->name('admin-reservation');
        Route::delete('/reservation/{id}', [BookingController::class, 'destroy'])->name('admin-reservation-destroy');
        Route::put('/reservation/{id}/attendance', [BookingController::class, 'updateAttendance']);

        // Users
        Route::get('/users', [UserController::class, 'index'])->name('admin-users');
        Route::put('/users/{id}', [UserController::class, 'update'])->name('admin-users-update');
        Route::delete('/users/{id}', [UserController::class, 'destroy'])->name('admin-users-destroy');
    });
});


require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
