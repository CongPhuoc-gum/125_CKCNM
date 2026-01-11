<!doctype html>
<html lang="vi">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Thanh toán | SnackFood</title>
  <link rel="stylesheet" href="{{ asset('css/home.css') }}">
  <link rel="stylesheet" href="{{ asset('css/checkout.css') }}">
</head>
<body>

<div class="site">

<!-- ===== HEADER ===== -->
<header>
  <a class="brand" href="{{ route('home') }}">
    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRoV0_K78ROk_yDSrCyKON-JkXA5uWF9gxe4A&s" alt="SnackFood">
    <div>
      <h1>SnackFood</h1>
      <div>Shop chuyên bán đồ khô</div>
    </div>
  </a>

  <div class="menu-wrapper">
    <button id="menu-toggle">
      Danh Mục <span class="arrow">▼</span>
    </button>
    <div id="dropdown-menu" class="dropdown-menu">
      <a href="{{ route('home') }}#products" class="menu-item">🔥 Bán Chạy</a>
      <a href="{{ route('home') }}#best" class="menu-item">📦 Tất Cả Sản Phẩm</a>
      <a href="#" class="menu-item">🦑 Mực Khô</a>
      <a href="#" class="menu-item">🐟 Cá Khô</a>
      <a href="#" class="menu-item">🥜 Hạt & Snack</a>
      <a href="#" class="menu-item">🍊 Trái Cây Sấy</a>
      <a href="{{ route('home') }}#contact" class="menu-item">📞 Liên Hệ</a>
    </div>
  </div>

  <div class="search" role="search">
    <input type="search" placeholder="Tìm kiếm sản phẩm...">
    <button>🔎</button>
  </div>

  <button id="cart-btn">
    🛒 <span id="cart-count">0</span>
  </button>

  <div id="user-area"
       data-login-url="{{ route('login') }}"
       data-register-url="{{ route('register') }}">
  </div>
</header>

<div id="dropdown-overlay"></div>

<!-- ===== CHECKOUT CONTENT ===== -->
<main class="checkout-page">

  <h2 class="checkout-title">🧾 Thanh toán</h2>

  <div class="checkout-container">

    <!-- THÔNG TIN GIAO HÀNG -->
    <section class="checkout-box">
      <h3>Thông tin giao hàng</h3>
      <input type="text" id="fullname" placeholder="Họ và tên" required>
      <input type="tel" id="phone" placeholder="Số điện thoại" required>
      <input type="text" id="address" placeholder="Địa chỉ giao hàng" required>
      <textarea id="note" placeholder="Ghi chú cho người bán (nếu có)"></textarea>
    </section>

    <!-- PHƯƠNG THỨC THANH TOÁN -->
    <section class="checkout-box">
      <h3>Phương thức thanh toán</h3>

      <div class="payment-grid">
        <!-- COD -->
        <label class="payment-card">
          <input type="radio" name="pay" value="cod" checked>
          <div class="card-content">
            <div class="icon-box cod-icon">💵</div>
            <span>Thanh toán khi nhận hàng (COD)</span>
          </div>
        </label>

        <!-- VNPAY -->
        <label class="payment-card">
          <input type="radio" name="pay" value="vnpay">
          <div class="card-content">
            <img src="https://vinadesign.vn/uploads/images/2023/05/vnpay-logo-vinadesign-25-12-57-55.jpg" alt="VNPay" class="payment-logo">
            <span>Ví VNPAY</span>
          </div>
        </label>

        <!-- STRIPE -->
        <label class="payment-card">
          <input type="radio" name="pay" value="stripe">
          <div class="card-content">
            <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" alt="Stripe" class="payment-logo">
            <span>Thẻ quốc tế (Stripe)</span>
          </div>
        </label>
      </div>
    </section>
    <div class="left-column">
      <!-- THÔNG TIN GIAO HÀNG -->
      <section class="checkout-box">
        <h3>📦 Thông tin giao hàng</h3>
        <input type="text" id="fullname" placeholder="Họ và tên *" required>
        <input type="tel" id="phone" placeholder="Số điện thoại *" required>
        <input type="text" id="address" placeholder="Địa chỉ giao hàng *" required>
        <textarea id="note" placeholder="Ghi chú cho người bán (nếu có)"></textarea>
      </section>

      <!-- PHƯƠNG THỨC THANH TOÁN -->
      <section class="checkout-box">
        <h3>💳 Phương thức thanh toán</h3>

        <label class="pay-option">
          <input type="radio" name="pay" value="cod" checked>
          <span class="pay-content">
            <span class="pay-icon">💵</span>
            <span class="pay-text">
              <strong>Thanh toán khi nhận hàng (COD)</strong>
              <small>Thanh toán bằng tiền mặt khi nhận hàng</small>
            </span>
          </span>
        </label>

        <label class="pay-option">
          <input type="radio" name="pay" value="bank">
          <span class="pay-content">
            <span class="pay-icon">🏦</span>
            <span class="pay-text">
              <strong>Chuyển khoản ngân hàng</strong>
              <small>Chuyển khoản trước, giao hàng sau</small>
            </span>
          </span>
        </label>

        <label class="pay-option">
          <input type="radio" name="pay" value="ewallet">
          <span class="pay-content">
            <span class="pay-icon">📱</span>
            <span class="pay-text">
              <strong>Ví điện tử</strong>
              <small>Momo, ZaloPay, VNPay</small>
            </span>
          </span>
        </label>
      </section>
    </div>

    <!-- TÓM TẮT ĐƠN HÀNG -->
    <section class="checkout-box summary">
      <h3>🛒 Đơn hàng của bạn</h3>

      <!-- Hiển thị danh sách sản phẩm trong giỏ -->
      <div id="order-items">
        <p style="text-align:center;color:#999;padding:30px">Đang tải giỏ hàng...</p>
      </div>

      <div class="summary-divider"></div>

      <div class="summary-row">
        <span>Tạm tính</span>
        <strong id="subtotal">0₫</strong>
      </div>

      <div class="summary-row">
        <span>Phí vận chuyển</span>
        <strong id="shipping">30.000₫</strong>
      </div>

      <div class="summary-row total">
        <span>Tổng cộng</span>
        <strong id="total">0₫</strong>
      </div>

      <button class="confirm-btn">
        <span>✅ Xác nhận đặt hàng</span>
      </button>
      <button class="back-btn" onclick="window.location.href='{{ route('home') }}'">
        ← Quay về trang chủ
      </button>
    </section>

  </div>
</main>

<footer id="contact">
  © <strong>SnackFood</strong> — Chuyên đồ khô chất lượng. Liên hệ: 0900 123 456 · email: info@snackfood.vn
</footer>

</div>

<!-- ===== CART OVERLAY ===== -->
<div id="cart-overlay">
  <div class="cart-panel">
    <div class="cart-header">
      <h3>🛒 Giỏ hàng</h3>
      <button id="close-cart">✕</button>
    </div>

    <div class="cart-items"></div>

    <div class="cart-footer">
      <div class="cart-total">
        Tổng cộng: <strong>0₫</strong>
      </div>
      <a href="{{ route('checkout') }}" class="checkout-btn">Thanh toán</a>
      <button class="close-cart-btn">Đóng giỏ hàng</button>
    </div>
  </div>
</div>

<!-- ===== SCRIPTS ===== -->
<script>
  // Menu toggle
  const toggleBtn = document.getElementById('menu-toggle');
  const dropdown = document.getElementById('dropdown-menu');
  const overlay = document.getElementById('dropdown-overlay');

  toggleBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    dropdown.classList.toggle('show');
    overlay.classList.toggle('show');
    toggleBtn.classList.toggle('active');
  });

  overlay.addEventListener('click', closeMenu);
  document.addEventListener('click', closeMenu);

  function closeMenu(){
    dropdown.classList.remove('show');
    overlay.classList.remove('show');
    toggleBtn.classList.remove('active');
  }
</script>

<script>
// Kiểm tra đăng nhập và hiển thị user area
  (function(){
    var userArea = document.getElementById('user-area');
    var token = localStorage.getItem('token');
    var userStr = localStorage.getItem('user');

    if(!token || !userStr){
      // Chưa đăng nhập - chuyển về trang login
      alert('Vui lòng đăng nhập để thanh toán!');
      window.location.href = '{{ route("login") }}';
      return;
    }

    var user = JSON.parse(userStr);
    var uname = user.fullName || user.email || 'Khách hàng';

    // Đã đăng nhập - hiển thị tên và nút đăng xuất
    userArea.innerHTML =
      '<span style="color:#2b2b2b;font-weight:700">Xin chào, ' + encodeHTML(uname) + '</span>' +
      '<button id="logoutBtn" style="margin-left:10px;background:linear-gradient(90deg,#ff4b2b,#e63e20);color:#fff;border:none;padding:8px 12px;border-radius:8px;cursor:pointer;font-weight:700">Đăng xuất</button>';

    document.getElementById('logoutBtn').onclick = function(){
      if(window.handleLogout) {
          window.handleLogout();
      } else {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          window.location.href = "{{ route('login') }}";
      }
    };

    // Điền tự động thông tin
    if (user.phone) document.getElementById('phone').value = user.phone;
    if (user.email) document.getElementById('address').dataset.email = user.email; // Lưu tạm email
    if (user.fullName) document.getElementById('fullname').value = user.fullName;


    function encodeHTML(s){
      return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\"/g,"&quot;");
    }
  })();
</script>

<script>
  // Hiển thị giỏ hàng từ API
  async function displayCheckoutCart() {
    const orderItemsDiv = document.getElementById('order-items');
    const subtotalEl = document.getElementById('subtotal');
    const shippingEl = document.getElementById('shipping');
    const totalEl = document.getElementById('total');

    // Dùng getCart() từ cart.js
    if (typeof getCart !== 'function') {
        console.error('getCart function not found!');
        return;
    }

    const cartData = await getCart();

    if (!cartData || !cartData.cartitems || cartData.cartitems.length === 0) {
      orderItemsDiv.innerHTML = '<p style="text-align:center;color:#999;padding:20px">Giỏ hàng trống</p>';
      subtotalEl.textContent = '0₫';
      totalEl.textContent = '30.000₫';
      return;
    }

    let html = '<div style="border-bottom:1px solid #eee;padding-bottom:10px;margin-bottom:10px">';
    let subtotal = 0;

    cartData.cartitems.forEach(item => {
      const itemTotal = item.price * item.quantity;
      subtotal += itemTotal;
      
      const imgUrl = item.product?.imageUrl ? '/storage/' + item.product.imageUrl : '{{ asset('images/no-image.png') }}';

      html += `
        <div style="display:flex;gap:10px;margin-bottom:10px;align-items:center">
          <img src="${imgUrl}" alt="${item.product?.name}" 
               style="width:50px;height:50px;object-fit:cover;border-radius:4px"
               onerror="this.src='{{ asset('images/no-image.png') }}'">
          <div style="flex:1">
            <div style="font-weight:600;font-size:14px">${item.product?.name}</div>
            <div style="color:#666;font-size:13px">${formatPrice(item.price)} × ${item.quantity}</div>
          </div>
          <div style="font-weight:700;color:#e63e20">${formatPrice(itemTotal)}</div>
        </div>
      `;
    });

    html += '</div>';
    orderItemsDiv.innerHTML = html;

    const shipping = 30000;
    const total = subtotal + shipping;

    subtotalEl.textContent = formatPrice(subtotal);
    shippingEl.textContent = formatPrice(shipping);
    totalEl.textContent = formatPrice(total);
  }

  function formatPrice(price) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  }

  async function confirmOrder() {
    const fullname = document.getElementById('fullname').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const address = document.getElementById('address').value.trim();
    const note = document.getElementById('note').value.trim();
    const paymentMethod = document.querySelector('input[name="pay"]:checked').value;

    if (!fullname || !phone || !address) {
      alert('Vui lòng điền đầy đủ thông tin giao hàng!');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
        alert('Vui lòng đăng nhập!');
        window.location.href = '{{ route("login") }}';
        return;
    }

    // Parse user data from localStorage
    const userStr = localStorage.getItem('user');
    if (!userStr) {
        alert('Không tìm thấy thông tin người dùng!');
        window.location.href = '{{ route("login") }}';
        return;
    }
    const user = JSON.parse(userStr);


    // Lấy lại giỏ hàng mới nhất để đảm bảo dữ liệu đúng
    const cartData = await getCart();
    if (!cartData || !cartData.cartitems || cartData.cartitems.length === 0) {
        alert('Giỏ hàng trống!');
        return;
    }

    const cartItems = cartData.cartitems.map(item => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price
    }));

    const subtotal = cartData.cartitems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalAmount = subtotal + 30000; // + Shipping

    try {
        const API_URL = window.location.origin + '/api'; // Build URL dynamically
        const response = await fetch(`${API_URL}/checkout`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                customerName: fullname, // Backend expects customerName
                phone,
                shippingAddress: address, // Backend expects shippingAddress
                note,
                paymentMethod: paymentMethod, // Backend expects camelCase
                cartItems: cartItems,
                totalAmount: totalAmount,
                userId: user.userId
            })
        });

        const data = await response.json();
        console.log('Checkout response:', data); // Debug log

        if (response.ok && data.success) {
            // Check if this is a payment redirect (VNPay/Stripe)
            if (data.redirectUrl) {
                console.log('Redirecting to payment gateway:', data.redirectUrl); // Debug log
                // Redirect to payment gateway
                window.location.href = data.redirectUrl;
            } else {
                // COD - show success message and redirect to home
                alert('✅ Đặt hàng thành công! Cám ơn bạn đã ủng hộ.');
                // Cập nhật lại UI giỏ hàng (về 0)
                if(window.updateCartCount) window.updateCartCount();
                window.location.href = '{{ route("home") }}';
            }
        } else {
            console.error('Checkout failed:', data); // Debug log
            alert('❌ ' + (data.message || 'Đặt hàng thất bại'));
        }
    } catch (error) {
        console.error('Order error:', error);
        alert('❌ Có lỗi xảy ra khi đặt hàng');
    }
  }

  function goBackToHome() {
    window.location.href = '{{ route("home") }}';
  }

  // Load cart khi trang load
  window.addEventListener('DOMContentLoaded', function() {
    displayCheckoutCart();
  });
</script>

<script defer src="{{ asset('js/auth.js') }}"></script>
<script defer src="{{ asset('js/header.js') }}"></script>
<script defer src="{{ asset('js/cart.js') }}"></script>
<script defer src="{{ asset('js/checkout.js') }}"></script>

</body>
</html>