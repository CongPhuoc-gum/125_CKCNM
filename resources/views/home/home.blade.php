<!doctype html>
<html lang="vi">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>SnackFood — Đồ khô</title>
  <link rel="stylesheet" href="{{ asset('css/home.css') }}">
</head>
<body>
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
          <a href="#best" class="menu-item">📦 Tất Cả Sản Phẩm</a>
          <a href="#" class="menu-item">🦑 Mực Khô</a>
          <a href="#" class="menu-item">🐟 Cá Khô</a>
          <a href="#" class="menu-item">🥜 Hạt & Snack</a>
          <a href="#" class="menu-item">🍊 Trái Cây Sấy</a>
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

          <article class="card">
            <img src="https://png.pngtree.com/thumb_back/fh260/background/20210907/pngtree-snacks-snack-food-delicious-dried-squid-shreds-photography-map-with-pictures-image_816479.jpg" alt="Mực khô">
            <h3>Mực một nắng</h3>
            <div style="color:#666;font-size:14px">Độ mềm vừa, tẩm gia vị truyền thống</div>
            <div class="price-row">
              <div class="price">199.000₫ / kg</div>
              <button class="btn-sm">Thêm vào giỏ</button>
            </div>
          </article>

          <article class="card">
            <img src="https://png.pngtree.com/thumb_back/fh260/background/20210907/pngtree-snacks-snack-food-delicious-dried-squid-shreds-photography-map-with-pictures-image_816479.jpg" alt="Cá khô">
            <h3>Cá cơm sấy</h3>
            <div style="color:#666;font-size:14px">Giòn tan, phù hợp ăn vặt</div>
            <div class="price-row">
              <div class="price">89.000₫ / gói</div>
              <button class="btn-sm">Thêm vào giỏ</button>
            </div>
          </article>

          <article class="card">
            <img src="https://png.pngtree.com/thumb_back/fh260/background/20210907/pngtree-snacks-snack-food-delicious-dried-squid-shreds-photography-map-with-pictures-image_816479.jpg" alt="Cá khô">
            <h3>Cá cơm sấy</h3>
            <div style="color:#666;font-size:14px">Giòn tan, phù hợp ăn vặt</div>
            <div class="price-row">
              <div class="price">89.000₫ / gói</div>
              <button class="btn-sm">Thêm vào giỏ</button>
            </div>
          </article>

          <article class="card">
            <img src="https://png.pngtree.com/thumb_back/fh260/background/20210907/pngtree-snacks-snack-food-delicious-dried-squid-shreds-photography-map-with-pictures-image_816479.jpg" alt="Cá khô">
            <h3>Cá cơm sấy</h3>
            <div style="color:#666;font-size:14px">Giòn tan, phù hợp ăn vặt</div>
            <div class="price-row">
              <div class="price">89.000₫ / gói</div>
              <button class="btn-sm">Thêm vào giỏ</button>
            </div>
          </article>

          <article class="card">
            <img src="https://png.pngtree.com/thumb_back/fh260/background/20210907/pngtree-snacks-snack-food-delicious-dried-squid-shreds-photography-map-with-pictures-image_816479.jpg" alt="Cá khô">
            <h3>Cá cơm sấy</h3>
            <div style="color:#666;font-size:14px">Giòn tan, phù hợp ăn vặt</div>
            <div class="price-row">
              <div class="price">89.000₫ / gói</div>
              <button class="btn-sm">Thêm vào giỏ</button>
            </div>
          </article>

          <article class="card">
            <img src="https://png.pngtree.com/thumb_back/fh260/background/20210907/pngtree-snacks-snack-food-delicious-dried-squid-shreds-photography-map-with-pictures-image_816479.jpg" alt="Cá khô">
            <h3>Cá cơm sấy</h3>
            <div style="color:#666;font-size:14px">Giòn tan, phù hợp ăn vặt</div>
            <div class="price-row">
              <div class="price">89.000₫ / gói</div>
              <button class="btn-sm">Thêm vào giỏ</button>
            </div>
          </article>

          <article class="card">
            <img src="https://png.pngtree.com/thumb_back/fh260/background/20210907/pngtree-snacks-snack-food-delicious-dried-squid-shreds-photography-map-with-pictures-image_816479.jpg" alt="Hạt">
            <h3>Hạt điều rang</h3>
            <div style="color:#666;font-size:14px">Ngon béo, không chất bảo quản</div>
            <div class="price-row">
              <div class="price">149.000₫ / kg</div>
              <button class="btn-sm">Thêm vào giỏ</button>
            </div>
          </article>
        </div>
        <button class="carousel-btn next" aria-label="Tiếp">›</button>
      </div>
      <!-- end carousel -->

      <h2 id="best" style="margin-top:28px">Tất cả sản phẩm</h2>
      <div class="grid" style="margin-bottom:18px">
        <article class="card">
          <img src="https://png.pngtree.com/thumb_back/fh260/background/20210907/pngtree-snacks-snack-food-delicious-dried-squid-shreds-photography-map-with-pictures-image_816479.jpg" alt="Trái cây sấy">
          <h3>Trái cây sấy</h3>
          <div class="price-row">
            <div class="price">79.000₫ / gói</div>
            <button class="btn-sm">Thêm vào giỏ</button>
          </div>
        </article>

        <article class="card">
          <img src="https://images.unsplash.com/photo-1542736667-069246bdbc81?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=" alt="Snack">
          <h3>Snack mặn</h3>
          <div class="price-row">
            <div class="price">49.000₫ / gói</div>
            <button class="btn-sm">Thêm vào giỏ</button>
          </div>
        </article>

        <article class="card">
          <img src="https://images.unsplash.com/photo-1542736667-069246bdbc81?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=" alt="Snack">
          <h3>Snack mặn</h3>
          <div class="price-row">
            <div class="price">49.000₫ / gói</div>
            <button class="btn-sm">Thêm vào giỏ</button>
          </div>
        </article>

        <article class="card">
          <img src="https://images.unsplash.com/photo-1542736667-069246bdbc81?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=" alt="Snack">
          <h3>Snack mặn</h3>
          <div class="price-row">
            <div class="price">49.000₫ / gói</div>
            <button class="btn-sm">Thêm vào giỏ</button>
          </div>
        </article>

        <article class="card">
          <img src="https://images.unsplash.com/photo-1542736667-069246bdbc81?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=" alt="Snack">
          <h3>Snack mặn</h3>
          <div class="price-row">
            <div class="price">49.000₫ / gói</div>
            <button class="btn-sm">Thêm vào giỏ</button>
          </div>
        </article>

        <article class="card">
          <img src="https://images.unsplash.com/photo-1542736667-069246bdbc81?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=" alt="Snack">
          <h3>Snack mặn</h3>
          <div class="price-row">
            <div class="price">49.000₫ / gói</div>
            <button class="btn-sm">Thêm vào giỏ</button>
          </div>
        </article>

        <article class="card">
          <img src="https://images.unsplash.com/photo-1542736667-069246bdbc81?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=" alt="Snack">
          <h3>Snack mặn</h3>
          <div class="price-row">
            <div class="price">49.000₫ / gói</div>
            <button class="btn-sm">Thêm vào giỏ</button>
          </div>
        </article>

        <article class="card">
          <img src="https://images.unsplash.com/photo-1542736667-069246bdbc81?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=" alt="Snack">
          <h3>Snack mặn</h3>
          <div class="price-row">
            <div class="price">49.000₫ / gói</div>
            <button class="btn-sm">Thêm vào giỏ</button>
          </div>
        </article>

        <article class="card">
          <img src="https://images.unsplash.com/photo-1606312619347-3b4f2f7f9d4e?q=80&w=1200&auto=format&fit=crop&ixlib=rb-4.0.3&s=" alt="Gia vị">
          <h3>Gia vị khô</h3>
          <div class="price-row">
            <div class="price">39.000₫ / gói</div>
            <button class="btn-sm">Thêm vào giỏ</button>
          </div>
        </article>
      </div>
    </main>

    <footer id="contact">
      © <strong>SnackFood</strong> — Chuyên đồ khô chất lượng. Liên hệ: 0900 123 456 · email: info@snackfood.vn
    </footer>
  </div>

  <div id="cart-overlay">
    <div class="cart-panel">
      <div class="cart-header">
        <h3>🛒 Giỏ hàng</h3>
        <button id="close-cart">✕</button>
      </div>

      <div class="cart-items">
        <!-- Item -->
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
        <button class="checkout-btn" 
                onclick="goCheckout()"
                data-login-url="{{ route('login') }}"
                data-checkout-url="{{ url('/checkout') }}">
          Thanh toán
        </button>
        <button class="close-cart-btn">Đóng giỏ hàng</button>
      </div>
    </div>
  </div>

  <script src="{{ asset('js/auth.js') }}"></script>
  <script src="{{ asset('js/header.js') }}"></script>

</body>
</html>