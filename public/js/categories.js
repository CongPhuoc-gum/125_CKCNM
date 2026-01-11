// ===== CATEGORIES.JS - Load Categories into Menu =====

async function loadCategories() {
    try {
        const API_URL = window.location.origin + '/api';
        const response = await fetch(`${API_URL}/categories`);
        const categories = await response.json();

        if (!Array.isArray(categories) || categories.length === 0) {
            console.log('No categories found');
            return;
        }

        const menuDropdown = document.getElementById('dropdown-menu');
        if (!menuDropdown) return;

        // Find the position after "Tất Cả Sản Phẩm" to insert categories
        const allProductsLink = Array.from(menuDropdown.children).find(item =>
            item.textContent.includes('Tất Cả Sản Phẩm')
        );

        // Remove existing hardcoded category items (between "Tất Cả Sản Phẩm" and "Liên Hệ")
        const hardcodedItems = menuDropdown.querySelectorAll('.menu-item:not([href="#products"]):not([href="#best"]):not([href="#contact"])');
        hardcodedItems.forEach(item => item.remove());

        // Insert categories dynamically after "Tất Cả Sản Phẩm"
        categories.forEach(category => {
            const categoryLink = document.createElement('a');
            categoryLink.href = `#category-${category.categoryId}`;
            categoryLink.className = 'menu-item category-link';
            categoryLink.dataset.categoryId = category.categoryId;

            // Add emoji based on category name or use a default one
            const emoji = getCategoryEmoji(category.name);
            categoryLink.textContent = `${emoji} ${category.name}`;

            // Add click handler to filter products by category
            categoryLink.addEventListener('click', (e) => {
                e.preventDefault();
                filterProductsByCategory(category.categoryId, category.name);
            });

            // Insert after "Tất Cả Sản Phẩm"
            if (allProductsLink && allProductsLink.nextSibling) {
                menuDropdown.insertBefore(categoryLink, allProductsLink.nextSibling);
            } else {
                menuDropdown.appendChild(categoryLink);
            }
        });

    } catch (error) {
        console.error('Error loading categories:', error);
    }
}

function getCategoryEmoji(categoryName) {
    const name = categoryName.toLowerCase();
    if (name.includes('mực')) return '🦑';
    if (name.includes('cá')) return '🐟';
    if (name.includes('hạt') || name.includes('snack')) return '🥜';
    if (name.includes('trái cây') || name.includes('sấy')) return '🍊';
    if (name.includes('kẹo')) return '🍬';
    if (name.includes('bánh')) return '🍪';
    return '🏷️'; // Default emoji
}

function filterProductsByCategory(categoryId, categoryName) {
    // Reload page with category filter
    const url = new URL(window.location.href);

    if (categoryId) {
        url.searchParams.set('category', categoryId);
    } else {
        url.searchParams.delete('category');
    }

    // Reload with new URL
    window.location.href = url.toString();
}

// Highlight active category on page load
window.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const activeCategoryId = urlParams.get('category');

    if (activeCategoryId) {
        // Highlight the active category in menu
        const categoryLinks = document.querySelectorAll('.category-link');
        categoryLinks.forEach(link => {
            if (link.dataset.categoryId === activeCategoryId) {
                link.style.fontWeight = 'bold';
                link.style.backgroundColor = '#e8f5e9';
            }
        });
    }
});

// Load categories when page loads
window.addEventListener('DOMContentLoaded', loadCategories);
