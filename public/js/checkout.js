if (!window.API_URL) window.API_URL = '/api';

// ===== EXPORT GLOBAL FUNCTIONS =====
window.getCart = getCart;
window.completeCheckout = completeCheckout;

// getCart is now imported from cart.js

// Hoàn thành thanh toán
async function completeCheckout(paymentMethod, cartItems, totalAmount) {
    const token = localStorage.getItem('token');
    if (!token) {
        alert('⚠️ Vui lòng đăng nhập trước!');
        return false;
    }

    try {
        const response = await fetch(`${window.API_URL}/orders/create`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                paymentMethod,
                cartItems,
                totalAmount
            })
        });

        const result = await response.json();

        if (result.success) {
            alert('Đơn hàng đã được tạo thành công!');
            return true;
        } else {
            alert('❌ ' + (result.message || 'Lỗi khi tạo đơn hàng'));
            return false;
        }
    } catch (error) {
        console.error('Error completing checkout:', error);
        alert('❌ Có lỗi xảy ra khi tạo đơn hàng!');
        return false;
    }
}

console.log('✅ Checkout.js loaded');
