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
    <button id="menu-toggle" type="button">
      Danh Mục <span class="arrow">▼</span>
    </button>
    <div id="dropdown-menu" class="dropdown-menu">
      <a href="{{ route('home') }}" class="menu-item">📦 Tất Cả Sản Phẩm</a>
      <!-- Categories will be inserted here dynamically -->
    </div>
  </div>

  <div class="search">
    <input type="search" placeholder="Tìm kiếm sản phẩm...">
    <button type="button">🔎</button>
  </div>

  <button id="cart-btn" type="button">
    🛒 <span id="cart-count">0</span>
  </button>

  <div id="user-area"
       data-login-url="{{ route('login') }}"
       data-register-url="{{ route('register') }}">
  </div>
</header>

<div id="dropdown-overlay"></div>

<!-- ===== CHECKOUT ===== -->
<main class="checkout-page">

  <h2 class="checkout-title">🧾 Thanh toán</h2>

  <div class="checkout-container">

    <!-- LEFT -->
    <div class="left-column">

      <!-- SHIPPING INFO -->
      <section class="checkout-box">
        <h3>📦 Thông tin giao hàng</h3>
        <input type="text" id="fullname" placeholder="Họ và tên *">
        <input type="tel" id="phone" placeholder="Số điện thoại *">
        <input type="text" id="address" placeholder="Địa chỉ giao hàng *">
        <textarea id="note" rows="3" placeholder="Ghi chú (nếu có)"></textarea>
      </section>

      <!-- PAYMENT -->
      <section class="checkout-box">
        <h3>💳 Phương thức thanh toán</h3>

        <label class="pay-option">
          <input type="radio" name="pay" value="cod" checked>
          <span>💵 Thanh toán khi nhận hàng (COD)</span>
        </label>

        <label class="pay-option">
          <input type="radio" name="pay" value="vnpay">
          <span>📱 Thanh toán qua VNPay</span>
        </label>

        <label class="pay-option">
          <input type="radio" name="pay" value="stripe">
          <span>💳 Thanh toán qua Stripe</span>
        </label>
      </section>
    </div>

    <!-- RIGHT -->
    <section class="checkout-box summary">
      <h3>🛒 Đơn hàng của bạn</h3>

      <div id="order-items">
        <div style="text-align:center;padding:30px">
          ⏳ Đang tải giỏ hàng...
        </div>
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
        <strong id="total">30.000₫</strong>
      </div>

      <button class="confirm-btn" type="button">
        ✅ Xác nhận đặt hàng
      </button>

      <button class="back-btn" type="button"
              onclick="window.location.href='{{ route('home') }}'">
        ← Quay về trang chủ
      </button>
    </section>

  </div>
</main>

<footer id="contact">
  © <strong>SnackFood</strong> — Chuyên đồ khô chất lượng
</footer>

</div>

<!-- ===== CART OVERLAY ===== -->
<div id="cart-overlay">
  <div class="cart-panel">
    <div class="cart-header">
      <h3>🛒 Giỏ hàng</h3>
      <button id="close-cart" type="button">✕</button>
    </div>

    <div class="cart-items"></div>

    <div class="cart-footer">
      <div class="cart-total">Tổng cộng: <strong>0₫</strong></div>
      <a href="{{ route('checkout') }}" class="checkout-btn">Thanh toán</a>
      <button class="close-cart-btn" type="button">Đóng</button>
    </div>
  </div>
</div>

<!-- ===== SCRIPTS (CHUẨN – KHÔNG INLINE) ===== -->
<script src="{{ asset('js/auth.js') }}"></script>
<script src="{{ asset('js/cart.js') }}"></script>
<script src="{{ asset('js/header.js') }}"></script>
<script src="{{ asset('js/categories.js') }}"></script>
<script src="{{ asset('js/checkout.js') }}"></script>

</body>
</html>