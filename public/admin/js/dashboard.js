const API_URL = 'http://127.0.0.1:8000/api';

async function loadDashboard() {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.href = '/login';
            return;
        }

        const response = await fetch(`${API_URL}/admin/dashboard`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to load dashboard');
        }

        const result = await response.json();
        const data = result.data;

        // Update stats
        document.getElementById('totalRevenue').textContent = 
            new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(data.stats.total_revenue);
        document.getElementById('totalOrders').textContent = data.stats.total_orders;
        document.getElementById('pendingOrders').textContent = data.stats.pending_orders;
        document.getElementById('totalProducts').textContent = data.stats.total_products;
        document.getElementById('totalUsers').textContent = data.stats.total_users;
        document.getElementById('lowStockProducts').textContent = data.stats.low_stock_products;

        // Load top products
        loadTopProducts(data.top_products);

        // Load recent orders
        loadRecentOrders(data.recent_orders);

        // Load low stock products
        loadLowStockProducts(data.low_stock_products);

    } catch (error) {
        console.error('Error loading dashboard:', error);
        alert('Không thể tải dữ liệu dashboard');
    }
}

function loadTopProducts(products) {
    const tbody = document.getElementById('topProductsTable');
    
    if (!products || products.length === 0) {
        tbody.innerHTML = '<tr><td colspan="2" class="text-center">Chưa có dữ liệu</td></tr>';
        return;
    }

    tbody.innerHTML = products.slice(0, 5).map(product => `
        <tr>
            <td>${product.name}</td>
            <td><strong>${product.orderitems_sum_quantity || 0}</strong></td>
        </tr>
    `).join('');
}

function loadRecentOrders(orders) {
    const tbody = document.getElementById('recentOrdersTable');
    
    if (!orders || orders.length === 0) {
        tbody.innerHTML = '<tr><td colspan="3" class="text-center">Chưa có đơn hàng</td></tr>';
        return;
    }

    tbody.innerHTML = orders.slice(0, 5).map(order => `
        <tr>
            <td>#${order.orderId}</td>
            <td>${order.customerName}</td>
            <td>${getStatusBadge(order.status)}</td>
        </tr>
    `).join('');
}

function loadLowStockProducts(products) {
    const tbody = document.getElementById('lowStockTable');
    
    if (!products || products.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center">Tất cả sản phẩm đều đủ hàng</td></tr>';
        return;
    }

    tbody.innerHTML = products.map(product => `
        <tr>
            <td>${product.name}</td>
            <td>${product.category ? product.category.name : 'N/A'}</td>
            <td><span class="badge badge-danger">${product.quantity}</span></td>
            <td>${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}</td>
            <td>
                <a href="/admin/products/${product.productId}/edit" class="btn btn-sm btn-primary">
                    <i class="fas fa-edit"></i> Cập nhật
                </a>
            </td>
        </tr>
    `).join('');
}

function getStatusBadge(status) {
    const badges = {
        'pending': '<span class="badge badge-warning">Chờ xử lý</span>',
        'processing': '<span class="badge badge-primary">Đang xử lý</span>',
        'shipping': '<span class="badge badge-primary">Đang giao</span>',
        'completed': '<span class="badge badge-success">Hoàn thành</span>',
        'cancelled': '<span class="badge badge-danger">Đã hủy</span>'
    };
    return badges[status] || status;
}

// Load dashboard on page load
window.addEventListener('DOMContentLoaded', loadDashboard);