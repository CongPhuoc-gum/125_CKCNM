// ===== CART.JS - Quản lý Giỏ Hàng =====
const API_URL = 'http://localhost:8000/api';

// ===== EXPORT GLOBAL FUNCTIONS NGAY LẬP TỨC =====
window.addToCart = addToCart;
window.updateCartItemQuantity = updateCartItemQuantity;
window.removeFromCart = removeFromCart;
window.goCheckout = goCheckout;
window.updateCartCount = updateCartCount; // ✅ Export luôn để tránh bị ghi đè

// Thêm sản phẩm vào giỏ hàng
async function addToCart(productId, quantity = 1) {
    const token = localStorage.getItem('token');

    if (!token) {
        alert('⚠️ Vui lòng đăng nhập trước!');
        window.location.href = '/login';
        return;
    }

    try {
        const response = await fetch(`${API_URL}/cart/add`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ productId, quantity })
        });

        const result = await response.json();

        if (result.success) {
            showToast('✅ Đã thêm vào giỏ hàng!');
            await updateCartCount();

            const cartOverlay = document.getElementById('cart-overlay');
            if (cartOverlay && cartOverlay.classList.contains('show')) {
                await updateCartUI();
            }
        } else {
            alert('❌ ' + (result.message || 'Lỗi khi thêm vào giỏ hàng'));
        }
    } catch (error) {
        console.error('Error adding to cart:', error);
        alert('❌ Có lỗi xảy ra khi thêm vào giỏ hàng!');
    }
}

// Lấy giỏ hàng từ API
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

// Cập nhật số lượng (hoặc xóa nếu = 0)
async function updateCartItemQuantity(cartItemId, quantity) {
    const token = localStorage.getItem('token');
    if (!token) return;

    // Nếu giảm xuống 0 thì xóa luôn
    if (quantity <= 0) {
        await removeFromCart(cartItemId, true);
        return;
    }

    try {
        const response = await fetch(`${API_URL}/cart/update/${cartItemId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({ quantity })
        });
        const result = await response.json();
        if (result.success) {
            await updateCartUI();
            await updateCartCount();
        } else {
            alert('❌ ' + (result.message || 'Lỗi cập nhật số lượng'));
        }
    } catch (error) {
        console.error('Error updating quantity:', error);
    }
}

// Xóa sản phẩm khỏi giỏ
async function removeFromCart(cartItemId, skipConfirm = false) {
    if (!skipConfirm && !confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
        return;
    }

    const token = localStorage.getItem('token');
    if (!token) return;

    try {
        const response = await fetch(`${API_URL}/cart/remove/${cartItemId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        });
        const result = await response.json();
        if (result.success) {
            if (!skipConfirm) {
                showToast('✅ Đã xóa khỏi giỏ hàng');
            }
            await updateCartUI();
            await updateCartCount();
        } else {
            alert('❌ ' + (result.message || 'Lỗi xóa sản phẩm'));
        }
    } catch (error) {
        console.error('Error removing from cart:', error);
    }
}

// Cập nhật giao diện giỏ hàng
async function updateCartUI() {
    const cartData = await getCart();
    const cartItemsEl = document.querySelector('.cart-items');
    const cartTotalEl = document.querySelector('.cart-total strong');

    if (!cartItemsEl) return;

    cartItemsEl.innerHTML = '';
    let total = 0;

    if (!cartData || !cartData.cartitems || cartData.cartitems.length === 0) {
        cartItemsEl.innerHTML = '<p style="text-align:center;color:#999;padding:20px">Giỏ hàng trống</p>';
        if (cartTotalEl) cartTotalEl.innerText = '0₫';
        return;
    }

    cartData.cartitems.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        let imageUrl = '/images/no-image.png';
        if (item.product && item.product.imageUrl) {
            imageUrl = '/storage/' + item.product.imageUrl;
        }

        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <img src="${imageUrl}" 
                 alt="${item.product?.name || 'Sản phẩm'}"
                 onerror="this.src='/images/no-image.png'">
            <div class="cart-info">
                <div class="cart-name">${item.product?.name || 'Sản phẩm'}</div>
                <div class="cart-price">${formatPrice(item.price)}₫</div>
                <div class="cart-qty">
                    <button onclick="updateCartItemQuantity(${item.cartItemId}, ${item.quantity - 1})" 
                            title="Giảm số lượng">−</button>
                    <span>${item.quantity}</span>
                    <button onclick="updateCartItemQuantity(${item.cartItemId}, ${item.quantity + 1})"
                            title="Tăng số lượng">+</button>
                </div>
            </div>
            <button class="remove-item" 
                    onclick="removeFromCart(${item.cartItemId})"
                    title="Xóa sản phẩm">✕</button>
        `;
        cartItemsEl.appendChild(cartItem);
    });

    if (cartTotalEl) cartTotalEl.innerText = formatPrice(total) + '₫';
}

// ✅ Cập nhật số lượng trên badge giỏ hàng
async function updateCartCount() {
    try {
        const cartCountEl = document.getElementById('cart-count');

        if (!cartCountEl) {
            console.warn('⚠️ Element #cart-count not found');
            return;
        }

        const cartData = await getCart();

        if (!cartData || !cartData.cartitems || cartData.cartitems.length === 0) {
            cartCountEl.innerText = '0';
            cartCountEl.style.display = 'none';
            console.log('📦 Cart is empty');
            return;
        }

        const totalItems = cartData.cartitems.reduce((sum, item) => sum + item.quantity, 0);

        // Animation nếu số thay đổi
        if (cartCountEl.innerText !== totalItems.toString()) {
            cartCountEl.classList.add('updated');
            setTimeout(() => cartCountEl.classList.remove('updated'), 500);
        }

        cartCountEl.innerText = totalItems;
        cartCountEl.style.display = 'inline-flex';

        console.log(`🛒 Cart count: ${totalItems} items`);
    } catch (error) {
        console.error('❌ Error updating cart count:', error);
    }
}

// Format tiền
function formatPrice(price) {
    return price.toLocaleString('vi-VN');
}

// Toast notification
function showToast(message) {
    const oldToast = document.querySelector('.custom-toast');
    if (oldToast) oldToast.remove();

    const toast = document.createElement('div');
    toast.className = 'custom-toast';
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background: linear-gradient(135deg, #2f7d32, #1b5e20);
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
    }, 2000);
}

// CSS animation
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from { transform: translateX(400px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(400px); opacity: 0; }
    }
`;
document.head.appendChild(style);

// Redirect checkout
function goCheckout() {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('⚠️ Vui lòng đăng nhập!');
        window.location.href = '/login';
        return;
    }
    window.location.href = '/checkout';
}

// Khởi tạo khi trang load
document.addEventListener('DOMContentLoaded', () => {
    console.log('✅ Cart.js loaded');

    // Cart Overlay Management
    const cartOverlay = document.getElementById('cart-overlay');
    const cartBtn = document.getElementById('cart-btn');
    const closeCartBtn = document.getElementById('close-cart');
    const closeCartBtn2 = document.querySelector('.close-cart-btn');

    if (cartBtn) {
        cartBtn.addEventListener('click', async () => {
            if (cartOverlay) {
                cartOverlay.classList.add('show');
                await updateCartUI();
            }
        });
    }

    if (closeCartBtn) {
        closeCartBtn.addEventListener('click', () => {
            if (cartOverlay) cartOverlay.classList.remove('show');
        });
    }

    if (closeCartBtn2) {
        closeCartBtn2.addEventListener('click', () => {
            if (cartOverlay) cartOverlay.classList.remove('show');
        });
    }

    if (cartOverlay) {
        cartOverlay.addEventListener('click', (e) => {
            if (e.target === cartOverlay) {
                cartOverlay.classList.remove('show');
            }
        });
    }

    // ✅ Initial load với delay nhỏ
    setTimeout(() => {
        updateCartCount();
    }, 100);
});

// ✅ Backup: Load lại khi window hoàn toàn ready
window.addEventListener('load', () => {
    updateCartCount();
});