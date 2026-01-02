// ===== MENU DROPDOWN =====
function initMenuDropdown() {
  const toggleBtn = document.getElementById('menu-toggle');
  const dropdown = document.getElementById('dropdown-menu');
  const overlay = document.getElementById('dropdown-overlay');

  if (!toggleBtn || !dropdown || !overlay) return;

  toggleBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    dropdown.classList.toggle('show');
    overlay.classList.toggle('show');
    toggleBtn.classList.toggle('active');
  });

  overlay.addEventListener('click', closeMenu);
  document.addEventListener('click', closeMenu);

  function closeMenu() {
    dropdown.classList.remove('show');
    overlay.classList.remove('show');
    toggleBtn.classList.remove('active');
  }
}

// ===== CART OVERLAY =====
function initCartOverlay() {
  const cartBtn = document.getElementById('cart-btn');
  const cartOverlay = document.getElementById('cart-overlay');
  const closeCart = document.getElementById('close-cart');
  const closeCartBtn = document.querySelector('.close-cart-btn');

  if (!cartBtn || !cartOverlay) return;

  cartBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    cartOverlay.classList.add('show');
  });

  if (closeCart) {
    closeCart.addEventListener('click', function () {
      cartOverlay.classList.remove('show');
    });
  }

  if (closeCartBtn) {
    closeCartBtn.addEventListener('click', function () {
      cartOverlay.classList.remove('show');
    });
  }

  cartOverlay.addEventListener('click', function (e) {
    if (e.target === cartOverlay) {
      cartOverlay.classList.remove('show');
    }
  });
}

// ===== CAROUSEL =====
function initCarousel() {
  const track = document.querySelector('.carousel-track');
  const prevBtn = document.querySelector('.carousel-btn.prev');
  const nextBtn = document.querySelector('.carousel-btn.next');

  if (!track || !prevBtn || !nextBtn) return;

  const cards = track.querySelectorAll('.card');
  if (cards.length === 0) return;

  const cardWidth = cards[0].offsetWidth + 16;
  let currentPosition = 0;

  nextBtn.addEventListener('click', function () {
    const maxScroll = track.scrollWidth - track.offsetWidth;
    currentPosition = Math.min(currentPosition + cardWidth, maxScroll);
    track.style.transform = `translateX(-${currentPosition}px)`;
  });

  prevBtn.addEventListener('click', function () {
    currentPosition = Math.max(currentPosition - cardWidth, 0);
    track.style.transform = `translateX(-${currentPosition}px)`;
  });
}

// ===== USER AUTHENTICATION - DÙNG VỚI AUTH.JS CŨA BẠN =====
function initUserAuth() {
  const userArea = document.getElementById('user-area');
  if (!userArea) return;

  // Lấy thông tin từ localStorage (auth.js của bạn lưu vào 'user' và 'token')
  const token = localStorage.getItem('token');
  const userDataStr = localStorage.getItem('user');
  
  const loginUrl = userArea.dataset.loginUrl || '/login';
  const registerUrl = userArea.dataset.registerUrl || '/register';

  if (!token || !userDataStr) {
    // Chưa đăng nhập - Hiển thị nút đăng nhập/đăng ký
    userArea.innerHTML =
      '<a href="' + loginUrl + '" style="background:linear-gradient(90deg,#4CAF50,#45a049);color:#fff;border:none;padding:8px 12px;border-radius:8px;text-decoration:none;font-weight:700;margin-right:8px">Đăng nhập</a>' +
      '<a href="' + registerUrl + '" style="background:linear-gradient(90deg,#2196F3,#1976D2);color:#fff;border:none;padding:8px 12px;border-radius:8px;text-decoration:none;font-weight:700">Đăng ký</a>';
  } else {
    // Đã đăng nhập - Hiển thị tên và nút đăng xuất
    try {
      const user = JSON.parse(userDataStr);
      const userName = user.fullName || user.email || 'User';
      
      userArea.innerHTML =
        '<span style="color:#2b2b2b;font-weight:700;margin-right:8px">Xin chào, ' + encodeHTML(userName) + '</span>' +
        '<button id="logoutBtn" style="background:linear-gradient(90deg,#ff4b2b,#e63e20);color:#fff;border:none;padding:8px 12px;border-radius:8px;cursor:pointer;font-weight:700">Đăng xuất</button>';

      const logoutBtn = document.getElementById('logoutBtn');
      if (logoutBtn && typeof window.handleLogout === 'function') {
        logoutBtn.addEventListener('click', function () {
          if (confirm('Bạn có chắc muốn đăng xuất?')) {
            window.handleLogout();
          }
        });
      }
    } catch (error) {
      console.error('Parse user data error:', error);
      // Nếu lỗi, xóa data và hiển thị nút đăng nhập
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.reload();
    }
  }

  function encodeHTML(s) {
    return String(s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }
}

// ===== CHECKOUT FUNCTION =====
function goCheckout() {
  const checkoutBtn = document.querySelector('.checkout-btn');
  const loginUrl = checkoutBtn ? checkoutBtn.dataset.loginUrl : '/login';
  const checkoutUrl = checkoutBtn ? checkoutBtn.dataset.checkoutUrl : '/checkout';

  // Kiểm tra đăng nhập
  const token = localStorage.getItem('token');
  
  if (!token) {
    alert('Vui lòng đăng nhập để thanh toán!');
    window.location.href = loginUrl;
    return;
  }
  
  window.location.href = checkoutUrl;
}

// ===== SEARCH FUNCTION =====
function initSearch() {
  const searchInput = document.querySelector('.search input[type="search"]');
  const searchBtn = document.querySelector('.search button');

  if (!searchInput || !searchBtn) return;

  searchBtn.addEventListener('click', function () {
    const query = searchInput.value.trim();
    if (query) {
      console.log('Tìm kiếm:', query);
      // TODO: Implement search functionality
      // window.location.href = '/search?q=' + encodeURIComponent(query);
    }
  });

  searchInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
      searchBtn.click();
    }
  });
}

// ===== CART COUNT UPDATE =====
function updateCartCount() {
  const cartCount = document.getElementById('cart-count');
  if (!cartCount) return;

  // Lấy số lượng sản phẩm trong giỏ hàng từ localStorage
  const items = JSON.parse(localStorage.getItem('cart_items') || '[]');
  cartCount.textContent = items.length;
}

// ===== INITIALIZE ALL =====
document.addEventListener('DOMContentLoaded', function () {
  initMenuDropdown();
  initCartOverlay();
  initCarousel();
  initUserAuth();
  initSearch();
  updateCartCount();
});