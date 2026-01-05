@extends('admin.layouts.app')

@section('title', 'Quản lý đánh giá')

@section('content')
<div class="page-header">
    <h1 class="page-title">Quản lý đánh giá</h1>
</div>

<div class="card">
    <div class="card-body">
        <!-- Search and Filter -->
        <div class="search-bar">
            <input type="text" id="searchInput" class="form-control" placeholder="Tìm theo tên sản phẩm...">
            <select id="ratingFilter" class="form-control" style="max-width: 150px;">
                <option value="">Tất cả đánh giá</option>
                <option value="5">⭐⭐⭐⭐⭐ (5 sao)</option>
                <option value="4">⭐⭐⭐⭐ (4 sao)</option>
                <option value="3">⭐⭐⭐ (3 sao)</option>
                <option value="2">⭐⭐ (2 sao)</option>
                <option value="1">⭐ (1 sao)</option>
            </select>
            <button onclick="searchReviews()" class="btn btn-primary">
                <i class="fas fa-search"></i> Tìm
            </button>
        </div>

        <!-- Reviews Table -->
        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Sản phẩm</th>
                        <th>Người đánh giá</th>
                        <th>Đánh giá</th>
                        <th>Bình luận</th>
                        <th>Ngày tạo</th>
                        <th>Thao tác</th>
                    </tr>
                </thead>
                <tbody id="reviewsTable">
                    <tr>
                        <td colspan="7" class="text-center">Đang tải...</td>
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
<script src="/admin/js/reviews.js"></script>
@endsection