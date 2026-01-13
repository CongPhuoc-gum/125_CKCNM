const API_URL = window.location.origin + '/api';
let currentPage = 1;

async function loadOrders(page = 1) {
    try {
        const token = localStorage.getItem('token');
        const search = document.getElementById('searchInput')?.value || '';
        const status = document.getElementById('statusFilter')?.value || '';

        let url = `${API_URL}/admin/orders?page=${page}`;
        if (search) url += `&search=${encodeURIComponent(search)}`;
        if (status) url += `&status=${status}`;

        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to load orders');
        }

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

        if (!response.ok) {
            throw new Error('Failed to load statistics');
        }

        const result = await response.json();
        console.log('Statistics response:', result);

        // Check if data is wrapped in result.data or direct
        const stats = result.data || result;

        document.getElementById('pendingCount').textContent = stats.pending || 0;
        document.getElementById('processingCount').textContent = stats.processing || 0;
        document.getElementById('shippingCount').textContent = stats.shipping || 0;
        document.getElementById('completedCount').textContent = stats.completed || 0;

    } catch (error) {
        console.error('Error loading stats:', error);
        // Set default values on error
        document.getElementById('pendingCount').textContent = '0';
        document.getElementById('processingCount').textContent = '0';
        document.getElementById('shippingCount').textContent = '0';
        document.getElementById('completedCount').textContent = '0';
    }
}

function displayOrders(orders) {
    const tbody = document.getElementById('ordersTable');

    if (!orders || orders.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center">Không có đơn hàng nào</td></tr>';
        return;
    }

    tbody.innerHTML = orders.map(order => {
        const orderId = order.orderId;
        const customerName = order.customerName || 'N/A';
        const phone = order.phone || 'N/A';
        const totalAmount = order.totalAmount || 0;
        const status = order.status || 'pending';
        const createdAt = order.createdAt;

        return `
            <tr>
                <td><strong>#${orderId}</strong></td>
                <td>${customerName}</td>
                <td>${phone}</td>
                <td><strong>${formatCurrency(totalAmount)}</strong></td>
                <td>${getStatusBadge(status)}</td>
                <td>${formatDate(createdAt)}</td>
                <td>
                    <button onclick="viewOrderDetail(${orderId})" class="btn btn-sm btn-primary">
                        <i class="fas fa-eye"></i>
                    </button>
                    ${status === 'pending' || status === 'processing' ? `
                        <select onchange="updateOrderStatus(${orderId}, this.value)" class="btn btn-sm" style="padding: 6px 8px;">
                            <option value="">Cập nhật</option>
                            ${status === 'pending' ? '<option value="processing">Xử lý</option>' : ''}
                            ${status === 'processing' ? '<option value="shipping">Giao hàng</option>' : ''}
                            <option value="cancelled">Hủy</option>
                        </select>
                    ` : ''}
                </td>
            </tr>
        `;
    }).join('');
}

async function viewOrderDetail(orderId) {
    try {
        const token = localStorage.getItem('token');

        // Endpoint đã fix: /api/orders/{id}
        const response = await fetch(`${API_URL}/orders/${orderId}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to load order detail');
        }

        // Parse response
        const orderData = await response.json();

        console.log('Order detail response:', orderData);

        document.getElementById('detailOrderId').textContent = orderData.orderId || orderId;

        let itemsHtml = '';
        if (orderData.items && orderData.items.length > 0) {
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
                        ${orderData.items.map(item => {
                const productName = item.product ? (item.product.name || item.product.Name || 'N/A') : 'N/A';
                const quantity = item.quantity || 0;
                const price = item.price || 0;

                return `
                                <tr>
                                    <td style="padding: 10px; border: 1px solid #e5e7eb;">
                                        ${productName}
                                    </td>
                                    <td style="padding: 10px; text-align: center; border: 1px solid #e5e7eb;">${quantity}</td>
                                    <td style="padding: 10px; text-align: right; border: 1px solid #e5e7eb;">${formatCurrency(price)}</td>
                                    <td style="padding: 10px; text-align: right; border: 1px solid #e5e7eb;">
                                        <strong>${formatCurrency(price * quantity)}</strong>
                                    </td>
                                </tr>
                            `;
            }).join('')}
                    </tbody>
                </table>
            `;
        } else {
            itemsHtml = '<p style="text-align: center; color: #999;">Không có sản phẩm</p>';
        }

        const content = `
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                <div>
                    <h4 style="margin-bottom: 10px;">Thông tin khách hàng</h4>
                    <p><strong>Họ tên:</strong> ${orderData.customerName || 'N/A'}</p>
                    <p><strong>SĐT:</strong> ${orderData.phone || 'N/A'}</p>
                    ${orderData.email ? `<p><strong>Email:</strong> ${orderData.email}</p>` : ''}
                    <p><strong>Địa chỉ:</strong> ${orderData.shippingAddress || 'N/A'}</p>
                    ${orderData.note ? `<p><strong>Ghi chú:</strong> ${orderData.note}</p>` : ''}
                </div>
                <div>
                    <h4 style="margin-bottom: 10px;">Thông tin đơn hàng</h4>
                    <p><strong>Mã đơn:</strong> #${orderData.orderId}</p>
                    <p><strong>Trạng thái:</strong> ${getStatusBadge(orderData.status)}</p>
                    <p><strong>Tổng tiền:</strong> <strong style="color: #4f46e5; font-size: 18px;">${formatCurrency(orderData.totalAmount || 0)}</strong></p>
                    <p><strong>Ngày đặt:</strong> ${formatDate(orderData.createdAt)}</p>
                </div>
            </div>

            <h4 style="margin-top: 20px; margin-bottom: 10px;">Chi tiết sản phẩm</h4>
            ${itemsHtml}

            <div style="margin-top: 20px; padding-top: 20px; border-top: 2px solid #e5e7eb; text-align: right;">
                <h3>Tổng cộng: <span style="color: #4f46e5;">${formatCurrency(orderData.totalAmount || 0)}</span></h3>
            </div>
        `;

        document.getElementById('orderDetailContent').innerHTML = content;
        document.getElementById('orderDetailModal').style.display = 'flex';

    } catch (error) {
        console.error('Error loading order detail:', error);
        alert('Không thể tải chi tiết đơn hàng: ' + error.message);
    }
}

function closeDetailModal() {
    document.getElementById('orderDetailModal').style.display = 'none';
}

async function updateOrderStatus(orderId, newStatus) {
    if (!newStatus) return;

    if (!confirm(`Bạn có chắc muốn cập nhật trạng thái đơn hàng?`)) {
        // Reset select về giá trị mặc định
        event.target.value = '';
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
            body: JSON.stringify({
                status: newStatus
            })
        });

        const data = await response.json();

        if (response.ok && data.success) {
            alert('Cập nhật trạng thái thành công!');
            loadOrders(currentPage);
            loadOrderStats();
        } else {
            alert(data.message || 'Không thể cập nhật trạng thái');
            // Reset select
            event.target.value = '';
        }
    } catch (error) {
        console.error('Error updating order status:', error);
        alert('Có lỗi xảy ra khi cập nhật trạng thái');
        // Reset select
        event.target.value = '';
    }
}

function displayPagination(data) {
    const container = document.getElementById('pagination');
    if (!container) return;

    const { current_page, last_page } = data;

    if (last_page <= 1) {
        container.innerHTML = '';
        return;
    }

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
        'shipping': '<span class="badge badge-info">Đang giao</span>',
        'completed': '<span class="badge badge-success">Hoàn thành</span>',
        'paid': '<span class="badge badge-success">Đã thanh toán</span>',
        'cancelled': '<span class="badge badge-danger">Đã hủy</span>'
    };
    return badges[status] || `<span class="badge">${status}</span>`;
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(amount || 0);
}

function formatDate(dateString) {
    if (!dateString) return 'N/A';
    try {
        const date = new Date(dateString);
        return date.toLocaleString('vi-VN');
    } catch (e) {
        return 'N/A';
    }
}

// Event Listeners
window.addEventListener('DOMContentLoaded', () => {
    loadOrders();
    loadOrderStats();

    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') searchOrders();
        });
    }

    const statusFilter = document.getElementById('statusFilter');
    if (statusFilter) {
        statusFilter.addEventListener('change', () => searchOrders());
    }
});

document.getElementById('orderDetailModal')?.addEventListener('click', function (e) {
    if (e.target === this) closeDetailModal();
});