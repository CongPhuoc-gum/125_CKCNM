if (!window.API_URL) window.API_URL = '/api';

(function () {
    'use strict';

    const API_URL = window.API_URL;

    // ===== EXPORT GLOBAL FUNCTIONS (nếu nơi khác cần) =====
    window.getCart = getCart;
    window.completeCheckout = completeCheckout;

    // ===== INIT =====
    document.addEventListener('DOMContentLoaded', async function () {
        console.log('✅ Checkout.js loaded');

        const token = localStorage.getItem('token');
        if (!token) {
            showToast('Vui lòng đăng nhập để thanh toán!', 'error');
            setTimeout(() => window.location.href = '/login', 1500);
            return;
        }

        await autoFillUserInfo();
        await loadCheckoutCart();
        initCheckoutButton();
    });

    // ===== AUTO-FILL USER =====
    async function autoFillUserInfo() {
        try {
            const userStr = localStorage.getItem('user');
            if (!userStr) return;

            const user = JSON.parse(userStr);

            const fullname = document.getElementById('fullname');
            const phone = document.getElementById('phone');

            if (fullname && user.fullName) fullname.value = user.fullName;
            if (phone && user.phone) phone.value = user.phone;

        } catch (e) {
            console.error('Auto-fill error:', e);
        }
    }

    // ===== LOAD CART =====
    async function loadCheckoutCart() {
        const cart = await getCart();
        if (!cart || !cart.cartitems || cart.cartitems.length === 0) {
            showEmptyCart();
            return;
        }

        renderCheckoutItems(cart.cartitems);
        calculateTotal(cart.cartitems);
    }

    function showEmptyCart() {
        const orderItems = document.getElementById('order-items');
        if (!orderItems) return;

        orderItems.innerHTML = `
            <div style="text-align:center;padding:40px 20px;">
                <div style="font-size:60px;margin-bottom:16px;">🛒</div>
                <h3>Giỏ hàng trống</h3>
                <a href="/" class="back-home">← Quay về trang chủ</a>
            </div>
        `;

        const btn = document.querySelector('.confirm-btn');
        if (btn) btn.disabled = true;
    }

    // ===== RENDER ITEMS =====
    function renderCheckoutItems(items) {
        const wrap = document.getElementById('order-items');
        if (!wrap) return;

        wrap.innerHTML = '';
        items.forEach(item => {
            const img = item.product?.imageUrl
                ? '/storage/' + item.product.imageUrl
                : '/images/no-image.png';

            const div = document.createElement('div');
            div.className = 'order-item';
            div.innerHTML = `
                <img src="${img}" onerror="this.src='/images/no-image.png'">
                <div class="order-info">
                    <div class="order-name">${item.product?.name || 'Sản phẩm'}</div>
                    <div class="order-qty-controls">
                        <button class="qty-btn minus" data-id="${item.productId}">−</button>
                        <span class="qty-display">${item.quantity}</span>
                        <button class="qty-btn plus" data-id="${item.productId}">+</button>
                    </div>
                </div>
                <div class="order-price">${formatPrice(item.price * item.quantity)}₫</div>
            `;
            wrap.appendChild(div);
        });

        // Add event listeners for quantity buttons
        document.querySelectorAll('.qty-btn').forEach(btn => {
            btn.addEventListener('click', handleQuantityChange);
        });
    }

    // ===== QUANTITY CHANGE =====
    async function handleQuantityChange(e) {
        const btn = e.currentTarget;
        const productId = parseInt(btn.dataset.id);
        const isMinus = btn.classList.contains('minus');

        try {
            const cart = await getCart();
            const item = cart.cartitems.find(i => i.productId === productId);
            if (!item) return;

            let newQty = isMinus ? item.quantity - 1 : item.quantity + 1;

            if (newQty <= 0) {
                // Remove item if quantity becomes 0
                if (confirm('Bạn có muốn xóa sản phẩm này khỏi giỏ hàng?')) {
                    await updateCartItem(productId, 0);
                    await loadCheckoutCart();

                    // Update cart count in header
                    if (window.updateCartCount) window.updateCartCount();
                }
            } else {
                await updateCartItem(productId, newQty);
                await loadCheckoutCart();

                // Update cart count in header
                if (window.updateCartCount) window.updateCartCount();
            }

        } catch (e) {
            console.error('Update quantity error:', e);
            showToast('Không thể cập nhật số lượng!', 'error');
        }
    }

    // ===== UPDATE CART ITEM =====
    async function updateCartItem(productId, quantity) {
        try {
            // Lấy cart để tìm cartItemId
            const cart = await getCart();
            const item = cart.cartitems.find(i => i.productId === productId);
            if (!item) throw new Error('Không tìm thấy sản phẩm');

            // Nếu quantity = 0, xóa sản phẩm
            if (quantity <= 0) {
                const res = await fetch(`${API_URL}/cart/remove/${item.cartItemId}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                });
                const json = await res.json();
                if (!json.success) {
                    throw new Error(json.message || 'Xóa thất bại');
                }
            } else {
                // Cập nhật số lượng
                const res = await fetch(`${API_URL}/cart/update/${item.cartItemId}`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({ quantity })
                });
                const json = await res.json();
                if (!json.success) {
                    throw new Error(json.message || 'Cập nhật thất bại');
                }
            }
        } catch (e) {
            throw e;
        }
    }

    // ===== TOTAL =====
    function calculateTotal(items) {
        const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0);
        document.getElementById('subtotal').textContent = formatPrice(subtotal) + '₫';
        updateTotalWithShipping(subtotal);

        const address = document.getElementById('address');
        if (address) {
            address.addEventListener('input', () => updateTotalWithShipping(subtotal));
        }
    }

    function updateTotalWithShipping(subtotal) {
        const address = document.getElementById('address').value.trim();
        const shippingEl = document.getElementById('shipping');
        const totalEl = document.getElementById('total');

        if (!address) {
            shippingEl.textContent = 'Vui lòng nhập địa chỉ';
            totalEl.textContent = formatPrice(subtotal) + '₫';
            return;
        }

        const shipping = 30000;
        shippingEl.textContent = formatPrice(shipping) + '₫';
        totalEl.textContent = formatPrice(subtotal + shipping) + '₫';
    }

    // ===== BUTTON =====
    function initCheckoutButton() {
        const btn = document.querySelector('.confirm-btn');
        if (!btn) return;
        btn.addEventListener('click', handleCheckout);
    }

    // ===== CHECKOUT =====
    async function handleCheckout() {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const cart = await getCart();
        if (!cart || !cart.cartitems?.length) {
            showToast('Giỏ hàng trống!', 'error');
            return;
        }

        const fullname = document.getElementById('fullname').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const address = document.getElementById('address').value.trim();
        const note = document.getElementById('note')?.value.trim();

        if (!fullname || !phone || !address) {
            showToast('Vui lòng nhập đầy đủ thông tin!', 'error');
            return;
        }

        const cartItems = cart.cartitems.map(i => ({
            productId: i.productId,
            quantity: i.quantity,
            price: i.price
        }));

        const subtotal = cart.cartitems.reduce((s, i) => s + i.price * i.quantity, 0);
        const totalAmount = subtotal + 30000;
        const paymentMethod = document.querySelector('input[name="pay"]:checked')?.value;

        await completeCheckout(paymentMethod, cartItems, totalAmount, {
            userId: user.userId,
            fullname,
            phone,
            address,
            note
        });
    }

    // ===== COMPLETE CHECKOUT =====
    async function completeCheckout(paymentMethod, cartItems, totalAmount, info) {
        try {
            const res = await fetch(`${API_URL}/checkout`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userId: info.userId,
                    cartItems,
                    totalAmount,
                    paymentMethod,
                    shippingAddress: info.address,
                    phone: info.phone,
                    customerName: info.fullname,
                    note: info.note
                })
            });

            const result = await res.json();

            if (res.ok && result.success) {
                // Check if payment gateway redirect is required
                if (result.redirectUrl) {
                    // For VNPay or Stripe - redirect to payment gateway
                    console.log('Redirecting to payment gateway:', result.redirectUrl);
                    window.location.href = result.redirectUrl;
                } else {
                    // For COD - show success and redirect to orders page
                    showToast('Đặt hàng thành công!', 'success');
                    setTimeout(() => window.location.href = '/orders', 1500);
                }
            } else {
                showToast(result.message || 'Đặt hàng thất bại!', 'error');
            }
        } catch (e) {
            console.error('Checkout error:', e);
            showToast('Lỗi hệ thống!', 'error');
        }
    }

    // ===== API CART =====
    async function getCart() {
        try {
            const res = await fetch(`${API_URL}/cart`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });
            const json = await res.json();
            return json.success ? json.data : null;
        } catch {
            return null;
        }
    }

    // ===== UTILS =====
    function formatPrice(p) {
        return Number(p).toLocaleString('vi-VN');
    }

    function showToast(msg, type = 'success') {
        alert(msg); // nếu muốn giữ toast cũ, mình gắn lại cho bạn
    }

})();