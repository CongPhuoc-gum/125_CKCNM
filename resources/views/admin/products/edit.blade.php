@extends('admin.layouts.app')

@section('title', 'Chỉnh sửa sản phẩm')

@section('content')
<div class="page-header">
    <h1 class="page-title">Chỉnh sửa sản phẩm</h1>
    <a href="/admin/products" class="btn btn-outline">
        <i class="fas fa-arrow-left"></i> Quay lại
    </a>
</div>

<div class="card">
    <div class="card-body">
        <form id="editProductForm" enctype="multipart/form-data">
            <input type="hidden" id="productId">

            <div class="form-group">
                <label class="form-label">Tên sản phẩm <span style="color: red;">*</span></label>
                <input type="text" id="productName" name="name" class="form-control" required>
            </div>

            <div class="form-group">
                <label class="form-label">Danh mục <span style="color: red;">*</span></label>
                <select id="categorySelect" name="categoryId" class="form-control" required>
                    <option value="">-- Chọn danh mục --</option>
                </select>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
                <div class="form-group">
                    <label class="form-label">Giá (VNĐ) <span style="color: red;">*</span></label>
                    <input type="number" id="productPrice" name="price" class="form-control" min="0" required>
                </div>

                <div class="form-group">
                    <label class="form-label">Số lượng <span style="color: red;">*</span></label>
                    <input type="number" id="productQuantity" name="quantity" class="form-control" min="0" required>
                </div>
            </div>

            <div class="form-group">
                <label class="form-label">Mô tả</label>
                <textarea id="productDescription" name="description" class="form-control" rows="4"></textarea>
            </div>

            <div class="form-group">
                <label class="form-label">Hình ảnh hiện tại</label>
                <div id="currentImage" style="margin-bottom: 10px;"></div>
                
                <label class="form-label">Thay đổi hình ảnh</label>
                <input type="file" id="imageInput" name="image" class="form-control" accept="image/*">
                <div id="imagePreview" style="margin-top: 10px;"></div>
            </div>

            <div class="form-group">
                <label class="form-label">Trạng thái</label>
                <select id="productStatus" name="status" class="form-control">
                    <option value="1">Hoạt động</option>
                    <option value="0">Ẩn</option>
                </select>
            </div>

            <div style="display: flex; gap: 12px;">
                <button type="submit" class="btn btn-primary">
                    <i class="fas fa-save"></i> Cập nhật sản phẩm
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
const API_URL = '/api';

// Get product ID from URL
const productId = window.location.pathname.split('/')[3];

// Load product data
async function loadProduct() {
    try {
        // Dùng public route để load data (không cần auth)
        const response = await fetch(`${API_URL}/products/${productId}`, {
            headers: {
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to load product');
        }

        const product = await response.json();

        // Fill form
        document.getElementById('productId').value = product.productId;
        document.getElementById('productName').value = product.name;
        document.getElementById('productPrice').value = product.price;
        document.getElementById('productQuantity').value = product.quantity;
        document.getElementById('productDescription').value = product.description || '';
        document.getElementById('productStatus').value = product.status ? '1' : '0';
        document.getElementById('categorySelect').value = product.categoryId;

        // Show current image
        if (product.imageUrl) {
            document.getElementById('currentImage').innerHTML = 
                `<img src="/storage/${product.imageUrl}" class="image-preview" alt="${product.name}">`;
        }

    } catch (error) {
        console.error('Error loading product:', error);
        alert('Không thể tải thông tin sản phẩm');
        window.location.href = '/admin/products';
    }
}

// Load categories
async function loadCategories() {
    try {
        const response = await fetch(`${API_URL}/categories`);
        
        if (!response.ok) {
            throw new Error('Failed to load categories');
        }
        
        const categories = await response.json();
        
        const select = document.getElementById('categorySelect');
        categories.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat.categoryId;
            option.textContent = cat.name;
            select.appendChild(option);
        });

        // Load product after categories loaded
        await loadProduct();
        
    } catch (error) {
        console.error('Error loading categories:', error);
        alert('Không thể tải danh mục');
    }
}

// Image preview
document.getElementById('imageInput').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('imagePreview').innerHTML = 
                `<p style="color: #10b981; margin-bottom: 8px;">Ảnh mới:</p>
                 <img src="${e.target.result}" class="image-preview" alt="Preview">`;
        };
        reader.readAsDataURL(file);
    }
});

// Submit form
document.getElementById('editProductForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const formData = new FormData();

    // Add form fields
    formData.append('name', document.getElementById('productName').value);
    formData.append('categoryId', document.getElementById('categorySelect').value);
    formData.append('price', document.getElementById('productPrice').value);
    formData.append('quantity', document.getElementById('productQuantity').value);
    formData.append('description', document.getElementById('productDescription').value);
    formData.append('status', document.getElementById('productStatus').value);

    // Add image if changed
    const imageFile = document.getElementById('imageInput').files[0];
    if (imageFile) {
        formData.append('image', imageFile);
    }

    // Laravel requires _method for PUT with FormData
    formData.append('_method', 'PUT');

    try {
        // ✅ FIX: Đổi từ /api/products/{id} → /api/admin/products/{id}
        const response = await fetch(`${API_URL}/admin/products/${productId}`, {
            method: 'POST', // Use POST with _method=PUT for file upload
            headers: {
                'Accept': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
            },
            body: formData
        });

        const data = await response.json();

        if (response.ok) {
            alert('Cập nhật sản phẩm thành công!');
            window.location.href = '/admin/products';
        } else {
            // Hiển thị chi tiết lỗi
            console.error('Error response:', data);
            
            if (data.errors) {
                let errorMsg = 'Lỗi validation:\n';
                for (let field in data.errors) {
                    errorMsg += `- ${data.errors[field].join(', ')}\n`;
                }
                alert(errorMsg);
            } else if (data.message) {
                alert('Lỗi: ' + data.message);
            } else {
                alert('Có lỗi xảy ra khi cập nhật sản phẩm');
            }
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Có lỗi xảy ra khi cập nhật sản phẩm. Vui lòng kiểm tra console để biết thêm chi tiết.');
    }
});

window.addEventListener('DOMContentLoaded', loadCategories);
</script>
@endsection