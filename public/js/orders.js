(function () {
    'use strict';

    const API_URL = 'http://localhost:8000/api';

    let allOrders = [];
    let currentFilter = 'all';

    // ===== INIT =====
    document.addEventListener('DOMContentLoaded', async function () {
        console.log('✅ Orders.js loaded');

        // Kiểm tra đăng nhập
        const token = localStorage.getItem('token');
        if (!token) {
            showToast('Vui lòng đăng nhập để xem đơn hàng!', 'error');
            setTimeout(() => {
                window.location.href = '/login';
            }, 1500);
            return;
        }

        // Load đơn hàng
        await loadOrders();

        // Init filter buttons
        initFilterButtons();
    });

    // ===== LOAD DANH SÁCH ĐƠN HÀNG =====
    async function loadOrders() {
        const token = localStorage.getItem('token');
        const userStr = localStorage.getItem('user');

        if (!token || !userStr) {
            showToast('Vui lòng đăng nhập!', 'error');
            window.location.href = '/login';
            return;
        }

        // Show loading
        const loading = document.getElementById('orders-loading');
        const ordersList = document.getElementById('orders-list');
        const emptyOrders = document.getElementById('empty-orders');

        if (loading) loading.style.display = 'block';
        if (ordersList) ordersList.style.display = 'none';
        if (emptyOrders) emptyOrders.style.display = 'none';

        try {
            const user = JSON.parse(userStr);
            const userId = user.userId;

            console.log('🔵 Loading orders for userId:', userId);

            const response = await fetch(`${API_URL}/orders/user/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });

            console.log('📦 Response status:', response.status);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const result = await response.json();
            console.log('📦 Orders response:', result);

            // Hide loading
            if (loading) loading.style.display = 'none';

            // ✅ Backend có thể trả về array trực tiếp hoặc object với data
            let ordersData = [];
            if (Array.isArray(result)) {
                ordersData = result;
            } else if (result.data && Array.isArray(result.data)) {
                ordersData = result.data;
            } else if (result.success && result.data && Array.isArray(result.data)) {
                ordersData = result.data;
            }

            if (ordersData.length > 0) {
                allOrders = ordersData;
                renderOrders(allOrders);
            } else {
                showEmptyOrders();
            }

        } catch (error) {
            console.error('❌ Error loading orders:', error);

            // Hide loading
            if (loading) loading.style.display = 'none';

            showToast('Không thể tải đơn hàng!', 'error');
            showEmptyOrders();
        }
    }

    // ===== RENDER DANH SÁCH ĐƠN HÀNG =====
    function renderOrders(orders) {
        const ordersList = document.getElementById('orders-list');
        const emptyOrders = document.getElementById('empty-orders');

        if (!ordersList) return;

        if (!orders || orders.length === 0) {
            ordersList.style.display = 'none';
            if (emptyOrders) emptyOrders.style.display = 'block';
            return;
        }

        ordersList.style.display = 'block';
        if (emptyOrders) emptyOrders.style.display = 'none';

        ordersList.innerHTML = '';

        orders.forEach(order => {
            const orderCard = createOrderCard(order);
            ordersList.appendChild(orderCard);
        });
    }

    // ===== TẠO CARD ĐƠN HÀNG =====
    function createOrderCard(order) {
        const card = document.createElement('div');
        card.className = 'order-card';

        const statusInfo = getStatusInfo(order.status);
        const orderDate = new Date(order.createdAt).toLocaleDateString('vi-VN');

        // ✅ Xử lý items với nhiều tên field khác nhau
        const items = order.orderitems || order.items || [];

        let itemsHTML = '';
        if (items.length > 0) {
            items.forEach(item => {
                let imageUrl = '/images/no-image.png';
                if (item.product && item.product.imageUrl) {
                    imageUrl = '/storage/' + item.product.imageUrl;
                }

                itemsHTML += `
                    <div class="order-product">
                        <img src="${imageUrl}" 
                             alt="${item.product?.name || 'Sản phẩm'}"
                             onerror="this.src='/images/no-image.png'">
                        <div class="product-info">
                            <div class="product-name">${item.product?.name || 'Sản phẩm'}</div>
                            <div class="product-qty">x${item.quantity}</div>
                        </div>
                        <div class="product-price">${formatPrice(item.price * item.quantity)}₫</div>
                    </div>
                `;
            });
        } else {
            itemsHTML = '<p style="color:#999;padding:10px 0">Không có sản phẩm</p>';
        }

        // ✅ Xử lý các field có thể khác nhau
        const customerName = order.customerName || order.fullName || 'N/A';
        const shippingAddress = order.shippingAddress || order.address || 'N/A';
        const paymentMethod = order.paymentMethod || 'cod';

        card.innerHTML = `
            <div class="order-header">
                <div class="order-id">
                    <strong>Đơn hàng #${order.orderId}</strong>
                    <span class="order-date">${orderDate}</span>
                </div>
                <span class="order-status status-${order.status}">${statusInfo.icon} ${statusInfo.text}</span>
            </div>

            <div class="order-body">
                ${itemsHTML}
            </div>

            <div class="order-footer">
                <div class="order-info-row">
                    <span>👤 Người nhận:</span>
                    <strong>${customerName}</strong>
                </div>
                <div class="order-info-row">
                    <span>📞 SĐT:</span>
                    <strong>${order.phone}</strong>
                </div>
                <div class="order-info-row">
                    <span>📍 Địa chỉ:</span>
                    <strong>${shippingAddress}</strong>
                </div>
                <div class="order-info-row">
                    <span>💳 Thanh toán:</span>
                    <strong>${getPaymentMethodText(paymentMethod)}</strong>
                </div>
                <div class="order-divider"></div>
                <div class="order-total">
                    <span>Tổng tiền:</span>
                    <strong>${formatPrice(order.totalAmount)}₫</strong>
                </div>

                <div class="order-actions">
                    ${order.status === 'pending' || order.status === 'processing' ?
                `<button class="btn-cancel" onclick="window.cancelOrder(${order.orderId})">Hủy đơn</button>` :
                ''}
                    <button class="btn-detail" onclick="window.viewOrderDetail(${order.orderId})">Xem chi tiết</button>
                </div>
            </div>
        `;

        return card;
    }

    // ===== FILTER BUTTONS =====
    function initFilterButtons() {
        const filterButtons = document.querySelectorAll('.filter-btn');

        filterButtons.forEach(btn => {
            btn.addEventListener('click', function () {
                filterButtons.forEach(b => b.classList.remove('active'));
                this.classList.add('active');

                const status = this.getAttribute('data-status');
                currentFilter = status;
                filterOrders(status);
            });
        });
    }

    // ===== LỌC ĐƠN HÀNG THEO TRẠNG THÁI =====
    function filterOrders(status) {
        if (status === 'all') {
            renderOrders(allOrders);
            return;
        }

        const filtered = allOrders.filter(order => order.status === status);
        renderOrders(filtered);
    }

    // ===== HỦY ĐƠN HÀNG =====
    async function cancelOrder(orderId) {
        if (!confirm('Bạn có chắc muốn hủy đơn hàng này?')) {
            return;
        }

        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const response = await fetch(`${API_URL}/orders/${orderId}/cancel`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });

            const result = await response.json();

            if (response.ok) {
                showToast('Đã hủy đơn hàng!', 'success');
                await loadOrders();
            } else {
                showToast(result.message || 'Không thể hủy đơn hàng!', 'error');
            }
        } catch (error) {
            console.error('❌ Error canceling order:', error);
            showToast('Có lỗi xảy ra!', 'error');
        }
    }

    // ===== XEM CHI TIẾT ĐƠN HÀNG =====
    function viewOrderDetail(orderId) {
        alert(`Chi tiết đơn hàng #${orderId} (Chức năng đang phát triển)`);
    }

    // ===== HIỂN THỊ TRỐNG =====
    function showEmptyOrders() {
        const ordersList = document.getElementById('orders-list');
        const emptyOrders = document.getElementById('empty-orders');

        if (ordersList) ordersList.style.display = 'none';
        if (emptyOrders) emptyOrders.style.display = 'block';
    }

    // ===== GET STATUS INFO =====
    function getStatusInfo(status) {
        const statusMap = {
            'pending': { icon: '🕐', text: 'Chờ xử lý', color: '#gray' },
            'processing': { icon: '⏳', text: 'Đang xử lý', color: '#f59e0b' },
            'shipping': { icon: '🚚', text: 'Đang giao', color: '#3b82f6' },
            'completed': { icon: '✅', text: 'Hoàn thành', color: '#10b981' },
            'cancelled': { icon: '❌', text: 'Đã hủy', color: '#ef4444' }
        };

        return statusMap[status] || { icon: '❓', text: 'Không rõ', color: '#6b7280' };
    }

    // ===== GET PAYMENT METHOD TEXT =====
    function getPaymentMethodText(method) {
        const methodMap = {
            'cod': 'COD (Tiền mặt)',
            'bank': 'Chuyển khoản',
            'ewallet': 'Ví điện tử',
            'vnpay': 'VNPay',
            'stripe': 'Stripe'
        };

        return methodMap[method] || method;
    }

    // ===== FORMAT PRICE =====
    function formatPrice(price) {
        return price.toLocaleString('vi-VN');
    }

    // ===== TOAST =====
    function showToast(message, type = 'success') {
        const oldToast = document.querySelector('.custom-toast');
        if (oldToast) oldToast.remove();

        const toast = document.createElement('div');
        toast.className = `custom-toast custom-toast-${type}`;

        const icon = type === 'success' ? '✓' : '✕';
        toast.innerHTML = `
            <div class="toast-icon">${icon}</div>
            <div class="toast-message">${message}</div>
        `;

        document.body.appendChild(toast);
        setTimeout(() => toast.classList.add('show'), 10);

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // Inject CSS
    if (!document.getElementById('toast-styles')) {
        const style = document.createElement('style');
        style.id = 'toast-styles';
        style.textContent = `
            .custom-toast {
                position: fixed; top: 20px; right: 20px;
                display: flex; align-items: center; gap: 12px;
                padding: 16px 24px; border-radius: 12px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                font-size: 14px; font-weight: 500; z-index: 999999;
                opacity: 0; transform: translateX(400px);
                transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            }
            .custom-toast.show { opacity: 1; transform: translateX(0); }
            .custom-toast-success {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
            }
            .custom-toast-error {
                background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
                color: white;
            }
            .toast-icon {
                width: 24px; height: 24px; border-radius: 50%;
                background: rgba(255,255,255,0.3);
                display: flex; align-items: center; justify-content: center;
                font-size: 14px; font-weight: bold;
            }
        `;
        document.head.appendChild(style);
    }

    // ===== EXPORT TO WINDOW =====
    window.cancelOrder = cancelOrder;
    window.viewOrderDetail = viewOrderDetail;

})();