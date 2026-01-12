<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProductController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/login', function () {
    return view('auth.login');
})->name('login');

Route::get('/register', function () {
    return view('auth.register');
})->name('register');

Route::get('/verify-otp', function () {
    return view('auth.verify-otp');
})->name('verify-otp');

Route::get('/', function (\Illuminate\Http\Request $request) {
    $query = \App\Models\Product::where('status', 1);
    
    // Filter by category if provided
    if ($request->has('category')) {
        $query->where('categoryId', $request->category);
    }
    
    $products = $query->get();
    return view('home.home', ['products' => $products]);
})->name('home');

// ===== PRODUCT DETAIL PAGE với Related Products =====
Route::get('/product/{id}', [ProductController::class, 'showPage'])
    ->name('product.show')
    ->where('id', '[0-9]+');

Route::get('/checkout', function () {
    return view('checkout.checkout');
})->name('checkout');

Route::get('orders', function () {
    return view('order.orders');
})->name('orders');

Route::get('/contact', function () {
    return view('contact.contact');
})->name('contact');

Route::get('/profile', function () {
    return view('profile.profile');
})->name('profile');


//admin routes
Route::prefix('admin')->middleware(['web'])->group(function () {
    
    // Dashboard
    Route::get('/dashboard', function () {
        return view('admin.dashboard');
    })->name('admin.dashboard');
    
    // Products
    Route::get('/products', function () {
        return view('admin.products.index');
    })->name('admin.products.index');
    
    Route::get('/products/create', function () {
        return view('admin.products.create');
    })->name('admin.products.create');
    
    Route::get('/products/{id}/edit', function () {
        return view('admin.products.edit');
    })->name('admin.products.edit');
    
    // Categories
    Route::get('/categories', function () {
        return view('admin.categories.index');
    })->name('admin.categories.index');
    
    // Orders
    Route::get('/orders', function () {
        return view('admin.orders.index');
    })->name('admin.orders.index');
    
    Route::get('/orders/{id}', function () {
        return view('admin.orders.show');
    })->name('admin.orders.show');
    
    // Users
    Route::get('/users', function () {
        return view('admin.users.index');
    })->name('admin.users.index');
    
    // Reviews
    Route::get('/reviews', function () {
        return view('admin.reviews.index');
    })->name('admin.reviews.index');
});