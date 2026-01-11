<!doctype html>
<html lang="vi">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Liên hệ | SnackFood</title>
  <link rel="stylesheet" href="{{ asset('css/home.css') }}">
  <link rel="stylesheet" href="{{ asset('css/contact.css') }}">
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
      <a href="{{ route('home') }}#products" class="menu-item">🔥 Bán Chạy</a>
      <a href="{{ route('home') }}#best" class="menu-item">📦 Tất Cả Sản Phẩm</a>
      <a href="#" class="menu-item">🦑 Mực Khô</a>
      <a href="#" class="menu-item">🐟 Cá Khô</a>
      <a href="#" class="menu-item">🥜 Hạt & Snack</a>
      <a href="#" class="menu-item">🍊 Trái Cây Sấy</a>
      <a href="#contact" class="menu-item">📞 Liên Hệ</a>
    </div>
  </div>

  <div class="search" role="search">
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

<!-- ===== CONTENT ===== -->
<main class="contact-page">

  <h2 class="contact-title">📞 Liên hệ với chúng tôi</h2>

  <div class="contact-container">

    <!-- FORM LIÊN HỆ -->
    <section class="contact-box">
      <h3>💬 Gửi tin nhắn</h3>
      <form id="contactForm">
        <div class="form-group">
          <label>👤 Họ và tên</label>
          <input type="text" id="fullName" placeholder="Nhập họ và tên" required>
        </div>

        <div class="form-group">
          <label>📧 Email</label>
          <input type="email" id="email" placeholder="Nhập email của bạn" required>
        </div>

        <div class="form-group">
          <label>📞 Số điện thoại</label>
          <input type="tel" id="phone" placeholder="Nhập số điện thoại">
        </div>

        <div class="form-group">
          <label>✍️ Nội dung</label>
          <textarea id="message" placeholder="Nhập nội dung liên hệ..." rows="5" required></textarea>
        </div>

        <button type="submit" class="btn-submit">📨 Gửi liên hệ</button>
      </form>
    </section>

    <!-- THÔNG TIN SHOP -->
    <section class="contact-info">
      <h3>🏪 Thông tin cửa hàng</h3>
      
      <div class="info-item">
        <div class="info-icon">🏢</div>
        <div class="info-content">
          <strong>SnackFood - Đồ Khô Chất Lượng</strong>
          <p>Chuyên cung cấp các sản phẩm đồ khô cao cấp</p>
        </div>
      </div>

      <div class="info-item">
        <div class="info-icon">📍</div>
        <div class="info-content">
          <strong>Địa chỉ</strong>
          <p>48 Cao Thắng, Hải Châu, Đà Nẵng</p>
        </div>
      </div>

      <div class="info-item">
        <div class="info-icon">📞</div>
        <div class="info-content">
          <strong>Hotline</strong>
          <p><a href="tel:0911469675">0911 469 675</a></p>
        </div>
      </div>

      <div class="info-item">
        <div class="info-icon">✉️</div>
        <div class="info-content">
          <strong>Email</strong>
          <p><a href="mailto:info@snackfood.vn">info@snackfood.vn</a></p>
        </div>
      </div>

      <div class="info-item">
        <div class="info-icon">🕐</div>
        <div class="info-content">
          <strong>Giờ làm việc</strong>
          <p>Thứ 2 - Chủ nhật: 8:00 - 22:00</p>
        </div>
      </div>

      <!-- BẢN ĐỒ -->
      <div class="map-wrapper">
        <h4>🗺️ Vị trí trên bản đồ</h4>
        <div class="map">
          <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3833.9896688056947!2d108.21115631533448!3d16.06527418889158!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x314219c5f8f8c3e9%3A0x5b0e8d2e9e6d5e3a!2zNDggQ2FvIFRo4bqvbmcsIEjhuqNpIENow6J1LCBEXG4gTuG6tW5n!5e0!3m2!1svi!2s!4v1234567890123!5m2!1svi!2s"
              allowfullscreen=""
              loading="lazy"
              referrerpolicy="no-referrer-when-downgrade">
          </iframe>
        </div>
      </div>
    </section>

  </div>
</main>

<footer id="contact">
  © <strong>SnackFood</strong> — Chuyên đồ khô chất lượng. Liên hệ: 0911 469 675 · email: info@snackfood.vn
</footer>

</div>

<!-- ===== CART OVERLAY ===== -->
<div id="cart-overlay">
  <div class="cart-panel">
    <div class="cart-header">
      <h3>🛒 Giỏ hàng</h3>
      <button id="close-cart" type="button">✕</button>
    </div>
    <div class="cart-items">
      <!-- Cart items sẽ được load bởi cart.js -->
    </div>
    <div class="cart-footer">
      <div class="cart-total">Tổng cộng: <strong>0₫</strong></div>
      <a href="{{ route('checkout') }}" class="checkout-btn">Thanh toán</a>
      <button class="close-cart-btn" type="button">Đóng giỏ hàng</button>
    </div>
  </div>
</div>

<!-- ===== SCRIPTS - Thứ tự quan trọng ===== -->
<script src="{{ asset('js/auth.js') }}"></script>
<script src="{{ asset('js/cart.js') }}"></script>
<script src="{{ asset('js/header.js') }}"></script>
<script src="{{ asset('js/contact.js') }}"></script>

</body>
</html>