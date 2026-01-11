(function () {
    'use strict';

    const API_URL = 'http://localhost:8000/api';

    // ===== TOAST NOTIFICATION =====
    function showToast(message, type = 'success') {
        // Xóa toast cũ nếu có
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

        // Animation
        setTimeout(() => toast.classList.add('show'), 10);

        // Auto remove
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
                position: fixed;
                top: 20px;
                right: 20px;
                display: flex;
                align-items: center;
                gap: 12px;
                padding: 16px 24px;
                border-radius: 12px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                font-size: 14px;
                font-weight: 500;
                z-index: 999999;
                opacity: 0;
                transform: translateX(400px);
                transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            }
            .custom-toast.show {
                opacity: 1;
                transform: translateX(0);
            }
            .custom-toast-success {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
            }
            .custom-toast-error {
                background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
                color: white;
            }
            .toast-icon {
                width: 24px;
                height: 24px;
                border-radius: 50%;
                background: rgba(255,255,255,0.3);
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 14px;
                font-weight: bold;
            }
            .toast-message {
                flex: 1;
                line-height: 1.4;
            }
        `;
        document.head.appendChild(style);
    }

    // ===== HELPER FUNCTIONS =====
    function saveRegisterData(data) {
        localStorage.setItem('register_data', JSON.stringify(data));
    }

    function getRegisterData() {
        const data = localStorage.getItem('register_data');
        return data ? JSON.parse(data) : null;
    }

    function clearRegisterData() {
        localStorage.removeItem('register_data');
    }

    // ===== ĐĂNG NHẬP =====
    async function handleLogin(email, password) {
        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok && data.success) {
                localStorage.setItem('token', data.data.token);
                localStorage.setItem('token_type', 'Bearer');
                localStorage.setItem('user', JSON.stringify(data.data.user));

                showToast('Đăng nhập thành công!', 'success');

                setTimeout(() => {
                    if (data.data.user.role === 'admin') {
                        window.location.href = '/admin/dashboard';
                    } else {
                        window.location.href = '/';
                    }
                }, 800);
            } else {
                showToast(data.message || 'Đăng nhập thất bại!', 'error');
            }
        } catch (error) {
            console.error('Login error:', error);
            showToast('Có lỗi xảy ra khi đăng nhập!', 'error');
        }
    }

    // ===== ĐĂNG KÝ - Bước 1: Gửi OTP =====
    async function handleRegister(userData) {
        try {
            const response = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    fullName: userData.fullName,
                    email: userData.email,
                    phone: userData.phone,
                    password: userData.password
                })
            });

            const data = await response.json();

            if (response.ok && data.success) {
                saveRegisterData(userData);
                showToast(data.message || 'Mã OTP đã được gửi đến email của bạn!', 'success');
                setTimeout(() => {
                    window.location.href = '/verify-otp';
                }, 1000);
            } else {
                let errorMsg = data.message || 'Đăng ký thất bại!';
                if (data.errors) {
                    const firstError = Object.values(data.errors)[0];
                    errorMsg = Array.isArray(firstError) ? firstError[0] : firstError;
                }
                showToast(errorMsg, 'error');
            }
        } catch (error) {
            console.error('Register error:', error);
            showToast('Không thể kết nối đến server!', 'error');
        }
    }

    // ===== XÁC THỰC OTP - Bước 2 =====
    async function handleVerifyOTP(otpCode) {
        try {
            const registerData = getRegisterData();

            if (!registerData) {
                showToast('Phiên đăng ký đã hết hạn. Vui lòng đăng ký lại!', 'error');
                setTimeout(() => {
                    window.location.href = '/register';
                }, 1500);
                return;
            }

            const response = await fetch(`${API_URL}/auth/verify-otp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    fullName: registerData.fullName,
                    email: registerData.email,
                    phone: registerData.phone,
                    password: registerData.password,
                    otpCode: otpCode
                })
            });

            const data = await response.json();

            if (response.ok && data.success) {
                localStorage.setItem('token', data.data.token);
                localStorage.setItem('token_type', 'Bearer');
                localStorage.setItem('user', JSON.stringify(data.data.user));
                clearRegisterData();

                showToast('Đăng ký thành công!', 'success');

                setTimeout(() => {
                    window.location.href = '/';
                }, 1000);
            } else {
                showToast(data.message || 'Mã OTP không đúng hoặc đã hết hạn!', 'error');
            }
        } catch (error) {
            console.error('Verify OTP error:', error);
            showToast('Không thể kết nối đến server!', 'error');
        }
    }

    // ===== GỬI LẠI OTP =====
    async function handleResendOTP() {
        try {
            const registerData = getRegisterData();

            if (!registerData || !registerData.email) {
                showToast('Không tìm thấy thông tin email!', 'error');
                setTimeout(() => {
                    window.location.href = '/register';
                }, 1500);
                return;
            }

            const response = await fetch(`${API_URL}/auth/resend-otp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    email: registerData.email
                })
            });

            const data = await response.json();

            if (response.ok && data.success) {
                showToast('Mã OTP mới đã được gửi đến email của bạn!', 'success');

                const resendBtn = document.getElementById('resendOTP');
                if (resendBtn) {
                    resendBtn.style.pointerEvents = 'none';
                    resendBtn.style.opacity = '0.5';

                    let countdown = 60;
                    const originalText = resendBtn.textContent;

                    const timer = setInterval(() => {
                        countdown--;
                        resendBtn.textContent = `Gửi lại (${countdown}s)`;

                        if (countdown <= 0) {
                            clearInterval(timer);
                            resendBtn.textContent = originalText;
                            resendBtn.style.pointerEvents = 'auto';
                            resendBtn.style.opacity = '1';
                        }
                    }, 1000);
                }
            } else {
                showToast(data.message || 'Không thể gửi lại OTP!', 'error');
            }
        } catch (error) {
            console.error('Resend OTP error:', error);
            showToast('Không thể kết nối đến server!', 'error');
        }
    }

    // ===== XỬ LÝ GOOGLE LOGIN CALLBACK =====
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const loginStatus = urlParams.get('login');

    if (token && loginStatus === 'success') {
        console.log('🔵 Processing Google login callback...');

        (async function () {
            try {
                const response = await fetch(`${API_URL}/auth/me`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                });

                const result = await response.json();
                console.log('🟢 User info response:', result);

                if (result.success && result.data) {
                    localStorage.setItem('token', token);
                    localStorage.setItem('token_type', 'Bearer');
                    localStorage.setItem('user', JSON.stringify(result.data));

                    console.log('🟢 User saved:', result.data.fullName);

                    // Xóa token khỏi URL
                    window.history.replaceState({}, document.title, window.location.pathname);

                    showToast(`Xin chào, ${result.data.fullName}!`, 'success');

                    // Reload để header cập nhật
                    setTimeout(() => {
                        window.location.reload();
                    }, 800);

                } else {
                    console.error('🔴 Failed:', result);
                    showToast('Không thể lấy thông tin người dùng!', 'error');

                    localStorage.removeItem('token');
                    localStorage.removeItem('token_type');
                    localStorage.removeItem('user');

                    setTimeout(() => {
                        window.location.href = '/login';
                    }, 2000);
                }
            } catch (error) {
                console.error('🔴 Error:', error);
                showToast('Có lỗi xảy ra: ' + error.message, 'error');

                localStorage.removeItem('token');
                localStorage.removeItem('token_type');
                localStorage.removeItem('user');

                setTimeout(() => {
                    window.location.href = '/login';
                }, 2000);
            }
        })();
    }

    // ===== ĐĂNG XUẤT =====
    async function handleLogout() {
        try {
            const token = localStorage.getItem('token');

            if (!token) {
                window.location.href = '/login';
                return;
            }

            const response = await fetch(`${API_URL}/auth/logout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            localStorage.removeItem('token');
            localStorage.removeItem('token_type');
            localStorage.removeItem('user');
            localStorage.removeItem('cart_items');
            clearRegisterData();

            showToast('Đăng xuất thành công!', 'success');

            setTimeout(() => {
                window.location.href = '/login';
            }, 800);

        } catch (error) {
            console.error('Logout error:', error);

            localStorage.removeItem('token');
            localStorage.removeItem('token_type');
            localStorage.removeItem('user');
            localStorage.removeItem('cart_items');

            setTimeout(() => {
                window.location.href = '/login';
            }, 500);
        }
    }

    // ===== EXPORT TO WINDOW =====
    window.handleLogin = handleLogin;
    window.handleRegister = handleRegister;
    window.handleVerifyOTP = handleVerifyOTP;
    window.handleResendOTP = handleResendOTP;
    window.handleLogout = handleLogout;

})();