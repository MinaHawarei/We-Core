<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\ActivityLogController;
use App\Http\Controllers\AdminScheduleController;
use App\Http\Controllers\vocController;
use App\Exports\VocExport;
use Maatwebsite\Excel\Facades\Excel;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::post('/voc', [vocController::class, 'store']);


Route::middleware(['auth', 'verified'])->group(function () {



    Route::get('/reservation', [BookingController::class, 'index'])->name('reservation');
    Route::post('/bookings', [BookingController::class, 'store']);

    Route::get('/posts', [PostController::class, 'index'])->name('posts');
    Route::post('/posts', [PostController::class, 'store']);


    Route::get('/voc-logs', [vocController::class, 'index'])->name('voc-logs');
    Route::post('/voc-toggle', [vocController::class, 'toggleAutoSave']);
    Route::post('/voc-clear-all', [vocController::class, 'destroyAll']);

    Route::get('/voc-export', function () {return Excel::download(new VocExport, 'voc_logs.xlsx');
});


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
        Route::put('/reservation/{id}/status', [BookingController::class, 'updateStatus'])->name('admin-reservation-status');

        // Users
        Route::get('/users', [UserController::class, 'index'])->name('admin-users');
        Route::put('/users/{id}', [UserController::class, 'update'])->name('admin-users-update');
        Route::delete('/users/{id}', [UserController::class, 'destroy'])->name('admin-users-destroy');

        Route::prefix('/schedule')->group(function () {
            Route::get('/', [AdminScheduleController::class, 'index']);     // GET all blocked slots
            Route::post('/block', [AdminScheduleController::class, 'store']);    // Block slot
            Route::PUT('/block', [AdminScheduleController::class, 'update']);    // Block slot
            Route::delete('/block', [AdminScheduleController::class, 'destroy']); // Unblock slot
        });

        Route::get('/activity-logs', [ActivityLogController::class, 'index'])->name('activity-logs');
    });
});


require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
