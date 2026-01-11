if (!window.API_URL) window.API_URL = '/api';

(function () {
    'use strict';

    const API_URL = window.API_URL;
    let currentFilter = 'all';
    let allOrders = [];
    let currentReviewOrderItemId = null;
    let currentReviewProductId = null;
    let selectedRating = 0;

    // ===== INIT =====
    document.addEventListener('DOMContentLoaded', async function () {
        console.log('✅ Orders.js loaded');

        const token = localStorage.getItem('token');
        if (!token) {
            window.location.href = '/login';
            return;
        }

        await loadOrders();
        initFilterButtons();
        initStarRating();
    });

    // ===== FILTER BUTTONS =====
    function initFilterButtons() {
        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                currentFilter = btn.dataset.status;
                renderOrders();
            });
        });
    }

    // ===== LOAD ORDERS =====
    async function loadOrders() {
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            if (!user || !user.userId) {
                throw new Error('User not found');
            }

            const res = await fetch(`${API_URL}/orders/${user.userId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Accept': 'application/json'
                }
            });

            if (!res.ok) throw new Error('Failed to load orders');

            allOrders = await res.json();
            renderOrders();

        } catch (e) {
            console.error('Load orders error:', e);
            showEmpty();
        }
    }

    // ===== RENDER ORDERS =====
    function renderOrders() {
        const listEl = document.getElementById('orders-list');
        const emptyEl = document.getElementById('empty-orders');

        let filtered = allOrders;
        if (currentFilter !== 'all') {
            filtered = allOrders.filter(o => o.status === currentFilter);
        }

        if (filtered.length === 0) {
            listEl.style.display = 'none';
            emptyEl.style.display = 'block';
            return;
        }

        listEl.style.display = 'block';
        emptyEl.style.display = 'none';
        listEl.innerHTML = '';

        filtered.forEach(order => {
            const orderCard = createOrderCard(order);
            listEl.appendChild(orderCard);
        });
    }

    // ===== CREATE ORDER CARD =====
    function createOrderCard(order) {
        const card = document.createElement('div');
        card.className = 'order-card';

        const statusInfo = getStatusInfo(order.status);
        const date = formatDate(order.createdAt);

        card.innerHTML = `
            <div class="order-header">
                <div class="order-id">#${order.orderId}</div>
                <div class="order-status status-${order.status}">${statusInfo.icon} ${statusInfo.text}</div>
                <div class="order-date">🕐 ${date}</div>
            </div>

            <div class="order-info-grid">
                <div class="info-box">
                    <div class="info-label">👤 KHÁCH HÀNG</div>
                    <div class="info-value">${order.customerName}</div>
                </div>
                <div class="info-box">
                    <div class="info-label">📞 ĐIỆN THOẠI</div>
                    <div class="info-value">${order.phone}</div>
                </div>
                <div class="info-box">
                    <div class="info-label">📍 ĐỊA CHỈ</div>
                    <div class="info-value">${order.shippingAddress}</div>
                </div>
            </div>

            <div class="order-total">
                <span>Tổng tiền:</span>
                <strong>${formatPrice(order.totalAmount)}₫</strong>
            </div>

            <div class="order-actions">
                <button class="btn-detail" onclick="viewOrderDetail(${order.orderId})">
                    🔍 Xem chi tiết
                </button>
                ${getActionButtons(order)}
            </div>
        `;

        return card;
    }

    // ===== GET ACTION BUTTONS =====
    function getActionButtons(order) {
        let buttons = '';

        // Nút "Đã nhận hàng" cho đơn đang giao
        if (order.status === 'shipping') {
            buttons += `
                <button class="btn-complete" onclick="completeOrder(${order.orderId})">
                    ✅ Đã nhận hàng
                </button>
            `;
        }

        // Nút "Hủy đơn" cho đơn pending hoặc processing
        if (order.status === 'pending' || order.status === 'processing') {
            buttons += `
                <button class="btn-cancel" onclick="cancelOrder(${order.orderId})">
                    ❌ Hủy đơn
                </button>
            `;
        }

        return buttons;
    }

    // ===== COMPLETE ORDER (Customer confirms delivery) =====
    window.completeOrder = async function (orderId) {
        if (!confirm('Xác nhận bạn đã nhận được hàng?')) return;

        try {
            const res = await fetch(`${API_URL}/orders/${orderId}/complete`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });

            const result = await res.json();

            if (result.success) {
                showToast('✅ Cảm ơn bạn đã xác nhận! Đơn hàng đã hoàn thành.');
                await loadOrders();
            } else {
                showToast('❌ ' + (result.message || 'Không thể cập nhật'), 'error');
            }
        } catch (e) {
            console.error('Complete order error:', e);
            showToast('❌ Lỗi hệ thống!', 'error');
        }
    };

    // ===== CANCEL ORDER =====
    window.cancelOrder = async function (orderId) {
        if (!confirm('Bạn có chắc muốn hủy đơn hàng này?')) return;

        try {
            const res = await fetch(`${API_URL}/orders/${orderId}/cancel`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });

            const result = await res.json();

            if (result.success) {
                showToast('Đã hủy đơn hàng');
                await loadOrders();
            } else {
                showToast('❌ ' + (result.message || 'Không thể hủy đơn'), 'error');
            }
        } catch (e) {
            console.error('Cancel order error:', e);
            showToast('❌ Lỗi hệ thống!', 'error');
        }
    };

    // ===== VIEW ORDER DETAIL =====
    window.viewOrderDetail = async function (orderId) {
        try {
            const res = await fetch(`${API_URL}/orders/detail/${orderId}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Accept': 'application/json'
                }
            });

            if (!res.ok) throw new Error('Failed to load detail');

            const order = await res.json();
            showOrderDetailModal(order);

        } catch (e) {
            console.error('Load detail error:', e);
            showToast('❌ Không thể tải chi tiết đơn hàng', 'error');
        }
    };

    // ===== SHOW ORDER DETAIL MODAL =====
    function showOrderDetailModal(order) {
        const modal = document.getElementById('order-detail-modal');
        const modalBody = document.getElementById('modal-body');
        const modalOrderId = document.getElementById('modal-order-id');

        modalOrderId.textContent = `#${order.orderId}`;

        let itemsHtml = '';
        if (order.items && order.items.length > 0) {
            order.items.forEach(item => {
                const img = item.product?.imageUrl
                    ? '/storage/' + item.product.imageUrl
                    : '/images/no-image.png';

                const canReview = order.status === 'completed';
                const reviewBtn = canReview
                    ? `<button class="btn-review" onclick="openReviewModal(${item.orderItemId}, ${item.productId}, '${item.product?.name || 'Sản phẩm'}', '${img}')">⭐ Đánh giá</button>`
                    : '';

                itemsHtml += `
                    <div class="detail-item">
                        <img src="${img}" onerror="this.src='/images/no-image.png'">
                        <div class="item-info">
                            <div class="item-name">${item.product?.name || 'Sản phẩm'}</div>
                            <div class="item-detail">SL: ${item.quantity} × ${formatPrice(item.price)}₫</div>
                        </div>
                        <div class="item-price">${formatPrice(item.price * item.quantity)}₫</div>
                        ${reviewBtn}
                    </div>
                `;
            });
        }

        const statusInfo = getStatusInfo(order.status);

        modalBody.innerHTML = `
            <div class="detail-status">
                <span class="status-badge status-${order.status}">${statusInfo.icon} ${statusInfo.text}</span>
            </div>

            <div class="detail-info">
                <div><strong>👤 Khách hàng:</strong> ${order.customerName}</div>
                <div><strong>📞 Điện thoại:</strong> ${order.phone}</div>
                <div><strong>📍 Địa chỉ:</strong> ${order.shippingAddress}</div>
                ${order.note ? `<div><strong>📝 Ghi chú:</strong> ${order.note}</div>` : ''}
            </div>

            <div class="detail-items">
                <h4>Sản phẩm đã đặt:</h4>
                ${itemsHtml}
            </div>

            <div class="detail-total">
                <span>Tổng cộng:</span>
                <strong>${formatPrice(order.totalAmount)}₫</strong>
            </div>
        `;

        modal.style.display = 'flex';
    }

    // ===== CLOSE ORDER MODAL =====
    window.closeOrderModal = function () {
        const modal = document.getElementById('order-detail-modal');
        modal.style.display = 'none';
    };

    // ===== OPEN REVIEW MODAL =====
    window.openReviewModal = function (orderItemId, productId, productName, productImage) {
        currentReviewOrderItemId = orderItemId;
        currentReviewProductId = productId;
        selectedRating = 0;

        const modal = document.getElementById('review-modal');
        const productInfo = document.getElementById('review-product-info');

        productInfo.innerHTML = `
            <img src="${productImage}" onerror="this.src='/images/no-image.png'">
            <div class="product-name">${productName}</div>
        `;

        // Reset stars
        document.querySelectorAll('#review-stars .star').forEach(star => {
            star.classList.remove('selected');
        });

        // Reset comment
        document.getElementById('review-comment-text').value = '';
        document.getElementById('rating-text').textContent = 'Chọn số sao';

        modal.style.display = 'flex';
    };

    // ===== CLOSE REVIEW MODAL =====
    window.closeReviewModal = function () {
        const modal = document.getElementById('review-modal');
        modal.style.display = 'none';
    };

    // ===== INIT STAR RATING =====
    function initStarRating() {
        const stars = document.querySelectorAll('#review-stars .star');
        stars.forEach(star => {
            star.addEventListener('click', () => {
                selectedRating = parseInt(star.dataset.rating);
                updateStars(selectedRating);
                updateRatingText(selectedRating);
            });
        });
    }

    function updateStars(rating) {
        const stars = document.querySelectorAll('#review-stars .star');
        stars.forEach(star => {
            if (parseInt(star.dataset.rating) <= rating) {
                star.classList.add('selected');
            } else {
                star.classList.remove('selected');
            }
        });
    }

    function updateRatingText(rating) {
        const texts = ['', 'Rất tệ', 'Tệ', 'Bình thường', 'Tốt', 'Xuất sắc'];
        document.getElementById('rating-text').textContent = texts[rating] || 'Chọn số sao';
    }

    // ===== SUBMIT REVIEW =====
    window.submitReview = async function () {
        if (selectedRating === 0) {
            showToast('❌ Vui lòng chọn số sao đánh giá!', 'error');
            return;
        }

        const comment = document.getElementById('review-comment-text').value.trim();

        try {
            const res = await fetch(`${API_URL}/reviews`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    productId: currentReviewProductId,
                    rating: selectedRating,
                    comment: comment
                })
            });

            const result = await res.json();

            if (result.success) {
                showToast('⭐ Cảm ơn bạn đã đánh giá!');
                closeReviewModal();
            } else {
                showToast('❌ ' + (result.message || 'Không thể gửi đánh giá'), 'error');
            }
        } catch (e) {
            console.error('Submit review error:', e);
            showToast('❌ Lỗi hệ thống!', 'error');
        }
    };

    // ===== UTILITIES =====
    function getStatusInfo(status) {
        const statuses = {
            pending: { text: 'Đang xử lý', icon: '⏳' },
            processing: { text: 'Đang xử lý', icon: '⏳' },
            shipping: { text: 'Đang giao', icon: '🚚' },
            completed: { text: 'Hoàn thành', icon: '✅' },
            cancelled: { text: 'Đã hủy', icon: '❌' }
        };
        return statuses[status] || { text: status, icon: '📦' };
    }

    function formatDate(dateStr) {
        const date = new Date(dateStr);
        const now = new Date();
        const diff = now - date;
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));

        if (days === 0) return 'Hôm nay ' + date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
        if (days === 1) return 'Hôm qua ' + date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
        return date.toLocaleString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    function formatPrice(price) {
        return Number(price).toLocaleString('vi-VN');
    }

    function showEmpty() {
        document.getElementById('orders-list').style.display = 'none';
        document.getElementById('empty-orders').style.display = 'block';
    }

    function showToast(message, type = 'success') {
        const oldToast = document.querySelector('.custom-toast');
        if (oldToast) oldToast.remove();

        const toast = document.createElement('div');
        toast.className = 'custom-toast';
        toast.textContent = message;

        const bgColor = type === 'error'
            ? 'linear-gradient(135deg, #d32f2f, #b71c1c)'
            : 'linear-gradient(135deg, #2f7d32, #1b5e20)';

        toast.style.cssText = `
            position: fixed;
            top: 80px;
            right: 20px;
            background: ${bgColor};
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            z-index: 10000;
            animation: slideIn 0.3s ease;
            font-weight: 600;
        `;

        document.body.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // Close modal when clicking overlay
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal-overlay')) {
            e.target.style.display = 'none';
        }
    });

})();