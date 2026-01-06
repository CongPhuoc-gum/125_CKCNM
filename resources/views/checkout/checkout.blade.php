<!doctype html>
<html lang="vi">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Thanh toán | SnackFood</title>

  <!-- CSS dùng chung với HOME -->
  <link rel="stylesheet" href="{{ asset('css/home.css') }}">
  <!-- CSS riêng cho checkout -->
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

      <label class="pay-option">
        <input type="radio" name="pay" value="cod" checked>
        💵 Thanh toán khi nhận hàng (COD)
      </label>

      <label class="pay-option">
        <input type="radio" name="pay" value="bank">
        💳 Chuyển khoản ngân hàng
      </label>

      <label class="pay-option">
        <input type="radio" name="pay" value="ewallet">
        📱 Ví điện tử (Momo / ZaloPay)
      </label>
    </section>

    <!-- TÓM TẮT ĐƠN HÀNG -->
    <section class="checkout-box summary">
      <h3>Đơn hàng</h3>

      <!-- Hiển thị danh sách sản phẩm trong giỏ -->
      <div id="order-items" style="margin-bottom: 15px; max-height: 300px; overflow-y: auto;">
        <!-- JavaScript sẽ render sản phẩm vào đây -->
      </div>

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

      <button class="confirm-btn" onclick="confirmOrder()">Xác nhận đặt hàng</button>
      <button class="back-btn" onclick="goBackToHome()">
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

    <div class="cart-items">
      <!-- updateCartUI() sẽ render dữ liệu giỏ hàng vào đây -->
    </div>

    <div class="cart-footer">
      <div class="cart-total">
        Tổng cộng: <strong>0₫</strong>
      </div>
      <a href="{{ route('checkout') }}" class="checkout-btn" style="text-decoration: none; display: block; text-align: center;">
        Thanh toán
      </a>
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
    var uname = localStorage.getItem('snack_username');

    if(!uname){
      // Chưa đăng nhập - chuyển về trang login
      alert('Vui lòng đăng nhập để thanh toán!');
      window.location.href = '{{ route("login") }}';
      return;
    }

    // Đã đăng nhập - hiển thị tên và nút đăng xuất
    userArea.innerHTML =
      '<span style="color:#2b2b2b;font-weight:700">Xin chào, ' + encodeHTML(uname) + '</span>' +
      '<button id="logoutBtn" style="margin-left:10px;background:linear-gradient(90deg,#ff4b2b,#e63e20);color:#fff;border:none;padding:8px 12px;border-radius:8px;cursor:pointer;font-weight:700">Đăng xuất</button>';

    document.getElementById('logoutBtn').onclick = function(){
      localStorage.removeItem("snack_username");
      window.location.href = "{{ route('login') }}";
    };

    function encodeHTML(s){
      return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\"/g,"&quot;");
    }
  })();
</script>

<script>
  // Hiển thị giỏ hàng trong checkout
  function displayCheckoutCart() {
    const cart = JSON.parse(localStorage.getItem('snack_cart') || '[]');
    const orderItemsDiv = document.getElementById('order-items');
    const subtotalEl = document.getElementById('subtotal');
    const shippingEl = document.getElementById('shipping');
    const totalEl = document.getElementById('total');

    if (cart.length === 0) {
      orderItemsDiv.innerHTML = '<p style="text-align:center;color:#999;padding:20px">Giỏ hàng trống</p>';
      subtotalEl.textContent = '0₫';
      totalEl.textContent = '30.000₫';
      return;
    }

    let html = '<div style="border-bottom:1px solid #eee;padding-bottom:10px;margin-bottom:10px">';
    let subtotal = 0;

    cart.forEach(item => {
      const itemTotal = item.price * item.quantity;
      subtotal += itemTotal;
      
      html += `
        <div style="display:flex;gap:10px;margin-bottom:10px;align-items:center">
          <img src="${item.imageUrl}" alt="${item.name}" 
               style="width:50px;height:50px;object-fit:cover;border-radius:4px"
               onerror="this.src='{{ asset('images/no-image.png') }}'">
          <div style="flex:1">
            <div style="font-weight:600;font-size:14px">${item.name}</div>
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

  function confirmOrder() {
    const fullname = document.getElementById('fullname').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const address = document.getElementById('address').value.trim();
    const note = document.getElementById('note').value.trim();
    const paymentMethod = document.querySelector('input[name="pay"]:checked').value;

    if (!fullname || !phone || !address) {
      alert('Vui lòng điền đầy đủ thông tin giao hàng!');
      return;
    }

    const cart = JSON.parse(localStorage.getItem('snack_cart') || '[]');
    if (cart.length === 0) {
      alert('Giỏ hàng trống!');
      return;
    }

    // Tạo đơn hàng
    const order = {
      customer: { fullname, phone, address, note },
      items: cart,
      paymentMethod: paymentMethod,
      subtotal: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      shipping: 30000,
      total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0) + 30000,
      createdAt: new Date().toISOString()
    };

    console.log('Order:', order);

    // TODO: Gửi order lên server
    // Sau khi thành công, xóa giỏ hàng
    localStorage.removeItem('snack_cart');
    
    alert('Đặt hàng thành công! Cảm ơn bạn đã mua hàng.');
    window.location.href = '{{ route("home") }}';
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

</body>
</html>