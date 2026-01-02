<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CartController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/
use App\Http\Controllers\ProductController;

// Public routes - Không cần authentication
Route::prefix('auth')->group(function () {
    // Đăng ký (bước 1) - gửi OTP
    Route::post('/register', [AuthController::class, 'register']);
    
    // Xác thực OTP (bước 2) - hoàn tất đăng ký
    Route::post('/verify-otp', [AuthController::class, 'verifyOtp']);
    
    // Gửi lại OTP
    Route::post('/resend-otp', [AuthController::class, 'resendOtp']);
    
    // Đăng nhập
    Route::post('/login', [AuthController::class, 'login']);
});

// Protected routes - Cần authentication
Route::middleware('auth:sanctum')->group(function () {
    Route::prefix('auth')->group(function () {
        // Đăng xuất
        Route::post('/logout', [AuthController::class, 'logout']);
        
        // Lấy thông tin user hiện tại
        Route::get('/me', [AuthController::class, 'me']);
    });

    // Cart routes
    Route::prefix('cart')->group(function () {
        Route::get('', [CartController::class, 'getCart']);
        Route::post('/add', [CartController::class, 'addToCart']);
        Route::put('/update/{cartItemId}', [CartController::class, 'updateQuantity']);
        Route::post('/increase/{cartItemId}', [CartController::class, 'increaseQuantity']);
        Route::post('/decrease/{cartItemId}', [CartController::class, 'decreaseQuantity']);
        Route::delete('/remove/{cartItemId}', [CartController::class, 'removeItem']);
    });

    // Các routes khác của ứng dụng sẽ thêm vào đây
    // Route::apiResource('products', ProductController::class);
    // Route::apiResource('categories', CategoryController::class);
    // ...
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
