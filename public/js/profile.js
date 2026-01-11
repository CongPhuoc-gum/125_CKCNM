(function () {
    'use strict';

    const API_URL = 'http://localhost:8000/api';

    let userData = null;
    let originalData = null;

    // ===== INIT =====
    document.addEventListener('DOMContentLoaded', async function () {
        console.log('✅ Profile.js loaded');

        // Kiểm tra đăng nhập
        const token = localStorage.getItem('token');
        if (!token) {
            showToast('Vui lòng đăng nhập!', 'error');
            setTimeout(() => {
                window.location.href = '/login';
            }, 1500);
            return;
        }

        // Load user data
        await loadUserData();

        // Init tabs
        initTabs();

        // Init forms
        initProfileForm();
        initPasswordForm();
    });

    // ===== LOAD USER DATA =====
    async function loadUserData() {
        const token = localStorage.getItem('token');

        try {
            // Gọi API để lấy thông tin user mới nhất
            const response = await fetch(`${API_URL}/user/profile`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Không thể tải thông tin user');
            }

            const result = await response.json();

            if (result.success && result.data) {
                userData = result.data;
                originalData = { ...userData };

                // Cập nhật localStorage
                localStorage.setItem('user', JSON.stringify(userData));

                // Display user data
                displayUserData(userData);
            } else {
                throw new Error('Dữ liệu không hợp lệ');
            }

        } catch (error) {
            console.error('❌ Error loading user data:', error);

            // Fallback: sử dụng data từ localStorage
            const userStr = localStorage.getItem('user');
            if (userStr) {
                try {
                    userData = JSON.parse(userStr);
                    originalData = { ...userData };
                    displayUserData(userData);
                } catch (e) {
                    showToast('Có lỗi xảy ra khi tải dữ liệu!', 'error');
                    setTimeout(() => window.location.href = '/login', 1500);
                }
            } else {
                showToast('Không tìm thấy thông tin người dùng!', 'error');
                setTimeout(() => window.location.href = '/login', 1500);
            }
        }
    }

    // ===== DISPLAY USER DATA =====
    function displayUserData(user) {
        // Sidebar
        const avatarPlaceholder = document.getElementById('avatarPlaceholder');
        const sidebarName = document.getElementById('sidebarName');
        const sidebarEmail = document.getElementById('sidebarEmail');

        if (avatarPlaceholder && user.fullName) {
            avatarPlaceholder.textContent = user.fullName.charAt(0).toUpperCase();
        }

        if (sidebarName) {
            sidebarName.textContent = user.fullName || 'User';
        }

        if (sidebarEmail) {
            sidebarEmail.textContent = user.email || '';
        }

        // Form fields - Kiểm tra element tồn tại trước khi gán
        const fullNameInput = document.getElementById('fullName');
        const usernameInput = document.getElementById('username');
        const emailInput = document.getElementById('email');
        const phoneInput = document.getElementById('phone');

        if (fullNameInput) fullNameInput.value = user.fullName || '';
        if (usernameInput) usernameInput.value = user.username || '';
        if (emailInput) emailInput.value = user.email || '';
        if (phoneInput) phoneInput.value = user.phone || '';

        // ✅ ẨN TAB ĐỔI MẬT KHẨU NẾU ĐĂNG NHẬP BẰNG GOOGLE
        // Chỉ ẩn khi googleId có giá trị thực (không phải null, undefined, empty string)
        const passwordNavItem = document.querySelector('.nav-item[data-tab="password"]');
        if (passwordNavItem && user.googleId && user.googleId !== null && user.googleId !== '') {
            passwordNavItem.style.display = 'none';
            console.log('🔒 User đăng nhập bằng Google - ẩn tab đổi mật khẩu');
        } else {
            // ✅ Hiển thị tab đổi mật khẩu cho user thường
            if (passwordNavItem) {
                passwordNavItem.style.display = 'flex';
                console.log('✅ User đăng ký thường - hiện tab đổi mật khẩu');
            }
        }
    }

    // ===== INIT TABS =====
    function initTabs() {
        const navItems = document.querySelectorAll('.nav-item[data-tab]');

        navItems.forEach(item => {
            item.addEventListener('click', function (e) {
                e.preventDefault();

                const tabName = this.getAttribute('data-tab');

                // Remove active class from all
                document.querySelectorAll('.nav-item').forEach(nav => {
                    nav.classList.remove('active');
                });

                document.querySelectorAll('.tab-content').forEach(tab => {
                    tab.classList.remove('active');
                });

                // Add active class to current
                this.classList.add('active');
                document.getElementById(`tab-${tabName}`).classList.add('active');
            });
        });
    }

    // ===== INIT PROFILE FORM =====
    function initProfileForm() {
        const form = document.getElementById('profileForm');
        const cancelBtn = document.getElementById('cancelBtn');

        if (cancelBtn) {
            cancelBtn.addEventListener('click', function () {
                // Reset to original data
                displayUserData(originalData);
                showToast('Đã hủy thay đổi', 'error');
            });
        }

        if (form) {
            form.addEventListener('submit', async function (e) {
                e.preventDefault();

                const fullName = document.getElementById('fullName').value.trim();
                const username = document.getElementById('username').value.trim();
                const phone = document.getElementById('phone').value.trim();

                if (!fullName) {
                    showToast('Vui lòng nhập họ và tên!', 'error');
                    return;
                }

                // Show loading
                const submitBtn = form.querySelector('.btn-save');
                const originalText = submitBtn.textContent;
                submitBtn.textContent = '⏳ Đang lưu...';
                submitBtn.disabled = true;
                submitBtn.classList.add('loading');

                try {
                    const token = localStorage.getItem('token');
                    const response = await fetch(`${API_URL}/user/profile`, {
                        method: 'PUT',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        },
                        body: JSON.stringify({
                            fullName,
                            username,
                            phone
                        })
                    });

                    const result = await response.json();

                    if (response.ok && result.success) {
                        // Update local storage
                        const updatedUser = { ...userData, fullName, username, phone };
                        localStorage.setItem('user', JSON.stringify(updatedUser));
                        userData = updatedUser;
                        originalData = { ...updatedUser };

                        // Update display
                        displayUserData(updatedUser);

                        showToast('✅ Cập nhật thông tin thành công!', 'success');

                        // Reload page sau 1s để update header
                        setTimeout(() => window.location.reload(), 1000);

                    } else {
                        showToast(result.message || 'Có lỗi xảy ra!', 'error');
                    }

                } catch (error) {
                    console.error('❌ Error updating profile:', error);
                    showToast('Có lỗi xảy ra!', 'error');

                } finally {
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                    submitBtn.classList.remove('loading');
                }
            });
        }
    }

    // ===== INIT PASSWORD FORM =====
    function initPasswordForm() {
        const form = document.getElementById('passwordForm');
        const cancelBtn = document.getElementById('cancelPasswordBtn');

        if (cancelBtn) {
            cancelBtn.addEventListener('click', function () {
                form.reset();
                showToast('Đã hủy', 'error');
            });
        }

        if (form) {
            form.addEventListener('submit', async function (e) {
                e.preventDefault();

                const currentPassword = document.getElementById('currentPassword').value;
                const newPassword = document.getElementById('newPassword').value;
                const confirmPassword = document.getElementById('confirmPassword').value;

                // Validation
                if (!currentPassword || !newPassword || !confirmPassword) {
                    showToast('Vui lòng điền đầy đủ thông tin!', 'error');
                    return;
                }

                if (newPassword.length < 6) {
                    showToast('Mật khẩu mới phải có ít nhất 6 ký tự!', 'error');
                    return;
                }

                if (newPassword !== confirmPassword) {
                    showToast('Mật khẩu xác nhận không khớp!', 'error');
                    return;
                }

                // Show loading
                const submitBtn = form.querySelector('.btn-save');
                const originalText = submitBtn.textContent;
                submitBtn.textContent = '⏳ Đang xử lý...';
                submitBtn.disabled = true;
                submitBtn.classList.add('loading');

                try {
                    const token = localStorage.getItem('token');
                    const response = await fetch(`${API_URL}/user/change-password`, {
                        method: 'PUT',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        },
                        body: JSON.stringify({
                            current_password: currentPassword,
                            new_password: newPassword,
                            new_password_confirmation: confirmPassword
                        })
                    });

                    const result = await response.json();

                    if (response.ok && result.success) {
                        showToast('✅ Đổi mật khẩu thành công! Đang đăng xuất...', 'success');
                        form.reset();

                        // Logout sau 2s
                        setTimeout(() => {
                            localStorage.removeItem('token');
                            localStorage.removeItem('user');
                            window.location.href = '/login';
                        }, 2000);

                    } else {
                        showToast(result.message || 'Mật khẩu hiện tại không đúng!', 'error');
                    }

                } catch (error) {
                    console.error('❌ Error changing password:', error);
                    showToast('Có lỗi xảy ra!', 'error');

                } finally {
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                    submitBtn.classList.remove('loading');
                }
            });
        }
    }

    // ===== TOAST =====
    function showToast(message, type = 'success') {
        const oldToast = document.querySelector('.custom-toast');
        if (oldToast) oldToast.remove();

        const toast = document.createElement('div');
        toast.className = `custom-toast custom-toast-${type}`;

        const icon = type === 'success' ? '✓' : '✕';
        toast.innerHTML = `
            <div class="toast-icon">${icon}</div>
            <div class="toast-message">${message}</div>
        `;

        document.body.appendChild(toast);
        setTimeout(() => toast.classList.add('show'), 10);

        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // Inject CSS
    if (!document.getElementById('toast-styles')) {
        const style = document.createElement('style');
        style.id = 'toast-styles';
        style.textContent = `
            .custom-toast {
                position: fixed; top: 20px; right: 20px;
                display: flex; align-items: center; gap: 12px;
                padding: 16px 24px; border-radius: 12px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                font-size: 14px; font-weight: 500; z-index: 999999;
                opacity: 0; transform: translateX(400px);
                transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            }
            .custom-toast.show { opacity: 1; transform: translateX(0); }
            .custom-toast-success {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
            }
            .custom-toast-error {
                background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
                color: white;
            }
            .toast-icon {
                width: 24px; height: 24px; border-radius: 50%;
                background: rgba(255,255,255,0.3);
                display: flex; align-items: center; justify-content: center;
                font-size: 14px; font-weight: bold;
            }
        `;
        document.head.appendChild(style);
    }

})();