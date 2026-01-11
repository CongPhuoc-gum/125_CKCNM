@extends('admin.layouts.app')

@section('title', 'Thêm sản phẩm')

@section('content')
<div class="page-header">
    <h1 class="page-title">Thêm sản phẩm mới</h1>
    <a href="/admin/products" class="btn btn-outline">
        <i class="fas fa-arrow-left"></i> Quay lại
    </a>
</div>

<div class="card">
    <div class="card-body">
        <form id="createProductForm" enctype="multipart/form-data">
            <div class="form-group">
                <label class="form-label">Tên sản phẩm <span style="color: red;">*</span></label>
                <input type="text" name="name" class="form-control" required>
            </div>

            <div class="form-group">
                <label class="form-label">Danh mục <span style="color: red;">*</span></label>
                <select name="categoryId" class="form-control" required id="categorySelect">
                    <option value="">-- Chọn danh mục --</option>
                </select>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                <div class="form-group">
                    <label class="form-label">Giá (VNĐ) <span style="color: red;">*</span></label>
                    <input type="number" name="price" class="form-control" min="0" required>
                </div>

                <div class="form-group">
                    <label class="form-label">Số lượng <span style="color: red;">*</span></label>
                    <input type="number" name="quantity" class="form-control" min="0" required>
                </div>
            </div>

            <div class="form-group">
                <label class="form-label">Mô tả</label>
                <textarea name="description" class="form-control" rows="4"></textarea>
            </div>

            <div class="form-group">
                <label class="form-label">Hình ảnh</label>
                <input type="file" name="image" class="form-control" accept="image/*" id="imageInput">
                <div id="imagePreview" style="margin-top: 10px;"></div>
            </div>

            <div class="form-group">
                <label class="form-label">Trạng thái</label>
                <select name="status" class="form-control">
                    <option value="1">Hoạt động</option>
                    <option value="0">Ẩn</option>
                </select>
            </div>

            <div style="display: flex; gap: 12px;">
                <button type="submit" class="btn btn-primary">
                    <i class="fas fa-save"></i> Lưu sản phẩm
                </button>
                <a href="/admin/products" class="btn btn-outline">
                    <i class="fas fa-times"></i> Hủy
                </a>
            </div>
        </form>
    </div>
</div>

@endsection

@section('scripts')
<script>
const API_URL = window.location.origin + '/api';

// Load categories
async function loadCategories() {
    try {
        const response = await fetch(`${API_URL}/categories`);
        const categories = await response.json();
        
        const select = document.getElementById('categorySelect');
        categories.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat.categoryId;
            option.textContent = cat.name;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading categories:', error);
    }
}

// Image preview
document.getElementById('imageInput').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('imagePreview').innerHTML = 
                `<img src="${e.target.result}" class="image-preview" alt="Preview">`;
        };
        reader.readAsDataURL(file);
    }
});

// Submit form
document.getElementById('createProductForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    const token = localStorage.getItem('token');

    try {
        const response = await fetch(`${API_URL}/admin/products`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            },
            body: formData
        });

        const data = await response.json();

        if (response.ok) {
            alert('Thêm sản phẩm thành công!');
            window.location.href = '/admin/products';
        } else {
            alert(data.message || 'Có lỗi xảy ra');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Có lỗi xảy ra khi thêm sản phẩm');
    }
});

window.addEventListener('DOMContentLoaded', loadCategories);
</script>
@endsection