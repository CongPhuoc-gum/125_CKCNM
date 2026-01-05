@extends('admin.layouts.app')

@section('title', 'Dashboard')

@section('content')
<div class="page-header">
    <h1 class="page-title">Dashboard</h1>
</div>

<!-- Stats Cards -->
<div class="stats-grid">
    <div class="stat-card">
        <div class="stat-icon success">
            <i class="fas fa-dollar-sign"></i>
        </div>
        <div class="stat-info">
            <h3>Tổng doanh thu</h3>
            <div class="stat-value" id="totalRevenue">0đ</div>
        </div>
    </div>

    <div class="stat-card">
        <div class="stat-icon primary">
            <i class="fas fa-shopping-cart"></i>
        </div>
        <div class="stat-info">
            <h3>Đơn hàng</h3>
            <div class="stat-value" id="totalOrders">0</div>
        </div>
    </div>

    <div class="stat-card">
        <div class="stat-icon warning">
            <i class="fas fa-clock"></i>
        </div>
        <div class="stat-info">
            <h3>Chờ xử lý</h3>
            <div class="stat-value" id="pendingOrders">0</div>
        </div>
    </div>

    <div class="stat-card">
        <div class="stat-icon danger">
            <i class="fas fa-box"></i>
        </div>
        <div class="stat-info">
            <h3>Sản phẩm</h3>
            <div class="stat-value" id="totalProducts">0</div>
        </div>
    </div>

    <div class="stat-card">
        <div class="stat-icon primary">
            <i class="fas fa-users"></i>
        </div>
        <div class="stat-info">
            <h3>Người dùng</h3>
            <div class="stat-value" id="totalUsers">0</div>
        </div>
    </div>

    <div class="stat-card">
        <div class="stat-icon warning">
            <i class="fas fa-exclamation-triangle"></i>
        </div>
        <div class="stat-info">
            <h3>Sắp hết hàng</h3>
            <div class="stat-value" id="lowStockProducts">0</div>
        </div>
    </div>
</div>

<!-- Charts and Tables -->
<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px;">
    <!-- Top Products -->
    <div class="card">
        <div class="card-header">
            <h3 class="card-title">Top 5 sản phẩm bán chạy</h3>
        </div>
        <div class="card-body">
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Sản phẩm</th>
                            <th>Đã bán</th>
                        </tr>
                    </thead>
                    <tbody id="topProductsTable">
                        <tr>
                            <td colspan="2" class="text-center">Đang tải...</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <!-- Recent Orders -->
    <div class="card">
        <div class="card-header">
            <h3 class="card-title">Đơn hàng gần đây</h3>
        </div>
        <div class="card-body">
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Mã ĐH</th>
                            <th>Khách hàng</th>
                            <th>Trạng thái</th>
                        </tr>
                    </thead>
                    <tbody id="recentOrdersTable">
                        <tr>
                            <td colspan="3" class="text-center">Đang tải...</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>

<!-- Low Stock Products -->
<div class="card">
    <div class="card-header">
        <h3 class="card-title">Sản phẩm sắp hết hàng</h3>
    </div>
    <div class="card-body">
        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th>Sản phẩm</th>
                        <th>Danh mục</th>
                        <th>Số lượng</th>
                        <th>Giá</th>
                        <th>Thao tác</th>
                    </tr>
                </thead>
                <tbody id="lowStockTable">
                    <tr>
                        <td colspan="5" class="text-center">Đang tải...</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</div>

@endsection

@section('scripts')
<script src="/admin/js/dashboard.js"></script>
@endsection