const API_URL = window.location.origin + '/api';
let currentPage = 1;

async function loadReviews(page = 1) {
    try {
        const token = localStorage.getItem('token');
        const search = document.getElementById('searchInput')?.value || '';
        const rating = document.getElementById('ratingFilter')?.value || '';

        let url = `${API_URL}/admin/reviews?page=${page}`;
        if (search) url += `&search=${search}`;
        if (rating) url += `&rating=${rating}`;

        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            }
        });

        const result = await response.json();
        const data = result.data;

        displayReviews(data.data);
        displayPagination(data);
        currentPage = page;

    } catch (error) {
        console.error('Error loading reviews:', error);
        document.getElementById('reviewsTable').innerHTML =
            '<tr><td colspan="7" class="text-center">Lỗi tải dữ liệu</td></tr>';
    }
}

function displayReviews(reviews) {
    const tbody = document.getElementById('reviewsTable');

    if (!reviews || reviews.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center">Không có đánh giá nào</td></tr>';
        return;
    }

    tbody.innerHTML = reviews.map(review => `
        <tr>
            <td>${review.reviewId}</td>
            <td>
                <div style="display: flex; align-items: center; gap: 10px;">
                    ${review.product && review.product.imageUrl ?
            `<img src="/storage/${review.product.imageUrl}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 6px;" alt="${review.product.name}">`
            : ''
        }
                    <span><strong>${review.product ? review.product.name : 'N/A'}</strong></span>
                </div>
            </td>
            <td>${review.user ? review.user.fullName : 'N/A'}</td>
            <td>${getStars(review.rating)}</td>
            <td>
                <div style="max-width: 300px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
                    ${review.comment || '<em style="color: #9ca3af;">Không có bình luận</em>'}
                </div>
            </td>
            <td>${formatDate(review.createdAt)}</td>
            <td>
                <button onclick="viewReviewDetail(${review.reviewId})" class="btn btn-sm btn-primary" title="Xem chi tiết">
                    <i class="fas fa-eye"></i>
                </button>
                <button onclick="deleteReview(${review.reviewId})" class="btn btn-sm btn-danger" title="Xóa">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function viewReviewDetail(reviewId) {
    // Find review in current data
    const reviews = Array.from(document.querySelectorAll('#reviewsTable tr')).map((_, index) => index);

    alert('Chi tiết đánh giá #' + reviewId + '\n\nChức năng này có thể mở rộng thêm modal hiển thị chi tiết.');
}

async function deleteReview(reviewId) {
    if (!confirm('Bạn có chắc muốn xóa đánh giá này?')) return;

    try {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/admin/reviews/${reviewId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            }
        });

        const data = await response.json();

        if (response.ok) {
            alert('Xóa đánh giá thành công!');
            loadReviews(currentPage);
        } else {
            alert(data.message || 'Không thể xóa đánh giá');
        }
    } catch (error) {
        console.error('Error deleting review:', error);
        alert('Có lỗi xảy ra khi xóa đánh giá');
    }
}

function getStars(rating) {
    const fullStars = '⭐'.repeat(rating);
    const emptyStars = '☆'.repeat(5 - rating);
    return `<span style="color: #f59e0b; font-size: 16px;">${fullStars}${emptyStars}</span>`;
}

function displayPagination(data) {
    const container = document.getElementById('pagination');
    if (!container) return;

    const { current_page, last_page } = data;

    let html = '';

    html += `<button onclick="loadReviews(${current_page - 1})" ${current_page === 1 ? 'disabled' : ''}>
        <i class="fas fa-chevron-left"></i>
    </button>`;

    for (let i = 1; i <= last_page; i++) {
        if (i === 1 || i === last_page || (i >= current_page - 2 && i <= current_page + 2)) {
            html += `<button onclick="loadReviews(${i})" class="${i === current_page ? 'active' : ''}">${i}</button>`;
        } else if (i === current_page - 3 || i === current_page + 3) {
            html += `<button disabled>...</button>`;
        }
    }

    html += `<button onclick="loadReviews(${current_page + 1})" ${current_page === last_page ? 'disabled' : ''}>
        <i class="fas fa-chevron-right"></i>
    </button>`;

    container.innerHTML = html;
}

function searchReviews() {
    loadReviews(1);
}

function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
}

window.addEventListener('DOMContentLoaded', () => {
    loadReviews();

    document.getElementById('searchInput')?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') searchReviews();
    });
});