let currentPage = 1;
let searchQuery = '';
let categoryFilter = '';
let statusFilter = '';

// Load products when page loads
document.addEventListener('DOMContentLoaded', function() {
    loadCategories();
    loadProducts();
});

// Load categories for filter
async function loadCategories() {
    try {
        const response = await fetch('/api/categories');
        const categories = await response.json();
        
        const categoryFilter = document.getElementById('categoryFilter');
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.categoryId;
            option.textContent = category.name;
            categoryFilter.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading categories:', error);
    }
}

// Load products with filters
async function loadProducts(page = 1) {
    try {
        currentPage = page;
        
        let url = `/api/products?page=${page}`;
        
        if (searchQuery) url += `&search=${searchQuery}`;
        if (categoryFilter) url += `&categoryId=${categoryFilter}`;
        if (statusFilter !== '') url += `&status=${statusFilter}`;
        
        const response = await fetch(url);
        const data = await response.json();
        
        displayProducts(data.data);
        displayPagination(data);
        
    } catch (error) {
        console.error('Error loading products:', error);
        document.getElementById('productsTable').innerHTML = 
            '<tr><td colspan="8" class="text-center text-danger">Lỗi tải dữ liệu</td></tr>';
    }
}

// Display products in table
function displayProducts(products) {
    const tbody = document.getElementById('productsTable');
    
    if (products.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" class="text-center">Không có sản phẩm nào</td></tr>';
        return;
    }
    
    tbody.innerHTML = products.map(product => {
        // Đường dẫn ảnh đúng
        const imageUrl = product.imageUrl 
            ? `/storage/${product.imageUrl}` 
            : '/admin/images/no-image.png';
        
        const statusBadge = product.status == 1 
            ? '<span class="badge badge-success">Hoạt động</span>'
            : '<span class="badge badge-danger">Ẩn</span>';
            
        return `
            <tr>
                <td>${product.productId}</td>
                <td>
                    <img src="${imageUrl}" 
                         alt="${product.name}" 
                         style="width: 60px; height: 60px; object-fit: cover; border-radius: 4px;"
                         onerror="this.src='/admin/images/no-image.png'">
                </td>
                <td>${product.name}</td>
                <td>${product.category ? product.category.name : 'N/A'}</td>
                <td>${formatPrice(product.price)}</td>
                <td>${product.quantity || 0}</td>
                <td>${statusBadge}</td>
                <td>
                    <a href="/admin/products/${product.productId}/edit" 
                       class="btn btn-sm btn-primary" 
                       title="Sửa">
                        <i class="fas fa-edit"></i>
                    </a>
                    <button onclick="deleteProduct(${product.productId})" 
                            class="btn btn-sm btn-danger" 
                            title="Xóa">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

// Display pagination
function displayPagination(data) {
    const pagination = document.getElementById('pagination');
    
    if (data.last_page <= 1) {
        pagination.innerHTML = '';
        return;
    }
    
    let html = '<ul class="pagination-list">';
    
    // Previous button
    if (data.current_page > 1) {
        html += `<li><a href="#" onclick="loadProducts(${data.current_page - 1}); return false;">Trước</a></li>`;
    }
    
    // Page numbers
    for (let i = 1; i <= data.last_page; i++) {
        if (i === data.current_page) {
            html += `<li class="active"><span>${i}</span></li>`;
        } else {
            html += `<li><a href="#" onclick="loadProducts(${i}); return false;">${i}</a></li>`;
        }
    }
    
    // Next button
    if (data.current_page < data.last_page) {
        html += `<li><a href="#" onclick="loadProducts(${data.current_page + 1}); return false;">Sau</a></li>`;
    }
    
    html += '</ul>';
    pagination.innerHTML = html;
}

// Search products
function searchProducts() {
    searchQuery = document.getElementById('searchInput').value;
    categoryFilter = document.getElementById('categoryFilter').value;
    statusFilter = document.getElementById('statusFilter').value;
    loadProducts(1);
}

// Delete product
async function deleteProduct(id) {
    if (!confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
        return;
    }
    
    try {
        // ✅ FIX: Đổi từ /api/products/{id} → /api/admin/products/{id}
        const response = await fetch(`/api/admin/products/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
            }
        });
        
        const result = await response.json();
        
        if (response.ok) {
            showNotification('Xóa sản phẩm thành công', 'success');
            loadProducts(currentPage);
        } else {
            showNotification('Lỗi: ' + (result.message || 'Không thể xóa sản phẩm'), 'error');
        }
    } catch (error) {
        console.error('Error deleting product:', error);
        showNotification('Lỗi kết nối', 'error');
    }
}

// Format price
function formatPrice(price) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(price);
}

// Show notification
function showNotification(message, type) {
    // You can implement a toast notification here
    alert(message);
}

// Search on Enter key
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchProducts();
            }
        });
    }
});