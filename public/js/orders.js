// ===== ORDERS PAGE - Quản lý hiển thị đơn hàng =====
if (!window.API_URL) window.API_URL = '/api';

let currentFilter = 'all';

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('⚠️ Vui lòng đăng nhập để xem đơn hàng!');
        window.location.href = '/login';
        return;
    }

    loadOrders();
    setupFilters();
});

// ===== FILTER =====
function setupFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.status;
            loadOrders();
        });
    });
}

// ===== LOAD ORDERS =====
async function loadOrders() {
    const token = localStorage.getItem('token');
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = userData.userId;

    if (!userId) {
        showEmptyOrders();
        return;
    }

    try {
        const response = await fetch(`${window.API_URL}/orders/user/${userId}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) throw new Error(response.status);

        let orders = await response.json();

        if (currentFilter !== 'all') {
            orders = orders.filter(o => o.status === currentFilter);
        }

        displayOrders(orders);

    } catch (error) {
        console.error(error);
        showEmptyOrders();
    }
}

// ===== RENDER ORDERS =====
function displayOrders(orders) {
    const ordersList = document.getElementById('orders-list');
    const emptyOrders = document.getElementById('empty-orders');

    if (!orders || orders.length === 0) {
        showEmptyOrders();
        return;
    }

    emptyOrders.style.display = 'none';
    ordersList.style.display = 'block';

    ordersList.innerHTML = orders.map(order => `
        <div class="order-card">
            <div class="order-header">
                <div>
                    <span class="order-id">#${order.orderId}</span>
                    ${getStatusBadge(order.status)}
                </div>
                <div class="order-date">🕒 ${formatDate(order.createdAt)}</div>
            </div>

            <div class="order-info">
                <p><strong>👤 Khách hàng</strong> ${order.customerName}</p>
                <p><strong>📞 Điện thoại</strong> ${order.phone}</p>
                <p style="grid-column:1/-1"><strong>📍 Địa chỉ</strong> ${order.shippingAddress}</p>
                ${order.note ? `<p style="grid-column:1/-1"><strong>📝 Ghi chú</strong> ${order.note}</p>` : ''}
            </div>

            <div class="order-total">
                <span>Tổng tiền:</span>
                <strong>${formatPrice(order.totalAmount)}₫</strong>
            </div>

            <button class="view-details-btn" onclick="viewOrderDetails(${order.orderId})">
                🔍 Xem chi tiết
            </button>
        </div>
    `).join('');
}

function showEmptyOrders() {
    document.getElementById('orders-list').style.display = 'none';
    document.getElementById('empty-orders').style.display = 'flex';
}

// ===== STATUS =====
function getStatusBadge(status) {
    const map = {
        pending: ['Chờ xử lý', '#FF9800'],
        processing: ['Đang xử lý', '#2196F3'],
        shipping: ['Đang giao', '#9C27B0'],
        completed: ['Hoàn thành', '#4CAF50'],
        cancelled: ['Đã hủy', '#F44336']
    };
    const [text, color] = map[status] || [status, '#999'];
    return `<span class="status-badge" style="background:${color}">${text}</span>`;
}

// ===== FORMAT =====
function formatDate(d) {
    const date = new Date(d);
    return date.toLocaleString('vi-VN');
}
function formatPrice(p) {
    return Number(p).toLocaleString('vi-VN');
}

// ===== ORDER DETAIL =====
async function viewOrderDetails(orderId) {
    const token = localStorage.getItem('token');
    const modal = document.getElementById('order-detail-modal');
    const body = document.getElementById('modal-body');
    document.getElementById('modal-order-id').textContent = `#${orderId}`;
    modal.style.display = 'flex';
    body.innerHTML = '⏳ Đang tải...';

    try {
        const res = await fetch(`${window.API_URL}/orders/${orderId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        const order = await res.json();
        displayOrderDetails(order);
    } catch {
        body.innerHTML = '❌ Không tải được đơn hàng';
    }
}

function displayOrderDetails(order) {
    const body = document.getElementById('modal-body');
    const canCancel = ['pending', 'processing'].includes(order.status);

    body.innerHTML = `
        <h4>🛍️ Sản phẩm</h4>
        ${order.items.map(i => `
            <div class="detail-item">
                <div>${i.product?.name || 'Sản phẩm'} × ${i.quantity}</div>
                <div>${formatPrice(i.price * i.quantity)}₫</div>
            </div>
        `).join('')}

        <h4>👤 Khách hàng</h4>
        <p>${order.customerName} - ${order.phone}</p>
        <p>${order.shippingAddress}</p>

        ${canCancel ? `<button class="cancel-order-btn" onclick="cancelOrder(${order.orderId})">Hủy đơn</button>` : ''}

        <div class="detail-total">
            <strong>Tổng: ${formatPrice(order.totalAmount)}₫</strong>
        </div>
    `;
}

function closeOrderModal() {
    document.getElementById('order-detail-modal').style.display = 'none';
}

// ===== CANCEL =====
async function cancelOrder(orderId) {
    if (!confirm('Bạn chắc chắn muốn hủy đơn?')) return;

    const token = localStorage.getItem('token');

    const res = await fetch(`${window.API_URL}/orders/${orderId}/cancel`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
    });

    const result = await res.json();
    alert(result.message || 'Đã hủy');
    closeOrderModal();
    loadOrders();
}
