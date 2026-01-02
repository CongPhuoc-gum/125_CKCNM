<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Review;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReviewController extends Controller
{
    // Lấy danh sách review của 1 sản phẩm
    public function index($productId)
    {
        $reviews = Review::where('productId', $productId)
            ->with(['user:userId,username'])
            ->orderBy('reviewId', 'desc') 
            ->get();
            
        return response()->json($reviews);
    }

    public function store(Request $request)
    {
        $request->validate([
            'userId' => 'required|exists:users,userId',
            'productId' => 'required|exists:products,productId',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string'
        ]);

        $userId = $request->userId;
        $productId = $request->productId;

        
        $hasPurchased = Order::where('userId', $userId)
            ->whereIn('status', ['completed', 'shipping']) 
            ->whereHas('items', function ($query) use ($productId) {
                $query->where('productId', $productId);
            })
            ->exists();

        if (!$hasPurchased) {
            return response()->json([
                'message' => 'Bạn chưa mua sản phẩm này hoặc đơn hàng chưa hoàn thành, nên không thể đánh giá.'
            ], 403);
        }

        

        $review = Review::create([
            'userId' => $userId,
            'productId' => $productId,
            'rating' => $request->rating,
            'comment' => $request->comment,
            'createdAt' => now()
        ]);

        return response()->json(['message' => 'Đánh giá thành công', 'data' => $review], 201);
    }
}
