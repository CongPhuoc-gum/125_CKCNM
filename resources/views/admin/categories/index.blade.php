@extends('admin.layouts.app')

@section('title', 'Quản lý danh mục')

@section('content')
<div class="page-header">
    <h1 class="page-title">Quản lý danh mục</h1>
    <button onclick="openCreateModal()" class="btn btn-primary">
        <i class="fas fa-plus"></i> Thêm danh mục
    </button>
</div>

<div class="card">
    <div class="card-body">
        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Hình ảnh</th>
                        <th>Tên danh mục</th>
                        <th>Số sản phẩm</th>
                        <th>Trạng thái</th>
                        <th>Ngày tạo</th>
                        <th>Thao tác</th>
                    </tr>
                </thead>
                <tbody id="categoriesTable">
                    <tr>
                        <td colspan="7" class="text-center">Đang tải...</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</div>

<!-- Modal Create/Edit -->
<div id="categoryModal" style="display: none; position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.5); z-index: 9999; align-items: center; justify-content: center;">
    <div style="background: white; padding: 30px; border-radius: 12px; width: 90%; max-width: 500px; max-height: 90vh; overflow-y: auto;">
        <h2 id="modalTitle" style="margin-bottom: 20px;">Thêm danh mục mới</h2>
        
        <form id="categoryForm">
            <input type="hidden" id="categoryId">
            
            <div class="form-group">
                <label class="form-label">Tên danh mục <span style="color: red;">*</span></label>
                <input type="text" id="categoryName" class="form-control" required>
            </div>

            <div class="form-group">
                <label class="form-label">Hình ảnh</label>
                <input type="file" id="categoryImage" class="form-control" accept="image/*">
                <div id="categoryImagePreview" style="margin-top: 10px;"></div>
            </div>

            <div class="form-group">
                <label class="form-label">Trạng thái</label>
                <select id="categoryStatus" class="form-control">
                    <option value="1">Hoạt động</option>
                    <option value="0">Ẩn</option>
                </select>
            </div>

            <div style="display: flex; gap: 12px; justify-content: flex-end;">
                <button type="button" onclick="closeModal()" class="btn btn-outline">
                    <i class="fas fa-times"></i> Hủy
                </button>
                <button type="submit" class="btn btn-primary">
                    <i class="fas fa-save"></i> Lưu
                </button>
            </div>
        </form>
    </div>
</div>

@endsection

@section('scripts')
<script src="/admin/js/categories.js"></script>
@endsection