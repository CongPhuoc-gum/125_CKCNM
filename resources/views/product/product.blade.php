<!doctype html>
<html lang="vi">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>{{ $product->name }} | SnackFood</title>
  <link rel="stylesheet" href="{{ asset('css/product.css') }}">
</head>
<body>

<!-- ===== HEADER - GIỐNG Y HỆT HOME ===== -->
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
      <a href="{{ route('home') }}" class="menu-item">📦 Tất Cả Sản Phẩm</a>
      <!-- Categories will be inserted here dynamically -->
    </div>
  </div>
  
  <div class="search" role="search">
    <input type="search" placeholder="Tìm kiếm sản phẩm...">
    <button>🔎</button>
  </div>

  <button id="cart-btn">
    🛒 <span id="cart-count">0</span>
  </button>
  
  <!-- CRITICAL: Phải có data attributes này để header.js hoạt động -->
  <div id="user-area" 
       data-login-url="{{ route('login') }}"
       data-register-url="{{ route('register') }}">
  </div>
</header>

<div id="dropdown-overlay"></div>

<!-- ===== PRODUCT DETAIL CONTENT ===== -->
<div class="product-container">
  <div class="breadcrumb" id="breadcrumb">
    <a href="{{ route('home') }}">Trang chủ</a> > 
    <a href="{{ route('home') }}#best">Sản phẩm</a> > 
    <span>{{ $product->name }}</span>
  </div>

  <div class="product-detail">
    <!-- IMAGE với fallback giống trang home -->
    <div class="product-images">
      <div class="product-image-wrapper {{ !$product->imageUrl ? 'no-image' : '' }}" id="mainImageWrapper">
        @if($product->imageUrl)
          <img id="mainImg" 
               src="{{ asset('storage/' . $product->imageUrl) }}" 
               alt="{{ $product->name }}"
               onerror="this.parentElement.classList.add('no-image'); this.style.display='none'; this.nextElementSibling.style.display='block';">
        @endif
        <div class="product-fallback-text">{{ $product->name }}</div>
      </div>
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
        <span class="price" id="price">{{ number_format($product->price, 0, ',', '.') }}₫</span>
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
        <input id="qty" value="1" type="number" min="1" max="{{ $product->quantity }}">
        <button onclick="changeQty(1)">+</button>
      </div>
      
      <div class="action-buttons">
        <button class="add-btn" onclick="handleAddToCart()">🛒 Thêm vào giỏ hàng</button>
        <button class="buy-btn" onclick="handleBuyNow()">🛒 Mua Ngay</button>
      </div>
    </div>
  </div>
   
  <!-- REVIEWS - HIỂN THỊ TÊN NGƯỜI DÙNG -->
  <div class="review-section">
    <h2>💬 Đánh giá của khách hàng</h2>

    @if($product->reviews && count($product->reviews) > 0)
      @foreach($product->reviews as $review)
        <div class="review-item">
          <div class="review-header">
            <strong>{{ $review->user->name ?? 'Khách hàng' }}</strong>
            <span class="stars">
              @for($i = 0; $i < 5; $i++)
                @if($i < $review->rating)★@else☆@endif
              @endfor
            </span>
          </div>
          <p>{{ $review->comment ?? 'Không có nhận xét' }}</p>
          <small style="color:#999">{{ $review->createdAt ? $review->createdAt->format('d/m/Y H:i') : '' }}</small>
        </div>
      @endforeach
    @else
      <p style="text-align:center;color:#999;padding:20px">Chưa có đánh giá nào cho sản phẩm này</p>
    @endif
  </div>

  <!-- ===== RELATED PRODUCTS SECTION - SIMPLE GRID ===== -->
  <div class="related-products-section">
    <h2>🔥 Sản phẩm liên quan</h2>
    
    @if(isset($relatedProducts) && count($relatedProducts) > 0)
      <!-- Products Grid (2 rows x 4 cols = 8 products max) -->
      <div class="related-products-grid">
        @foreach($relatedProducts->take(8) as $relatedProduct)
          <a href="{{ route('product.show', $relatedProduct->productId) }}" class="related-product-card">
            <div class="related-product-image {{ !$relatedProduct->imageUrl ? 'no-img' : '' }}">
              @if($relatedProduct->imageUrl)
                <img src="{{ asset('storage/' . $relatedProduct->imageUrl) }}" 
                     alt="{{ $relatedProduct->name }}"
                     onerror="this.parentElement.classList.add('no-img'); this.innerHTML='{{ $relatedProduct->name }}';">
              @else
                {{ $relatedProduct->name }}
              @endif
            </div>
            
            <div class="related-product-info">
              <div class="related-product-name">{{ $relatedProduct->name }}</div>
              <div class="related-product-price">{{ number_format($relatedProduct->price, 0, ',', '.') }}₫</div>
              <div class="related-product-stock {{ $relatedProduct->status == 1 ? 'in-stock' : 'out-stock' }}">
                {{ $relatedProduct->status == 1 ? '✓ Còn hàng' : '✗ Hết hàng' }}
              </div>
            </div>
          </a>
        @endforeach
      </div>
    @else
      <p style="text-align:center;color:#999;padding:20px">
        Không có sản phẩm liên quan
      </p>
    @endif
  </div>
</div>

<footer id="contact">
  © <strong>SnackFood</strong> — Chuyên đồ khô chất lượng. Liên hệ: 0900 123 456 · email: info@snackfood.vn
</footer>

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

<!-- ===== PRODUCT DATA - TRUYỀN TỪ LARAVEL SANG JS ===== -->
<script>
  window.productData = {
    id: {{ $product->productId }},
    name: "{{ addslashes($product->name) }}",
    price: {{ $product->price }},
    description: "{{ addslashes($product->description) }}",
    imageUrl: "{{ $product->imageUrl ? asset('storage/' . $product->imageUrl) : asset('images/no-image.png') }}",
    quantity: {{ $product->quantity }},
    status: {{ $product->status }},
    categoryId: {{ $product->categoryId ?? 0 }}
  };
</script>

<!-- ===== LOAD JS FILES - THỨ TỰ QUAN TRỌNG ===== -->
<script defer src="{{ asset('js/cart.js') }}"></script>
<script defer src="{{ asset('js/auth.js') }}"></script>
<script defer src="{{ asset('js/header.js') }}"></script>
<script defer src="{{ asset('js/categories.js') }}"></script>
<script defer src="{{ asset('js/product-detail.js') }}"></script>

</body>
</html>