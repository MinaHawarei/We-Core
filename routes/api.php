<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\vocController;

Route::post('/voc', [vocController::class, 'store']);
