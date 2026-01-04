// Product Detail Page - Quản lý trang chi tiết sản phẩm
// Dữ liệu được truyền từ Laravel blade template vào window.productData

document.addEventListener('DOMContentLoaded', () => {
    const product = window.productData;
    
    if (!product || !product.id) {
        console.error('Product data not found');
        return;
    }

    // Render product info
    document.getElementById('name').innerText = product.name;
    document.getElementById('price').innerText = formatPrice(product.price) + '₫';
    document.getElementById('desc').innerText = product.description;
    document.getElementById('mainImg').src = product.imageUrl;

    // Set quantity input
    const qtyInput = document.getElementById('qty');
    if (qtyInput) {
        qtyInput.value = 1;
    }
});

// Thay đổi số lượng
function changeQty(n) {
    const qtyInput = document.getElementById('qty');
    const currentQty = parseInt(qtyInput.value) || 1;
    const newQty = Math.max(1, currentQty + n);
    qtyInput.value = newQty;
}

// Format giá tiền
function formatPrice(price) {
    return parseFloat(price).toLocaleString('vi-VN');
}

// Thêm vào giỏ hàng
function handleAddToCart() {
    const token = localStorage.getItem('token');
    
    if (!token) {
        alert('⚠️ Vui lòng đăng nhập trước!');
        window.location.href = '/login';
        return;
    }

    const product = window.productData;
    const qtyInput = document.getElementById('qty');
    const quantity = parseInt(qtyInput.value) || 0;

    // Kiểm tra số lượng
    if (quantity <= 0) {
        alert('⚠️ Số lượng phải lớn hơn 0');
        qtyInput.focus();
        return;
    }

    if (quantity > product.quantity) {
        alert(`⚠️ Không đủ hàng! Tồn kho: ${product.quantity}`);
        qtyInput.value = product.quantity;
        return;
    }

    // Gọi hàm từ cart.js (nếu có) hoặc gọi API trực tiếp
    if (typeof addToCart === 'function') {
        addToCart(product.id, quantity);
    } else {
        addToCartAPI(product.id, quantity);
    }
}

// API: Thêm vào giỏ hàng
async function addToCartAPI(productId, quantity) {
    const token = localStorage.getItem('token');
    
    try {
        const response = await fetch('/api/cart/add', {
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
            // Update cart count nếu hàm có sẵn
            if (typeof updateCartCount === 'function') {
                updateCartCount();
            }
        } else {
            alert('❌ ' + (result.message || 'Lỗi'));
        }
    } catch (error) {
        console.error('Error:', error);
        alert('❌ Có lỗi xảy ra!');
    }
}

// Mua ngay (Buy now - redirect to checkout)
function handleBuyNow() {
    const token = localStorage.getItem('token');
    
    if (!token) {
        alert('⚠️ Vui lòng đăng nhập trước!');
        window.location.href = '/login';
        return;
    }

    const product = window.productData;
    const qtyInput = document.getElementById('qty');
    const quantity = parseInt(qtyInput.value) || 0;

    // Kiểm tra số lượng
    if (quantity <= 0) {
        alert('⚠️ Số lượng phải lớn hơn 0');
        qtyInput.focus();
        return;
    }

    if (quantity > product.quantity) {
        alert(`⚠️ Không đủ hàng! Tồn kho: ${product.quantity}`);
        qtyInput.value = product.quantity;
        return;
    }

    // Add to cart then redirect to checkout
    addToCartAPI(product.id, quantity);
    
    // Sau khi thêm thành công, redirect sau 1 giây
    setTimeout(() => {
        window.location.href = '/checkout';
    }, 1000);
}

// Nếu cart.js chưa load, cần khởi tạo cart overlay handlers
document.addEventListener('DOMContentLoaded', () => {
    const cartBtn = document.getElementById('cart-btn');
    const cartOverlay = document.getElementById('cart-overlay');
    const closeCartBtn = document.getElementById('close-cart');
    const closeCartBtn2 = document.querySelector('.close-cart-btn');

    if (cartBtn && cartOverlay) {
        cartBtn.addEventListener('click', () => {
            cartOverlay.style.display = 'flex';
        });
    }

    if (closeCartBtn && cartOverlay) {
        closeCartBtn.addEventListener('click', () => {
            cartOverlay.style.display = 'none';
        });
    }

    if (closeCartBtn2 && cartOverlay) {
        closeCartBtn2.addEventListener('click', () => {
            cartOverlay.style.display = 'none';
        });
    }

    if (cartOverlay) {
        cartOverlay.addEventListener('click', (e) => {
            if (e.target === cartOverlay) {
                cartOverlay.style.display = 'none';
            }
        });
    }
});
