// ===== ORDERS PAGE - Quản lý hiển thị đơn hàng =====
if (!window.API_URL) window.API_URL = '/api';

let currentFilter = 'all';
let currentReviewProduct = null;
let selectedRating = 0;

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
    setupReviewModal();
});

// ===== FILTER =====
function setupFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.status;

            // Filter locally or reload
            const allCards = document.querySelectorAll('.order-card');
            if (currentFilter === 'all') {
                allCards.forEach(card => card.style.display = 'block');
            } else {
                allCards.forEach(card => {
                    card.style.display = card.dataset.status === currentFilter ? 'block' : 'none';
                });
            }
            // For now, let's keep it simple and just reload for safety if we want strict fitlering
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
        <div class="order-card" data-status="${order.status}">
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

// ===== STATUS BADGE =====
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

// ===== FORMAT HELPERS =====
function formatDate(d) {
    return new Date(d).toLocaleString('vi-VN');
}
function formatPrice(p) {
    return Number(p).toLocaleString('vi-VN');
}
function getPaymentMethod(method) {
    const map = {
        'cod': '💵 Thanh toán khi nhận hàng',
        'vnpay': '💳 VNPay',
        'stripe': '💳 Stripe'
    };
    return map[method] || method || 'Không xác định';
}
function getPaymentStatus(status) {
    const map = {
        'pending': '⏳ Chờ thanh toán',
        'paid': '✅ Đã thanh toán',
        'failed': '❌ Thất bại'
    };
    return map[status] || status || 'Chờ cập nhật';
}

// ===== ORDER DETAIL =====
async function viewOrderDetails(orderId) {
    const token = localStorage.getItem('token');
    const modal = document.getElementById('order-detail-modal');
    const body = document.getElementById('modal-body');
    document.getElementById('modal-order-id').textContent = `#${orderId}`;

    modal.style.display = 'flex';
    body.innerHTML = '<div style="text-align:center;padding:40px;"><div class="loading-spinner"></div><p>Đang tải...</p></div>';

    try {
        const res = await fetch(`${window.API_URL}/orders/${orderId}`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (!res.ok) throw new Error('Failed to load order');

        const order = await res.json();

        // Fetch reviews if completed
        const userData = JSON.parse(localStorage.getItem('user') || '{}');
        let reviewedProductIds = [];

        if (userData.userId && order.status === 'completed') {
            try {
                const productIds = order.items.map(i => i.productId);
                const checks = await Promise.all(productIds.map(async (pid) => {
                    const r = await fetch(`${window.API_URL}/products/${pid}/reviews`);
                    if (r.ok) {
                        const reviews = await r.json();
                        return reviews.some(rv => rv.userId === userData.userId) ? pid : null;
                    }
                    return null;
                }));
                reviewedProductIds = checks.filter(id => id !== null);
            } catch (e) {
                console.warn('Review check failed', e);
            }
        }

        displayOrderDetails(order, reviewedProductIds);
    } catch (e) {
        console.error(e);
        body.innerHTML = '<div style="text-align:center;padding:40px;color:red">❌ Không tải được đơn hàng</div>';
    }
}

function displayOrderDetails(order, reviewedProductIds = []) {
    const body = document.getElementById('modal-body');
    const isCompleted = order.status === 'completed';
    const canCancel = ['pending', 'processing'].includes(order.status);

    const itemsHtml = order.items.map(item => {
        const isReviewed = reviewedProductIds.includes(item.productId);
        const imageUrl = item.product?.imageUrl ? `/storage/${item.product.imageUrl}` : '/images/placeholder.png';

        return `
        <div class="detail-item">
            <div class="item-image">
                <img src="${imageUrl}" onerror="this.src='/images/placeholder.png'" alt="Product">
            </div>
            <div class="item-info">
                <h4>${item.product?.name || `Sản phẩm #${item.productId}`}</h4>
                <div class="item-meta">
                    <span>${formatPrice(item.price)}₫ x ${item.quantity}</span>
                    <span class="item-subtotal">${formatPrice(item.price * item.quantity)}₫</span>
                </div>
                
                ${isCompleted && !isReviewed ? `
                    <button class="review-btn-small" onclick="openReviewModal(${item.productId}, '${(item.product?.name || '').replace(/'/g, "\\'")}', '${imageUrl}')">
                        ⭐ Đánh giá
                    </button>
                ` : ''}
                
                ${isReviewed ? `<span class="reviewed-badge">✅ Đã đánh giá</span>` : ''}
            </div>
        </div>
        `;
    }).join('');

    body.innerHTML = `
        <div class="detail-section">
            <h4 class="section-title">🛍️ Sản phẩm</h4>
            <div class="detail-items-list">
                ${itemsHtml}
            </div>
        </div>

        <div class="detail-row two-cols">
            <div class="detail-section">
                <h4 class="section-title">👤 Khách hàng</h4>
                <div class="info-group">
                    <p><strong>Họ tên:</strong> ${order.customerName}</p>
                    <p><strong>SĐT:</strong> ${order.phone}</p>
                    <p><strong>Địa chỉ:</strong> ${order.shippingAddress}</p>
                    ${order.note ? `<p><strong>Ghi chú:</strong> ${order.note}</p>` : ''}
                </div>
            </div>
            
            <div class="detail-section">
                <h4 class="section-title">💳 Thanh toán</h4>
                <div class="info-group">
                    <p><strong>Phương thức:</strong> ${getPaymentMethod(order.payment?.method)}</p>
                    <p><strong>Trạng thái:</strong> ${getPaymentStatus(order.payment?.status)}</p>
                </div>
            </div>
        </div>

        ${canCancel ? `
        <div class="action-footer">
            <button class="cancel-order-btn" onclick="cancelOrder(${order.orderId})">
                ❌ Hủy đơn hàng
            </button>
        </div>
        ` : ''}

        <div class="detail-total-bar">
            <span>Tổng cộng</span>
            <strong>${formatPrice(order.totalAmount)}₫</strong>
        </div>
    `;
}

function closeOrderModal() {
    document.getElementById('order-detail-modal').style.display = 'none';
}

// ===== CANCEL =====
async function cancelOrder(orderId) {
    if (!confirm('⚠️ Bạn có chắc muốn hủy đơn hàng này?\nHành động này không thể hoàn tác.')) {
        return;
    }

    const token = localStorage.getItem('token');
    try {
        const res = await fetch(`${window.API_URL}/orders/${orderId}/cancel`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        const result = await res.json();

        if (res.ok && result.success) {
            alert('✅ ' + result.message);
            closeOrderModal();
            loadOrders();
        } else {
            alert('❌ ' + (result.message || 'Lỗi hủy đơn'));
        }
    } catch (e) {
        console.error(e);
        alert('❌ Có lỗi xảy ra');
    }
}

// ===== REVIEW FUNC =====
function setupReviewModal() {
    // Setup stars interaction
    const stars = document.querySelectorAll('#star-rating .star');
    stars.forEach(star => {
        star.addEventListener('click', () => {
            const value = parseInt(star.dataset.value);
            selectedRating = value;
            updateStars(value);
        });

        star.addEventListener('mouseover', () => {
            updateStars(parseInt(star.dataset.value));
        });

        star.addEventListener('mouseleave', () => {
            updateStars(selectedRating);
        });
    });
}

function updateStars(rating) {
    const stars = document.querySelectorAll('#star-rating .star');
    const emojis = ['😶', '😢', '😞', '😐', '😊', '🤩'];
    const textDesc = ['Chưa đánh giá', 'Tệ', 'Không hài lòng', 'Bình thường', 'Hài lòng', 'Tuyệt vời'];

    stars.forEach(s => {
        const val = parseInt(s.dataset.value);
        s.classList.toggle('active', val <= rating);
        s.style.transform = val <= rating ? 'scale(1.2)' : 'scale(1)';
    });

    document.getElementById('rating-emoji').textContent = emojis[rating];
    document.getElementById('rating-text').textContent = textDesc[rating];
}

function openReviewModal(productId, productName, productImg) {
    currentReviewProduct = { productId, productName };
    selectedRating = 0;

    document.getElementById('review-product-name').textContent = productName;
    document.getElementById('review-product-img').src = productImg || '/images/placeholder.png';
    document.getElementById('review-comment-text').value = '';
    updateStars(0);

    document.getElementById('review-modal').style.display = 'flex';
}

function closeReviewModal() {
    document.getElementById('review-modal').style.display = 'none';
    currentReviewProduct = null;
}

async function submitReview() {
    if (!currentReviewProduct) return;
    const comment = document.getElementById('review-comment-text').value.trim();
    if (selectedRating === 0) return alert('⚠️ Vui lòng chọn số sao!');

    const token = localStorage.getItem('token');
    try {
        const res = await fetch(`${window.API_URL}/reviews`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                productId: currentReviewProduct.productId,
                rating: selectedRating,
                comment
            })
        });
        const result = await res.json();

        if (res.ok && result.success) {
            alert('✅ Đánh giá thành công!');
            closeReviewModal();
            // Refresh modal details
            // For simplicity, we just reload the order details if strictly needed, 
            // or we could manually toggle the button in DOM like before. 
            // Since we need orderId to viewOrderDetails, let's just do the DOM update.
            const btns = document.querySelectorAll('.review-btn-small');
            // This is a bit tricky since we don't have the context of the modal here easily
            // except checking button sibling elements.
            // Let's just simply close review modal and tell user success.
            // But user wanted instant feedback.
            // Let's reload order details? We don't have orderId here.

            // Re-implement the DOM manipulation trick
            const items = document.querySelectorAll('.detail-item');
            items.forEach(item => {
                if (item.innerHTML.includes(currentReviewProduct.productName)) {
                    const btn = item.querySelector('.review-btn-small');
                    if (btn) {
                        const parent = btn.parentElement;
                        btn.remove();
                        const span = document.createElement('span');
                        span.className = 'reviewed-badge';
                        span.textContent = '✅ Đã đánh giá';
                        parent.appendChild(span);
                    }
                }
            });

        } else {
            alert('❌ ' + (result.message || 'Lỗi'));
        }
    } catch (e) {
        console.error(e);
        alert('❌ Lỗi hệ thống');
    }
}
window.submitReview = submitReview; // bind to window just in case
