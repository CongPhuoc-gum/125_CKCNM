// ===== PRODUCT DETAIL PAGE - QUẢN LÝ TRANG CHI TIẾT SẢN PHẨM =====
// Dữ liệu được truyền từ Laravel blade template vào window.productData

document.addEventListener('DOMContentLoaded', () => {
    const product = window.productData;

    if (!product || !product.id) {
        console.error('❌ Product data not found');
        return;
    }

    console.log('✅ Product Detail JS loaded');

    // Render product info
    document.getElementById('name').innerText = product.name;
    document.getElementById('price').innerText = formatPrice(product.price) + '₫';
    document.getElementById('desc').innerText = product.description;
    document.getElementById('mainImg').src = product.imageUrl;

    // Set quantity input
    const qtyInput = document.getElementById('qty');
    if (qtyInput) {
        qtyInput.value = 1;
        qtyInput.max = product.quantity;
    }
});

// ===== QUANTITY CONTROL =====
function changeQty(delta) {
    const qtyInput = document.getElementById('qty');
    const product = window.productData;

    if (!qtyInput || !product) return;

    const currentQty = parseInt(qtyInput.value) || 1;
    const newQty = currentQty + delta;

    // Giới hạn từ 1 đến số lượng tồn kho
    if (newQty >= 1 && newQty <= product.quantity) {
        qtyInput.value = newQty;
    } else if (newQty < 1) {
        qtyInput.value = 1;
    } else {
        qtyInput.value = product.quantity;
        alert(`⚠️ Chỉ còn ${product.quantity} sản phẩm trong kho!`);
    }
}

// ===== FORMAT PRICE =====
function formatPrice(price) {
    return parseFloat(price).toLocaleString('vi-VN');
}

// ===== ADD TO CART - DÙNG TOKEN NHƯ TRANG HOME =====
function handleAddToCart() {
    const token = localStorage.getItem('token');

    if (!token) {
        alert('⚠️ Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!');
        window.location.href = '/login';
        return;
    }

    const product = window.productData;
    const qtyInput = document.getElementById('qty');
    const quantity = parseInt(qtyInput.value) || 0;

    // Validate quantity
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

    // Gọi hàm từ cart.js nếu có, nếu không thì gọi API trực tiếp
    if (typeof addToCart === 'function') {
        addToCart(product.id, quantity);
    } else {
        addToCartAPI(product.id, quantity);
    }
}

// ===== BUY NOW - DÙNG TOKEN NHƯ TRANG HOME =====
function handleBuyNow() {
    const token = localStorage.getItem('token');

    if (!token) {
        alert('⚠️ Vui lòng đăng nhập để mua hàng!');
        window.location.href = '/login';
        return;
    }

    const product = window.productData;
    const qtyInput = document.getElementById('qty');
    const quantity = parseInt(qtyInput.value) || 0;

    // Validate quantity
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
    if (typeof addToCart === 'function') {
        addToCart(product.id, quantity);
        setTimeout(() => {
            window.location.href = '/checkout';
        }, 800);
    } else {
        addToCartAPI(product.id, quantity)
            .then(() => {
                setTimeout(() => {
                    window.location.href = '/checkout';
                }, 800);
            });
    }
}

// ===== API: ADD TO CART =====
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

            // Update cart count if function exists
            if (typeof updateCartCount === 'function') {
                updateCartCount();
            }

            return true;
        } else {
            alert('❌ ' + (result.message || 'Lỗi thêm vào giỏ hàng'));
            return false;
        }
    } catch (error) {
        console.error('Add to cart error:', error);
        alert('❌ Có lỗi xảy ra! Vui lòng thử lại.');
        return false;
    }
}

