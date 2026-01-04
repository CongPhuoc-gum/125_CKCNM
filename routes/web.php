<?php

use Illuminate\Support\Facades\Route;

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

Route::get('/', function () {
    $products = \App\Models\Product::where('status', 1)->get();
    return view('home.home', ['products' => $products]);
})->name('home');

Route::get('/product/{id}', function ($id) {
    $product = \App\Models\Product::with(['category', 'reviews.user'])->find($id);
    if (!$product) {
        abort(404, 'Sản phẩm không tồn tại');
    }
    return view('product.product', ['product' => $product]);
})->name('product.show');
