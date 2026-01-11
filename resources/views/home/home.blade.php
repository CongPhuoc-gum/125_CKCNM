<!doctype html>
<html lang="vi">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>SnackFood — Đồ khô</title>
  <link rel="stylesheet" href="{{ asset('css/home.css') }}">
</head>
<body>

  @if(session('success'))
    <script>
      window.addEventListener('DOMContentLoaded', () => {
        alert('✅ {{ session('success') }}');
      });
    </script>
  @endif

  @if(session('error'))
    <script>
      window.addEventListener('DOMContentLoaded', () => {
        alert('❌ {{ session('error') }}');
      });
    </script>
  @endif

  <div class="site">
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
          <a href="#products" class="menu-item">🔥 Bán Chạy</a>
          <a href="{{ route('home') }}" class="menu-item">📦 Tất Cả Sản Phẩm</a>
          <!-- Categories will be inserted here dynamically -->
          <a href="#contact" class="menu-item">📞 Liên Hệ</a>
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

    <main id="products">
      <h2 style="margin-top:26px">Sản phẩm nổi bật</h2>

      <div class="carousel" aria-label="Sản phẩm nổi bật">
        <button class="carousel-btn prev" aria-label="Trước">‹</button>
        <div class="carousel-track">
          @forelse($products->take(7) as $product)
          <a href="{{ route('product.show', $product->productId) }}" class="card" style="text-decoration: none; color: inherit;">
            {{-- ✅ FIX: Thêm /storage/ trước imageUrl --}}
            <img src="{{ $product->imageUrl ? asset('storage/' . $product->imageUrl) : asset('images/no-image.png') }}" 
                 alt="{{ $product->name }}"
                 onerror="this.src='{{ asset('images/no-image.png') }}'">
            <h3>{{ $product->name }}</h3>
            <div style="color:#666;font-size:14px">{{ Str::limit($product->description, 40) }}</div>
            <div class="price-row">
              <div class="price">{{ number_format($product->price, 0, ',', '.') }}₫</div>
              <button class="btn-sm" onclick="event.preventDefault(); addToCart({{ $product->productId }});">Thêm vào giỏ</button>
            </div>
          </a>
          @empty
          <p style="text-align:center;color:#999">Không có sản phẩm</p>
          @endforelse
        </div>
        <button class="carousel-btn next" aria-label="Tiếp">›</button>
      </div>

      <h2 id="best" style="margin-top:28px">Tất cả sản phẩm</h2>
      <div class="grid" style="margin-bottom:18px">
        @forelse($products as $product)
        <a href="{{ route('product.show', $product->productId) }}" class="card" style="text-decoration: none; color: inherit;">
          {{-- ✅ FIX: Thêm /storage/ trước imageUrl --}}
          <img src="{{ $product->imageUrl ? asset('storage/' . $product->imageUrl) : asset('images/no-image.png') }}" 
               alt="{{ $product->name }}"
               onerror="this.src='{{ asset('images/no-image.png') }}'">
          <h3>{{ $product->name }}</h3>
          <div class="price-row">
            <div class="price">{{ number_format($product->price, 0, ',', '.') }}₫</div>
            <button class="btn-sm" onclick="event.preventDefault(); addToCart({{ $product->productId }});">Thêm vào giỏ</button>
          </div>
        </a>
        @empty
        <p style="text-align:center;color:#999">Không có sản phẩm</p>
        @endforelse
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

  <script defer src="{{ asset('js/auth.js') }}"></script>
  <script defer src="{{ asset('js/header.js') }}"></script>
  <script defer src="{{ asset('js/categories.js') }}"></script>
  <script defer src="{{ asset('js/cart.js') }}"></script>

</body>
</html>