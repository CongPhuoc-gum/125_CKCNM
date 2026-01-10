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

// ===== SEARCH FUNCTIONALITY - TÌM KIẾM THÔNG MINH =====
let allProducts = [];
let searchTimeout = null;

function initSearch() {
  const searchInput = document.querySelector('.search input[type="search"]');
  const searchBtn = document.querySelector('.search button');

  if (!searchInput || !searchBtn) return;

  console.log('✅ Search initialized');

  // Tạo dropdown suggestions
  createSearchDropdown();

  // Lấy tất cả sản phẩm từ DOM
  getAllProductsFromDOM();

  // Search khi gõ (với debounce)
  searchInput.addEventListener('input', function () {
    clearTimeout(searchTimeout);
    const query = this.value.trim();

    if (query.length < 2) {
      hideSearchDropdown();
      return;
    }

    searchTimeout = setTimeout(() => {
      handleSearch(query);
    }, 300);
  });

  // Search khi click button
  searchBtn.addEventListener('click', function (e) {
    e.preventDefault();
    const query = searchInput.value.trim();
    if (query) {
      performSearch(query);
    }
  });

  // Search khi nhấn Enter
  searchInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      const query = this.value.trim();
      if (query) {
        performSearch(query);
      }
    }
  });

  // Focus vào search input
  searchInput.addEventListener('focus', function () {
    const query = this.value.trim();
    if (query && query.length >= 2) {
      handleSearch(query);
    }
  });

  // Đóng dropdown khi click bên ngoài
  document.addEventListener('click', function (e) {
    if (!e.target.closest('.search')) {
      hideSearchDropdown();
    }
  });
}

// ===== TẠO DROPDOWN SUGGESTIONS =====
function createSearchDropdown() {
  const searchContainer = document.querySelector('.search');
  if (!searchContainer) return;

  // Xóa dropdown cũ nếu có
  const oldDropdown = document.getElementById('searchDropdown');
  if (oldDropdown) {
    oldDropdown.remove();
  }

  const dropdown = document.createElement('div');
  dropdown.className = 'search-dropdown';
  dropdown.id = 'searchDropdown';
  searchContainer.appendChild(dropdown);
}

// ===== LẤY TẤT CẢ SẢN PHẨM TỪ DOM =====
function getAllProductsFromDOM() {
  const productCards = document.querySelectorAll('.card');
  allProducts = [];

  productCards.forEach(card => {
    const link = card.querySelector('a');
    const name = card.querySelector('h3')?.textContent?.trim() || '';
    const priceText = card.querySelector('.price')?.textContent || '0';
    const price = parseInt(priceText.replace(/[^\d]/g, ''));
    const img = card.querySelector('img')?.getAttribute('src') || '';
    const href = link?.getAttribute('href') || '#';

    if (name && href !== '#') {
      allProducts.push({
        productId: href.split('/').pop(),
        name: name,
        price: price,
        imageUrl: img,
        link: href
      });
    }
  });

  console.log(`✅ Loaded ${allProducts.length} products for search`);
}

// ===== HANDLE SEARCH (REAL-TIME) =====
function handleSearch(query) {
  const results = searchProducts(query);
  displaySearchSuggestions(results, query);
}

// ===== TÌM KIẾM SẢN PHẨM THÔNG MINH =====
function searchProducts(query) {
  const queryLower = query.toLowerCase().trim();
  const queryWords = queryLower.split(' ').filter(w => w.length > 0);

  // Tìm kiếm và tính điểm cho mỗi sản phẩm
  const results = allProducts.map(product => {
    const nameLower = product.name.toLowerCase();
    let score = 0;

    // Điểm cao nhất: Tên chính xác
    if (nameLower === queryLower) {
      score = 100;
    }
    // Điểm cao: Bắt đầu bằng query
    else if (nameLower.startsWith(queryLower)) {
      score = 90;
    }
    // Điểm trung bình: Chứa toàn bộ query
    else if (nameLower.includes(queryLower)) {
      score = 70;
    }
    // Điểm thấp: Chứa các từ trong query (ví dụ: "khô" → tìm "khô bò", "khô gà")
    else {
      let matchCount = 0;
      queryWords.forEach(word => {
        if (nameLower.includes(word)) {
          matchCount++;
        }
      });

      if (matchCount > 0) {
        score = 50 + (matchCount * 10);
      }
    }

    return { product, score };
  })
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5) // Giới hạn 5 kết quả - compact version
    .map(item => item.product);

  return results;
}

// ===== HIỂN THỊ SUGGESTIONS =====
function displaySearchSuggestions(results, query) {
  const dropdown = document.getElementById('searchDropdown');
  if (!dropdown) return;

  if (results.length === 0) {
    dropdown.innerHTML = `
      <div class="search-no-results">
        <span>❌ Không tìm thấy sản phẩm nào cho "${query}"</span>
      </div>
    `;
    dropdown.classList.add('show');
    return;
  }

  let html = '<div class="search-results">';

  results.forEach(product => {
    const highlightedName = highlightText(product.name, query);

    html += `
      <a href="${product.link}" class="search-result-item">
        <div class="search-result-image">
          ${product.imageUrl ?
        `<img src="${product.imageUrl}" alt="${product.name}" onerror="this.parentElement.innerHTML='<div class=\\'search-no-img\\'>${product.name.charAt(0)}</div>'">` :
        `<div class="search-no-img">${product.name.charAt(0)}</div>`
      }
        </div>
        <div class="search-result-info">
          <div class="search-result-name">${highlightedName}</div>
          <div class="search-result-price">${formatPrice(product.price)}₫</div>
        </div>
      </a>
    `;
  });

  html += '</div>';
  dropdown.innerHTML = html;
  dropdown.classList.add('show');
}

// ===== HIGHLIGHT TEXT =====
function highlightText(text, query) {
  const queryLower = query.toLowerCase();
  const textLower = text.toLowerCase();
  const index = textLower.indexOf(queryLower);

  if (index === -1) return text;

  const before = text.substring(0, index);
  const match = text.substring(index, index + query.length);
  const after = text.substring(index + query.length);

  return `${before}<strong class="search-highlight">${match}</strong>${after}`;
}

// ===== FORMAT PRICE =====
function formatPrice(price) {
  return price.toLocaleString('vi-VN');
}

// ===== PERFORM SEARCH (SCROLL TO RESULTS) =====
function performSearch(query) {
  hideSearchDropdown();

  const results = searchProducts(query);

  if (results.length === 0) {
    alert(`❌ Không tìm thấy sản phẩm nào cho "${query}"`);
    return;
  }

  // Scroll to products section
  const productsSection = document.getElementById('best') || document.getElementById('products');
  if (productsSection) {
    productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // Filter và hiển thị kết quả
  filterProductCards(results);
}

// ===== FILTER PRODUCT CARDS =====
function filterProductCards(results) {
  const resultIds = new Set(results.map(p => p.productId));
  const allCards = document.querySelectorAll('.card');

  allCards.forEach(card => {
    const link = card.querySelector('a')?.getAttribute('href') || '';
    const productId = link.split('/').pop();

    if (resultIds.has(productId)) {
      card.style.display = 'block';
      card.style.animation = 'fadeIn 0.3s ease';
    } else {
      card.style.display = 'none';
    }
  });

  // Thêm CSS animation nếu chưa có
  if (!document.getElementById('searchAnimationStyle')) {
    const style = document.createElement('style');
    style.id = 'searchAnimationStyle';
    style.textContent = `
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
    `;
    document.head.appendChild(style);
  }
}

// ===== HIDE SEARCH DROPDOWN =====
function hideSearchDropdown() {
  const dropdown = document.getElementById('searchDropdown');
  if (dropdown) {
    dropdown.classList.remove('show');
  }
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