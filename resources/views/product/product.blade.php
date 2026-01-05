<!doctype html>
<html lang="vi">
<head>
  <meta charset="utf-8">
  <title>Chi tiết sản phẩm | SnackFood</title>
  <link rel="stylesheet" href="{{ asset('css/product.css') }}">
</head>
<body>

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
  
  <div id="user-area"></div>
</header>

<div id="dropdown-overlay"></div>

<div class="product-container">
  <div class="breadcrumb" id="breadcrumb">
    <a href="{{ route('home') }}">Trang chủ</a> > 
    <a href="{{ route('home') }}#best">Sản phẩm</a> > 
    <span>{{ $product->name }}</span>
  </div>

  <div class="product-detail">
    <!-- IMAGE -->
    <div class="product-images">
      <img id="mainImg" src="{{ asset('storage/' . $product->imageUrl) }}" alt="{{ $product->name }}">
      <div class="thumbs" id="thumbs"></div>
    </div>

    <!-- INFO -->
    <div class="product-info">
      <h1 id="name">{{ $product->name }}</h1>
      <div class="rating" id="rating">
        @if($product->reviews && count($product->reviews) > 0)
          @php
            $avgRating = $product->reviews->avg('rating');
            $reviewCount = count($product->reviews);
          @endphp
          <span>
            @for($i = 0; $i < 5; $i++)
              @if($i < floor($avgRating))★@else☆@endif
            @endfor
            ({{ number_format($avgRating, 1) }} – {{ $reviewCount }} đánh giá)
          </span>
        @else
          <span>Chưa có đánh giá</span>
        @endif
      </div>

      <div class="price-box">
        <span class="old-price" id="oldPrice"></span>
        <span class="price" id="price">{{ number_format($product->price, 2, ',', '.') }}₫</span>
        <span class="unit" id="unit"></span>
      </div>

      <p class="desc" id="desc">{{ $product->description }}</p>

      <div class="info-grid" id="info">
        <div><strong>SKU:</strong> <span>{{ $product->productId }}</span></div>
        <div><strong>Danh mục:</strong> <span id="category">{{ $product->category->name ?? 'N/A' }}</span></div>
        <div><strong>Tồn kho:</strong> <span>{{ $product->quantity }} sản phẩm</span></div>
        <div><strong>Trạng thái:</strong> <span>{{ $product->status == 1 ? '✓ Còn hàng' : '✗ Hết hàng' }}</span></div>
      </div>

      <div class="qty">
        <span>Số lượng:</span>
        <button onclick="changeQty(-1)">−</button>
        <input id="qty" value="1">
        <button onclick="changeQty(1)">+</button>
      </div>
      
      <div class="action-buttons">
        <button class="add-btn" onclick="handleAddToCart()">🛒 Thêm vào giỏ hàng</button>
        <button class="buy-btn" onclick="handleBuyNow()">🛒 Mua Ngay</button>
      </div>
    </div>
  </div>
   
  <div class="review-section">
    <h2>Đánh giá của khách hàng</h2>

    @if($product->reviews && count($product->reviews) > 0)
      @foreach($product->reviews as $review)
        <div class="review-item">
          <div class="review-header">
            <strong>{{ $review->user->name ?? 'Ẩn danh' }}</strong>
            <span class="stars">
              @for($i = 0; $i < 5; $i++)
                @if($i < $review->rating)★@else☆@endif
              @endfor
            </span>
          </div>
          <p>{{ $review->comment ?? 'Không có nhận xét' }}</p>
          <small style="color:#999">{{ $review->createdAt->format('d/m/Y H:i') ?? '' }}</small>
        </div>
      @endforeach
    @else
      <p style="text-align:center;color:#999;padding:20px">Chưa có đánh giá nào</p>
    @endif
  </div>
</div>

<footer id="contact">
  © <strong>SnackFood</strong> — Chuyên đồ khô chất lượng. Liên hệ: 0900 123 456 · email: info@snackfood.vn
</footer>

<div id="cart-overlay">
  <div class="cart-panel">
    <div class="cart-header">
      <h3>🛒 Giỏ hàng</h3>
      <button id="close-cart">✕</button>
    </div>

    <div class="cart-items">
      <div class="cart-item">
        <img src="https://langfarm-backend.s3.amazonaws.com/10.YSE_Mau%20hut%20chan%20khong%20(Thit%20kho%20an%20lien).jpg">
        <div class="cart-info">
          <div class="cart-name">Thịt kho ăn liền</div>
          <div class="cart-price">120.000₫</div>
          <div class="cart-qty">
            <button>-</button>
            <span>1</span>
            <button>+</button>
          </div>
        </div>
        <button class="remove-item">✕</button>
      </div>
    </div>

    <div class="cart-footer">
      <div class="cart-total">
        Tổng cộng: <strong>120.000₫</strong>
      </div>
      <button class="checkout-btn" onclick="goCheckout()">Thanh toán</button>
      <button class="close-cart-btn">Đóng giỏ hàng</button>
    </div>
  </div>    
</div>

<script>
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
  const cartBtn = document.getElementById('cart-btn');
  const cartOverlay = document.getElementById('cart-overlay');
  const closeCart = document.getElementById('close-cart');
  const closeCartBtn = document.querySelector('.close-cart-btn');

  cartBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    cartOverlay.classList.add('show');
  });

  closeCart.addEventListener('click', function () {
    cartOverlay.classList.remove('show');
  });

  closeCartBtn.addEventListener('click', function () {
    cartOverlay.classList.remove('show');
  });

  cartOverlay.addEventListener('click', function (e) {
    if (e.target === cartOverlay) {
      cartOverlay.classList.remove('show');
    }
  });
</script>

<script>
  // Hiển thị thông tin user hoặc nút đăng nhập
  (function(){
    var userArea = document.getElementById('user-area');
    var uname = localStorage.getItem('snack_username');
    
    if(uname){
      // Đã đăng nhập - hiển thị tên và nút đăng xuất
      userArea.innerHTML = ''
        + '<span style="color:#2b2b2b;font-weight:700">Xin chào, ' + encodeHTML(uname) + '</span>'
        + '<button id="logoutBtn" style="background:linear-gradient(90deg,#ff4b2b,#e63e20);color:#fff;border:none;padding:8px 12px;border-radius:8px;cursor:pointer;font-weight:700;margin-left:10px">Đăng xuất</button>';

      document.getElementById('logoutBtn').addEventListener('click', function(){
        localStorage.removeItem('snack_username');
        window.location.reload();
      });
    } else {
      // Chưa đăng nhập - hiển thị nút đăng nhập
      userArea.innerHTML = ''
        + '<a href="{{ route("login") }}" style="background:linear-gradient(90deg,#ff4b2b,#e63e20);color:#fff;border:none;padding:8px 16px;border-radius:8px;cursor:pointer;font-weight:700;text-decoration:none;display:inline-block">Đăng nhập</a>';
    }
    
    function encodeHTML(s){
      return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\"/g,"&quot;");
    }
  })();

  // Hàm xử lý thêm vào giỏ hàng
  function handleAddToCart() {
    var uname = localStorage.getItem('snack_username');
    if(!uname){
      alert('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng!');
      window.location.href = '{{ route("login") }}';
      return;
    }
    // Code thêm vào giỏ hàng ở đây
    alert('Đã thêm vào giỏ hàng!');
  }

  // Hàm xử lý mua ngay
  function handleBuyNow() {
    var uname = localStorage.getItem('snack_username');
    if(!uname){
      alert('Vui lòng đăng nhập để mua hàng!');
      window.location.href = '{{ route("login") }}';
      return;
    }
    // Code mua ngay ở đây
    alert('Chuyển đến trang thanh toán...');
  }
</script>

<!-- QUAN TRỌNG: Truyền product data từ Laravel sang JavaScript -->
<script>
  window.productData = {
    id: {{ $product->productId }},
    name: "{{ $product->name }}",
    price: {{ $product->price }},
    description: "{{ $product->description }}",
    imageUrl: "{{ asset('storage/' . $product->imageUrl) }}",
    quantity: {{ $product->quantity }},
    status: {{ $product->status }},
    categoryId: {{ $product->categoryId ?? 0 }}
  };
</script>

<script defer src="{{ asset('js/auth.js') }}"></script>
<script defer src="{{ asset('js/cart.js') }}"></script>
<script src="{{ asset('js/product-detail.js') }}"></script>
</body>
</html>