const API_URL = 'http://127.0.0.1:8000/api';
let currentPage = 1;

async function loadUsers(page = 1) {
    try {
        const token = localStorage.getItem('token');
        const search = document.getElementById('searchInput')?.value || '';
        const role = document.getElementById('roleFilter')?.value || '';
        const isActive = document.getElementById('statusFilter')?.value || '';

        let url = `${API_URL}/admin/users?page=${page}`;
        if (search) url += `&search=${search}`;
        if (role) url += `&role=${role}`;
        if (isActive !== '') url += `&isActive=${isActive}`;

        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            }
        });

        const result = await response.json();
        const data = result.data;
        
        displayUsers(data.data);
        displayPagination(data);
        currentPage = page;

    } catch (error) {
        console.error('Error loading users:', error);
        document.getElementById('usersTable').innerHTML = 
            '<tr><td colspan="8" class="text-center">Lỗi tải dữ liệu</td></tr>';
    }
}

function displayUsers(users) {
    const tbody = document.getElementById('usersTable');
    
    if (!users || users.length === 0) {
        tbody.innerHTML = '<tr><td colspan="8" class="text-center">Không có người dùng nào</td></tr>';
        return;
    }

    tbody.innerHTML = users.map(user => `
        <tr>
            <td>${user.userId}</td>
            <td><strong>${user.fullName}</strong></td>
            <td>${user.email}</td>
            <td>${user.phone || 'N/A'}</td>
            <td>${user.role === 'admin' ? '<span class="badge badge-danger">Admin</span>' : '<span class="badge badge-primary">User</span>'}</td>
            <td>${user.isActive ? '<span class="badge badge-success">Hoạt động</span>' : '<span class="badge badge-danger">Bị khóa</span>'}</td>
            <td>${formatDate(user.createdAt)}</td>
            <td>
                <button onclick="viewUserDetail(${user.userId})" class="btn btn-sm btn-primary">
                    <i class="fas fa-eye"></i>
                </button>
                ${user.role !== 'admin' ? `
                    <button onclick="toggleUserStatus(${user.userId}, ${user.isActive})" 
                            class="btn btn-sm ${user.isActive ? 'btn-danger' : 'btn-success'}">
                        <i class="fas ${user.isActive ? 'fa-lock' : 'fa-unlock'}"></i>
                    </button>
                ` : ''}
            </td>
        </tr>
    `).join('');
}

async function viewUserDetail(userId) {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/admin/users/${userId}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            }
        });

        const result = await response.json();
        const user = result.data.user;
        const stats = result.data.stats;

        const content = `
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                <div>
                    <h4 style="margin-bottom: 15px;">Thông tin cá nhân</h4>
                    <div style="margin-bottom: 10px;">
                        <p style="color: #6b7280; margin-bottom: 4px;">Họ tên:</p>
                        <p style="font-weight: 600;">${user.fullName}</p>
                    </div>
                    <div style="margin-bottom: 10px;">
                        <p style="color: #6b7280; margin-bottom: 4px;">Email:</p>
                        <p style="font-weight: 600;">${user.email}</p>
                    </div>
                    <div style="margin-bottom: 10px;">
                        <p style="color: #6b7280; margin-bottom: 4px;">Số điện thoại:</p>
                        <p style="font-weight: 600;">${user.phone || 'Chưa cập nhật'}</p>
                    </div>
                    <div style="margin-bottom: 10px;">
                        <p style="color: #6b7280; margin-bottom: 4px;">Vai trò:</p>
                        <p>${user.role === 'admin' ? '<span class="badge badge-danger">Admin</span>' : '<span class="badge badge-primary">User</span>'}</p>
                    </div>
                    <div style="margin-bottom: 10px;">
                        <p style="color: #6b7280; margin-bottom: 4px;">Trạng thái:</p>
                        <p>${user.isActive ? '<span class="badge badge-success">Hoạt động</span>' : '<span class="badge badge-danger">Bị khóa</span>'}</p>
                    </div>
                    <div>
                        <p style="color: #6b7280; margin-bottom: 4px;">Ngày đăng ký:</p>
                        <p style="font-weight: 600;">${formatDate(user.createdAt)}</p>
                    </div>
                </div>

                <div>
                    <h4 style="margin-bottom: 15px;">Thống kê hoạt động</h4>
                    <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin-bottom: 10px;">
                        <p style="color: #6b7280; font-size: 14px;">Tổng đơn hàng</p>
                        <p style="font-size: 24px; font-weight: 700; color: #4f46e5;">${stats.total_orders}</p>
                    </div>
                    <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin-bottom: 10px;">
                        <p style="color: #6b7280; font-size: 14px;">Đơn hoàn thành</p>
                        <p style="font-size: 24px; font-weight: 700; color: #10b981;">${stats.completed_orders}</p>
                    </div>
                    <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin-bottom: 10px;">
                        <p style="color: #6b7280; font-size: 14px;">Tổng chi tiêu</p>
                        <p style="font-size: 20px; font-weight: 700; color: #ef4444;">${formatCurrency(stats.total_spent)}</p>
                    </div>
                    <div style="background: #f3f4f6; padding: 15px; border-radius: 8px;">
                        <p style="color: #6b7280; font-size: 14px;">Đánh giá</p>
                        <p style="font-size: 24px; font-weight: 700; color: #f59e0b;">${stats.total_reviews}</p>
                    </div>
                </div>
            </div>

            ${user.role !== 'admin' ? `
                <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center;">
                    <button onclick="toggleUserStatus(${user.userId}, ${user.isActive}); closeUserModal();" 
                            class="btn ${user.isActive ? 'btn-danger' : 'btn-success'}">
                        <i class="fas ${user.isActive ? 'fa-lock' : 'fa-unlock'}"></i>
                        ${user.isActive ? 'Khóa tài khoản' : 'Mở khóa tài khoản'}
                    </button>
                </div>
            ` : ''}
        `;

        document.getElementById('userDetailContent').innerHTML = content;
        document.getElementById('userDetailModal').style.display = 'flex';

    } catch (error) {
        console.error('Error loading user detail:', error);
        alert('Không thể tải thông tin người dùng');
    }
}

function closeUserModal() {
    document.getElementById('userDetailModal').style.display = 'none';
}

async function toggleUserStatus(userId, currentStatus) {
    const action = currentStatus ? 'khóa' : 'mở khóa';
    if (!confirm(`Bạn có chắc muốn ${action} tài khoản này?`)) return;

    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/admin/users/${userId}/toggle-status`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            }
        });

        const data = await response.json();

        if (response.ok) {
            alert(data.message);
            loadUsers(currentPage);
        } else {
            alert(data.message || `Không thể ${action} tài khoản`);
        }
    } catch (error) {
        console.error('Error toggling user status:', error);
        alert('Có lỗi xảy ra khi cập nhật trạng thái');
    }
}

function displayPagination(data) {
    const container = document.getElementById('pagination');
    if (!container) return;

    const { current_page, last_page } = data;
    
    let html = '';
    
    html += `<button onclick="loadUsers(${current_page - 1})" ${current_page === 1 ? 'disabled' : ''}>
        <i class="fas fa-chevron-left"></i>
    </button>`;
    
    for (let i = 1; i <= last_page; i++) {
        if (i === 1 || i === last_page || (i >= current_page - 2 && i <= current_page + 2)) {
            html += `<button onclick="loadUsers(${i})" class="${i === current_page ? 'active' : ''}">${i}</button>`;
        } else if (i === current_page - 3 || i === current_page + 3) {
            html += `<button disabled>...</button>`;
        }
    }
    
    html += `<button onclick="loadUsers(${current_page + 1})" ${current_page === last_page ? 'disabled' : ''}>
        <i class="fas fa-chevron-right"></i>
    </button>`;
    
    container.innerHTML = html;
}

function searchUsers() {
    loadUsers(1);
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
}

function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
}

window.addEventListener('DOMContentLoaded', () => {
    loadUsers();
    
    document.getElementById('searchInput')?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') searchUsers();
    });
});

document.getElementById('userDetailModal')?.addEventListener('click', function(e) {
    if (e.target === this) closeUserModal();
});