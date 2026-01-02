<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Http\Resources\CartResource;
use App\Models\Product;
use Illuminate\Http\Request;

class CartController extends Controller
{
    /**
     * Add a product to the cart.
     * POST /api/cart/add
     */
    public function addToCart(Request $request)
    {
        try {
            $request->validate([
                'productId' => 'required|exists:products,productId',
                'quantity' => 'required|integer|min:1'
            ]);

            $user = auth()->user();
            $cart = $user->cart; 
            
            $product = Product::findOrFail($request->productId);

            $cartItem = $cart->cartitems()->where('productId', $request->productId)->first();
            $currentQuantity = $cartItem ? $cartItem->quantity : 0;
            $newQuantity = $currentQuantity + $request->quantity;

            if ($product->quantity < $newQuantity) {
                return response()->json([
                    'success' => false,
                    'message' => "Chỉ còn {$product->quantity} sản phẩm trong kho."
                ], 400);
            }

            if ($cartItem) {
                $cartItem->update(['quantity' => $newQuantity]);
            } else {
                $cart->cartitems()->create([
                    'productId' => $request->productId,
                    'quantity' => $request->quantity,
                    'price' => $product->price 
                ]);
            }

            return response()->json([
                'success' => true,
                'message' => 'Thêm sản phẩm vào giỏ hàng thành công',
                'data' => new CartResource($cart->load('cartitems.product'))
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Có lỗi xảy ra: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get the cart for the authenticated user.
     * GET /api/cart
     */
    public function getCart()
    {
        try {
            $user = auth()->user();
            $cart = $user->cart->load('cartitems.product');

            return response()->json([
                'success' => true,
                'data' => new CartResource($cart)
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Có lỗi xảy ra: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update product quantity in cart.
     * PUT /api/cart/update/{cartItemId}
     */
    public function updateQuantity(Request $request, $cartItemId)
    {
        try {
            $request->validate([
                'quantity' => 'required|integer|min:1'
            ]);

            $user = auth()->user();
            $cart = $user->cart;

            $cartItem = $cart->cartitems()->where('cartItemId', $cartItemId)->firstOrFail();
            $product = Product::findOrFail($cartItem->productId);

            if ($product->quantity < $request->quantity) {
                return response()->json([
                    'success' => false,
                    'message' => "Chỉ còn {$product->quantity} sản phẩm trong kho."
                ], 400);
            }

            $cartItem->update(['quantity' => $request->quantity]);

            return response()->json([
                'success' => true,
                'message' => 'Cập nhật số lượng sản phẩm thành công',
                'data' => new CartResource($cart->load('cartitems.product'))
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Có lỗi xảy ra: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove item from cart.
     * DELETE /api/cart/remove/{cartItemId}
     */
    public function removeItem($cartItemId)
    {
        try {
            $user = auth()->user();
            $cart = $user->cart;

            $cartItem = $cart->cartitems()->where('cartItemId', $cartItemId)->firstOrFail();
            $cartItem->delete();

            return response()->json([
                'success' => true,
                'message' => 'Xóa sản phẩm khỏi giỏ hàng thành công',
                'data' => new CartResource($cart->load('cartitems.product'))
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Có lỗi xảy ra: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Clear all items from cart (XÓA TOÀN BỘ GIỎ)
     * DELETE /api/cart/clear
     */
    public function clearCart()
    {
        try {
            $user = auth()->user();
            $cart = $user->cart;

            // Xoá tất cả cartitems
            $cart->cartitems()->delete();

            return response()->json([
                'success' => true,
                'message' => 'Đã xóa toàn bộ sản phẩm khỏi giỏ hàng',
                'data' => new CartResource($cart->load('cartitems.product'))
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Có lỗi xảy ra: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Increase product quantity in cart (+1)
     * POST /api/cart/increase/{cartItemId}
     */
    public function increaseQuantity($cartItemId)
    {
        try {
            $user = auth()->user();
            $cart = $user->cart;

            $cartItem = $cart->cartitems()->where('cartItemId', $cartItemId)->firstOrFail();
            $product = Product::findOrFail($cartItem->productId);

            $newQuantity = $cartItem->quantity + 1;

            if ($product->quantity < $newQuantity) {
                return response()->json([
                    'success' => false,
                    'message' => "Chỉ còn {$product->quantity} sản phẩm trong kho."
                ], 400);
            }

            $cartItem->update(['quantity' => $newQuantity]);

            return response()->json([
                'success' => true,
                'message' => 'Tăng số lượng sản phẩm thành công',
                'data' => new CartResource($cart->load('cartitems.product'))
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Có lỗi xảy ra: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Decrease product quantity in cart (-1)
     * POST /api/cart/decrease/{cartItemId}
     */
    public function decreaseQuantity($cartItemId)
    {
        try {
            $user = auth()->user();
            $cart = $user->cart;

            $cartItem = $cart->cartitems()->where('cartItemId', $cartItemId)->firstOrFail();

            $newQuantity = $cartItem->quantity - 1;

            // Nếu số lượng <= 0 thì xóa khỏi giỏ
            if ($newQuantity <= 0) {
                $cartItem->delete();
                return response()->json([
                    'success' => true,
                    'message' => 'Sản phẩm đã bị xóa khỏi giỏ hàng',
                    'data' => new CartResource($cart->load('cartitems.product'))
                ], 200);
            }

            $cartItem->update(['quantity' => $newQuantity]);

            return response()->json([
                'success' => true,
                'message' => 'Giảm số lượng sản phẩm thành công',
                'data' => new CartResource($cart->load('cartitems.product'))
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Có lỗi xảy ra: ' . $e->getMessage()
            ], 500);
        }
    }
}