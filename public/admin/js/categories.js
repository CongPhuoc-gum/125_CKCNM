const API_URL = 'http://127.0.0.1:8000/api';
let isEditMode = false;

async function loadCategories() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/categories`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            }
        });

        const categories = await response.json();
        displayCategories(categories);

    } catch (error) {
        console.error('Error loading categories:', error);
        document.getElementById('categoriesTable').innerHTML = 
            '<tr><td colspan="7" class="text-center">Lỗi tải dữ liệu</td></tr>';
    }
}

function displayCategories(categories) {
    const tbody = document.getElementById('categoriesTable');
    
    if (!categories || categories.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center">Chưa có danh mục nào</td></tr>';
        return;
    }

    tbody.innerHTML = categories.map(cat => `
        <tr>
            <td>${cat.categoryId}</td>
            <td>
                <img src="${cat.imageUrl ? '/storage/' + cat.imageUrl : '/images/no-image.png'}" 
                     class="image-preview" alt="${cat.name}">
            </td>
            <td><strong>${cat.name}</strong></td>
            <td>${cat.products_count || 0}</td>
            <td>${cat.status ? '<span class="badge badge-success">Hoạt động</span>' : '<span class="badge badge-danger">Ẩn</span>'}</td>
            <td>${formatDate(cat.createdAt)}</td>
            <td>
                <button onclick="editCategory(${cat.categoryId})" class="btn btn-sm btn-primary">
                    <i class="fas fa-edit"></i>
                </button>
                <button onclick="deleteCategory(${cat.categoryId})" class="btn btn-sm btn-danger">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function openCreateModal() {
    isEditMode = false;
    document.getElementById('modalTitle').textContent = 'Thêm danh mục mới';
    document.getElementById('categoryForm').reset();
    document.getElementById('categoryId').value = '';
    document.getElementById('categoryImagePreview').innerHTML = '';
    document.getElementById('categoryModal').style.display = 'flex';
}

async function editCategory(id) {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/categories/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            }
        });

        const category = await response.json();

        isEditMode = true;
        document.getElementById('modalTitle').textContent = 'Chỉnh sửa danh mục';
        document.getElementById('categoryId').value = category.categoryId;
        document.getElementById('categoryName').value = category.name;
        document.getElementById('categoryStatus').value = category.status ? '1' : '0';
        
        if (category.imageUrl) {
            document.getElementById('categoryImagePreview').innerHTML = 
                `<img src="/storage/${category.imageUrl}" class="image-preview" alt="${category.name}">`;
        }

        document.getElementById('categoryModal').style.display = 'flex';

    } catch (error) {
        console.error('Error loading category:', error);
        alert('Không thể tải thông tin danh mục');
    }
}

function closeModal() {
    document.getElementById('categoryModal').style.display = 'none';
}

// Image preview
document.getElementById('categoryImage').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('categoryImagePreview').innerHTML = 
                `<img src="${e.target.result}" class="image-preview" alt="Preview">`;
        };
        reader.readAsDataURL(file);
    }
});

// Submit form
document.getElementById('categoryForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const categoryId = document.getElementById('categoryId').value;
    const formData = new FormData();
    
    formData.append('name', document.getElementById('categoryName').value);
    formData.append('status', document.getElementById('categoryStatus').value);
    
    const imageFile = document.getElementById('categoryImage').files[0];
    if (imageFile) {
        formData.append('image', imageFile);
    }

    const token = localStorage.getItem('token');
    const url = isEditMode ? `${API_URL}/admin/categories/${categoryId}` : `${API_URL}/admin/categories`;
    const method = isEditMode ? 'PUT' : 'POST';

    try {
        let response;
        
        if (isEditMode) {
            // For PUT, need to send as JSON if no file
            if (!imageFile) {
                response = await fetch(url, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        name: document.getElementById('categoryName').value,
                        status: parseInt(document.getElementById('categoryStatus').value)
                    })
                });
            } else {
                formData.append('_method', 'PUT');
                response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json'
                    },
                    body: formData
                });
            }
        } else {
            response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/json'
                },
                body: formData
            });
        }

        const data = await response.json();

        if (response.ok) {
            alert(isEditMode ? 'Cập nhật danh mục thành công!' : 'Thêm danh mục thành công!');
            closeModal();
            loadCategories();
        } else {
            alert(data.message || 'Có lỗi xảy ra');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Có lỗi xảy ra khi lưu danh mục');
    }
});

async function deleteCategory(id) {
    if (!confirm('Bạn có chắc muốn xóa danh mục này?')) return;

    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/admin/categories/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            }
        });

        const data = await response.json();

        if (response.ok) {
            alert('Xóa danh mục thành công!');
            loadCategories();
        } else {
            alert(data.message || 'Không thể xóa danh mục');
        }
    } catch (error) {
        console.error('Error deleting category:', error);
        alert('Có lỗi xảy ra khi xóa danh mục');
    }
}

function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
}

// Close modal on background click
document.getElementById('categoryModal').addEventListener('click', function(e) {
    if (e.target === this) {
        closeModal();
    }
});

window.addEventListener('DOMContentLoaded', loadCategories);