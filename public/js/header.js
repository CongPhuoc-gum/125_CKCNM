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

// ===== CAROUSEL WITH INFINITE LOOP =====
function initCarousel() {
  const track = document.querySelector('.carousel-track');
  const prevBtn = document.querySelector('.carousel-btn.prev');
  const nextBtn = document.querySelector('.carousel-btn.next');

  if (!track || !prevBtn || !nextBtn) return;

  const cards = track.querySelectorAll('.card');
  if (cards.length === 0) return;

  let currentIndex = 0;
  const totalCards = cards.length;
  const cardWidth = cards[0].offsetWidth + 18;

  function scrollToIndex(index) {
    if (index < 0) {
      currentIndex = totalCards - 1;
    } else if (index >= totalCards) {
      currentIndex = 0;
    } else {
      currentIndex = index;
    }

    const scrollPosition = currentIndex * cardWidth;
    track.scrollTo({
      left: scrollPosition,
      behavior: 'smooth'
    });
  }

  nextBtn.addEventListener('click', function () {
    scrollToIndex(currentIndex + 1);
  });

  prevBtn.addEventListener('click', function () {
    scrollToIndex(currentIndex - 1);
  });

  let autoScrollInterval = setInterval(function () {
    scrollToIndex(currentIndex + 1);
  }, 4000);

  track.addEventListener('mouseenter', function () {
    clearInterval(autoScrollInterval);
  });

  track.addEventListener('mouseleave', function () {
    autoScrollInterval = setInterval(function () {
      scrollToIndex(currentIndex + 1);
    }, 4000);
  });
}

// ===== USER AUTHENTICATION WITH DROPDOWN =====
function initUserAuth() {
  const userArea = document.getElementById('user-area');
  if (!userArea) return;

  const token = localStorage.getItem('token');
  const userDataStr = localStorage.getItem('user');

  const loginUrl = userArea.dataset.loginUrl || '/login';
  const registerUrl = userArea.dataset.registerUrl || '/register';

  if (!token || !userDataStr) {
    // Chưa đăng nhập
    userArea.innerHTML =
      '<a href="' + loginUrl + '" class="user-login-btn">Đăng nhập</a>' +
      '<a href="' + registerUrl + '" class="user-register-btn">Đăng ký</a>';
  } else {
    // Đã đăng nhập
    try {
      const user = JSON.parse(userDataStr);
      const userName = user.fullName || user.email || 'User';
      const userAvatar = user.avatar || null;

      userArea.innerHTML = `
        <div class="user-dropdown-wrapper">
          <button class="user-profile-btn" id="userProfileBtn">
            ${userAvatar ?
          `<img src="${userAvatar}" alt="${userName}" class="user-avatar">` :
          `<div class="user-avatar-placeholder">${userName.charAt(0).toUpperCase()}</div>`
        }
            <span class="user-name">${encodeHTML(userName)}</span>
            <span class="user-arrow">▼</span>
          </button>

          <div class="user-dropdown-menu" id="userDropdownMenu">
            <div class="user-dropdown-header">
              <div class="user-info">
                ${userAvatar ?
          `<img src="${userAvatar}" alt="${userName}" class="user-avatar-large">` :
          `<div class="user-avatar-placeholder large">${userName.charAt(0).toUpperCase()}</div>`
        }
                <div class="user-details">
                  <div class="user-fullname">${encodeHTML(userName)}</div>
                  <div class="user-email">${encodeHTML(user.email || '')}</div>
                </div>
              </div>
            </div>

            <div class="user-dropdown-body">
              <a href="/orders" class="dropdown-item">
                <span class="dropdown-icon">📦</span>
                <span>Đơn hàng của tôi</span>
              </a>
              
              <a href="/profile" class="dropdown-item">
                <span class="dropdown-icon">👤</span>
                <span>Thông tin tài khoản</span>
              </a>

              <a href="/contact" class="dropdown-item">
                <span class="dropdown-icon">📞</span>
                <span>Liên hệ & hỗ trợ</span>
              </a>

              <div class="dropdown-divider"></div>

              <button class="dropdown-item logout-item" id="logoutBtnDropdown">
                <span class="dropdown-icon">🚪</span>
                <span>Đăng xuất</span>
              </button>
            </div>
          </div>
        </div>
      `;

      initUserDropdown();

      const logoutBtn = document.getElementById('logoutBtnDropdown');
      if (logoutBtn) {
        logoutBtn.addEventListener('click', function () {
          if (confirm('Bạn có chắc muốn đăng xuất?')) {
            if (typeof window.handleLogout === 'function') {
              window.handleLogout();
            } else {
              localStorage.removeItem('token');
              localStorage.removeItem('token_type');
              localStorage.removeItem('user');
              window.location.href = loginUrl;
            }
          }
        });
      }
    } catch (error) {
      console.error('Parse user data error:', error);
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

// User dropdown toggle
function initUserDropdown() {
  const profileBtn = document.getElementById('userProfileBtn');
  const dropdownMenu = document.getElementById('userDropdownMenu');

  if (!profileBtn || !dropdownMenu) return;

  profileBtn.addEventListener('click', function (e) {
    e.stopPropagation();
    dropdownMenu.classList.toggle('show');
    profileBtn.classList.toggle('active');
  });

  document.addEventListener('click', function (e) {
    if (!e.target.closest('.user-dropdown-wrapper')) {
      dropdownMenu.classList.remove('show');
      profileBtn.classList.remove('active');
    }
  });

  const menuItems = dropdownMenu.querySelectorAll('.dropdown-item:not(.logout-item)');
  menuItems.forEach(item => {
    item.addEventListener('click', function () {
      dropdownMenu.classList.remove('show');
      profileBtn.classList.remove('active');
    });
  });
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
    }
  });

  searchInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
      searchBtn.click();
    }
  });
}

// ===== INITIALIZE ALL =====
document.addEventListener('DOMContentLoaded', function () {
  console.log('✅ Header.js loaded');

  initMenuDropdown();
  initCartOverlay();
  initCarousel();
  initUserAuth();
  initSearch();
});