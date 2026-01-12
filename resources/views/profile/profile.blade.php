<!doctype html>
<html lang="vi">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Thông tin tài khoản | SnackFood</title>
  <link rel="stylesheet" href="{{ asset('css/home.css') }}">
  <link rel="stylesheet" href="{{ asset('css/profile.css') }}">
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
<main class="profile-page">

  <h2 class="profile-title">👤 Thông tin tài khoản</h2>

  <div class="profile-container">

    <!-- SIDEBAR -->
    <aside class="profile-sidebar">
      <div class="profile-avatar-section">
        <div class="avatar-wrapper" id="avatarWrapper">
          <div class="avatar-placeholder" id="avatarPlaceholder">U</div>
          <img id="avatarImage" style="display: none;">
        </div>
        <h3 id="sidebarName">Đang tải...</h3>
        <p id="sidebarEmail">email@example.com</p>
      </div>

      <nav class="profile-nav">
        <a href="#" class="nav-item active" data-tab="info">
          <span class="nav-icon">👤</span>
          <span>Thông tin cá nhân</span>
        </a>
        <a href="#" class="nav-item" data-tab="password">
          <span class="nav-icon">🔒</span>
          <span>Đổi mật khẩu</span>
        </a>
        <a href="{{ route('orders') }}" class="nav-item">
          <span class="nav-icon">📦</span>
          <span>Đơn hàng của tôi</span>
        </a>
      </nav>
    </aside>

    <!-- MAIN CONTENT -->
    <section class="profile-main">

      <!-- TAB: THÔNG TIN CÁ NHÂN -->
      <div id="tab-info" class="tab-content active">
        <div class="section-header">
          <h3>📝 Thông tin cá nhân</h3>
          <p>Cập nhật thông tin của bạn</p>
        </div>

        <form id="profileForm" class="profile-form">
          <div class="form-row">
            <div class="form-group">
              <label>👤 Họ và tên</label>
              <input type="text" id="fullName" placeholder="Nhập họ và tên" required>
            </div>

            <div class="form-group">
              <label>🏷️ Tên người dùng</label>
              <input type="text" id="username" placeholder="Nhập username">
            </div>
          </div>

          <div class="form-group">
            <label>📧 Email</label>
            <input type="email" id="email" placeholder="Nhập email" readonly>
            <small class="form-hint">Email không thể thay đổi</small>
          </div>

          <div class="form-group">
            <label>📞 Số điện thoại</label>
            <input type="tel" id="phone" placeholder="Nhập số điện thoại">
          </div>

          <div class="form-actions">
            <button type="button" class="btn-cancel" id="cancelBtn">Hủy</button>
            <button type="submit" class="btn-save">💾 Lưu thay đổi</button>
          </div>
        </form>
      </div>

      <!-- TAB: ĐỔI MẬT KHẨU -->
      <div id="tab-password" class="tab-content">
        <div class="section-header">
          <h3>🔒 Đổi mật khẩu</h3>
          <p>Cập nhật mật khẩu của bạn</p>
        </div>

        <form id="passwordForm" class="profile-form">
          <div class="form-group">
            <label>🔑 Mật khẩu hiện tại</label>
            <input type="password" id="currentPassword" placeholder="Nhập mật khẩu hiện tại" required>
          </div>

          <div class="form-group">
            <label>🆕 Mật khẩu mới</label>
            <input type="password" id="newPassword" placeholder="Nhập mật khẩu mới" required>
            <small class="form-hint">Tối thiểu 6 ký tự</small>
          </div>

          <div class="form-group">
            <label>✅ Xác nhận mật khẩu mới</label>
            <input type="password" id="confirmPassword" placeholder="Nhập lại mật khẩu mới" required>
          </div>

          <div class="form-actions">
            <button type="button" class="btn-cancel" id="cancelPasswordBtn">Hủy</button>
            <button type="submit" class="btn-save">🔒 Đổi mật khẩu</button>
          </div>
        </form>
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
<script src="{{ asset('js/categories.js') }}"></script>
<script src="{{ asset('js/profile.js') }}"></script>

</body>
</html>