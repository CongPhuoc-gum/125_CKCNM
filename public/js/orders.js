// ===== ORDERS PAGE - Quản lý hiển thị đơn hàng =====
if (!window.API_URL) window.API_URL = '/api';

let currentFilter = 'all';

document.addEventListener('DOMContentLoaded', () => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
        alert('⚠️ Vui lòng đăng nhập để xem đơn hàng!');
        window.location.href = '/login';
        return;
    }

    // Load orders
    loadOrders();

    // Setup filter buttons
    setupFilters();
});

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

async function loadOrders() {
    const token = localStorage.getItem('token');
    const userData = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = userData.userId;

    if (!userId) {
        console.error('❌ User ID not found');
        showEmptyOrders();
        return;
    }

    try {
        console.log('📡 Fetching orders for user:', userId);
        console.log('🔑 Using token:', token ? 'Present' : 'Missing');

        const response = await fetch(`${window.API_URL}/orders/user/${userId}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        console.log('📥 Response status:', response.status);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        let orders = await response.json();
        console.log('✅ Orders loaded:', orders.length, 'orders');
        console.log('📦 Orders data:', orders);

        // Filter orders by status
        if (currentFilter !== 'all') {
            orders = orders.filter(order => order.status === currentFilter);
            console.log(`🔍 Filtered to ${currentFilter}:`, orders.length, 'orders');
        }

        displayOrders(orders);

    } catch (error) {
        console.error('❌ Load orders error:', error);
        showEmptyOrders();
    }
}

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
                <p>
                    <strong>👤 Khách hàng</strong>
                    ${order.customerName}
                </p>
                <p>
                    <strong>📞 Điện thoại</strong>
                    ${order.phone}
                </p>
                <p style="grid-column: 1 / -1;">
                    <strong>📍 Địa chỉ giao hàng</strong>
                    ${order.shippingAddress}
                </p>
                ${order.note ? `
                <p style="grid-column: 1 / -1;">
                    <strong>📝 Ghi chú</strong>
                    ${order.note}
                </p>
                ` : ''}
            </div>

            <div class="order-total">
                <span>Tổng tiền:</span>
                <strong>${formatPrice(order.totalAmount)}₫</strong>
            </div>

            <button class="view-details-btn" onclick="viewOrderDetails(${order.orderId})">
                🔍 Xem chi tiết đơn hàng
            </button>
        </div>
    `).join('');
}

function showEmptyOrders() {
    const ordersList = document.getElementById('orders-list');
    const emptyOrders = document.getElementById('empty-orders');

    ordersList.style.display = 'none';
    emptyOrders.style.display = 'flex';
}

function getStatusBadge(status) {
    const statusMap = {
        'pending': { text: 'Chờ xử lý', color: '#FF9800' },
        'processing': { text: 'Đang xử lý', color: '#2196F3' },
        'shipping': { text: 'Đang giao', color: '#9C27B0' },
        'completed': { text: 'Hoàn thành', color: '#4CAF50' },
        'cancelled': { text: 'Đã hủy', color: '#F44336' }
    };

    const info = statusMap[status] || { text: status, color: '#666' };
    return `<span class="status-badge" style="background-color: ${info.color}">${info.text}</span>`;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
}

function formatPrice(price) {
    return parseFloat(price).toLocaleString('vi-VN');
}

async function viewOrderDetails(orderId) {
    const token = localStorage.getItem('token');
    const modal = document.getElementById('order-detail-modal');
    const modalBody = document.getElementById('modal-body');
    const modalOrderId = document.getElementById('modal-order-id');

    // Show modal with loading state
    modal.style.display = 'flex';
    modalOrderId.textContent = `#${orderId}`;
    modalBody.innerHTML = '<div style="text-align:center;padding:40px;"><div class="loading-spinner"></div><p>Đang tải chi tiết...</p></div>';

    try {
        const response = await fetch(`${window.API_URL}/orders/${orderId}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const order = await response.json();
        console.log('📦 Order details:', order);

        // Fetch user's reviews to check which products have been reviewed
        const userData = JSON.parse(localStorage.getItem('user') || '{}');
        const userId = userData.userId;

        let reviewedProductIds = [];
        if (userId && order.status === 'completed') {
            try {
                // Fetch all reviews for products in this order
                const productIds = order.items.map(item => item.productId);
                const reviewChecks = await Promise.all(
                    productIds.map(async (productId) => {
                        const reviewResponse = await fetch(`${window.API_URL}/products/${productId}/reviews`, {
                            headers: {
                                'Authorization': `Bearer ${token}`,
                                'Content-Type': 'application/json'
                            }
                        });
                        if (reviewResponse.ok) {
                            const reviews = await reviewResponse.json();
                            const hasReviewed = reviews.some(review => review.userId === userId);
                            return hasReviewed ? productId : null;
                        }
                        return null;
                    })
                );
                reviewedProductIds = reviewChecks.filter(id => id !== null);
            } catch (error) {
                console.warn('Could not fetch review status:', error);
            }
        }

        // Display order details
        displayOrderDetails(order, reviewedProductIds);

    } catch (error) {
        console.error('❌ Error loading order details:', error);
        modalBody.innerHTML = '<div style="text-align:center;padding:40px;color:#ff5252;"><p>❌ Không thể tải chi tiết đơn hàng</p></div>';
    }
}

function displayOrderDetails(order, reviewedProductIds = []) {
    const modalBody = document.getElementById('modal-body');

    const isCompleted = order.status === 'completed';
    const canCancel = ['pending', 'processing'].includes(order.status);

    const itemsHtml = order.items && order.items.length > 0
        ? order.items.map(item => {
            const alreadyReviewed = reviewedProductIds.includes(item.productId);
            return `
            <div class="detail-item">
                <div class="item-info">
                    <img src="${item.product?.imageUrl ? '/storage/' + item.product.imageUrl : '/images/placeholder.png'}" 
                         alt="${item.product?.name || 'Product'}" 
                         onerror="this.src='/images/placeholder.png'">
                    <div>
                        <h4>${item.product?.name || 'Sản phẩm #' + item.productId}</h4>
                        <p class="item-price">${formatPrice(item.price)}₫ × ${item.quantity}</p>
                        ${isCompleted && !alreadyReviewed ? `<button class="review-btn-small" onclick="openReviewModal(${item.productId}, '${(item.product?.name || '').replace(/'/g, "\\'")}', '${item.product?.imageUrl || ''}')">⭐ Đánh giá</button>` : ''}
                        ${alreadyReviewed ? `<span style="color:#4CAF50;font-size:12px;margin-top:5px;display:block;">✅ Đã đánh giá</span>` : ''}
                    </div>
                </div>
                <div class="item-total">${formatPrice(item.price * item.quantity)}₫</div>
            </div>
        `}).join('')
        : '<p style="text-align:center;color:#999;padding:20px;">Không có sản phẩm</p>';

    modalBody.innerHTML = `
        <div class="detail-section">
            <h4>🛍️ Sản phẩm đã đặt</h4>
            <div class="detail-items">
                ${itemsHtml}
            </div>
        </div>
        
        <div class="detail-section">
            <h4>👤 Thông tin khách hàng</h4>
            <div class="detail-grid">
                <p><strong>Họ tên:</strong> ${order.customerName}</p>
                <p><strong>Số điện thoại:</strong> ${order.phone}</p>
                <p style="grid-column: 1 / -1;"><strong>Địa chỉ giao hàng:</strong> ${order.shippingAddress}</p>
                ${order.note ? `<p style="grid-column: 1 / -1;"><strong>Ghi chú:</strong> ${order.note}</p>` : ''}
            </div>
        </div>
        
        <div class="detail-section">
            <h4>💳 Thông tin thanh toán</h4>
            <div class="detail-grid">
                <p><strong>Phương thức:</strong> ${getPaymentMethod(order.payment?.method)}</p>
                <p><strong>Trạng thái:</strong> ${getPaymentStatus(order.payment?.status)}</p>
                ${order.payment?.transactionCode ? `<p style="grid-column: 1 / -1;"><strong>Mã giao dịch:</strong> ${order.payment.transactionCode}</p>` : ''}
            </div>
        </div>
        
        ${canCancel ? `
        <button class="cancel-order-btn" onclick="cancelOrder(${order.orderId})">
            Hủy đơn hàng
        </button>
        ` : ''}
        
        <div class="detail-total">
            <span>Tổng cộng:</span>
            <strong>${formatPrice(order.totalAmount)}₫</strong>
        </div>
    `;
}

function getPaymentMethod(method) {
    const methods = {
        'cod': '💵 Thanh toán khi nhận hàng (COD)',
        'vnpay': '🏦 VNPay',
        'stripe': '💳 Stripe'
    };
    return methods[method] || method;
}

function getPaymentStatus(status) {
    const statuses = {
        'pending': '⏳ Chờ thanh toán',
        'success': '✅ Đã thanh toán',
        'failed': '❌ Thất bại'
    };
    return statuses[status] || status;
}

function closeOrderModal() {
    document.getElementById('order-detail-modal').style.display = 'none';
}

// ===== REVIEW MODAL FUNCTIONS =====
let currentReviewProduct = null;
let selectedRating = 0;

function openReviewModal(productId, productName, productImage) {
    currentReviewProduct = { productId, productName, productImage };
    selectedRating = 0;

    const modal = document.getElementById('review-modal');
    const productInfo = document.getElementById('review-product-info');
    const commentText = document.getElementById('review-comment-text');
    const ratingText = document.getElementById('rating-text');

    // Reset form
    commentText.value = '';
    document.querySelectorAll('#review-stars .star').forEach(star => {
        star.classList.remove('active');
    });
    ratingText.textContent = 'Chọn số sao';

    // Display product info
    productInfo.innerHTML = `
        <img src="${productImage ? '/storage/' + productImage : '/images/placeholder.png'}" 
             alt="${productName}"
             onerror="this.src='/images/placeholder.png'">
        <h4>${productName}</h4>
    `;

    // Show modal
    modal.style.display = 'flex';

    // Setup star click handlers
    setupStarRating();
}

function setupStarRating() {
    const stars = document.querySelectorAll('#review-stars .star');
    const starContainer = document.getElementById('review-stars');

    // Remove any existing event listeners
    starContainer.replaceWith(starContainer.cloneNode(true));
    const newStarContainer = document.getElementById('review-stars');
    const newStars = document.querySelectorAll('#review-stars .star');

    newStars.forEach((star, index) => {
        // Click handler
        star.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            selectedRating = parseInt(star.dataset.rating);
            updateStars(selectedRating);
            console.log('⭐ Selected rating:', selectedRating);
        });

        // Hover handler
        star.addEventListener('mouseenter', () => {
            const rating = parseInt(star.dataset.rating);
            updateStars(rating, true);
        });
    });

    // Mouse leave - return to selected state
    newStarContainer.addEventListener('mouseleave', () => {
        updateStars(selectedRating);
    });
}

function updateStars(rating, isHover = false) {
    const stars = document.querySelectorAll('#review-stars .star');
    const ratingText = document.getElementById('rating-text');

    stars.forEach((star, index) => {
        if (index < rating) {
            star.classList.add('active');
        } else {
            star.classList.remove('active');
        }
    });

    const ratingTexts = {
        0: 'Chọn số sao',
        1: '😢 Rất tệ',
        2: '😕 Tệ',
        3: '😐 Trung bình',
        4: '😊 Tốt',
        5: '🤩 Tuyệt vời'
    };

    ratingText.textContent = ratingTexts[rating] || 'Chọn số sao';

    // Add pulse animation on selection (not on hover)
    if (!isHover && rating > 0) {
        ratingText.style.animation = 'none';
        setTimeout(() => {
            ratingText.style.animation = 'pulse 0.3s ease';
        }, 10);
    }
}

async function submitReview() {
    if (!currentReviewProduct) return;

    const comment = document.getElementById('review-comment-text').value.trim();
    const token = localStorage.getItem('token');

    if (selectedRating === 0) {
        alert('⚠️ Vui lòng chọn số sao đánh giá!');
        return;
    }

    if (!comment) {
        alert('⚠️ Vui lòng viết nhận xét của bạn!');
        return;
    }

    try {
        const response = await fetch(`${window.API_URL}/reviews`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                productId: currentReviewProduct.productId,
                rating: selectedRating,
                comment: comment
            })
        });

        const result = await response.json();

        if (response.ok && result.success) {
            alert('✅ Cảm ơn bạn đã đánh giá sản phẩm!');

            // Update UI immediately - find and replace the review button with "Đã đánh giá" text
            const detailItems = document.querySelectorAll('.detail-item');
            detailItems.forEach(item => {
                const itemH4 = item.querySelector('.item-info h4');
                if (itemH4 && itemH4.textContent.includes(currentReviewProduct.productName)) {
                    const reviewBtn = item.querySelector('.review-btn-small');
                    if (reviewBtn) {
                        reviewBtn.remove();
                        const infoDiv = item.querySelector('.item-info > div');
                        const reviewedSpan = document.createElement('span');
                        reviewedSpan.style.cssText = 'color:#4CAF50;font-size:12px;margin-top:5px;display:block;';
                        reviewedSpan.textContent = '✅ Đã đánh giá';
                        infoDiv.appendChild(reviewedSpan);
                    }
                }
            });

            closeReviewModal();
        } else {
            alert('❌ ' + (result.message || 'Không thể gửi đánh giá'));
        }
    } catch (error) {
        console.error('Submit review error:', error);
        alert('❌ Có lỗi xảy ra khi gửi đánh giá');
    }
}

async function cancelOrder(orderId) {
    if (!confirm('⚠️ Bạn có chắc muốn hủy đơn hàng này?\nHành động này không thể hoàn tác.')) {
        return;
    }

    const token = localStorage.getItem('token');

    try {
        const response = await fetch(`${window.API_URL}/orders/${orderId}/cancel`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        const result = await response.json();

        if (response.ok && result.success) {
            alert('✅ ' + result.message);

            // Close modal and reload orders list
            closeOrderModal();
            loadOrders();
        } else {
            alert('❌ ' + (result.message || 'Không thể hủy đơn hàng'));
        }
    } catch (error) {
        console.error('Cancel order error:', error);
        alert('❌ Có lỗi xảy ra khi hủy đơn hàng');
    }
}

function closeReviewModal() {
    document.getElementById('review-modal').style.display = 'none';
    currentReviewProduct = null;
    selectedRating = 0;
}
