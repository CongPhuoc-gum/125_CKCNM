// ===== CART.JS - Quản lý Giỏ Hàng =====
// API_URL is defined in auth.js - use that shared constant

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
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ productId, quantity })
        });
        
        const result = await response.json();
        
        if (result.success) {
            alert('✅ ' + result.message);
            updateCartUI();
            updateCartCount();
        } else {
            alert('❌ ' + (result.message || 'Lỗi'));
        }
    } catch (error) {
        console.error('Error:', error);
        alert('❌ Có lỗi xảy ra!');
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
                'Content-Type': 'application/json'
            }
        });
        const result = await response.json();
        return result.success ? result.data : null;
    } catch (error) {
        console.error('Error:', error);
        return null;
    }
}

// Cập nhật số lượng
async function updateCartItemQuantity(cartItemId, quantity) {
    const token = localStorage.getItem('token');
    if (!token || quantity < 1) return;
    
    try {
        const response = await fetch(`${API_URL}/cart/update/${cartItemId}`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ quantity })
        });
        const result = await response.json();
        if (result.success) {
            updateCartUI();
            updateCartCount();
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// Xóa sản phẩm khỏi giỏ
async function removeFromCart(cartItemId) {
    if (!confirm('Xóa sản phẩm này?')) return;
    
    const token = localStorage.getItem('token');
    if (!token) return;
    
    try {
        const response = await fetch(`${API_URL}/cart/remove/${cartItemId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        const result = await response.json();
        if (result.success) {
            alert('✅ ' + result.message);
            updateCartUI();
            updateCartCount();
        }
    } catch (error) {
        console.error('Error:', error);
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
        
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <img src="${item.product?.imageUrl || 'https://via.placeholder.com/80'}" 
                 style="width:80px; height:80px; object-fit:cover; border-radius:8px;">
            <div class="cart-info">
                <div class="cart-name">${item.product?.name || 'Sản phẩm'}</div>
                <div class="cart-price">${formatPrice(item.price)}₫</div>
                <div class="cart-qty">
                    <button onclick="updateCartItemQuantity(${item.cartItemId}, ${item.quantity - 1})">−</button>
                    <span>${item.quantity}</span>
                    <button onclick="updateCartItemQuantity(${item.cartItemId}, ${item.quantity + 1})">+</button>
                </div>
            </div>
            <button class="remove-item" onclick="removeFromCart(${item.cartItemId})">✕</button>
        `;
        cartItemsEl.appendChild(cartItem);
    });
    
    if (cartTotalEl) cartTotalEl.innerText = formatPrice(total) + '₫';
}

// Cập nhật số lượng trên nút giỏ
async function updateCartCount() {
    const cartData = await getCart();
    const cartCountEl = document.getElementById('cart-count');
    
    if (!cartCountEl) return;
    
    if (!cartData || !cartData.cartitems) {
        cartCountEl.innerText = '0';
        return;
    }
    
    const totalItems = cartData.cartitems.reduce((sum, item) => sum + item.quantity, 0);
    cartCountEl.innerText = totalItems;
}

// Format tiền
function formatPrice(price) {
    return price.toLocaleString('vi-VN');
}

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
    // Cart Overlay Management
    const cartOverlay = document.getElementById('cart-overlay');
    const cartBtn = document.getElementById('cart-btn');
    const closeCartBtn = document.getElementById('close-cart');
    const closeCartBtn2 = document.querySelector('.close-cart-btn');
    
    if (cartBtn) {
        cartBtn.addEventListener('click', () => {
            if (cartOverlay) {
                cartOverlay.style.display = 'flex';
                updateCartUI();
            }
        });
    }
    
    if (closeCartBtn) {
        closeCartBtn.addEventListener('click', () => {
            if (cartOverlay) {
                cartOverlay.style.display = 'none';
            }
        });
    }
    
    if (closeCartBtn2) {
        closeCartBtn2.addEventListener('click', () => {
            if (cartOverlay) {
                cartOverlay.style.display = 'none';
            }
        });
    }
    
    // Close cart when clicking outside the panel
    if (cartOverlay) {
        cartOverlay.addEventListener('click', (e) => {
            if (e.target === cartOverlay) {
                cartOverlay.style.display = 'none';
            }
        });
    }
    
    // Initial load
    updateCartUI();
    updateCartCount();
});
