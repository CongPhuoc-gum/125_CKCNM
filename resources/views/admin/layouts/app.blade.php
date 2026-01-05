<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <!-- ✅ THÊM DÒNG NÀY - QUAN TRỌNG -->
    <meta name="csrf-token" content="{{ csrf_token() }}">
    
    <title>@yield('title', 'Admin Panel') - Snack Shop</title>
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
    <link href="/admin/css/admin.css" rel="stylesheet">
</head>
<body>
    <div class="admin-container">
        <!-- Sidebar -->
        <aside class="sidebar" id="sidebar">
            <div class="sidebar-header">
                <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRoV0_K78ROk_yDSrCyKON-JkXA5uWF9gxe4A&s" alt="Logo">
                <h2>Admin Panel</h2>
            </div>

            <nav class="sidebar-menu">
                <a href="/admin/dashboard" class="menu-item {{ Request::is('admin/dashboard') ? 'active' : '' }}">
                    <i class="fas fa-chart-line"></i>
                    <span>Dashboard</span>
                </a>
                <a href="/admin/products" class="menu-item {{ Request::is('admin/products*') ? 'active' : '' }}">
                    <i class="fas fa-box"></i>
                    <span>Sản phẩm</span>
                </a>
                <a href="/admin/categories" class="menu-item {{ Request::is('admin/categories*') ? 'active' : '' }}">
                    <i class="fas fa-folder"></i>
                    <span>Danh mục</span>
                </a>
                <a href="/admin/orders" class="menu-item {{ Request::is('admin/orders*') ? 'active' : '' }}">
                    <i class="fas fa-shopping-cart"></i>
                    <span>Đơn hàng</span>
                </a>
                <a href="/admin/users" class="menu-item {{ Request::is('admin/users*') ? 'active' : '' }}">
                    <i class="fas fa-users"></i>
                    <span>Người dùng</span>
                </a>
                <a href="/admin/reviews" class="menu-item {{ Request::is('admin/reviews*') ? 'active' : '' }}">
                    <i class="fas fa-star"></i>
                    <span>Đánh giá</span>
                </a>
            </nav>

            <div class="sidebar-footer">
                <button onclick="handleLogout()" class="logout-btn">
                    <i class="fas fa-sign-out-alt"></i>
                    <span>Đăng xuất</span>
                </button>
            </div>
        </aside>

        <!-- Main Content -->
        <main class="main-content">
            <!-- Top Bar -->
            <header class="topbar">
                <button class="menu-toggle" onclick="toggleSidebar()">
                    <i class="fas fa-bars"></i>
                </button>
                
                <div class="topbar-right">
                    <div class="user-info">
                        <i class="fas fa-user-circle"></i>
                        <span id="adminName">Admin Snack Shop</span>
                    </div>
                </div>
            </header>

            <!-- Page Content -->
            <div class="content-wrapper">
                @yield('content')
            </div>
        </main>
    </div>

    <script>
        // Toggle Sidebar
        function toggleSidebar() {
            document.getElementById('sidebar').classList.toggle('collapsed');
        }

        // Logout
        async function handleLogout() {
            if (!confirm('Bạn có chắc muốn đăng xuất?')) return;

            try {
                const token = localStorage.getItem('token');
                const response = await fetch('/api/auth/logout', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/json'
                    }
                });

                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/login';
            } catch (error) {
                console.error('Logout error:', error);
                window.location.href = '/login';
            }
        }

        // Load user info
        window.addEventListener('DOMContentLoaded', () => {
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            if (user.fullName) {
                document.getElementById('adminName').textContent = user.fullName;
            }
        });
    </script>

    @yield('scripts')
</body>
</html>