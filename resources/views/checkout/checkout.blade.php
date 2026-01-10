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
<script defer src="{{ asset('js/auth.js') }}"></script>
<script defer src="{{ asset('js/header.js') }}"></script>
<script defer src="{{ asset('js/cart.js') }}"></script>
<script defer src="{{ asset('js/checkout.js') }}"></script>

</body>
</html>