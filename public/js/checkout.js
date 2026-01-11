(function () {
    'use strict';

    const API_URL = 'http://localhost:8000/api';

    // ===== AUTO-FILL THÔNG TIN USER KHI LOAD TRANG =====
    document.addEventListener('DOMContentLoaded', async function () {
        console.log('✅ Checkout.js loaded');

        // Kiểm tra đăng nhập
        const token = localStorage.getItem('token');
        if (!token) {
            showToast('Vui lòng đăng nhập để thanh toán!', 'error');
            setTimeout(() => {
                window.location.href = '/login';
            }, 1500);
            return;
        }

        // ✅ AUTO-FILL THÔNG TIN USER
        await autoFillUserInfo();

        // Load giỏ hàng
        await loadCheckoutCart();

        // Xử lý thanh toán
        initCheckoutButton();
    });

    // ===== AUTO-FILL THÔNG TIN USER =====
    async function autoFillUserInfo() {
        try {
            const userStr = localStorage.getItem('user');

            if (!userStr) {
                console.warn('⚠️ No user data in localStorage');
                return;
            }

            const user = JSON.parse(userStr);

            // Fill họ tên
            const fullnameInput = document.getElementById('fullname');
            if (fullnameInput && user.fullName) {
                fullnameInput.value = user.fullName;
            }

            // Fill số điện thoại
            const phoneInput = document.getElementById('phone');
            if (phoneInput && user.phone) {
                phoneInput.value = user.phone;
            }

            console.log('✅ User info auto-filled:', {
                fullName: user.fullName,
                phone: user.phone
            });

        } catch (error) {
            console.error('❌ Error auto-filling user info:', error);
        }
    }

    // ===== LOAD GIỎ HÀNG CHO CHECKOUT =====
    async function loadCheckoutCart() {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const response = await fetch(`${API_URL}/cart`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });

            const result = await response.json();
            console.log('🛒 Cart data:', result);

            if (!result.success || !result.data || !result.data.cartitems || result.data.cartitems.length === 0) {
                showEmptyCart();
                return;
            }

            renderCheckoutItems(result.data.cartitems);
            calculateTotal(result.data.cartitems);

        } catch (error) {
            console.error('❌ Error loading cart:', error);
            showToast('Không thể tải giỏ hàng!', 'error');
        }
    }

    // ===== HIỂN THỊ GIỎ HÀNG TRỐNG =====
    function showEmptyCart() {
        const orderItems = document.getElementById('order-items');
        if (!orderItems) return;

        orderItems.innerHTML = `
            <div style="text-align:center;padding:40px 20px;">
                <div style="font-size:60px;margin-bottom:16px;">🛒</div>
                <h3 style="color:#666;margin-bottom:8px;">Giỏ hàng trống</h3>
                <p style="color:#999;margin-bottom:20px;">Hãy thêm sản phẩm vào giỏ hàng trước khi thanh toán</p>
                <a href="/" style="display:inline-block;padding:12px 24px;background:#f97316;color:white;text-decoration:none;border-radius:8px;font-weight:600;">
                    ← Quay về trang chủ
                </a>
            </div>
        `;

        // Disable nút thanh toán
        const confirmBtn = document.querySelector('.confirm-btn');
        if (confirmBtn) {
            confirmBtn.disabled = true;
            confirmBtn.style.opacity = '0.5';
            confirmBtn.style.cursor = 'not-allowed';
        }
    }

    // ===== RENDER DANH SÁCH SẢN PHẨM =====
    function renderCheckoutItems(items) {
        const orderItems = document.getElementById('order-items');
        if (!orderItems) return;

        orderItems.innerHTML = '';

        items.forEach(item => {
            let imageUrl = '/images/no-image.png';
            if (item.product && item.product.imageUrl) {
                imageUrl = '/storage/' + item.product.imageUrl;
            }

            const itemEl = document.createElement('div');
            itemEl.className = 'order-item';
            itemEl.innerHTML = `
                <img src="${imageUrl}" 
                     alt="${item.product?.name || 'Sản phẩm'}"
                     onerror="this.src='/images/no-image.png'">
                <div class="order-info">
                    <div class="order-name">${item.product?.name || 'Sản phẩm'}</div>
                    <div class="order-qty">SL: ${item.quantity}</div>
                </div>
                <div class="order-price">${formatPrice(item.price * item.quantity)}₫</div>
            `;
            orderItems.appendChild(itemEl);
        });
    }

    // ===== TÍNH TỔNG TIỀN =====
    function calculateTotal(items) {
        let subtotal = 0;

        items.forEach(item => {
            subtotal += item.price * item.quantity;
        });

        // Update tạm tính
        const subtotalEl = document.getElementById('subtotal');
        if (subtotalEl) subtotalEl.textContent = formatPrice(subtotal) + '₫';

        // Update tổng (ban đầu chỉ hiện tạm tính)
        updateTotalWithShipping(subtotal);

        // Lắng nghe khi nhập địa chỉ để update phí ship
        const addressInput = document.getElementById('address');
        if (addressInput) {
            addressInput.addEventListener('input', function () {
                updateTotalWithShipping(subtotal);
            });
        }
    }

    // ===== CẬP NHẬT TỔNG TIỀN VỚI PHÍ SHIP =====
    function updateTotalWithShipping(subtotal) {
        const addressInput = document.getElementById('address');
        const shippingEl = document.getElementById('shipping');
        const totalEl = document.getElementById('total');

        if (!addressInput || !shippingEl || !totalEl) return;

        const hasAddress = addressInput.value.trim().length > 0;

        if (hasAddress) {
            // Có địa chỉ → Hiển thị phí ship 30k
            const shipping = 30000;
            const total = subtotal + shipping;

            shippingEl.textContent = formatPrice(shipping) + '₫';
            shippingEl.style.color = '#333';
            totalEl.textContent = formatPrice(total) + '₫';
        } else {
            // Chưa có địa chỉ → Hiển thị placeholder
            shippingEl.textContent = 'Vui lòng nhập địa chỉ';
            shippingEl.style.color = '#999';
            shippingEl.style.fontStyle = 'italic';
            totalEl.textContent = formatPrice(subtotal) + '₫';
        }
    }

    // ===== XỬ LÝ NÚT THANH TOÁN =====
    function initCheckoutButton() {
        const confirmBtn = document.querySelector('.confirm-btn');
        if (!confirmBtn) return;

        confirmBtn.addEventListener('click', async function () {
            await handleCheckout();
        });
    }

    // ===== XỬ LÝ CHECKOUT =====
    async function handleCheckout() {
        const token = localStorage.getItem('token');
        const userStr = localStorage.getItem('user');

        if (!token || !userStr) {
            showToast('Vui lòng đăng nhập!', 'error');
            window.location.href = '/login';
            return;
        }

        // Validate thông tin
        const fullname = document.getElementById('fullname').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const address = document.getElementById('address').value.trim();
        const note = document.getElementById('note').value.trim();

        if (!fullname) {
            showToast('Vui lòng nhập họ tên!', 'error');
            document.getElementById('fullname').focus();
            return;
        }

        if (!phone) {
            showToast('Vui lòng nhập số điện thoại!', 'error');
            document.getElementById('phone').focus();
            return;
        }

        if (!address) {
            showToast('Vui lòng nhập địa chỉ giao hàng!', 'error');
            document.getElementById('address').focus();
            return;
        }

        // Lấy userId
        const user = JSON.parse(userStr);
        const userId = user.userId;

        // Lấy giỏ hàng
        const cartData = await getCart();
        if (!cartData || !cartData.cartitems || cartData.cartitems.length === 0) {
            showToast('Giỏ hàng trống!', 'error');
            return;
        }

        // Chuẩn bị cartItems theo format backend cần
        const cartItems = cartData.cartitems.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price
        }));

        // Tính tổng tiền
        const subtotal = cartData.cartitems.reduce((sum, item) => {
            return sum + (item.price * item.quantity);
        }, 0);
        const shipping = 30000;
        const totalAmount = subtotal + shipping;

        // Lấy phương thức thanh toán
        const payMethod = document.querySelector('input[name="pay"]:checked').value;

        // Show loading
        const confirmBtn = document.querySelector('.confirm-btn');
        const originalText = confirmBtn.innerHTML;
        confirmBtn.innerHTML = '<span>⏳ Đang xử lý...</span>';
        confirmBtn.disabled = true;

        try {
            console.log('🔵 Sending checkout request...', {
                userId,
                cartItems,
                totalAmount,
                paymentMethod: payMethod,
                shippingAddress: address,
                phone,
                customerName: fullname
            });

            const response = await fetch(`${API_URL}/checkout`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    userId: userId,
                    cartItems: cartItems,
                    totalAmount: totalAmount,
                    paymentMethod: payMethod,
                    shippingAddress: address,
                    phone: phone,
                    customerName: fullname,
                    note: note
                })
            });

            const result = await response.json();
            console.log('📦 Checkout result:', result);

            if (response.ok && (result.message === 'Order created successfully' || result.orderId)) {
                showToast('Đặt hàng thành công!', 'success');

                // Clear cart count
                const cartCount = document.getElementById('cart-count');
                if (cartCount) {
                    cartCount.textContent = '0';
                    cartCount.style.display = 'none';
                }

                // Redirect
                setTimeout(() => {
                    window.location.href = '/orders';
                }, 1500);

            } else {
                // Hiển thị lỗi cụ thể
                let errorMsg = result.message || 'Đặt hàng thất bại!';

                if (result.errors) {
                    const firstError = Object.values(result.errors)[0];
                    errorMsg = Array.isArray(firstError) ? firstError[0] : firstError;
                }

                showToast(errorMsg, 'error');
                confirmBtn.innerHTML = originalText;
                confirmBtn.disabled = false;
            }

        } catch (error) {
            console.error('❌ Checkout error:', error);
            showToast('Có lỗi xảy ra khi đặt hàng!', 'error');
            confirmBtn.innerHTML = originalText;
            confirmBtn.disabled = false;
        }
    }

    // ===== LẤY GIỎ HÀNG =====
    async function getCart() {
        const token = localStorage.getItem('token');
        if (!token) return null;

        try {
            const response = await fetch(`${API_URL}/cart`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });
            const result = await response.json();
            return result.success ? result.data : null;
        } catch (error) {
            console.error('Error fetching cart:', error);
            return null;
        }
    }

    // ===== FORMAT PRICE =====
    function formatPrice(price) {
        return price.toLocaleString('vi-VN');
    }

    // ===== TOAST NOTIFICATION =====
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

    // Inject toast CSS if not exists
    if (!document.getElementById('toast-styles')) {
        const style = document.createElement('style');
        style.id = 'toast-styles';
        style.textContent = `
            .custom-toast {
                position: fixed;
                top: 20px;
                right: 20px;
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 16px 24px;
                border-radius: 12px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                font-size: 14px;
                font-weight: 500;
                z-index: 999999;
                opacity: 0;
                transform: translateX(400px);
                transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            }
            .custom-toast.show {
                opacity: 1;
                transform: translateX(0);
            }
            .custom-toast-success {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
            }
            .custom-toast-error {
                background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
                color: white;
            }
            .toast-icon {
                width: 24px;
                height: 24px;
                border-radius: 50%;
                background: rgba(255,255,255,0.3);
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 14px;
                font-weight: bold;
            }
            .toast-message {
                flex: 1;
                line-height: 1.4;
            }
        `;
        document.head.appendChild(style);
    }

})();