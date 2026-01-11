const API_URL = window.location.origin + '/api';

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
            // Lưu token và user info
            localStorage.setItem('token', data.data.token);
            localStorage.setItem('token_type', 'Bearer');
            localStorage.setItem('user', JSON.stringify(data.data.user));

            alert('✅ Đăng nhập thành công!');

            // Kiểm tra role và redirect
            if (data.data.user.role === 'admin') {
                window.location.href = '/admin/dashboard';
            } else {
                window.location.href = '/';
            }
        } else {
            alert('❌ ' + (data.message || 'Đăng nhập thất bại!'));
        }
    } catch (error) {
        console.error('Login error:', error);
        alert('❌ Có lỗi xảy ra khi đăng nhập!');
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
            // Lưu thông tin để dùng ở bước verify OTP
            saveRegisterData(userData);

            alert('✅ ' + (data.message || 'Mã OTP đã được gửi đến email của bạn!'));

            setTimeout(() => {
                window.location.href = '/verify-otp';
            }, 1500);
        } else {
            let errorMsg = data.message || 'Đăng ký thất bại!';

            if (data.errors) {

            if (data.errors) {
                const firstError = Object.values(data.errors)[0];
                errorMsg = Array.isArray(firstError) ? firstError[0] : firstError;
            }

            alert('❌ ' + errorMsg);
        }
    } catch (error) {
        console.error('Register error:', error);
        alert('❌ Không thể kết nối đến server!');
    }
}

// ===== XÁC THỰC OTP - Bước 2 =====
async function handleVerifyOTP(otpCode) {
    try {
        const registerData = getRegisterData();

        if (!registerData) {
            alert('❌ Phiên đăng ký đã hết hạn. Vui lòng đăng ký lại!');
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
            // Lưu token và user info
            localStorage.setItem('token', data.data.token);
            localStorage.setItem('token_type', 'Bearer');
            localStorage.setItem('user', JSON.stringify(data.data.user));

            // Xóa dữ liệu đăng ký tạm
            clearRegisterData();

            alert('✅ Đăng ký thành công!');

            setTimeout(() => {
                window.location.href = '/';
            }, 1000);
        } else {
            alert('❌ ' + (data.message || 'Mã OTP không đúng hoặc đã hết hạn!'));
        }
    } catch (error) {
        console.error('Verify OTP error:', error);
        alert('❌ Không thể kết nối đến server!');
    }
}

// ===== GỬI LẠI OTP =====
async function handleResendOTP() {
    try {
        const registerData = getRegisterData();

        if (!registerData || !registerData.email) {
            alert('❌ Không tìm thấy thông tin email!');
            window.location.href = '/register';
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
            alert('✅ Mã OTP mới đã được gửi đến email của bạn!');

            // Disable nút resend trong 60 giây
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
            alert('❌ ' + (data.message || 'Không thể gửi lại OTP!'));
        }
    } catch (error) {
        console.error('Resend OTP error:', error);
        alert('❌ Không thể kết nối đến server!');
    }
}

// ===== XỬ LÝ GOOGLE LOGIN CALLBACK =====
window.addEventListener('DOMContentLoaded', async function () {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const loginStatus = urlParams.get('login');

    if (token && loginStatus === 'success') {
        console.log('🔵 Google login callback - Token received:', token.substring(0, 20) + '...');

        // Lưu token vào localStorage
        localStorage.setItem('token', token);
        localStorage.setItem('token_type', 'Bearer');

        // ✅ LẤY THÔNG TIN USER TỪ API
        try {
            console.log('🔵 Fetching user info from API...');

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
                // ✅ LƯU THÔNG TIN USER VÀO LOCALSTORAGE
                localStorage.setItem('user', JSON.stringify(result.data));

                console.log('🟢 User info saved to localStorage:', result.data);

                // Hiển thị thông báo thành công
                alert('✅ Đăng nhập Google thành công!\n\nXin chào, ' + result.data.fullName + '!');

                // Xóa token khỏi URL
                window.history.replaceState({}, document.title, window.location.pathname);

                // Reload trang để cập nhật UI
                setTimeout(() => {
                    window.location.reload();
                }, 500);

            } else {
                console.error('🔴 Failed to get user info:', result);
                alert('❌ Không thể lấy thông tin người dùng!\nVui lòng thử đăng nhập lại.');

                // Xóa token và redirect về login
                localStorage.removeItem('token');
                localStorage.removeItem('token_type');
                window.location.href = '/login';
            }
        } catch (error) {
            console.error('🔴 Error fetching user info:', error);
            alert('❌ Có lỗi xảy ra khi lấy thông tin người dùng!\n' + error.message);

            // Xóa token và redirect về login
            localStorage.removeItem('token');
            localStorage.removeItem('token_type');
            window.location.href = '/login';
        }
    }
});

// ===== ĐĂNG XUẤT =====
async function handleLogout() {
    try {
        const token = localStorage.getItem('token');

        if (!token) {
            window.location.href = '/login';
            return;
        }

        // Gọi API logout
        const response = await fetch(`${API_URL}/auth/logout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        // Xóa tất cả dữ liệu localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('token_type');
        localStorage.removeItem('user');
        localStorage.removeItem('cart_items');
        clearRegisterData();

        alert('✅ Đăng xuất thành công!');
        window.location.href = '/login';

    } catch (error) {
        console.error('Logout error:', error);

        // Vẫn xóa dữ liệu dù có lỗi
        localStorage.removeItem('token');
        localStorage.removeItem('token_type');
        localStorage.removeItem('user');
        localStorage.removeItem('cart_items');

        window.location.href = '/login';
    }
}

// ===== EXPORT FUNCTIONS =====
window.handleLogin = handleLogin;
window.handleRegister = handleRegister;
window.handleVerifyOTP = handleVerifyOTP;
window.handleResendOTP = handleResendOTP;
window.handleLogout = handleLogout;