@extends('admin.layouts.app')

@section('title', 'Quản lý sản phẩm')

@section('content')
<div class="page-header">
    <h1 class="page-title">Quản lý sản phẩm</h1>
    <a href="/admin/products/create" class="btn btn-primary">
        <i class="fas fa-plus"></i> Thêm sản phẩm
    </a>
</div>

<div class="card">
    <div class="card-body">
        <!-- Search and Filter -->
        <div class="search-bar">
            <input type="text" id="searchInput" class="form-control" placeholder="Tìm kiếm sản phẩm...">
            <select id="categoryFilter" class="form-control" style="max-width: 200px;">
                <option value="">Tất cả danh mục</option>
            </select>
            <select id="statusFilter" class="form-control" style="max-width: 150px;">
                <option value="">Tất cả trạng thái</option>
                <option value="1">Hoạt động</option>
                <option value="0">Ẩn</option>
            </select>
            <button onclick="searchProducts()" class="btn btn-primary">
                <i class="fas fa-search"></i> Tìm
            </button>
        </div>

        <!-- Products Table -->
        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Hình ảnh</th>
                        <th>Tên sản phẩm</th>
                        <th>Danh mục</th>
                        <th>Giá</th>
                        <th>Số lượng</th>
                        <th>Trạng thái</th>
                        <th>Thao tác</th>
                    </tr>
                </thead>
                <tbody id="productsTable">
                    <tr>
                        <td colspan="8" class="text-center">Đang tải...</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Pagination -->
        <div class="pagination" id="pagination"></div>
    </div>
</div>

@endsection

@section('scripts')
<script src="/admin/js/products.js"></script>
@endsection