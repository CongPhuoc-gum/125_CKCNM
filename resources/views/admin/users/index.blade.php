@extends('admin.layouts.app')

@section('title', 'Quản lý người dùng')

@section('content')
<div class="page-header">
    <h1 class="page-title">Quản lý người dùng</h1>
</div>

<div class="card">
    <div class="card-body">
        <!-- Search and Filter -->
        <div class="search-bar">
            <input type="text" id="searchInput" class="form-control" placeholder="Tìm theo tên, email, SĐT...">
            <select id="roleFilter" class="form-control" style="max-width: 150px;">
                <option value="">Tất cả vai trò</option>
                <option value="user">User</option>
                <option value="admin">Admin</option>
            </select>
            <select id="statusFilter" class="form-control" style="max-width: 150px;">
                <option value="">Tất cả trạng thái</option>
                <option value="1">Hoạt động</option>
                <option value="0">Bị khóa</option>
            </select>
            <button onclick="searchUsers()" class="btn btn-primary">
                <i class="fas fa-search"></i> Tìm
            </button>
        </div>

        <!-- Users Table -->
        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Họ tên</th>
                        <th>Email</th>
                        <th>Số điện thoại</th>
                        <th>Vai trò</th>
                        <th>Trạng thái</th>
                        <th>Ngày đăng ký</th>
                        <th>Thao tác</th>
                    </tr>
                </thead>
                <tbody id="usersTable">
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

<!-- User Detail Modal -->
<div id="userDetailModal" style="display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 9999; align-items: center; justify-content: center; overflow-y: auto; padding: 20px;">
    <div style="background: white; padding: 30px; border-radius: 12px; width: 90%; max-width: 700px; max-height: 90vh; overflow-y: auto;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
            <h2>Thông tin người dùng</h2>
            <button onclick="closeUserModal()" style="background: none; border: none; font-size: 24px; cursor: pointer;">&times;</button>
        </div>
        
        <div id="userDetailContent">
            <p>Đang tải...</p>
        </div>
    </div>
</div>

@endsection

@section('scripts')
<script src="/admin/js/users.js"></script>
@endsection