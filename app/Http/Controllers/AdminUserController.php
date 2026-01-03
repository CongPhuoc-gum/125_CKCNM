<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class AdminUserController extends Controller
{
    /**
     * Lấy danh sách users
     * GET /api/admin/users
     */
    public function index(Request $request)
    {
        $query = User::query();

        // Lọc theo role
        if ($request->filled('role')) {
            $query->where('role', $request->role);
        }

        // Lọc theo trạng thái
        if ($request->filled('isActive')) {
            $query->where('isActive', $request->isActive);
        }

        // Tìm kiếm
        if ($request->filled('search')) {
            $query->where(function($q) use ($request) {
                $q->where('fullName', 'like', '%' . $request->search . '%')
                  ->orWhere('email', 'like', '%' . $request->search . '%')
                  ->orWhere('phone', 'like', '%' . $request->search . '%');
            });
        }

        $users = $query->orderBy('createdAt', 'desc')->paginate(15);

        return response()->json([
            'success' => true,
            'data' => $users
        ]);
    }

    /**
     * Chi tiết user
     * GET /api/admin/users/{id}
     */
    public function show($id)
    {
        $user = User::with(['orders', 'reviews'])->findOrFail($id);

        $stats = [
            'total_orders' => $user->orders()->count(),
            'completed_orders' => $user->orders()->where('status', 'completed')->count(),
            'total_spent' => $user->orders()->where('status', 'completed')->sum('totalAmount'),
            'total_reviews' => $user->reviews()->count(),
        ];

        return response()->json([
            'success' => true,
            'data' => [
                'user' => $user,
                'stats' => $stats
            ]
        ]);
    }

    /**
     * Khóa/Mở khóa tài khoản
     * PUT /api/admin/users/{id}/toggle-status
     */
    public function toggleStatus($id)
    {
        $user = User::findOrFail($id);

        if ($user->isAdmin()) {
            return response()->json([
                'success' => false,
                'message' => 'Không thể khóa tài khoản admin'
            ], 403);
        }

        $user->isActive = !$user->isActive;
        $user->save();

        return response()->json([
            'success' => true,
            'message' => $user->isActive ? 'Mở khóa tài khoản thành công' : 'Khóa tài khoản thành công',
            'data' => $user
        ]);
    }
}