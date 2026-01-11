<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ReviewController;
use App\Http\Controllers\AdminUserController;
use App\Http\Controllers\AdminDashboardController;

// ========== PUBLIC ROUTES ==========
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/verify-otp', [AuthController::class, 'verifyOtp']);
    Route::post('/resend-otp', [AuthController::class, 'resendOtp']);
    Route::post('/login', [AuthController::class, 'login']);

    Route::get('/google', [AuthController::class, 'redirectToGoogle']);
    Route::get('/google/callback', [AuthController::class, 'handleGoogleCallback']);
});

// Products API (Public)
Route::get('products/best-selling', [ProductController::class, 'bestSelling']);
Route::get('products', [ProductController::class, 'index']);
Route::get('products/{id}', [ProductController::class, 'show']);

// Categories API (Public)
Route::get('categories', [CategoryController::class, 'index']);
Route::get('categories/{id}', [CategoryController::class, 'show']);

// Reviews API (Public)
Route::get('products/{id}/reviews', [ReviewController::class, 'index']);

// ========== PROTECTED USER ROUTES ==========
Route::middleware('auth:sanctum')->group(function () {
    
    // Auth
    Route::prefix('auth')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/me', [AuthController::class, 'me']);
    });

    // Cart
    Route::prefix('cart')->group(function () {
        Route::get('', [CartController::class, 'getCart']);
        Route::post('/add', [CartController::class, 'addToCart']);
        Route::put('/update/{cartItemId}', [CartController::class, 'updateQuantity']);
        Route::post('/increase/{cartItemId}', [CartController::class, 'increaseQuantity']);
        Route::post('/decrease/{cartItemId}', [CartController::class, 'decreaseQuantity']);
        Route::delete('/remove/{cartItemId}', [CartController::class, 'removeItem']);
    });

    // Orders
    Route::post('/checkout', [OrderController::class, 'checkout']);
    Route::get('/orders/user/{userId}', [OrderController::class, 'index']);
    Route::get('/orders/{id}', [OrderController::class, 'show']);
    Route::put('/orders/{id}/cancel', [OrderController::class, 'cancel']);
    Route::post('/orders/{id}/cancel', [OrderController::class, 'cancel']);
});

// Payment callbacks
Route::get('/vnpay-return', [OrderController::class, 'vnpayReturn']);
Route::get('/stripe-return', [OrderController::class, 'stripeReturn']);

// Reviews
Route::post('/reviews', [App\Http\Controllers\ReviewController::class, 'store'])->middleware('auth:sanctum');

// ========== ADMIN ROUTES ==========
Route::prefix('admin')->middleware(['auth:sanctum', 'admin'])->group(function () {
    
    // Dashboard
    Route::get('/dashboard', [AdminDashboardController::class, 'index']);
    
    // Products Management
    Route::post('/products', [ProductController::class, 'store']);
    Route::post('/products/{id}', [ProductController::class, 'update']);
    Route::put('/products/{id}', [ProductController::class, 'update']);
    Route::delete('/products/{id}', [ProductController::class, 'destroy']);
    
    // Categories Management
    Route::post('/categories', [CategoryController::class, 'store']);
    Route::put('/categories/{id}', [CategoryController::class, 'update']);
    Route::delete('/categories/{id}', [CategoryController::class, 'destroy']);
    
    // Orders Management
    Route::get('/orders', [OrderController::class, 'adminIndex']);
    Route::put('/orders/{id}/status', [OrderController::class, 'updateStatus']);
    Route::get('/orders/statistics', [OrderController::class, 'statistics']);
    
    // Users Management
    Route::get('/users', [AdminUserController::class, 'index']);
    Route::get('/users/{id}', [AdminUserController::class, 'show']);
    Route::put('/users/{id}/toggle-status', [AdminUserController::class, 'toggleStatus']);
    
    // Reviews Management
    Route::get('/reviews', [ReviewController::class, 'adminIndex']);
    Route::delete('/reviews/{id}', [ReviewController::class, 'destroy']);
});