<!doctype html>
<html lang="vi">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Đơn hàng của tôi | SnackFood</title>

  <link rel="stylesheet" href="{{ asset('css/home.css') }}">
  <link rel="stylesheet" href="{{ asset('css/orders.css') }}">
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
      <a href="{{ route('home') }}#contact" class="menu-item">📞 Liên Hệ</a>
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
<main class="orders-page">

  <h2 class="orders-title">📦 Đơn hàng của tôi</h2>

  <!-- Filter tabs -->
  <div class="order-filters">
    <button class="filter-btn active" type="button" data-status="all">Tất cả</button>
    <button class="filter-btn" type="button" data-status="processing">⏳ Đang xử lý</button>
    <button class="filter-btn" type="button" data-status="shipping">🚚 Đang giao</button>
    <button class="filter-btn" type="button" data-status="completed">✅ Hoàn thành</button>
    <button class="filter-btn" type="button" data-status="cancelled">❌ Đã hủy</button>
  </div>

  <!-- Loading -->
  <div id="orders-loading" class="orders-loading">
    <div style="text-align:center;padding:60px 20px">
      <div style="font-size:50px;margin-bottom:16px">⏳</div>
      <p style="color:#666;font-size:16px">Đang tải đơn hàng...</p>
    </div>
  </div>

  <!-- Orders list -->
  <div id="orders-list" class="orders-list" style="display:none">
    <!-- JS render -->
  </div>

  <!-- Empty -->
  <div id="empty-orders" class="empty-orders" style="display:none">
    <div class="empty-icon">📦</div>
    <h3>Bạn chưa có đơn hàng nào</h3>
    <p>Hãy khám phá các sản phẩm tuyệt vời của chúng tôi!</p>
    <a href="{{ route('home') }}" class="back-home">🛒 Mua sắm ngay</a>
  </div>

</main>

<footer id="contact">
  © <strong>SnackFood</strong> — Chuyên đồ khô chất lượng.
  Liên hệ: 0900 123 456 · email: info@snackfood.vn
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
      <button class="close-cart-btn" type="button">Đóng giỏ hàng</button>
    </div>
  </div>
</div>

<!-- ===== SCRIPTS ===== -->
<script src="{{ asset('js/auth.js') }}"></script>
<script src="{{ asset('js/cart.js') }}"></script>
<script src="{{ asset('js/header.js') }}"></script>
<script src="{{ asset('js/orders.js') }}"></script>

<!-- ===== ORDER DETAIL MODAL ===== -->
<div id="order-detail-modal" class="modal-overlay" style="display:none">
  <div class="modal-content">
    <div class="modal-header">
      <h3>📦 Chi tiết đơn hàng <span id="modal-order-id"></span></h3>
      <button class="modal-close" onclick="closeOrderModal()">✕</button>
    </div>
    <div class="modal-body" id="modal-body"></div>
  </div>
</div>

<!-- ===== REVIEW MODAL ===== -->
<div id="review-modal" class="modal-overlay" style="display:none">
  <div class="modal-content review-modal-content">
    <div class="modal-header">
      <h3>⭐ Đánh giá sản phẩm</h3>
      <button class="modal-close" onclick="closeReviewModal()">✕</button>
    </div>

    <div class="modal-body">
      <div id="review-product-info" class="review-product-info"></div>

      <div class="review-rating">
        <label>Đánh giá của bạn:</label>
        <div class="stars" id="review-stars">
          <span class="star" data-rating="1">★</span>
          <span class="star" data-rating="2">★</span>
          <span class="star" data-rating="3">★</span>
          <span class="star" data-rating="4">★</span>
          <span class="star" data-rating="5">★</span>
        </div>
        <p class="rating-text" id="rating-text">Chọn số sao</p>
      </div>

      <div class="review-comment">
        <label for="review-comment-text">Nhận xét của bạn:</label>
        <textarea id="review-comment-text" rows="4"
          placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."></textarea>
      </div>

      <button class="submit-review-btn" onclick="submitReview()">Gửi đánh giá</button>
    </div>
  </div>
</div>

</body>
</html>
