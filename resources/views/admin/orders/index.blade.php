@extends('admin.layouts.app')

@section('title', 'Quản lý đơn hàng')

@section('content')
<div class="page-header">
    <h1 class="page-title">Quản lý đơn hàng</h1>
</div>

<!-- Order Stats -->
<div class="stats-grid" style="grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); margin-bottom: 24px;">
    <div class="stat-card" style="padding: 16px;">
        <div class="stat-info">
            <h3>Chờ xử lý</h3>
            <div class="stat-value" id="pendingCount">0</div>
        </div>
    </div>
    <div class="stat-card" style="padding: 16px;">
        <div class="stat-info">
            <h3>Đang xử lý</h3>
            <div class="stat-value" id="processingCount">0</div>
        </div>
    </div>
    <div class="stat-card" style="padding: 16px;">
        <div class="stat-info">
            <h3>Đang giao</h3>
            <div class="stat-value" id="shippingCount">0</div>
        </div>
    </div>
    <div class="stat-card" style="padding: 16px;">
        <div class="stat-info">
            <h3>Hoàn thành</h3>
            <div class="stat-value" id="completedCount">0</div>
        </div>
    </div>
</div>

<div class="card">
    <div class="card-body">
        <!-- Filters -->
        <div class="search-bar">
            <input type="text" id="searchInput" class="form-control" placeholder="Tìm theo tên, SĐT...">
            <select id="statusFilter" class="form-control" style="max-width: 180px;">
                <option value="">Tất cả trạng thái</option>
                <option value="pending">Chờ xử lý</option>
                <option value="processing">Đang xử lý</option>
                <option value="shipping">Đang giao</option>
                <option value="completed">Hoàn thành</option>
                <option value="cancelled">Đã hủy</option>
            </select>
            <button onclick="searchOrders()" class="btn btn-primary">
                <i class="fas fa-search"></i> Tìm
            </button>
        </div>

        <!-- Orders Table -->
        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th>Mã ĐH</th>
                        <th>Khách hàng</th>
                        <th>SĐT</th>
                        <th>Tổng tiền</th>
                        <th>Trạng thái</th>
                        <th>Ngày đặt</th>
                        <th>Thao tác</th>
                    </tr>
                </thead>
                <tbody id="ordersTable">
                    <tr>
                        <td colspan="7" class="text-center">Đang tải...</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div class="pagination" id="pagination"></div>
    </div>
</div>

<!-- Order Detail Modal -->
<div id="orderDetailModal" style="display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 9999; align-items: center; justify-content: center; overflow-y: auto; padding: 20px;">
    <div style="background: white; padding: 30px; border-radius: 12px; width: 90%; max-width: 800px; max-height: 90vh; overflow-y: auto;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <h2>Chi tiết đơn hàng #<span id="detailOrderId"></span></h2>
            <button onclick="closeDetailModal()" style="background: none; border: none; font-size: 24px; cursor: pointer;">&times;</button>
        </div>
        
        <div id="orderDetailContent">
            <p>Đang tải...</p>
        </div>
    </div>
</div>

@endsection

@section('scripts')
<script src="/admin/js/orders.js"></script>
@endsection