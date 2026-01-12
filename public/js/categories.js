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

        // Find the "Tất Cả Sản Phẩm" link
        const allProductsLink = Array.from(menuDropdown.children).find(item =>
            item.textContent.includes('Tất Cả Sản Phẩm')
        );

        if (!allProductsLink) {
            console.error('Could not find "Tất Cả Sản Phẩm" link');
            return;
        }

        // Insert categories dynamically after "Tất Cả Sản Phẩm"
        categories.forEach(category => {
            const categoryLink = document.createElement('a');
            categoryLink.href = `${window.location.origin}?category=${category.categoryId}`;
            categoryLink.className = 'menu-item category-link';
            categoryLink.dataset.categoryId = category.categoryId;

            // Add emoji based on category name or use a default one
            const emoji = getCategoryEmoji(category.name);
            categoryLink.textContent = `${emoji} ${category.name}`;

            // Insert after the last category or after "Tất Cả Sản Phẩm"
            const lastCategory = menuDropdown.querySelector('.category-link:last-of-type');
            if (lastCategory) {
                lastCategory.after(categoryLink);
            } else {
                allProductsLink.after(categoryLink);
            }
        });

        // Highlight active category on page load
        highlightActiveCategory();

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
    if (name.includes('bò')) return '🥩';
    if (name.includes('tôm')) return '🦐';
    return '🏷️'; // Default emoji
}

function highlightActiveCategory() {
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
}

// Load categories when page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadCategories);
} else {
    loadCategories();
}