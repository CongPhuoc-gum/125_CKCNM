<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use App\Models\Category;
use Carbon\Carbon;
use Illuminate\Http\Request;

class AdminDashboardController extends Controller
{
    /**
     * Dashboard statistics
     * GET /api/admin/dashboard
     */
    public function index(Request $request)
    {
        // Thống kê tổng quan
        $stats = [
            'total_revenue' => Order::whereIn('status', ['completed', 'processing', 'shipping'])
                ->sum('totalAmount'),
            'total_orders' => Order::count(),
            'pending_orders' => Order::where('status', 'pending')->count(),
            'total_products' => Product::count(),
            'low_stock_products' => Product::where('quantity', '<', 10)->count(),
            'total_users' => User::where('role', 'user')->count(),
            'total_categories' => Category::count(),
        ];

        // Doanh thu theo ngày (7 ngày gần nhất)
        $revenueChart = Order::whereIn('status', ['completed', 'processing', 'shipping'])
            ->where('createdAt', '>=', Carbon::now()->subDays(7))
            ->selectRaw('DATE(createdAt) as date, SUM(totalAmount) as revenue, COUNT(*) as orders')
            ->groupBy('date')
            ->orderBy('date', 'asc')
            ->get();

        // Top 10 sản phẩm bán chạy
        $topProducts = Product::withSum('orderitems', 'quantity')
            ->with('category:categoryId,name')
            ->orderBy('orderitems_sum_quantity', 'desc')
            ->take(10)
            ->get();

        // Đơn hàng gần nhất
        $recentOrders = Order::with(['user:userId,fullName'])
            ->orderBy('createdAt', 'desc')
            ->take(10)
            ->get();

        // Sản phẩm sắp hết hàng
        $lowStockProducts = Product::where('quantity', '<', 10)
            ->orderBy('quantity', 'asc')
            ->take(10)
            ->get();

        return response()->json([
            'success' => true,
            'data' => [
                'stats' => $stats,
                'revenue_chart' => $revenueChart,
                'top_products' => $topProducts,
                'recent_orders' => $recentOrders,
                'low_stock_products' => $lowStockProducts,
            ]
        ]);
    }
}