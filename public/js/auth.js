(function () {
    'use strict';

    // ================= CONFIG =================
    const API_URL = window.API_URL || 'http://localhost:8000/api';

    // ================= TOAST =================
    function showToast(message, type = 'success') {
        const oldToast = document.querySelector('.custom-toast');
        if (oldToast) oldToast.remove();

        const toast = document.createElement('div');
        toast.className = `custom-toast custom-toast-${type}`;
        toast.innerHTML = `
            <div class="toast-icon">${type === 'success' ? '✓' : '✕'}</div>
            <div class="toast-message">${message}</div>
        `;
        document.body.appendChild(toast);

        setTimeout(() => toast.classList.add('show'), 10);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    if (!document.getElementById('toast-styles')) {
        const style = document.createElement('style');
        style.id = 'toast-styles';
        style.textContent = `
            .custom-toast{position:fixed;top:20px;right:20px;display:flex;gap:12px;
            padding:16px 24px;border-radius:12px;box-shadow:0 4px 12px rgba(0,0,0,.15);
            font-size:14px;font-weight:500;z-index:999999;opacity:0;
            transform:translateX(400px);transition:.3s}
            .custom-toast.show{opacity:1;transform:translateX(0)}
            .custom-toast-success{background:#4f46e5;color:#fff}
            .custom-toast-error{background:#ef4444;color:#fff}
            .toast-icon{width:24px;height:24px;border-radius:50%;
            background:rgba(255,255,255,.3);display:flex;
            align-items:center;justify-content:center}
        `;
        document.head.appendChild(style);
    }

    // ================= LOCAL STORAGE =================
    const saveRegisterData = data =>
        localStorage.setItem('register_data', JSON.stringify(data));

    const getRegisterData = () =>
        JSON.parse(localStorage.getItem('register_data') || 'null');

    const clearRegisterData = () =>
        localStorage.removeItem('register_data');

    // ================= LOGIN =================
    async function handleLogin(email, password) {
        try {
            const res = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();

            if (res.ok && data.success) {
                localStorage.setItem('token', data.data.token);
                localStorage.setItem('token_type', 'Bearer');
                localStorage.setItem('user', JSON.stringify(data.data.user));

                showToast('Đăng nhập thành công!');
                setTimeout(() => {
                    window.location.href =
                        data.data.user.role === 'admin'
                            ? '/admin/dashboard'
                            : '/';
                }, 800);
            } else {
                showToast(data.message || 'Đăng nhập thất bại!', 'error');
            }
        } catch (e) {
            console.error(e);
            showToast('Không thể kết nối server!', 'error');
        }
    }

    // ================= REGISTER =================
    async function handleRegister(user) {
        try {
            const res = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify(user)
            });

            const data = await res.json();

            if (res.ok && data.success) {
                saveRegisterData(user);
                showToast('OTP đã gửi tới email!');
                setTimeout(() => location.href = '/verify-otp', 1000);
            } else {
                showToast(data.message || 'Đăng ký thất bại!', 'error');
            }
        } catch (e) {
            showToast('Lỗi kết nối!', 'error');
        }
    }

    // ================= VERIFY OTP =================
    async function handleVerifyOTP(otpCode) {
        const user = getRegisterData();
        if (!user) {
            showToast('Phiên đăng ký hết hạn!', 'error');
            return location.href = '/register';
        }

        try {
            const res = await fetch(`${API_URL}/auth/verify-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify({ ...user, otpCode })
            });

            const data = await res.json();

            if (res.ok && data.success) {
                localStorage.setItem('token', data.data.token);
                localStorage.setItem('user', JSON.stringify(data.data.user));
                clearRegisterData();

                showToast('Đăng ký thành công!');
                setTimeout(() => location.href = '/', 800);
            } else {
                showToast('OTP không hợp lệ!', 'error');
            }
        } catch (e) {
            showToast('Lỗi xác thực!', 'error');
        }
    }

    // ================= RESEND OTP =================
    async function handleResendOTP() {
        const user = getRegisterData();
        if (!user?.email) return showToast('Không tìm thấy email!', 'error');

        try {
            const res = await fetch(`${API_URL}/auth/resend-otp`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify({ email: user.email })
            });

            const data = await res.json();
            res.ok && data.success
                ? showToast('Đã gửi OTP mới!')
                : showToast('Không gửi được OTP!', 'error');
        } catch {
            showToast('Lỗi kết nối!', 'error');
        }
    }

    // ================= LOGOUT =================
    async function handleLogout() {
        try {
            const token = localStorage.getItem('token');
            if (token) {
                await fetch(`${API_URL}/auth/logout`, {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
            }
        } catch {}

        localStorage.clear();
        showToast('Đã đăng xuất!');
        setTimeout(() => location.href = '/login', 600);
    }

    // ================= EXPORT =================
    window.handleLogin = handleLogin;
    window.handleRegister = handleRegister;
    window.handleVerifyOTP = handleVerifyOTP;
    window.handleResendOTP = handleResendOTP;
    window.handleLogout = handleLogout;

})();
