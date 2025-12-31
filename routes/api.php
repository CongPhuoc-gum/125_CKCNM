<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/
use App\Http\Controllers\CategoryController;
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
