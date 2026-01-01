const API_URL = 'http://localhost:8000/api';

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

// ĐĂNG NHẬP

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
            localStorage.setItem('user', JSON.stringify(data.data.user));
            
            alert('✅ ' + (data.message || 'Đăng nhập thành công!'));
            
            setTimeout(() => {
                window.location.href = '/';
            }, 1000);
        } else {

            let errorMsg = data.message || 'Đăng nhập thất bại!';
            
            if (response.status === 403) {
                if (data.message.includes('xác thực email')) {
                    errorMsg = 'Vui lòng xác thực email trước khi đăng nhập!';
                } else if (data.message.includes('bị khóa')) {
                    errorMsg = 'Tài khoản của bạn đã bị khóa!';
                }
            } else if (response.status === 401) {
                errorMsg = 'Email hoặc mật khẩu không đúng!';
            }
            
            alert('❌ ' + errorMsg);
        }
    } catch (error) {
        console.error('Login error:', error);
        alert('❌ Không thể kết nối đến server!');
    }
}

// ĐĂNG KÝ - Bước 1: Gửi OTP

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
            
            alert('✅ ' + (data.message || 'Mã OTP đã được gửi đến email của bạn!'));

            setTimeout(() => {
                window.location.href = '/verify-otp';
            }, 1500);
        } else {

            let errorMsg = data.message || 'Đăng ký thất bại!';
            
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

// XÁC THỰC OTP - Bước 2

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

            localStorage.setItem('token', data.data.token);
            localStorage.setItem('user', JSON.stringify(data.data.user));
            
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

// GỬI LẠI OTP

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

// ĐĂNG XUẤT

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
        localStorage.removeItem('user');
        clearRegisterData();
        
        alert('✅ Đăng xuất thành công!');
        window.location.href = '/login';
        
    } catch (error) {
        console.error('Logout error:', error);
        
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
    }
}

// Export functions
window.handleLogin = handleLogin;
window.handleRegister = handleRegister;
window.handleVerifyOTP = handleVerifyOTP;
window.handleResendOTP = handleResendOTP;
window.handleLogout = handleLogout;