const API_URL = window.location.origin + '/api';
let currentPage = 1;

async function loadOrders(page = 1) {
    try {
        const token = localStorage.getItem('token');
        const search = document.getElementById('searchInput')?.value || '';
        const status = document.getElementById('statusFilter')?.value || '';

        let url = `${API_URL}/admin/orders?page=${page}`;
        if (search) url += `&search=${search}`;
        if (status) url += `&status=${status}`;

        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            }
        });

        const result = await response.json();
        const data = result.data;

        displayOrders(data.data);
        displayPagination(data);
        currentPage = page;

    } catch (error) {
        console.error('Error loading orders:', error);
        document.getElementById('ordersTable').innerHTML =
            '<tr><td colspan="7" class="text-center">Lỗi tải dữ liệu</td></tr>';
    }
}

async function loadOrderStats() {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/admin/orders/statistics`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            }
        });

        const result = await response.json();
        const stats = result.data;

        document.getElementById('pendingCount').textContent = stats.pending;
        document.getElementById('processingCount').textContent = stats.processing;
        document.getElementById('shippingCount').textContent = stats.shipping;
        document.getElementById('completedCount').textContent = stats.completed;

    } catch (error) {
        console.error('Error loading stats:', error);
    }
}

function displayOrders(orders) {
    const tbody = document.getElementById('ordersTable');

    if (!orders || orders.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center">Không có đơn hàng nào</td></tr>';
        return;
    }

    tbody.innerHTML = orders.map(order => `
        <tr>
            <td><strong>#${order.orderId}</strong></td>
            <td>${order.customerName}</td>
            <td>${order.phone}</td>
            <td><strong>${formatCurrency(order.totalAmount)}</strong></td>
            <td>${getStatusBadge(order.status)}</td>
            <td>${formatDate(order.createdAt)}</td>
            <td>
                <button onclick="viewOrderDetail(${order.orderId})" class="btn btn-sm btn-primary">
                    <i class="fas fa-eye"></i>
                </button>
                ${order.status === 'pending' || order.status === 'processing' ? `
                    <select onchange="updateOrderStatus(${order.orderId}, this.value)" class="btn btn-sm" style="padding: 6px 8px;">
                        <option value="">Cập nhật</option>
                        ${order.status === 'pending' ? '<option value="processing">Xử lý</option>' : ''}
                        ${order.status === 'processing' ? '<option value="shipping">Giao hàng</option>' : ''}
                        <option value="cancelled">Hủy</option>
                    </select>
                ` : ''}
            </td>
        </tr>
    `).join('');
}

async function viewOrderDetail(orderId) {
    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/orders/detail/${orderId}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            }
        });

        const order = await response.json();

        document.getElementById('detailOrderId').textContent = order.orderId;

        let itemsHtml = '';
        if (order.items && order.items.length > 0) {
            itemsHtml = `
                <table style="width: 100%; margin-top: 20px; border-collapse: collapse;">
                    <thead>
                        <tr style="background: #f3f4f6;">
                            <th style="padding: 10px; text-align: left; border: 1px solid #e5e7eb;">Sản phẩm</th>
                            <th style="padding: 10px; text-align: center; border: 1px solid #e5e7eb;">SL</th>
                            <th style="padding: 10px; text-align: right; border: 1px solid #e5e7eb;">Giá</th>
                            <th style="padding: 10px; text-align: right; border: 1px solid #e5e7eb;">Tổng</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${order.items.map(item => `
                            <tr>
                                <td style="padding: 10px; border: 1px solid #e5e7eb;">
                                    ${item.product ? item.product.name : 'N/A'}
                                </td>
                                <td style="padding: 10px; text-align: center; border: 1px solid #e5e7eb;">${item.quantity}</td>
                                <td style="padding: 10px; text-align: right; border: 1px solid #e5e7eb;">${formatCurrency(item.price)}</td>
                                <td style="padding: 10px; text-align: right; border: 1px solid #e5e7eb;">
                                    <strong>${formatCurrency(item.price * item.quantity)}</strong>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;
        }

        const content = `
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                <div>
                    <h4 style="margin-bottom: 10px;">Thông tin khách hàng</h4>
                    <p><strong>Họ tên:</strong> ${order.customerName}</p>
                    <p><strong>SĐT:</strong> ${order.phone}</p>
                    <p><strong>Địa chỉ:</strong> ${order.shippingAddress}</p>
                    ${order.note ? `<p><strong>Ghi chú:</strong> ${order.note}</p>` : ''}
                </div>
                <div>
                    <h4 style="margin-bottom: 10px;">Thông tin đơn hàng</h4>
                    <p><strong>Mã đơn:</strong> #${order.orderId}</p>
                    <p><strong>Trạng thái:</strong> ${getStatusBadge(order.status)}</p>
                    <p><strong>Tổng tiền:</strong> <strong style="color: #4f46e5; font-size: 18px;">${formatCurrency(order.totalAmount)}</strong></p>
                    <p><strong>Ngày đặt:</strong> ${formatDate(order.createdAt)}</p>
                </div>
            </div>

            <h4 style="margin-top: 20px; margin-bottom: 10px;">Chi tiết sản phẩm</h4>
            ${itemsHtml}

            <div style="margin-top: 20px; padding-top: 20px; border-top: 2px solid #e5e7eb; text-align: right;">
                <h3>Tổng cộng: <span style="color: #4f46e5;">${formatCurrency(order.totalAmount)}</span></h3>
            </div>
        `;

        document.getElementById('orderDetailContent').innerHTML = content;
        document.getElementById('orderDetailModal').style.display = 'flex';

    } catch (error) {
        console.error('Error loading order detail:', error);
        alert('Không thể tải chi tiết đơn hàng');
    }
}

function closeDetailModal() {
    document.getElementById('orderDetailModal').style.display = 'none';
}

async function updateOrderStatus(orderId, newStatus) {
    if (!newStatus) return;

    if (!confirm(`Bạn có chắc muốn cập nhật trạng thái đơn hàng?`)) {
        return;
    }

    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/admin/orders/${orderId}/status`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ status: newStatus })
        });

        const data = await response.json();

        if (response.ok) {
            alert('Cập nhật trạng thái thành công!');
            loadOrders(currentPage);
            loadOrderStats();
        } else {
            alert(data.message || 'Không thể cập nhật trạng thái');
        }
    } catch (error) {
        console.error('Error updating order status:', error);
        alert('Có lỗi xảy ra khi cập nhật trạng thái');
    }
}

function displayPagination(data) {
    const container = document.getElementById('pagination');
    if (!container) return;

    const { current_page, last_page } = data;

    let html = '';

    html += `<button onclick="loadOrders(${current_page - 1})" ${current_page === 1 ? 'disabled' : ''}>
        <i class="fas fa-chevron-left"></i>
    </button>`;

    for (let i = 1; i <= last_page; i++) {
        if (i === 1 || i === last_page || (i >= current_page - 2 && i <= current_page + 2)) {
            html += `<button onclick="loadOrders(${i})" class="${i === current_page ? 'active' : ''}">${i}</button>`;
        } else if (i === current_page - 3 || i === current_page + 3) {
            html += `<button disabled>...</button>`;
        }
    }

    html += `<button onclick="loadOrders(${current_page + 1})" ${current_page === last_page ? 'disabled' : ''}>
        <i class="fas fa-chevron-right"></i>
    </button>`;

    container.innerHTML = html;
}

function searchOrders() {
    loadOrders(1);
}

function getStatusBadge(status) {
    const badges = {
        'pending': '<span class="badge badge-warning">Chờ xử lý</span>',
        'processing': '<span class="badge badge-primary">Đang xử lý</span>',
        'shipping': '<span class="badge badge-primary">Đang giao</span>',
        'completed': '<span class="badge badge-success">Hoàn thành</span>',
        'cancelled': '<span class="badge badge-danger">Đã hủy</span>'
    };
    return badges[status] || status;
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
}

function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN');
}

window.addEventListener('DOMContentLoaded', () => {
    loadOrders();
    loadOrderStats();

    document.getElementById('searchInput')?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') searchOrders();
    });
});

document.getElementById('orderDetailModal')?.addEventListener('click', function (e) {
    if (e.target === this) closeDetailModal();
});