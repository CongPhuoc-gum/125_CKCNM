<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ProductController;

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Product API
Route::apiResource('products', ProductController::class);


// Category API
Route::prefix('categories')->group(function () {
    Route::get('', [CategoryController::class, 'index']);
    Route::post('', [CategoryController::class, 'store']);
    Route::get('{id}', [CategoryController::class, 'show']);
    Route::put('{id}', [CategoryController::class, 'update']);
    Route::delete('{id}', [CategoryController::class, 'destroy']);
});

// Order & Payment API
use App\Http\Controllers\OrderController;
Route::post('/checkout', [OrderController::class, 'checkout']);
Route::get('/vnpay-return', [OrderController::class, 'vnpayReturn']);
Route::get('/orders/user/{userId}', [OrderController::class, 'index']);
Route::get('/orders/{id}', [OrderController::class, 'show']);
