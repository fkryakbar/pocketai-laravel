<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ChatController;
use App\Http\Controllers\CompletionController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', [AuthController::class, 'index'])->name('login');
Route::post('/', [AuthController::class, 'loginAttempt'])->name('loginAttempt');
Route::get('/logout', [AuthController::class, 'logout'])->name('logout');

Route::group(['middleware' => 'auth'], function () {
    Route::get('chat', [ChatController::class, 'index'])->name('chat');
    Route::post('completion', [CompletionController::class, 'completion'])->name('completion');
    Route::get('test', [CompletionController::class, 'test'])->name('test');
});
